<?php

class ApiRequest
{
    /* #region  Public Fields */

    /**
     * @var string Http Method
     */
    public $method;
    /**
     * Raw Path
     *
     * @var string
     */
    public $rawPath;
    /**
     * @var string[] transformed path
     */
    public $pathArray;
    /**
     * Dictionary with get parameters
     *
     * @var string[]
     */
    public $params;
    /**
     * @var string name of the requested entity
     */
    public $baseEntity;
    /**
     * Requestet Record ID or null
     *
     * @var int
     */
    public $requestedId;
    /**
     * Requested Action or NUll
     *
     * @var string
     */
    public $action;
    /**
     * JSON Input
     *
     * @var object
     */
    public $input;
    /**
     * Given Auth Token
     * 
     * @var string 
     */
    public $authKey;
    /* #endregion */


    /**
     * Create a ApiRest request with the needed Data
     *
     * @param string $path example: Url path with Get parameters
     * @param string $requestMethod Http method of the call
     * @param mixed $data transfered object
     * @param mixed $authHeaderKey http header key with the token
     * @return ApiRequest
     */
    public static function ParseRequest(string $path, string $requestMethod, $data, string $authHeaderKey)
    {
        $splitParams = explode("?", $path);
        $pathArr = explode("/", $splitParams[0]);
        $params = array();
        //URL Get Param Parser
        if (isset($splitParams[1])) {
            $keyValueString = explode("&", $splitParams[1]);

            foreach ($keyValueString as  $value) {
                $t = explode("=", $value, 2);
                if ($t[0] == "") continue;
                $params[$t[0]] = $t[1] ?? "";
            }
        }

        $api = new ApiRequest();
        $api->baseEntity = $pathArr[0];
        $api->method = $requestMethod;
        $api->params = $params;
        $api->pathArray = $pathArr;
        $api->rawPath = $path;
        $api->requestedId = isset($pathArr[1]) && is_numeric($pathArr[1]) ? $pathArr[1] : null;
        $api->action = isset($pathArr[1]) && !is_numeric($pathArr[1]) ? $pathArr[1] : (isset($pathArr[2]) ? $pathArr[2] : null);
        $api->input = $data;
        //Apache specific method to get headers / custom headers
        $api->authKey = apache_request_headers()[$authHeaderKey] ?? null;

        return $api;
    }
}
