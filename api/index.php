<?php

 include('lib/rb-mysql.php');
 include('apilib/ApiController.php');
 include('apilib/ApiRequest.php');
 include('apilib/ApiBaseController.php');
 include('apilib/BaseEntityCtrl.php');
 include('apilib/Hook.php');

 

 $baseFolder = "/wowClassicGuildBank/api/";

R::setup("mysql:host=localhost;dbname=tstuff_wow","root");
$actrl = new ApiController($baseFolder,"Token");
$actrl->setAllowedEntities([]);
$actrl->start();
$actrl->setHeader();
echo $actrl->getResponse();



?>