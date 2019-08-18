<?php
namespace TStuff\Php\Logging\DefaultLogger  ;

use TStuff\Php\Logging\ITLogger;
use TStuff\Php\Logging\LogLevel;
 

    class FileLogger implements ITLogger {

        private $path;
        private $fileNameTemplate ="log_{date}.log";
        private $currentFileName = "";
        private $cat = "default";
        private $curr = "default";
        

        public function __construct($logDir)
        {
            $this->path = $logDir;
            if(!is_dir($this->path)){
                if(!mkdir($this->path)){
                    throw new \Exception("Can't find or create Log folder: $this->path");
                }   

              

            }
            $this->currentFileName = $this->path."/". str_replace("{date}",date("d_M_Y"),$this->fileNameTemplate);
        }

        private function writeLog($data){
            file_put_contents($this->currentFileName,$data."\r\n",FILE_APPEND);
        }

       
        public  function log(int $level, string $message,   $trace = null, string $category = null){
            $logArr = [
                "Level"=>$level,
                "Message"=>$message,
                "Trace" => $trace,
                "Category"=>$category??$this->cat
            ];
            $this->writeLog(implode(";",array(str_replace(";","~",json_encode($logArr)),date("d M Y H:i:s"))));
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