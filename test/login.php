<?php 
session_start();
$_SESSION["logged_in"] = true;
$_SESSION["username"] = "Admin";
print_r($_SESSION);
?>
<a href="..">Back</a>
