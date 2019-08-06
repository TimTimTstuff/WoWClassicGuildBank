<?php
    session_start();
    //include config
    include("config.php");

    //include data
    include("data/database.php");
    include("data/lang.php");
    include("data/session.php");
    include("data/basemodel.php");

    //model files
    include("model/BankStorage.php");
    include("model/ItemTemplate.php");
    include("model/NewsEntry.php");
    include("model/SystemUser.php");
    include("model/Transaction.php");
    include("model/UserChar.php");

    //rest
    include("context.php");
    include("controller.php");
//Start the backend logic here

$context = Context::getInstance();
$context->setDependencies(new AppSession($_SESSION),$pdo);
BaseModel::$context = $context;