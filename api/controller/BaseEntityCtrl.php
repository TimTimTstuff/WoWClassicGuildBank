<?php

/**
 * All DB Entities can be controlled over this Controller
 */
class BaseEntityCtrl implements ApiBaseCtrl{

    /**
     * Undocumented variable
     *
     * @var ApiService
     */
    private $context;

    public static $tableMeta = [];

    private $prePostModel;

    function getEntityName(){
        return $this->context->getRequest()->baseEntity;
    }

    function hasPermission(){
        $model = R::dispense($this->getEntityName());
        return $model->hasPermissions();
    }

    function setContext(ApiService $context){
        $this->context = $context;
        $this->prePostModel = R::dispense($this->getEntityName());
        $this->loadTableInfo();
    }

    private function loadTableInfo(){
        self::$tableMeta = $this->context->getCache()->getValue("db_meta","table_field_meta");
        if(!isset(self::$tableMeta[$this->getEntityName()])){
            
            $s = R::getAll("SELECT COLUMN_NAME,DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ?",[$this->getEntityName()]);
            $newArr = array();
            foreach ($s as $value) {
                $newArr[$value['COLUMN_NAME']] = $value['DATA_TYPE'];
            }
            self::$tableMeta[$this->getEntityName()] = $newArr;
            $this->context->getCache()->storeValue("db_meta","table_field_meta",self::$tableMeta,60*60*24);
        }
    }

    function get($param){

        $this->prePostModel->preGet(["param"=>$param]);
        $bindings = ["limit"=>$this->getLimitOrDefault($param),"offset"=>$this->getOffsetOrDefault($param)];
        $order = $this->addOrdering($param);
        $filter = $this->generateFilter($param);
        $query = "status = 1 $filter order by $order limit :limit offset :offset";
        //echo $query;
        $result = R::find($this->getEntityName(),$query,$bindings);

        $this->prePostModel->postGet(["result"=>$result]);


        return $result;
    }

    function getById($id,$param){
       
        $this->prePostModel->preGetById(["id"=>$id,"param"=>$param]);
        $result = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);
        $this->prePostModel->postGetById(["result"=>$result]);
        return $result;
    }

    function update($id, $data){
        $bean = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);
        $bean->import($data);

        $this->prePostModel->preUpdate(["id"=>$id,"data"=>$data,"pre"=>$bean]);
        
        R::store($bean);

        $this->prePostModel->postUpdate(["result"=>$bean]);

        return $bean;
    }


    function delete($id){
        //R::trash(R::findOne($this->getEntityName(),"id = ?",[$id]));
        $b = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);

        $this->prePostModel->preDelete(["id"=>$id,"pre"=>$b]);

        $b->state = 0;
        R::store($b);
        $this->prePostModel->postDelete(["result"=>$b]);
        return null;
    }

    function create($data){
        
       $entity = R::dispense($this->getEntityName());
       $entity->import($data);
     
        $this->prePostModel->preCreate(["data"=>$data,"pre"=>$entity]);
        R::store($entity);
       
       $this->prePostModel->postCreate(["result"=>$entity]);
       return $entity;
    }

    function invokeAction(string $action,  $id, $data)
    {
        $bean = null;
        if(is_numeric($id)){
            $bean = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);

        }else{
            $bean = R::dispense($this->getEntityName());
        }
        $model = R::dispense($this->getEntityName());
        $model->preAction($action,$id,$data,$bean);
        $beanModel = $bean->box();
        $methodName = "action_".$action;
        if(method_exists($beanModel,$methodName)){
           return $bean->$methodName();
           $model = R::dispense($this->getEntityName());
           $model->postAction($action,$id,$data,$bean);
        }
        
      
        $result = new ActionFaultResult();
        $result->success = false;
        $result->message = "Unknown Action: ".$action;
        $result->code = 1;
        return $result;
        
    }

    private function hasField($field){
        return array_key_exists($field,self::$tableMeta[$this->getEntityName()]);
    }


    private function addOrdering($param){
        
        if(isset($param['orderasc']) && $this->hasField($param['orderasc'])){
            return $param['orderasc']." ASC";
        }elseif(isset($param['orderdesc']) && $this->hasField($param['orderdesc'])){
            return $param['orderdesc']." DESC";
        }else{
            return "id ASC";
        }
     
       
    }

    private function generateFilter($param){

        $stage  = ["field","operator","value","operator"];

        if(isset($param['$filter'])){
           
            $filter = urldecode($param['$filter']);
            $arg = explode(" ",$filter);
            $buildArr = array();
            $currStage = 0;

            for($i = 0; $i < count($arg); $i++){

                $value = $arg[$i];
               
                if($value == ""){}
                elseif($currStage == 0){
                    $fieldName = str_replace("(","",$value);
                    if($this->hasField($fieldName)){

                        $buildArr[] = $value;
                    }else{
                      
                        throw new ApiException("Can't find Field: $fieldName",$this->context);
                    }
                    
                    $currStage++;
                }elseif($currStage == 1 || $currStage == 3){
                    if(array_key_exists($value,QueryModel::OPERATORS)){
                        $buildArr[] = QueryModel::OPERATORS[$value];
                    }
                    $currStage++;
                }else{
                    if($value[0] == "'"){
                        if($currStage != 2)echo "not value stage!\r\n";
                        if(strpos($value,1,-1) == "'"){
                            $buildArr[] = $value;
                           
                        }else{
                            $temp = $value;
                            $search = true;
                            while($i < (count($arg)-1) && $search){
                            
                                $i++;
                                if($arg[$i] != ""){
                                $temp .= " ".$arg[$i];
                               
                                if(substr($arg[$i],-1) == "'"){
                                    $buildArr[] = $temp;
                                    $currStage = 0;
                                    $search = false;
                                }
                                }
                            }
                        }
                    }else{   
                        $buildArr[] = $value; 
                    }
                    $currStage++;
                }
                if($currStage > 3)$currStage = 0; 
            } 

            if(count($buildArr)>2){
                return " and ".join(" ",$buildArr);
            }
            return "";
           
        }
        
    }

    private function getLimitOrDefault($dataArr,$default = 50){
        return isset($dataArr['limit']) && is_numeric($dataArr['limit'])?$dataArr['limit']:$default;
    }

    private function getOffsetOrDefault($dataArr,$default = 0){
        return isset($dataArr['offset']) && is_numeric($dataArr['offset'])?$dataArr['offset']:$default;
    }
    

}