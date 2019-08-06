<?php

/**
 * Quick way for modules. Everything which should be done, has to be in this file, or included in this file. 
 */

if(!Context::getInstance()->getSession()->isUserLoggedIn()){
    echo "Need to be logged in";
    exit();
}


?>

<h2>Wilkommen im Inventar der Gildenbank</h2>