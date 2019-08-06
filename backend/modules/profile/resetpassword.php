<?php ?>
<div class='form'>
    <div class='row'>
        <label for='oldpass'>Altes Passwort: </label><input type="text" name="oldpass" />
    </div>
    <div class='row'>
        <label for='newpass'>Neues Passwort: </label><input type="text" name="newpass" />
    </div>
    <div class='row'>
        <label for='newpass2'>Passwort wiederholen: </label><input type="text" name="newpass2" />
    </div>
    <div class='row'>
        <label for=''> </label><input type="button" value='Senden' onclick="Profile.validatePassword()" />
    </div>
</div>