<?php

class HttpResponseCodes{
    public const Ok = 200;
    public const Created = 201;
    public const NoContent = 204;
    public const BadRequest = 400;
    public const Unauthorized = 401;
    public const NotFound = 404;
    public const MethodNotAllowed = 405;
    public const NotImplemented = 501;

}

class ApiMessageResponse{
    public $isSuccess;
    public $message;
    public $exception;
    public $data;
}

class ApiDebugResult{
    public $request;
    public $result;
}

class ApiResult{
    public $data;
    public $type;
}

class ApiController
{

    public static function getInstance(){
        return self::$instance;
    }

    private static $instance;

    /**
     * Undocumented variable
     *
     * @var ApiRequest
     */
    private $apiRequest = null;
    private $baseFolder = null;
    private $charset = null;
    private $maxAge = null;
    private $response = null;
    private $debugMode = false;
    private $authHeaderKey = null;
    private $allowedEntities = array();
    private $session;
    /**
     * Undocumented variable
     *
     * @var ApiBaseCtrl[]
     */
    private $apiControllers = array();
    private $currentState = HttpResponseCodes::NotImplemented;

    public function __construct(string $baseFolder, string $authHeaderKey, string $charset = "UTF-8", int $maxAge = 3600)
    { 
        self::$instance = $this;
        $this->baseFolder = $baseFolder;
        $this->maxAge = 3600;
        $this->charset = $charset;
        $this->apiControllers["entity"] = new BaseEntityCtrl();
        $this->authHeaderKey = $authHeaderKey;
        $this->allowedEntities = null;
        
    }

    
    /**
     * Undocumented function
     *
     * @return ApiSession
     */
    public function getSession(){
        return $this->session;
    }

    public function setAllowedEntities(array $allowedEntities){
        $this->allowedEntities = $allowedEntities;
    }

    public function setHeader(){
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=".$this->charset);
        header("Access-Control-Max-Age: ".$this->maxAge);
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }

    /**
     * Undocumented function
     *
     * @return ApiRequest
     */
    public function getRequest(){
        return $this->apiRequest;
    }

    public function setState(int $state){
        $this->currentState = $state;
    }

    public function start(){
        $apiPath = str_replace($this->baseFolder,"", strtolower($_SERVER['REQUEST_URI']));
        $this->apiRequest = ApiRequest::ParseRequest($apiPath, $_SERVER['REQUEST_METHOD'],json_decode(file_get_contents('php://input'), true),$this->authHeaderKey);
        $this->debugMode = $this->apiRequest->params['debug']??false || $this->debugMode;
        $this->session = new ApiSession($this->apiRequest->authKey);
        $this->session->setValue("lastaction",new DateTime());
            if($this->apiRequest->baseEntity == null){
               
                $this->createMessageResponse(true,"API Base not implemented");
                $this->setState(HttpResponseCodes::NotImplemented);
                return;
            }
        
            if(count($this->allowedEntities) == 0 || in_array($this->apiRequest->baseEntity,$this->allowedEntities)){
                
                if(file_exists('model/'.$this->apiRequest->baseEntity.".model.php")){
                   include('model/'.$this->apiRequest->baseEntity.".model.php");
               }
                $this->run();
                return;
            }

          $this->createMessageResponse(false,"Unknown Entity");
                $this->setState(HttpResponseCodes::NotFound);
        
       
    }

    private function createMessageResponse($success,$message, $exception = null, $data = null){
      
        $msg = new ApiMessageResponse();
        $msg->isSuccess = $success;
        $msg->message = $message;
        $msg->data = $data;
        $msg->exception = $exception;
        $this->response = $msg;
      
    }
    
    private function run(){
        
        $apiCtrl = $this->apiControllers["entity"]??null;
        if($apiCtrl == null ){
            $this->setState(HttpResponseCodes::NotFound);
            return;
        }

        $apiCtrl->setContext($this);
        if(!$apiCtrl->hasPermission()){
            $this->createMessageResponse(false,"You haven't the permissions to do this action");
            $this->setState(HttpResponseCodes::Unauthorized);
            return;
        }
        switch ($this->apiRequest->method) {
            case 'GET':
                    if($this->apiRequest->requestedId != null){
                        $this->response = $apiCtrl->getById($this->apiRequest->requestedId,$this->apiRequest->params);
                    }else{
                        $this->response = $apiCtrl->get($this->apiRequest->params);
                    }
                break;
            case 'PUT':
                    $this->response = $apiCtrl->update($this->apiRequest->requestedId,$this->apiRequest->input);
                break;
            case 'POST':
                    if($this->apiRequest->action != null){
                        $this->response = $apiCtrl->invokeAction($this->apiRequest->action,$this->apiRequest->requestedId,$this->apiRequest->input);
                    }else{
                        $this->response = $apiCtrl->create($this->apiRequest->input);
                    }
                    
                break;
            case 'DELETE':
                    $this->response = $apiCtrl->delete($this->apiRequest->requestedId,$this->apiRequest->input);
                break;
            default:
                $this->createMessageResponse(false,"Not supported Method: ".$this->apiRequest->method);
                $this->setState(HttpResponseCodes::MethodNotAllowed);
                return;
        }

    }


    public function getResponse(){

     
        $response = null;
        http_response_code($this->currentState);
        if($this->response == null){
            $msg = new ApiMessageResponse();
            $msg->isSuccess = false;
            $msg->message = "empty result";
            $response = $msg;
        
        }else{
            $response = $this->response;
             
        }
       
        if($this->debugMode){
            $debugMsg = new ApiDebugResult();
            $debugMsg->request = $this->apiRequest;
            $debugMsg->result = $response;
            $response = $debugMsg;
        }
        
        return json_encode($response,JSON_PRETTY_PRINT);
    }

    public function setDebugMode(bool $debug){
        $this->debugMode = $debug;
    }

    public function printRequest(){
        $msg = new ApiMessageResponse();
        $msg->isSuccess = true;
        $msg->data = $this->apiRequest;
        $msg->message = "Request object";        
        echo json_encode($msg,JSON_PRETTY_PRINT);
    }

}

?>
