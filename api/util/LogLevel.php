<?php
namespace TStuff\Php\Logging  ; 

    abstract class LogLevel  {
        const Trace =   0;
        const Debug =   1;
        const Info =    2;
        const Warning = 4;
        const Error =   8;
        const Fatal =   16;
       
    }