<?php

class RegisterActionResult{
    public $success = false;
    public $message = "";
    public $code = 0;
}

class LoginActionResult{
    public $success = false;
    public $token = null;
    public $message = "";
    public $code = 0;
}

class WhoAmIResult{
    public $success = false;
    public $name;
    public $id;
    public $level;
    public $loggedIn = false;
}

class Model_User extends ApiBaseEntityModel{
    
   private $isCreateRequest = false;

   private function maskExportFields(){
       $this->bean->password = null;
       $this->bean->token = null;
       $this->bean->tokenExpires = null;
   }

   private function maskNotAdminFields(){
        if($this->bean->getID() == $this->getUserId())return;
        $this->bean->email = null;
        $this->bean->modified_on = null;
        $this->bean->modified_by = null;
   }
   
   public function hasPermissions(){
    $request = $this->api->getRequest();
    if($this->hasUserLevel(RoleLevel::ADMIN))return true;
    if(in_array($request->action,["login","registeruser","whoami"]))return true;
    
    if($this->hasUserLevel(RoleLevel::MEMBER))return true;
    
    return false;
    }


    public function update(){
        if($this->isCreate()){
            $this->isCreateRequest = true;
            $this->bean->roleLevel = 1;
        }else{
            
        }
       
    }

    public function after_update(){
        if($this->isCreateRequest){
            $this->isCreateRequest = false;
            $this->setSystemData($this->bean,$this->bean->getID());
            R::store($this->bean);
        }
    }

    public function open(){
       if($this->api->getRequest()->method == "GET"){
           $this->maskExportFields();
           if(!$this->hasUserLevel(RoleLevel::OFFICER)){
              $this->maskNotAdminFields();
           }
           
       }
    }

    public function action_registerUser(){
        $this->bean->import($this->api->getRequest()->input);
        $userExists = R::count($this->api->getRequest()->baseEntity,"username = :username or email = :email",["username"=>$this->bean->username,"email"=>$this->bean->email]);
        $result = new RegisterActionResult();
        
        if($userExists > 0) {
            $result->code = 1;
            $result->message = "User with name or email exists";
            $result->success = false;
            return $result;
        }
        $this->bean->password = sha1($this->bean->password);
        R::store($this->bean);
        $this->maskExportFields();
        $result->code = 2;
        $result->message = "User Registration was successfull";
        $result->success = true;
        return $result;
    }
    
    public function action_whoami(){
        
        $b = R::load($this->api->getRequest()->baseEntity,$this->api->getSession()->getUserId());
        $hasId = $this->api->getSession()->getUserId() != null;
        $result = new WhoAmIResult();
        $result->id = $hasId!=null?$b->getID():0;
        $result->level = $hasId!=null?$b->roleLevel:RoleLevel::GUEST;
        $result->name = $hasId!=null?$b->username:"Gast";
        $result->success = true;
        $result->loggedIn = $hasId!=null;
        return $result;
    }

    public function action_login(){
        $this->bean->import($this->api->getRequest()->input);
        $password = sha1($this->bean->password);
        $exists = R::findOne($this->api->getRequest()->baseEntity,"username = :username and password = :password",["username"=>$this->bean->username,"password"=>$password]);

        $result = new LoginActionResult();

        if($exists != null){
            $exists->token = md5(uniqid(rand(), true));
            $startDate = time();
            $exists->tokenExpires =  date('Y-m-d H:i:s', strtotime('+5 day', $startDate));
            R::store($exists);
            $result->token = $exists->token;
            $result->code = 2;
            $result->success = true;
            $result->message = "Login Successfull";
            return $result;
        }

        $result->code = 1;
        $result->message = "Credentials not correct";
        $result->success = false;
        $result->token = null;
        return $result;
    }
}