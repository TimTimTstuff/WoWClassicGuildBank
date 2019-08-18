<?php

includeLib();


$baseFolder = strtolower("/WoWClassicGuildBank/api/");

R::setup("mysql:host=localhost;dbname=tstuff_wow","root");
R::freeze(false);

$actrl = new ApiService($baseFolder,"token");
$actrl->setAllowedEntities([]);
$actrl->start();
$actrl->setHeader();

echo $actrl->getResponse();




function includeLib(){
    include 'lib/rb-mysql.php';
    include 'config/enum.php';
    include 'config/error.handler.php';
    include 'api_lib/model/query.model.php';
    include 'api_lib/model/api.model.php';
   include 'api_lib/model/ApiRequest.php';
   include 'api_lib/ReadBean.extension.php';
   include 'api_lib/ApiSession.php';
   include 'api_lib/ApiBaseEntityModel.php';
  include 'api_lib/ApiBaseCtrl.php';
    include 'api_lib/ApiService.php';
    include 'controller/BaseEntityCtrl.php';
}
