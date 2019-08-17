<?php



class ApiSession{
    private $user;
    /**
     * Undocumented variable
     *
     * @var OODBean
     */
    private $data;
    private static $sessionEntity = "sessionvar";
    public function __construct($token) {
        $this->getUserByToken($token);
        if($this->isLoggedInUser()){
            $this->data = R::findAll(self::$sessionEntity,"owner = ?",[$this->user->getID()]);
        }else{
            $this->data = array();
        }
       
    }

    public function getUserByToken($token){
        $this->user = R::findOne("user","token = ? && token_expires > NOW()",[$token]);
    }


    public function getUserId(){
        if($this->user != null)
            return $this->user->getID();
        return 0;
    }

    public function getUserLevel(){
        if($this->user == null)return RoleLevel::GUEST;
        return $this->user->roleLevel;
    }

    public function isLoggedInUser(){
        return $this->user != null;
    }

    public function setValue($skey,$svalue){
        if(!$this->isLoggedInUser())return;
        foreach ($this->data as $value) {
            if($value->sessionKey == $skey){
                 $value->sessionValue = $svalue;
                 R::store($value);
                 return;
            }
        }
        $bean = R::dispense(self::$sessionEntity);
        $bean->sessionKey = $skey;
        $bean->sessionValue = $svalue;
        R::store($bean);
    }

}