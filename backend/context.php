<?php

class Context{

    private $session;
    private $pdo;

    private static $self;


    /**
     * Undocumented function
     *
     * @return Context
     */
    public static function getInstance(){
        
        if(self::$self == null){
            self::$self = new Context();
        }
        
        return self::$self;
    }

    public function setDependencies(AppSession $session, \PDO $pdo) {
        $this->session = $session;
        $this->pdo = $pdo;
    }

    /**
     * Undocumented function
     *
     * @return \PDO
     */
    public function getPdo(){
        return $this->pdo;
    }

    /**
     * Undocumented function
     *
     * @return AppSession
     */
    public function getSession(){
        return $this->session;
    }

}