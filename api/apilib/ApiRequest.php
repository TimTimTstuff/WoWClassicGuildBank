<?php

class ApiRequest
{

    public $method;
    public $rawPath;
    public $pathArray;
    public $params;
    public $baseEntity;
    public $requestedId;
    public $action;
    public $input;
    public $authKey;


    /**
     * Undocumented function
     *
     * @param string $path
     * @param string $requestMethod
     * @param mixed $data
     * @return ApiRequest
     */
    public static function ParseRequest(string $path, string $requestMethod, $data, string $authHeaderKey)
    {
        $splitParams = explode("?", $path);
        $pathArr = explode("/", $splitParams[0]);
        $params = array();
        if (isset($splitParams[1])) {
            $keyValueString = explode("&", $splitParams[1]);

            foreach ($keyValueString as  $value) {
               $t = explode("=", $value,2);
               if($t[0] == "")continue;
               $params[$t[0]] = $t[1]??"";
            }
        }

        $api = new ApiRequest();
        $api->baseEntity = $pathArr[0];
        $api->method = $requestMethod;
        $api->params = $params;
        $api->pathArray = $pathArr;
        $api->rawPath = $path;
        $api->requestedId = isset($pathArr[1]) && is_numeric($pathArr[1]) ? $pathArr[1] : null;
        $api->action = isset($pathArr[1]) && !is_numeric($pathArr[1])?$pathArr[1]:(isset($pathArr[2])?$pathArr[2]:null);
        $api->input = $data;
        $api->authKey = apache_request_headers()[$authHeaderKey]??null;

        return $api;
    }
}
