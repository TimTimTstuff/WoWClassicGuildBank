<?php
namespace TStuff\Php\Logging  ; 

    interface ITLogger  {
        /**
         * Logs a Message
         *
         * @param integer $level 
         * @param string $message
         * @param string $trace
         * @param string $category
         * @return void
         */
        public  function log(int $level, string $message,   $trace = null, string $category = null);
        /**
         * Sets a Category which should be used till clear Category is called
         *
         * @param string $category
         * @return void
         */
        public  function setCategory(string $category);
        /**
         * Clears the category from set Category, sets the "default" category;
         *
         * @return void
         */
        public  function clearCategory();
        /**
         * Sets the default Category for logging
         *
         * @param string $category
         * @return void
         */
        public  function setDefaultCategory(string $category);
        public  function trace(string $message,  $trace = null, string $category = null);
        public  function debug(string $message,  $trace = null, string $category = null);
        public  function info(string $message,  $trace = null, string $category = null);
        public  function warn(string $message,  $trace = null, string $category = null);
        public  function error(string $message,  $trace = null, string $category = null);
        public  function fatal(string $message,  $trace = null, string $category = null);
    }