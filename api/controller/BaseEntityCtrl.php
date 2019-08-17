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
    }

    function get($param){
       
        
        $this->prePostModel->preGet(["param"=>$param]);

        $bindings = ["limit"=>$this->getLimitOrDefault($param),"offset"=>$this->getOffsetOrDefault($param)];
        $result = R::find($this->getEntityName()," status = 1 limit :limit offset :offset ",$bindings);

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
        $bean = R::findOne($this->getEntityName(),"status = 1 and id = ",[$id]);
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

    private function getLimitOrDefault($dataArr,$default = 50){
        return isset($dataArr['limit']) && is_numeric($dataArr['limit'])?$dataArr['limit']:$default;
    }

    private function getOffsetOrDefault($dataArr,$default = 0){
        return isset($dataArr['offset']) && is_numeric($dataArr['offset'])?$dataArr['offset']:$default;
    }
    

}