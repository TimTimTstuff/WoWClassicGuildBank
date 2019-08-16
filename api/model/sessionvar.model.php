<?php
    class Model_Sessionvar extends MainModel{

        public function update(){
            
            if($this->isCreate()){
                $this->setSystemData($this->bean,$this->api->getSession()->getUserId());
            }else{
                $this->setUpdateSystemData($this->bean,$this->api->getSession()->getUserId());
            }
        }

        

    }