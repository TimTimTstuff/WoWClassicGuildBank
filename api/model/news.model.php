<?php

class Model_News extends ApiBaseEntityModel{

    public function hasPermissions(){
        $request = $this->api->getRequest();
        if($this->hasUserLevel(RoleLevel::ADMIN))return true;
       
        
        if($this->hasUserLevel(RoleLevel::MEMBER))return true;
        
        return false;
    }

    public function open(){
        if($this->api->getRequest()->method == "GET"){
            $this->bean->owner_ref = $this->createEntityReference($this->bean->owner,"user");
            $this->bean->created_by_ref = $this->createEntityReference($this->bean->created_by,"user");
            $this->bean->modified_by_ref = $this->createEntityReference($this->bean->modified_by,"user");
        }
    }

    public function update(){
        if($this->isCreate()){
            
           $this->setSystemData($this->bean,$this->api->getSession()->getUserId());
        }else{
            
        }
       
    }


    

}