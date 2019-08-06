<?php

try{
    $pdo =  new PDO(
       DB_DSN,
       DB_USER,
       DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
           // PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]//options
    );
   
    }catch(\PDOException $e){
      
        print_r($e);
    }

