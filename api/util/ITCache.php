<?php


    interface ITCache  {
       
        /**
         * Stores a value in a file cache. 
         * 
         *
         * @param string $category Categorys store in different cache files
         * @param string $key 
         * @param mixed $value
         * @param integer $lifetime how long should a value be valid
         * @return void
         */
        public function storeValue(string $category,string $key,  $value, int $lifetime = 60*60*24);
        /**
         * Get the value from the cache
         *
         * @param string $category
         * @param string $key
         * @return mixed
         */
        public function getValue(string $category, string $key);
        /**
         * invalidates a specific key or category
         *
         * @param string $category
         * @param string|null $key
         * @return void
         */
        public function invalidate(string $category, ?string $key = null):void;

        /**
         * Checks if a key exists in the cache
         *
         * @param string $category
         * @param string $key
         * @return boolean
         */
        public function existsKey(string $category, string $key);
    }