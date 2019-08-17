<?php

class ActionFaultResult{
    public $success = false;
    public $message = "";
    public $code = 0;
}

/**
 * Default Message Response of the API
 */
class ApiMessageResponse{
    public $isSuccess;
    public $message;
    public $exception;
    public $data;
}

/**
 * Wrapper object for Debug results
 */
class ApiDebugResult{
    public $request;
    public $result;
}
