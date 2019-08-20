<?php

/**
 * All DB Entities can be controlled over this Controller
 * all CRUD and Actions called over this class. Also pre/Post hooks. 
 * methods
 * get -> get all
 * getById -> get specific
 * create
 * delete 
 * update
 * action
 */
class BaseEntityCtrl implements ApiBaseCtrl
{

    /**
     * Undocumented variable
     *
     * @var ApiService
     */
    private $context;

    /**
     * Stores metadata over all edxisting entities
     *
     * @var array
     */
    public static $tableMeta = [];

    /**
     * holds a "bean" object for the pre/post hooks
     *
     * @var "bean"
     */
    private $prePostModel;

    /**
     * Returns the current entity/table name
     *
     * @return string
     */
    function getEntityName()
    {
        return $this->context->getRequest()->baseEntity;
    }

    /**
     * Calls the model own "has permission" method
     *
     * @return boolean
     */
    function hasPermission()
    {
        $model = R::dispense($this->getEntityName());
        return $model->hasPermissions();
    }

    /**
     * Sets the context and initializes the Controller
     *
     * @param ApiService $context
     * @return void
     */
    function setContext(ApiService $context)
    {
        $this->context = $context;
        $this->prePostModel = R::dispense($this->getEntityName());
        $this->loadTableInfo();
    }

    /**
     * Load table Information and cache them. Used to determine if fields / datatypes ar fitting
     * @todo can maybe moved to a other class
     * @return void
     */
    private function loadTableInfo()
    {
        self::$tableMeta = $this->context->getCache()->getValue("db_meta", "table_field_meta");
        if (!isset(self::$tableMeta[$this->getEntityName()])) {

            $s = R::getAll("SELECT COLUMN_NAME,DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ?", [$this->getEntityName()]);
            $newArr = array();
            foreach ($s as $value) {
                $newArr[$value['COLUMN_NAME']] = $value['DATA_TYPE'];
            }
            self::$tableMeta[$this->getEntityName()] = $newArr;
            $this->context->getCache()->storeValue("db_meta", "table_field_meta", self::$tableMeta, 60 * 60 * 24);
        }
    }

    
    private function hasField($field)
    {
        return array_key_exists($field, self::$tableMeta[$this->getEntityName()]);
    }

    /* #region  Public API Methods */

    /**
     * Do all get requests
     * The parameter are the url params
     * @param array $param
     * @return void
     */
    function get($param)
    {

        $resultArg = $this->prePostModel->preGet(["param" => $param]);
        if ($resultArg != null) {
            $param = $resultArg['param'];
        }
        $bindings = ["limit" => $this->getLimitOrDefault($param), "offset" => $this->getOffsetOrDefault($param)];
        $order = $this->addOrdering($param);
        $filter = $this->generateFilter($param);
        $query = "status = 1 $filter order by $order limit :limit offset :offset";
        //echo $query;
        $result = R::find($this->getEntityName(), $query, $bindings);

        $this->prePostModel->postGet(["result" => $result]);
        return array_values($result);
    }

    /**
     * Get a specific record by ID
     *
     * @param int $id
     * @param array $param
     * @return void
     */
    function getById($id, $param)
    {

        $this->prePostModel->preGetById(["id" => $id, "param" => $param]);
        $result = R::findOne($this->getEntityName(), "status = 1 and id = ?", [$id]);
        $this->prePostModel->postGetById(["result" => $result]);
        return $result;
    }

    /**
     * Update a record
     *
     * @param int $id
     * @param int $data
     * @return void
     */
    function update($id, $data)
    {
        $bean = R::findOne($this->getEntityName(), "status = 1 and id = ?", [$id]);

        $bean->import($data);

        $this->prePostModel->preUpdate(["id" => $id, "data" => $data, "pre" => $bean]);

        R::store($bean);

        $this->prePostModel->postUpdate(["result" => $bean]);

        return $bean;
    }


