<?php
class UserChar extends BaseModel{
    
    //table properties
    public $userCharId;
    public $userId;
    public $charName;
    public $charRace;
    public $charClass;
    public $charRole;
    public $charRoleSup;
    public $firstProfession;
    public $secondProfession;
    public $hasCooking;
    public $hasFishing;
    public $hasFirstAid;
    //end table properties

    public static $tableName = "wow_userchars";

    /**
     * Sets the values by array. 
     */
    public function setDataFromArray(array $charData)
    {
        $this->userCharId = $charData['usercharid'];
        $this->userId = $charData['userid'];
        $this->charName = $charData['charname'];
        $this->charRace = $charData['charrace'];
        $this->charClass = $charData['charclass'];
        $this->charRole = $charData['charrole'];
        $this->charRoleSup = $charData['charrolesup'];
        $this->firstProfession = $charData['firstprofession'];
        $this->secondProfession = $charData['secondprofession'];
        $this->hasCooking = $charData['hascooking'];
        $this->hasFirstAid = $charData['hasfirstaid'];
        $this->hasFishing = $charData['hasfishing'];
    }


    /**
     * Updates char data in the database
     *
     * @return void
     */
    public function update(){
        $query = "UPDATE ".self::$tableName." SET `charname`= ?,`charrace`= ?,`charclass`= ?,`charrole`= ?,`charrolesup`= ?,`firstprofession`= ?,`secondprofession`= ?,`hascooking`= ?,`hasfishing`= ?,`hasfirstaid`= ? WHERE usercharid = ?";
        $statement = self::$context->getPdo()->prepare($query);
        $insertValueArray =  [
            $this->charName, 
            $this->charRace,
             $this->charClass, 
             $this->charRole, 
             $this->charRoleSup, 
             $this->firstProfession, 
             $this->secondProfession, 
             $this->hasCooking,
             $this->hasFishing, 
             $this->hasFirstAid,
             $this->userCharId
            ];
        if($statement->execute($insertValueArray)){
            return;
        }
        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);
    }


    /*
        Static statements
    */

    /**
     * Get all Chars 
     *
     * @param integer $start
     * @param integer $count
     * @return UserChar[]
     */
    public static function getChars(int $start, int $count, string $where = null){
        $query = "SELECT * from ".self::$tableName." ".($where!=null?"WHERE ".$where:"")." LIMIT ? OFFSET ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$count, $start])){

            $result = $statement->fetchAll();
            $usersChars = array();
            foreach ($result as $value) {
                $char = new UserChar();
                $char->setDataFromArray($value);
                $usersChars[] = $char;
            }
            return $usersChars;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);
    }

    /**
     * Load all chars for a specific userid
     *
     * @param integer $userId
     * @return UserChar[]
     */
    public static function getAllCharsFromUser(int $userId){
        $query = "SELECT * from ".self::$tableName." where userid = ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$userId])){

            $result = $statement->fetchAll();
            $usersChars = array();
            foreach ($result as $value) {
                $char = new UserChar();
                $char->setDataFromArray($value);
                $usersChars[] = $char;
            }
            return $usersChars;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }


    /**
     * Load a UserChar by its ID
     *
     * @param integer $id
     * @return UserChar
     */
    public static function getById(int $id){
        $query = "SELECT * from ".self::$tableName." where usercharid = ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$id])){

            $result = $statement->fetch();
            if($result == null) return null;
            $char = new UserChar();
            $char->setDataFromArray($result);
            return $char;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }


    public static function create(UserChar $char){

        //check if userCharId == null, if yes return
        if($char->userCharId != null){return;}
        $query = "INSERT INTO ".self::$tableName." 
        ( `userid`, `charname`, `charrace`, `charclass`, `charrole`, `charrolesup`, `firstprofession`, `secondprofession`, `hascooking`, `hasfishing`, `hasfirstaid`) 
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";

        $statement = self::$context->getPdo()->prepare($query);

        $insertValueArray =  [
            $char->userId, 
            $char->charName, 
            $char->charRace,
             $char->charClass, 
             $char->charRole, 
             $char->charRoleSup, 
             $char->firstProfession, 
             $char->secondProfession, 
             $char->hasCooking,
             $char->hasFishing, 
             $char->hasFirstAid];

        if($statement->execute($insertValueArray)){
            $char->userCharId = self::$context->getPdo()->lastInsertId();
            return $char;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }

    public static function deleteChar($id){
      
        $query = "DELETE FROM ".self::$tableName." WHERE usercharid = ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$id])){
            return;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }



    public static function createTable(){

        $query = "CREATE TABLE ".self::$tableName." (
            `usercharid` int(11) NOT NULL AUTO_INCREMENT,
            `userid` int(11) NOT NULL,
            `charname` varchar(64) COLLATE utf8_bin NOT NULL,
            `charrace` varchar(64) COLLATE utf8_bin NOT NULL,
            `charclass` varchar(64) COLLATE utf8_bin NOT NULL,
            `charrole` varchar(64) COLLATE utf8_bin NOT NULL,
            `charrolesup` varchar(64) COLLATE utf8_bin NOT NULL,
            `firstprofession` varchar(64) COLLATE utf8_bin NOT NULL,
            `secondprofession` varchar(64) COLLATE utf8_bin NOT NULL,
            `hascooking` int(1) NOT NULL,
            `hasfishing` int(1) NOT NULL,
            `hasfirstaid` int(1) NOT NULL,
            PRIMARY KEY (`usercharid`)
           ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_bin";

            self::$context->getPdo()->exec($query);

    }


}