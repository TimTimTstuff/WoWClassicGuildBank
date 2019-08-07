<?php ?>
<div class='form'>
    <div class='row'>
        <label for='name'>Username: </label><input type='text' name='username' id='username' />
    </div>
    <div class='row'>
    <label for='password'>Passwort: </label><input type='password' name='password' id='password' />
    </div>
    <div class='row'>
        <input type='button' value='login' onclick="Login.sendLogin()" />
    </div>
</div>