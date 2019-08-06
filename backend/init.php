<?php
    session_start();
    include("config.php");
    include("data/database.php");
    include("data/lang.php");
    include("data/session.php");
    include("context.php");
//Start the backend logic here

$context = Context::getInstance();
$context->setDependencies(new AppSession($_SESSION),$pdo);