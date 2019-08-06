<?php

if(!Context::getInstance()->getSession()->isUserLoggedIn()){
    echo "Need to be logged in";
    exit();
}


?>

<h2>Wilkommen im Newsmodul</h2>