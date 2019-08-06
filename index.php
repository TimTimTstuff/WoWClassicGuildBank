<?php 

  include("backend/init.php");

  $requestedApi = isset($_GET["view"])?$_GET['view']:"default";
 
  if($requestedApi == "default"){
    include("backend/pages/main.php");
  }else{
    
    switch($requestedApi){

      case "main":
        echo "Main";
      break;
        default:
          echo "404 not found";
    }
  }


?>