    function delete($id)
    {
        //R::trash(R::findOne($this->getEntityName(),"id = ?",[$id]));
        $b = R::findOne($this->getEntityName(), "status = 1 and id = ?", [$id]);

        $this->prePostModel->preDelete(["id" => $id, "pre" => $b]);

        $b->status = 0;
        R::store($b);
        $this->prePostModel->postDelete(["result" => $b]);
        return null;
    }

    function create($data)
    {

        $entity = R::dispense($this->getEntityName());
        $entity->import($data);

        $this->prePostModel->preCreate(["data" => $data, "pre" => $entity]);
        R::store($entity);

        $this->prePostModel->postCreate(["result" => $entity]);
        return $entity;
    }

    function invokeAction(string $action,  $id, $data)
    {
        $bean = null;
        if (is_numeric($id)) {
            $bean = R::findOne($this->getEntityName(), "status = 1 and id = ?", [$id]);
        } else {
            $bean = R::dispense($this->getEntityName());
        }
        $model = R::dispense($this->getEntityName());

        $beanModel = $bean->box();
        $methodName = "action_" . $action;
        if (method_exists($beanModel, $methodName)) {
            return $bean->$methodName();
            $model = R::dispense($this->getEntityName());
        }


        $result = new ActionFaultResult();
        $result->success = false;
        $result->message = "Unknown Action: " . $action;
        $result->code = 1;
        return $result;
    }

    /* #endregion */



    /* #region  custom filtering */

    private function addOrdering($param)
    {

        if (isset($param['orderasc']) && $this->hasField($param['orderasc'])) {
            return $param['orderasc'] . " ASC";
        } elseif (isset($param['orderdesc']) && $this->hasField($param['orderdesc'])) {
            return $param['orderdesc'] . " DESC";
        } else {
            return "id ASC";
        }
    }

    private function generateFilter($param)
    {

        $stage  = ["field", "operator", "value", "operator"];

        if (isset($param['$filter'])) {

            $filter = urldecode($param['$filter']);
            $arg = explode(" ", $filter);
            $buildArr = array();
            $currStage = 0;

            for ($i = 0; $i < count($arg); $i++) {

                $value = $arg[$i];

                if ($value == "") { } elseif ($currStage == 0) {
                    $fieldName = str_replace("(", "", $value);
                    if ($this->hasField($fieldName)) {

                        $buildArr[] = $value;
                    } else {

                        throw new ApiException("Can't find Field: $fieldName", $this->context);
                    }

                    $currStage++;
                } elseif ($currStage == 1 || $currStage == 3) {
                    if (array_key_exists($value, QueryModel::OPERATORS)) {
                        $buildArr[] = QueryModel::OPERATORS[$value];
                    }
                    $currStage++;
                } else {
                    if ($value[0] == "'") {
                        if ($currStage != 2) echo "not value stage!\r\n";
                        if (strpos($value, 1, -1) == "'") {
                            $buildArr[] = $value;
                        } else {
                            $temp = $value;
                            $search = true;
                            while ($i < (count($arg) - 1) && $search) {

                                $i++;
                                if ($arg[$i] != "") {
                                    $temp .= " " . $arg[$i];

                                    if (substr($arg[$i], -1) == "'") {
                                        $buildArr[] = $temp;
                                        $currStage = 0;
                                        $search = false;
                                    }
                                }
                            }
                        }
                    } else {
                        $buildArr[] = $value;
                    }
                    $currStage++;
                }
                if ($currStage > 3) $currStage = 0;
            }

            if (count($buildArr) > 2) {
                return " and " . join(" ", $buildArr);
            }
            return "";
        }
    }

    private function getLimitOrDefault($dataArr, $default = 50)
    {
        return isset($dataArr['limit']) && is_numeric($dataArr['limit']) ? $dataArr['limit'] : $default;
    }

    private function getOffsetOrDefault($dataArr, $default = 0)
    {
        return isset($dataArr['offset']) && is_numeric($dataArr['offset']) ? $dataArr['offset'] : $default;
    }
    /* #endregion */
}
