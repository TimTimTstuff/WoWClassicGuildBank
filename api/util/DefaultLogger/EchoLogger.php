<?php
namespace TStuff\Php\Logging\DefaultLogger  ;

use TStuff\Php\Logging\LogLevel;
use TStuff\Php\Logging\ITLogger;
 

    class EchoLogger implements ITLogger  {

        private $cat = "default";
        private $curr = "default";
        
        public  function log(int $level, string $message,  $trace = null, string $category = null){
            $logArr = [
                "Level"=>$level,
                "Message"=>$message,
                "Trace" => $trace,
                "Category"=>$category??$this->cat
            ];
            echo json_encode($logArr,JSON_PRETTY_PRINT);
        }
       
        public  function setCategory(string $category){
            $this->curr = $category;
        }
      
        public  function clearCategory(){
            $this->curr = $this->cat;
        }
       
        public  function setDefaultCategory(string $category){
            $this->cat = $category;
        }
        public  function trace(string $message, $trace = null, string $category = null){
            $this->log(LogLevel::Trace,$message,$trace,$category);
        }
        public  function debug(string $message, $trace = null, string $category = null){
            $this->log(LogLevel::Debug,$message,$trace,$category);
        }
        public  function info(string $message, $trace = null, string $category = null)
        {
            $this->log(LogLevel::Info,$message,$trace,$category);
        }
        public  function warn(string $message, $trace = null, string $category = null){
            $this->log(LogLevel::Warning,$message,$trace,$category);
        }
        public  function error(string $message, $trace = null, string $category = null){
            $this->log(LogLevel::Error,$message,$trace,$category);
        }
        public  function fatal(string $message, $trace = null, string $category = null){
            $this->log(LogLevel::Fatal,$message,$trace,$category);
        }
    }