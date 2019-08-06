<?php
error_reporting(E_ALL);
/***
 *  WoWGuildBank App Configuration
 */

## Website
define("PAGE_TITLE","WoW Guild Bank");

 ## Enviroment
define("BASE_PATH", $_SERVER['CONTEXT_DOCUMENT_ROOT'] . "/WoWClassicGuildBank/");

## Database connection
define("DB_DSN", "mysql:host=localhost;dbname=tstuff_test;charset=utf8mb4");
define("DB_USER", "root");
define("DB_PASS", "");
