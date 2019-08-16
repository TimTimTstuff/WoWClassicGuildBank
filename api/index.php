<?php

 include('lib/rb-mysql.php');
 include('apilib/ApiService.extension.php');
 include('apilib/ApiService.php');
 include('apilib/ApiRequest.php');
 include('apilib/ApiBaseController.php');
 include('apilib/BaseEntityCtrl.php');
 include('apilib/Hook.php');
 include('apilib/ApiSession.php');
 include('model/sessionvar.model.php');
 

 $baseFolder = strtolower("/WoWClassicGuildBank/api/");

R::setup("mysql:host=localhost;dbname=tstuff_wow","root");
$actrl = new ApiService($baseFolder,"token");
$actrl->setAllowedEntities([]);
$actrl->start();
$actrl->setHeader();
echo $actrl->getResponse();



?>