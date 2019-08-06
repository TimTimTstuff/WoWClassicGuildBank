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
     
   }

   public function setIfEmpty(string $key, $value){
        if(!$this->hasKey($key)) $this->setValue($key,$value);
   }

   public function setValue(string $key, $value){
        $this->session[$key] = $value;
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


}