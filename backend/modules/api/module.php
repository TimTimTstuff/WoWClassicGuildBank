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

//API mock
if($_GET['e'] == "user"){

    $user = new SystemUser();
    $user->systemUserId = 1;
    $user->name = "Admin";
    $user->password = "***";
    $user->registerDate = new DateTime();
    $user->lastLogin = new DateTime();
    $user->role = 1;
    $user->email = "example@example.org";
    echo json_encode($user,JSON_PRETTY_PRINT);
}