<?php
class ActionFaultResult{
    public $success = false;
    public $message = "";
    public $code = 0;
}
class BaseEntityCtrl implements ApiBaseCtrl{

    /**
     * Undocumented variable
     *
     * @var ApiController
     */
    private $context;

    function getEntityName(){
        return $this->context->getRequest()->baseEntity;
    }

    function hasPermission(){
        $model = R::dispense($this->getEntityName());
        return $model->hasPermissions();
    }

    function setContext(ApiController $context){
        $this->context = $context;
    }

    function get($param){
        $model = R::dispense($this->getEntityName());
        $model->preGet($param);
        $bindings = ["limit"=>$this->getLimitOrDefault($param),"offset"=>$this->getOffsetOrDefault($param)];
        $result = R::find($this->getEntityName()," status = 1 limit :limit offset :offset ",$bindings);
        $model->postGet($result);
        return $result;
    }

  

    function getById($id,$param){
        $model = R::dispense($this->getEntityName());
        $model->preGetById($param);
        $result = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);
        $model->postGetById($result);
        return $result;
    }

    function update($id, $data){
        $bean = R::findOne($this->getEntityName(),"status = 1 and id = ",[$id]);
        $model = R::dispense($this->getEntityName());
        $model->preUpdate($id,$data,$bean);
        $bean->import($data);
        R::store($bean);
        $model->postUpdate($id,$data,$bean);
        return $bean;
    }


    function delete($id){
        $model = R::dispense($this->getEntityName());
        $model->preDelete($id);
        //R::trash(R::findOne($this->getEntityName(),"id = ?",[$id]));
        $b = R::findOne($this->getEntityName(),"status = 1 and id = ?",[$id]);
        $b->state = 0;
        R::store($b);
        $model->postDelete($id);
        return null;
    }

    function create($data){
        
       $entity = R::dispense($this->getEntityName());
       $entity->import($data);
       $model = R::dispense($this->getEntityName());
        $model->preCreate($entity,$data);
       R::store($entity);
       
       $model->postCreate($entity,$data);
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
        
    }

    private function getLimitOrDefault($dataArr,$default = 50){
        return isset($dataArr['limit']) && is_numeric($dataArr['limit'])?$dataArr['limit']:$default;
    }

    private function getOffsetOrDefault($dataArr,$default = 0){
        return isset($dataArr['offset']) && is_numeric($dataArr['offset'])?$dataArr['offset']:$default;
    }
    

}