<?php

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

    function setContext(ApiController $context){
        $this->context = $context;
    }

    function get($param){
        return R::findAll($this->getEntityName());
    }


    function getById($id,$param){
        $bean = R::load($this->getEntityName(),$id);
        return $bean;
    }

    function update($id, $data){
        $bean = R::findOne($this->getEntityName(),"id = ?",[$id]);
        $bean->import($data);
        R::store($bean);
        return $bean;
    }


    function delete($id){
        R::trash(R::findOne($this->getEntityName(),"id = ?",[$id]));
        return null;
    }

    function create($data){
       $entity = R::dispense($this->getEntityName());
       $entity->import($data);
       R::store($entity);
       return $entity;
    }
    

}