<?php

class Model_User extends MainModel{
    
   
    
    public function update(){
        if($this->isCreate()){
        
        }else{
            
        }
       
    }

    public function open(){
       if($this->api->getRequest()->method == "GET"){
           $this->bean->password = "";
       }
    }
}