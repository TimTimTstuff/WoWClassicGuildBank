<?php

class Model_News extends ApiBaseEntityModel{

    public function hasPermissions(){
        $r = $this->api->getRequest();
        if($r->method == "GET")
            return true;
        if($this->hasUserLevel(RoleLevel::OFFICER))
            return true;
        return false;
    }


    public function preGet(array $arg){
        $param = $arg['param'];
        //remove filtering for non member user
        if(!$this->hasUserLevel(RoleLevel::MEMBER)){
            if(isset($param['$filter'])){$param['$filter'] = "";}
            $param['limit'] = 5;
            $param['$filter'] =  "publicpost eq 1";
        }
        return ['param'=> $param] ;
    }

    public function open(){
        if($this->api->getRequest()->method == "GET"){
            
            $this->bean->owner_ref = $this->createEntityReference($this->bean->owner,"user");
            
            //add entity reference
            if($this->hasUserLevel(RoleLevel::OFFICER)){
                $this->bean->created_by_ref = $this->createEntityReference($this->bean->created_by,"user");
                $this->bean->modified_by_ref = $this->createEntityReference($this->bean->modified_by,"user");
            }
        }
    }

    public function update(){
        if($this->isCreate()){
            
           $this->setSystemData($this->bean,$this->api->getSession()->getUserId());
        }else{
            
        }
       
    }



    

}