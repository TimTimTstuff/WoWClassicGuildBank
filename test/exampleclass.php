<?php

class MyClass{

    public $publicVariable = "public var";
    private $privateVariable = "private var";

    public function __construct($name) {
        echo "I'm the constructor: ".$name;
    }

    private function privatFunction(){
        echo "I'm private";
    }

    public function publicFunction(){
        echo "I'm public";
    }

    public function callPrivate(){
        $this->privatFunction();
    }

}


$object = new MyClass("object 1");
echo "<br>";
$object2 = new MyClass("object 2"); 
echo "<br>";
echo $object->publicVariable;
echo "<br>";
$object->publicFunction();
//not possible
$object->privateFunction();
//not possible
//$object->privateVariable;
echo "<br>";
$object->callPrivate();


