<?php

class Model_Char extends ApiBaseEntityModel{

    public function hasPermissions(){
        $request = $this->api->getRequest();
        if($this->hasUserLevel(RoleLevel::MEMBER))return true;
        
        return false;
    }


    public function update(){
        if($this->isCreate()){
            
           $this->setSystemData($this->bean,$this->api->getSession()->getUserId());
        }else{
            
        }
       
    }
}