<?php   
namespace TStuff\Php\Logging  ;


use TStuff\Php\Transform\RandomHelper;
 

    class LoggerFactory implements ITLogger {

        /**
         * ID for the current run
         *
         * @var string
         */
        private $correlationId;

        /**
         * Registered Loggers 
         *
         * @var array
         */
        private $registeredLogger = [];

        /**
         * Log level for each level
         *
         * @var array
         */
        private $loggerByValue = [
            LogLevel::Trace=>[],
            LogLevel::Debug=>[],
            LogLevel::Info=>[],
            LogLevel::Warning=>[],
            LogLevel::Error=>[],
            LogLevel::Fatal=>[]
        ];

        /**
         * Defines which category for logs, if no category is defined
         *
         * @var string
         */
        private $currentCategory = "default";

        private $defaultCategory;

        public function __construct(string $defaultCategory = "default")
        {
            $this->correlationId = RandomHelper::generateRandomString(12);
            $this->defaultCategory = $defaultCategory;
            $this->currentCategory = $defaultCategory;
        }
       
        /**
         * Register Logger for different levels
         *
         * @param ITLogger $logger
         * @param array $levels array of different log levels [0,1,16,..]
         * @return void
         */
        public function registerLogger(ITLogger $logger,array $levels){
            $this->registeredLogger[] = array("levels"=>$levels,"logger"=>$logger);
            foreach ($levels as $value) {
                $this->loggerByValue[$value][] = $logger;
            }
        }

        public  function log(int $level, string $message,  $trace = null, string $category = null){
            
            if(is_array($this->loggerByValue[$level]) && count($this->loggerByValue[$level])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[$level] as  $logger) {
                $logger->log($level,$message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }

        }


        public  function setCategory(string $category){
            $this->currentCategory = $category;
        }

        public  function clearCategory(){
            $this->currentCategory = $this->defaultCategory;
        }

        public  function setDefaultCategory(string $category){
            $this->defaultCategory = $category;
        }

        public  function trace(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Trace])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Trace] as  $logger) {
                $logger->trace($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }

        }
        public  function debug(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Debug])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Debug] as  $logger) {
                $logger->debug($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }
        }
        public  function info(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Info])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Info] as  $logger) {
                $logger->info($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }
        }
        public  function warn(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Warning])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Warning] as  $logger) {
                $logger->warn($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }
        }
        public  function error(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Error])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Error] as  $logger) {
                $logger->error($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }
        }
        public  function fatal(string $message, $trace = null, string $category = null){
            if(count($this->loggerByValue[LogLevel::Fatal])<=0)return;

            /** @var ITLogger $logger */
            foreach ($this->loggerByValue[LogLevel::Fatal] as  $logger) {
                $logger->fatal($message."|CI:".$this->correlationId,$trace,$category??$this->currentCategory);
            }
        }



    }