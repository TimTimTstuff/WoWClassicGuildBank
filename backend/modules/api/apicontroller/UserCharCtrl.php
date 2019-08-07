<?php
class UserCharCtrl{

    private $result;

    public function setRequest($method, $data, $get, $post){
        
        if($method == "GET" && isset($get['id'])){
            $this->result = UserChar::getById($get['id']);
        }else if($method == "GET"){
            $start = $get['start']??0;
            $count = $get['count']??50;
            $this->result = UserChar::getChars($start,$count);
        }
    }

    public function getResponse(){
        return $this->result??["error"=>"No result"];
    }


}