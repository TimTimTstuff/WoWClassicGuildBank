<?php
class ItemTemplateCtrl{

    private $result;

    public function setRequest($method, $data, $get, $post){
        
       if($method == "GET" && isset($get['id'])){
            $this->result = ItemTemplate::getById($get['id']);
        }else if($method == "GET"){
            $start = $get['start']??0;
            $count = $get['count']??50;
            $name = $get['name']??"";
            $this->result = ItemTemplate::get($start,$count,($name!=""?"itemname like '%".$get['name']."%'":null));
        }
    }

    public function getResponse(){
        return $this->result??["error"=>"No result"];
    }


}