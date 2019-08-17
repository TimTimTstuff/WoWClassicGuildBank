<?php

/**
 * Extends the RedBeadn Model Factory to inject the ApiService when a model is created
 */

use RedBeanPHP\BeanHelper\SimpleFacadeBeanHelper as SimpleFacadeBeanHelper;
use RedBeanPHP\OODBBean;

SimpleFacadeBeanHelper::setFactoryFunction( function( $name ) {
        
        //include model file
        if (file_exists('model/' . $name . ".model.php")) {
            include_once('model/' . $name . ".model.php");
        }
    
    
        $model = new $name();
        //set own call here
        $model->setContext(ApiService::getInstance());

        
        return $model;
    } );


