<?php
class SystemUserCtrl{

    private $result;

    public function setRequest($method, $data, $get, $post){
        
       if($method == "POST" && isset($data["action"])){
            $action = $data['action'];
            if($action == "login"){
                $name = $data['username']??null;
                $pass = $data['password']??null;
                if($name == null || $pass == null) {
                    $this->result = ["error"=>"Wrong login data"];
                    return;
                }
                    Context::getInstance()->getSession()->doLogin("Admin",1);
                    $this->result = ["success"=>"Login erfolgreich"];
            }elseif($action == "logout"){
                     Context::getInstance()->getSession()->doLogout();
                     $this->result = ["success"=>"Logout erfolgreich"];
            }else{
                $this->result = ["error"=>"Unbekannte action"];
            }
        }
    }

    public function getResponse(){
        return $this->result??["error"=>"No result"];
    }


}