<?php
if(!Context::getInstance()->getSession()->isUserLoggedIn()){
    echo "Need to be logged in";
    exit();
}
?>
<nav class='insidenav'>
    <ul>
        <li><span onclick="Profile.showProfile()">Profil</span></li>
        <li><span onclick="Profile.showChars()">Chars</span></li>
    </ul>    
</nav>
<div id='content_inner'>
    <h3>Profildaten</h3>
    <?php include("profileform.php"); ?>

    <h3>Passwort Reset</h3>
    <?php include("resetpassword.php"); ?>
</div>
<script>Profile.init();</script>