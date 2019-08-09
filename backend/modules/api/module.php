<?php
$charset = "UTF-8";
$maxAge = 3600;
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=".$charset);
header("Access-Control-Max-Age: ".$maxAge);
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$request = [
    "METHODE"=>$_SERVER["REQUEST_METHOD"],
    "DATA"=>json_decode(file_get_contents("php://input"),true),
    "POST"=>$_POST,
    "GET"=>$_GET,
    "RAW"=>file_get_contents("php://input")
];
include('apicontroller/UserCharCtrl.php');
include('apicontroller/SystemUserCtrl.php');
include('apicontroller/ItemTemplateCtrl.php');

//API mock
if($_GET['e'] == "user"){

    unset($_GET["e"]);
    unset($_GET["view"]);
    $chctrl = new SystemUserCtrl();
    $chctrl->setRequest($_SERVER["REQUEST_METHOD"],json_decode(file_get_contents("php://input"),true),$_GET, $_POST);
    echo json_encode($chctrl->getResponse(),JSON_PRETTY_PRINT);
   
} elseif ($_GET["e"] == "char"){
    
    unset($_GET["e"]);
    unset($_GET["view"]);
    $chctrl = new UserCharCtrl();
    $chctrl->setRequest($_SERVER["REQUEST_METHOD"],json_decode(file_get_contents("php://input"),true),$_GET, $_POST);
    echo json_encode($chctrl->getResponse(),JSON_PRETTY_PRINT);
}elseif ($_GET["e"] == "item"){
    
    unset($_GET["e"]);
    unset($_GET["view"]);
    $chctrl = new ItemTemplateCtrl();
    $chctrl->setRequest($_SERVER["REQUEST_METHOD"],json_decode(file_get_contents("php://input"),true),$_GET, $_POST);
    echo json_encode($chctrl->getResponse(),JSON_PRETTY_PRINT);
}
