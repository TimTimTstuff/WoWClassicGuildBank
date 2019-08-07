<?php

class AppSession{

    private $session;

    public function __construct(array $session) {
        $this->session = $session;
        $this->setupSession();
    }

    private function setupSession(){
        $this->setIfEmpty("logged_in",false);
        $this->setIfEmpty("username",getLang("guest"));
        $this->setIfEmpty("userid",0);
     
   }

   public function setIfEmpty(string $key, $value){
        if(!$this->hasKey($key)) $this->setValue($key,$value);
   }

   public function setValue(string $key, $value){
        $this->session[$key] = $value;
        $_SESSION[$key] = $value;
    }

   public function hasKey(string $key)
   {
       return isset($this->session[$key]);
   }

   public function getValue(string $key){
       return $this->session[$key];
   }

    public function isUserLoggedIn(){
        return $this->getValue("logged_in");
    }

    public function getUserName(){
        return $this->getValue("username");
    }

    public function getUserId(){
        return $this->getValue("userid");
    }

    public function doLogin($name,$id){
        $this->setValue("logged_in",true);
        $this->setUserName($name);
        $this->setUserId($id);
    }

    public function doLogout(){
        $this->setValue("logged_in",false);
        $this->setUserName(getLang("guest"));
        $this->setUserId(0);
    }

    public function setUserLogin(bool $value){
        $this->setValue("logged_in",$value);
    }

    public function setUserName(string $name){
        $this->setValue("username",$name);
    }

    public function setUserId(int $id){
        $this->setValue("userid",$id);
    }

}