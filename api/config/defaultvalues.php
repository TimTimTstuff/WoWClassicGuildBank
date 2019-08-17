<?php
/**
 * List of Http Response Codes
 */
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

/**
 * Defined User Role Levels
 * @todo Put this in some Configuration
 */
class RoleLevel{
    public const GUEST = 0;
    public const MEMBER = 1;
    public const GUILD_MEMBER = 2;
    public const OFFICER = 3;
    public const ADMIN = 99;
}