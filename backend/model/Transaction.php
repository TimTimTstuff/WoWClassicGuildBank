<?php

 class Transaction  extends BaseModel{
    public $transactionId;
    public $itemId;
    public $amount;
    public $userId;
    public $direction;
    public $date;
}