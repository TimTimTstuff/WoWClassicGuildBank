<?php

/**
 * This is a Model class. The model in softwaredevelopment is usually a object which gives the developer data, also alowes him to manipulate and save 
 * this data. Model/Object specific functions also stored in a model. Like, Create, update,load or for a user: Login, hasRights, isAdmin,..
 *  (part of oop)
 * SystemUser in database. 
 * Implement different functions to load, create, update user. 
 * Also implements functions the user may needs, like "validateLogin" "logout" ...
 * - if you load a user, create a SystemUser object with the properties set
 * - update: the update should use the properties
 * 
 */
class SystemUser extends BaseModel{

    

    //properties of the Systemuser = table columns
    public $systemUserId; //primary id, int, auto increment
    public $name;//uniqe, string, size 64  (user / loginname)
    public $password;//size 129, string (sha) (password saved as sha)
    public $email;//size 128, string (email address of the user)
    public $registerDate;//timestemp, default: current timestamp (date they registered)
    public $lastLogin;//timestamp (last time they logged in)
    public $role;//size 2, int (security role as int (0=member, 1=better member, 2=admin...))
    //properties end

    public function __construct() {
        //set the database table name. Variable from the parent class BaseModel
        $this->tableName = "systemuser";
    }

    private static function getPasswordHash(){
        //return password as hash. Add a salt, save the salt in the config.php
    }

    /**
     * Undocumented function
     *
     * @param integer $id
     * @return SystemUser 
     */
    public static function byId(int $id){
         //Load System user by id from the database
         $pdo = Context::getInstance()->getPdo();
        $result = $pdo->query("");
         //Load a single user by id, return a System user object 
    }

    /**
     * Undocumented function
     *
     * @param string $name
     * @return SystemUser 
     */
    public static function byName(string $name){
        //load a user by its username
    }
    
    public static function loadMultiple(string $query){
        //Load users by a query, return multiple users
    }
    
    public static function createUser(SystemUser $user){
        //create a new user based on the user data
    }

    public function update(){
        //Update the record based on the properties
    }
}