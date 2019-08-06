<?php
    session_start();
    include("config.php");
    include("data/database.php");
    include("data/lang.php");
    include("data/session.php");
    include("context.php");
    include("controller.php");
    //model files
    include("model/BankStorage.php");
    include("model/ItemTemplate.php");
    include("model/NewsEntry.php");
    include("model/SystemUser.php");
    include("model/Transaction.php");
    include("model/UserChar.php");
//Start the backend logic here

$context = Context::getInstance();
$context->setDependencies(new AppSession($_SESSION),$pdo);