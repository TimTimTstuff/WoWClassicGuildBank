<?php

if(!Context::getInstance()->getSession()->isUserLoggedIn()){
    include('loginform.php');
}else{
    include('logoutform.php');
}


?>