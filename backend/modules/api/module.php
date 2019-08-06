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

echo json_encode($request);