<?php

if(!is_numeric($_GET['year'])){
    
}

$year = $_GET['year'];

$dir = "\\\\sig-ham-file01\\Projekte\\$year";
    echo "in";
        
if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                echo nl2br ("$file \n ");
            }
        closedir($dh);
    }
}    

?>