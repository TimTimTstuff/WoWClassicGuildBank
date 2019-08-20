<?php


/**
 * Own session handling, no PHP default sessions (DB bound)
 */
class ApiSession{
    private $user;
    /**
     * Undocumented variable
     *
     * @var OODBean
     */
    private $data;
    /**
     * Name of the Session table
     *
     * @var string
     */
    private static $sessionEntity = "sessionvar";

    /**
     * Call with the auth token, the session will determine who the user is
     *
     * @param string $token
     */
    public function __construct($token) {
        
        $this->getUserByToken($token);
        
        if($this->isLoggedInUser()){
            $this->data = R::findAll(self::$sessionEntity,"owner = ?",[$this->user->getID()]);
        }else{
            $this->data = array();
        }
       
    }

    /**
     * Find a user by its token if its not expired
     *
     * @param string $token
     * @return void
     */
    public function getUserByToken($token){
        $this->user = R::findOne("user","token = ? && token_expires > NOW()",[$token]);
    }

    /**
     * Returns the current user id (0 for not authorized)
     *
     * @return int
     */
    public function getUserId(){
        if($this->user != null)
            return $this->user->getID();
        return 0;
    }

    /**
     * Returns the User Role Level. Guest = 0 for not authorized
     *  
     * @return int
     */
    public function getUserLevel(){
        if($this->user == null)return RoleLevel::GUEST;
        return $this->user->roleLevel;
    }

    /**
     * Returns true if the user is logged in
     *
     * @return boolean
     */
    public function isLoggedInUser(){
        return $this->user != null;
    }

    /**
     * Sets a session value
     *
     * @param string $skey
     * @param string $svalue
     * @return void
     */
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