<?php  


    class TFileCache implements ITCache  {
        
        private $path;
        
        private $cacheData = [];

        private $categories = [];

        private static $fileExtension = ".cache";
        private static $fileNameDelimiter = "_";
        public static $defaultLifeTime = (60*60*24);

        private static $self;

        private function __construct(string $cacheDirPath){
            $this->path = $cacheDirPath;
            $this->setupCacheDir();
            $this->getAllCacheFiles();
        }

        private function setupCacheDir(){
            if(!is_dir($this->path)){
                if(!mkdir($this->path)){
                    throw new \Exception("Can't find or create FileCache folder: $this->$path");
                }   
            }
        }

        public static function getInstance(string $cacheDirPath):TFileCache{
            if(self::$self == null){
                self::$self = new TFileCache($cacheDirPath);
            }
            return self::$self;
        }

        private static function generateCacheFileName($category){
          
            $fileNameParts = [base64_encode($category),self::$fileNameDelimiter,time(),self::$fileExtension];
            return implode("",$fileNameParts);
        }

       

        private static function getCategoryFromFileName($fileName){
            $r = explode(self::$fileNameDelimiter,
            str_replace(self::$fileExtension,"",$fileName));
            return base64_decode($r[0]);
        }

        private function getAllCacheFiles(){
            $dirs = scandir($this->path);
            $nonCategories = array(".","..");
            $this->categories = [];
            foreach ($dirs as $key => $value) {
                
                if(in_array($value,$nonCategories))continue;
                {
                    $this->categories[self::getCategoryFromFileName($value)] = $value;
                }
            }
        }

        private function loadOrSetCategory(string $category){
            if(!array_key_exists($category,$this->categories)){
                //create cache file name
                $this->categories[$category] = self::generateCacheFileName($category);   
                $this->cacheData[$category] = [];
            } 
            else{
                $this->cacheData[$category] = json_decode(file_get_contents($this->path."/".$this->categories[$category]),true);
                foreach ($this->cacheData[$category] as $key => $value) {
                    if($value['lifetime']<time()){
                        unset($this->cacheData[$category][$key]);
                    }
                }
            }
        }

        /**
         * Undocumented function
         *
         * @param string $category
         * @param string $key
         * @param [type] $value
         * @param integer|null $lifetime in seconds
         * @return void
         */
        public function storeValue(string $category,string $key,  $value, ?int $lifetime = null){
           
            $this->loadOrSetCategory($category);

            $this->cacheData[$category][$key] = ["value"=>$value,"lifetime"=>time()+$lifetime??self::$defaultLifeTime];
           

            //write cache file
            file_put_contents($this->path."/".$this->categories[$category],json_encode($this->cacheData[$category]));
            
        }

        public function getValue(string $category, string $key){
           
            if(!array_key_exists($category,$this->categories))return null;
             
            if(!isset($this->cacheData[$category])){
                $this->cacheData[$category] = json_decode(file_get_contents($this->path."/".$this->categories[$category]),true);
            }

            if(!isset($this->cacheData[$category][$key])) return null;

            return $this->cacheData[$category][$key]["value"];
        }

        public function getValueOrSetDefault(string $category, string $key, $default, $ttl = null){
            if($this->existsKey($category,$key)){
                return $this->getValue($category,$key);
            }
            $this->storeValue($category,$key,$default,$ttl);
            return $default;
        }
        
        public function invalidate(string $category, ?string $key = null):void{

            $this->loadOrSetCategory($category);
            if($key != null){
                unset($this->cacheData[$category][$key]);
                file_put_contents($this->path."/".$this->categories[$category],json_encode($this->cacheData[$category]));
            }else{
                unlink($this->path."/".$this->categories[$category]);
                unset($this->cacheData[$category]);
                unset($this->categories[$category]);
                
            }
           
        }

        public function existsKey(string $category, string $key):bool{
            if(!array_key_exists($category,$this->categories))return false;
             
            if(!isset($this->cacheData[$category])){
                $this->cacheData[$category] = json_decode(file_get_contents($this->path."/".$this->categories[$category]),true);
            }

            if(!isset($this->cacheData[$category][$key])) return false;
            return true;
        }
    }