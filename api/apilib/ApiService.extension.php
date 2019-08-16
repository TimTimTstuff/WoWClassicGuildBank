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