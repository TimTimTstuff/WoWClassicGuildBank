<?php

/**
 * Quick implementation of a Module loader. Just include module file from the module directory
 */
class ModuleLoader{


    public static function loadModul(string $key){
        if(file_exists(MODULE_PATH.$key."/module.php"))
            include(MODULE_PATH.$key."/module.php");
        else
            echo "Module: ".$key." not found!";
    }


}
