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

