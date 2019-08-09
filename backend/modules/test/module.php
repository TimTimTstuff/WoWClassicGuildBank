<?php

$char = new UserChar();
$char->charName = "second char";
$char->charClass = "priest";
$char->charRace = "orc";
$char->userId = 1;
$char->hasFirstAid = true;
$char->hasCooking = false;
$char->hasFishing = true;
$char->charRole = "none";
$char->charRoleSup = "none";
$char->firstProfession = "Tailor";
$char->secondProfession = "none";



//$obj = UserChar::create($char);
//$obj = UserChar::getById(1);
//$obj = UserChar::getAllCharsFromUser(1);
//$obj->charName = "Funny Char";
//$obj->update();

//UserChar::deleteChar(1);

//$obj = UserChar::getChars(0,6,"charname like '%unny%'");

$obj = ItemTemplate::get(0,200,"itemname like '%silk%'");
//$obj = ItemTemplate::getById(1433);
print_r($obj);