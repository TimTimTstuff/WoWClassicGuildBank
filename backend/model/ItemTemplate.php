<?php

class ItemTemplate extends BaseModel{
    public $itemTemplateId;
    public $wowid;
    public $itemName;
    public $itemType;
    public $itemSubType;
    public $itemQuality;
    public $itemLevel;
    public $requiredLevel;
    public $description;
    public $htmlTemplate;
    public $itemicon;

    public static $tableName = "wow_itemtemplates";


    private $itemTypeNames = array(
        0 => "consumables",
        1 => "containers",
        2 => "weapon",
        4 => "armor",
        6 => "projectiles",
        7 => "trade",
        9 => "recipes",
        11 => "quivers",
        12 => "quest",
        13 => "keys",
        15 => "misc",
    );

    public function setDataFromArray(array $charData)
    {
        $this->itemTemplateId = $charData['itemtemplateid'];
        $this->wowid = $charData['wowid'];
        $this->itemName = $charData['itemname'];
        $this->itemType = $charData['itemtype'];
        $this->itemSubType = $charData['itemsubtype'];
        $this->itemQuality = $charData['itemquality'];
        $this->itemLevel = $charData['itemlevel'];
        $this->requiredLevel = $charData['requiredlevel'];
        $this->description = $charData['description'];
        $this->htmlTemplate = $charData['htmltemplate'];
        $this->itemicon = $charData['itemicon'];
      
    }


    /**
     * Updates char data in the database
     *
     * @return void
     */
    public function update(){
        $query = "UPDATE ".self::$tableName." SET `wowid`= ?,`itemname`= ?,`itemtype`= ?,`itemsubtype`= ?,
        `itemquality`= ?,`itemlevel`= ?,`requiredlevel`= ?,`description`= ?,`htmltemplate`= ?,`itemicon`= ? WHERE itemtemplateid = ?";
        $statement = self::$context->getPdo()->prepare($query);
        $insertValueArray =  [
            $this->wowid, 
            $this->itemName,
             $this->itemType, 
             $this->itemSubType, 
             $this->itemQuality, 
             $this->itemLevel, 
             $this->requiredLevel, 
             $this->description,
             $this->htmlTemplate, 
             $this->itemicon,
             $this->itemTemplateId
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
     * @return ItemTemplate[]
     */
    public static function get(int $start, int $count, string $where = null){
        $query = "SELECT * from ".self::$tableName." ".($where!=null?"WHERE ".$where:"")." LIMIT ? OFFSET ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$count, $start])){

            $result = $statement->fetchAll();
            $usersChars = array();
            foreach ($result as $value) {
                $char = new ItemTemplate();
                $char->setDataFromArray($value);
                $usersChars[] = $char;
            }
            return $usersChars;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);
    }


    /**
     * Load a ItemTemplate by its ID
     *
     * @param integer $id
     * @return ItemTemplate
     */
    public static function getById(int $id){
        $query = "SELECT * from ".self::$tableName." where itemtemplateid = ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$id])){

            $result = $statement->fetch();
            if($result == null) return null;
            $char = new ItemTemplate();
            $char->setDataFromArray($result);
            return $char;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }


    public static function create(ItemTemplate $char){

        //check if ItemTemplateId == null, if yes return
        if($char->ItemTemplateId != null){return;}
        $query = "INSERT INTO ".self::$tableName." 
        ( `wowid`, `itemname`, `itemtype`, `itemsubtype`, `itemquality`, `itemlevel`, `requiredlevel`, `description`, `htmltemplate`, `itemicon`) 
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";

        $statement = self::$context->getPdo()->prepare($query);

        $insertValueArray =  [
            $char->wowid, 
            $char->itemName, 
            $char->itemType,
             $char->itemSubType, 
             $char->itemQuality, 
             $char->itemLevel, 
             $char->requiredLevel, 
             $char->description, 
             $char->htmlTemplate,
             $char->itemicon];

        if($statement->execute($insertValueArray)){
            $char->ItemTemplateId = self::$context->getPdo()->lastInsertId();
            return $char;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }

    public static function delete($id){
      
        $query = "DELETE FROM ".self::$tableName." WHERE itemtemplateid = ?";
        $statement = self::$context->getPdo()->prepare($query);

        if($statement->execute([$id])){
            return;
        }

        throw new PDOException($statement->queryString." <br/> ".$statement->errorInfo()[2]);

    }



    

    public static function createTable(){

        $query = "CREATE TABLE `wow_itemtemplates` (
            `itemtemplateid` int(11) NOT NULL AUTO_INCREMENT,
            `wowid` int(11) NOT NULL,
            `itemname` varchar(255) NOT NULL,
            `itemtype` int(11) NOT NULL DEFAULT '0',
            `itemsubtype` int(11) NOT NULL DEFAULT '0',
            `itemquality` int(11) NOT NULL DEFAULT '0',
            `itemlevel` int(11) NOT NULL DEFAULT '0',
            `requiredlevel` int(11) NOT NULL DEFAULT '0',
            `description` varchar(255) DEFAULT NULL,
            `htmltemplate` varchar(2000) NOT NULL,
            `itemicon` varchar(255) NOT NULL,
            PRIMARY KEY (`itemtemplateid`),
            UNIQUE KEY `wowid` (`wowid`)
           ) ENGINE=InnoDB AUTO_INCREMENT=9577 DEFAULT CHARSET=utf8
           ";

        self::$context->getPdo()->exec($query);

    }
}