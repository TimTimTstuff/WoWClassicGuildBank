<?php



class ApiBaseEntityModel extends RedBean_SimpleModel{
    
    /**
     * Undocumented variable
     *
     * @var ApiService
     */
    public $api;

    protected function getUserId(){
        return $this->api->getSession()->getUserId();
    }

    protected function hasUserLevel($neededLevel){
        return $neededLevel <= $this->api->getSession()->getUserLevel();
    }
    
    protected function createEntityReference($id,$entity){
        
        $name = "UNKNOWN";
        $key = "entity_".$entity."_id_".$id;
        if($this->api->getCache()->existsKey("entity_ref",$key)){
            $name = $this->api->getCache()->getValue("entity_ref",$key);
        }else{
            $name = $this->api->getCache()->getValueOrSetDefault("entity_ref",$key,R::load($entity,$id)->username,60);
        }
        

        return [
            "id"=>$id,
            "entity"=>$entity,
            "name"=>$name
        ];
    }

   

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

    public function setUpdateSystemData(OODBBean $bean, $userId){
        $bean->modifiedBy = $userId;
        $bean->modifiedOn = new DateTime();
    }

    public function isCreate(){
        return $this->bean->getID() == 0;
    }

    public function setContext(ApiService $api){
        $this->api = $api;
    }
}

