<?php


/**
 * Base implementation for all models (extends RedBeans default Model)
 */
class ApiBaseEntityModel extends RedBean_SimpleModel{
    
    /**
     * Undocumented variable
     *
     * @var ApiService
     */
    public $api;

    /**
     * Returns the current users ID
     *
     * @return int
     */
    protected function getUserId(){
        return $this->api->getSession()->getUserId();
    }

    /**
     * Returns true if the user has same or higher privileges
     * @todo Create a proper User privilege check
     * @param int $neededLevel
     * @return boolean
     */
    protected function hasUserLevel($neededLevel){
        return $neededLevel <= $this->api->getSession()->getUserLevel();
    }
    
    /**
     * Creates entity reference informaiton for api returns. So you know which other entity the information is comming from. 
     * 
     * @todo currently it only works for user, it will fail if you use it on a other entity (see HACK).
     * @todo create a mapping for table to primary name field
     *
     * @param int $id
     * @param string $entity
     * @return void
     */
    protected function createEntityReference($id,$entityName){
        
        $name = "UNKNOWN";
        $key = "entity_".$entityName."_id_".$id;
        if($this->api->getCache()->existsKey("entity_ref",$key)){
            $name = $this->api->getCache()->getValue("entity_ref",$key);
        }else{
                                                                                                      //HACK
            $name = $this->api->getCache()->getValueOrSetDefault("entity_ref",$key,R::load($entityName,$id)->username,60);
        }
        
        return [
            "id"=>$id,
            "entity"=>$entityName,
            "name"=>$name
        ];
    }

   
    /**
     * Sets default fields / information for each entity (use on create)
     *
     * @param RedBeanPHP\OODBBean $bean
     * @param int $userId
     * @return void
     */
    public function setSystemData(RedBeanPHP\OODBBean $bean,$userId){
        if(!isset($bean->createdBy))
            $bean->createdBy = $userId;
        if(!isset($bean->createdOn))
            $bean->createdOn = new DateTime();
        if(!isset($bean->modifiedBy))
            $bean->modifiedBy = $userId;
        if(!isset($bean->modifiedOn))
            $bean->modifiedOn = new DateTime();
        if(!isset($bean->status))
            $bean->status = 1;
        if(!isset($bean->owner)){
            $bean->owner = $userId;
        }
    }

    /**
     * Updates default data use on Update
     *
     * @param OODBBean $bean
     * @param int $userId
     * @return void
     */
    public function setUpdateSystemData(OODBBean $bean, $userId){
        $bean->modifiedBy = $userId;
        $bean->modifiedOn = new DateTime();
    }

    /**
     * Returns true if the "bean" is in create state
     *
     * @return boolean
     */
    public function isCreate(){
        return $this->bean->getID() == 0;
    }

    /**
     * Set the Api Service "context"
     *
     * @param ApiService $api
     * @return void
     */
    public function setContext(ApiService $api){
        $this->api = $api;
    }
}

