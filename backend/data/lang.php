<?php

/**
 * Quick and dirty localization
 * TODO: create better way / create lang file. 
 */

define("DE",[
    "guest"=>"Gast",
    "welcome"=>"Willkommen bei der Gildenbank {name}!"
]);


function getLang(string $key, array $replace =null, string $default = null){

    if(!isset(DE[$key])){
        if($default != null) return $default;
        print_r(DE);
        return "MISSING TEXT: ".$key;
    }
    $result = DE[$key];

    if($replace != null){
        return str_replace(array_keys($replace),array_values($replace),$result);
    }
    return $result;

}