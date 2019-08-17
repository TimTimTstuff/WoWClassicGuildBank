<?php


class ApiService
{


    /* #region Static  */
    public static function getInstance()
    {
        return self::$instance;
    }

    private static $instance;
    /* #endregion */
    /* #region  Fields */

    /**
     * Current Request Object
     *
     * @var ApiRequest
     */
    private $apiRequest = null;
    /**
     * API base foder (index.php)
     *
     * @var string
     */
    private $baseFolder = null;
    /**
     * API HTTP Charset
     *
     * @var string
     */
    private $charset = null;
    /**
     * Max Age Header
     *
     * @var int
     */
    private $maxAge = null;
    /**
     * Response Object
     *
     * @var object
     */
    private $response = null;
    /**
     * Debug mode enabled
     *
     * @var boolean
     */
    private $debugMode = false;
    /**
     * Header key for the Auth token
     *
     * @var string
     */
    private $authHeaderKey = null;
    /**
     * Defines the allowed Entities
     *
     * @var string[]
     */
    private $allowedEntities = array();
    /**
     * Session
     *
     * @var ApiSession
     */
    private $session;
    /**
     * Registered Controller
     *
     * @var ApiBaseCtrl[]
     */
    private $apiControllers = array();
    /**
     * Response HTTP State
     *
     * @var int
     */
    private $currentState = HttpResponseCodes::NotImplemented;
    /* #endregion */
    /* #region  Constructor */

    /**
     * Constructor
     *
     * @param string $baseFolder defines the base folder of the API (relativ to http root)
     * @param string $authHeaderKey defines the header key for the custom auth token
     * @param string $charset defines the charset header
     * @param integer $maxAge defines the max age header
     */
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

    /* #endregion */
    /* #region  GETTER */
    /**
     * @return ApiSession
     */
    public function getSession()
    {
        return $this->session;
    }

    /**
     * @return ApiRequest
     */
    public function getRequest()
    {
        return $this->apiRequest;
    }

    /**
     * @return object
     */
    public function getResponse()
    {

        $response = null;
        //create empty response message
        if ($this->response == null) {
            $msg = new ApiMessageResponse();
            $msg->isSuccess = false;
            $msg->message = "empty result";
            $response = $msg;
        } else {
            //default response form controller
            $this->setState(HttpResponseCodes::Ok);
            $response = $this->response;
        }
        //if debug mode is enabled wrap $result in a debug object
        if ($this->debugMode) {
            $debugMsg = new ApiDebugResult();
            $debugMsg->request = $this->apiRequest;
            $debugMsg->result = $response;
            $response = $debugMsg;
        }
        
        http_response_code($this->currentState);
        return json_encode($response, JSON_PRETTY_PRINT);
    }

    /* #endregion */
    /* #region  SETTER */
    public function setAllowedEntities(array $allowedEntities)
    {
        $this->allowedEntities = $allowedEntities;
    }

    public function setHeader()
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=" . $this->charset);
        header("Access-Control-Max-Age: " . $this->maxAge);
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }

    public function setState(int $state)
    {
        $this->currentState = $state;
    }

    public function setDebugMode(bool $debug)
    {
        $this->debugMode = $debug;
    }
    /* #endregion */
    /* #region  LOGIC */

    private function setupApiRequest(){
        //clean request URI (remove not relevant path parts)
        $apiPath = str_replace($this->baseFolder, "", strtolower($_SERVER['REQUEST_URI']));
        //parse the ApiRequest
        $this->apiRequest = ApiRequest::ParseRequest($apiPath, $_SERVER['REQUEST_METHOD'], json_decode(file_get_contents('php://input'), true), $this->authHeaderKey);
        //check if the debug mode is enabled
        $this->debugMode = $this->apiRequest->params['debug'] ?? false || $this->debugMode;
        //initialize the session
        $this->session = new ApiSession($this->apiRequest->authKey);
    }

    private function handleApiRootRequest(){
        if ($this->apiRequest->baseEntity == null) {

            $this->createMessageResponse(true, "API Base not implemented");
            $this->setState(HttpResponseCodes::NotImplemented);
            return true;
        }
        return false;
    }

    private function loadModel(){
        if (file_exists('model/' . $this->apiRequest->baseEntity . ".model.php")) {
            include_once('model/' . $this->apiRequest->baseEntity . ".model.php");
        }
    }

    private function isRequestedEntityOk(){
        return count($this->allowedEntities) == 0 || in_array($this->apiRequest->baseEntity, $this->allowedEntities);
    }

    private function handleNormalRequest(){
        if (!$this->isRequestedEntityOk())return false; 

        $this->loadModel();
        $this->run();
        return true;
    }

    public function start()
    {
        $this->setupApiRequest();
        
        //handle api root request
        if($this->handleApiRootRequest()) return;
        //handle normal request
        if($this->handleNormalRequest()) return;
        
        //if nothing to run is found
        $this->createMessageResponse(false, "Unknown Entity");
        $this->setState(HttpResponseCodes::NotFound);
    }



    private function run()
    {

        $apiCtrl = $this->apiControllers["entity"] ?? null;
        if ($apiCtrl == null) {
            $this->setState(HttpResponseCodes::NotFound);
            return;
        }

        $apiCtrl->setContext($this);
        if (!$apiCtrl->hasPermission()) {
            $this->createMessageResponse(false, "You haven't the permissions to do this action");
            $this->setState(HttpResponseCodes::Unauthorized);
            return;
        }
        switch ($this->apiRequest->method) {
            case 'GET':
                if ($this->apiRequest->requestedId != null) {
                    $this->response = $apiCtrl->getById($this->apiRequest->requestedId, $this->apiRequest->params);
                } else {
                    $this->response = $apiCtrl->get($this->apiRequest->params);
                }
                break;
            case 'PUT':
                $this->response = $apiCtrl->update($this->apiRequest->requestedId, $this->apiRequest->input);
                break;
            case 'POST':
                if ($this->apiRequest->action != null) {
                    $this->response = $apiCtrl->invokeAction($this->apiRequest->action, $this->apiRequest->requestedId, $this->apiRequest->input);
                } else {
                    $this->response = $apiCtrl->create($this->apiRequest->input);
                }

                break;
            case 'DELETE':
                $this->response = $apiCtrl->delete($this->apiRequest->requestedId, $this->apiRequest->input);
                break;
            default:
                $this->createMessageResponse(false, "Not supported Method: " . $this->apiRequest->method);
                $this->setState(HttpResponseCodes::MethodNotAllowed);
                return;
        }
    }
    /* #endregion */
    /* #region  HELPER */
    private function createMessageResponse($success, $message, $exception = null, $data = null)
    {

        $msg = new ApiMessageResponse();
        $msg->isSuccess = $success;
        $msg->message = $message;
        $msg->data = $data;
        $msg->exception = $exception;
        $this->response = $msg;
    }

    public function printRequest()
    {
        $msg = new ApiMessageResponse();
        $msg->isSuccess = true;
        $msg->data = $this->apiRequest;
        $msg->message = "Request object";
        echo json_encode($msg, JSON_PRETTY_PRINT);
    }
    /* #endregion */
}
