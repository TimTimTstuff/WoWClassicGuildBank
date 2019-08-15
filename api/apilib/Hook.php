<?php
  
  use RedBeanPHP\BeanHelper\SimpleFacadeBeanHelper as SimpleFacadeBeanHelper;
    SimpleFacadeBeanHelper::setFactoryFunction( function( $name ) {
        $model = new $name();
        $model->setContext(ApiController::getInstance());
        return $model;
    } );


class MainModel extends RedBean_SimpleModel{
    
    /**
     * Undocumented variable
     *
     * @var ApiController
     */
    public $api;
    
    public function isCreate(){
        return $this->bean->getID() == 0;
    }

    public function setContext(ApiController $api){
        $this->api = $api;
    }
}

