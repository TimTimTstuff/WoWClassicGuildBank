<nav>
    <h2 class='nav-head '> <i class="fas fa-piggy-bank"></i> </h2>
    <ul id='nav'>

        <?php if(Context::getInstance()->getSession()->isUserLoggedIn()) { ?>
        <li class='nav-item main'>
            <a href='#main'>    
                <i class='fas fa-box'></i><span>Inventar</span>
            </a>
        </li>
        <?php } ?>

        <li class='nav-item news'>
        <a href='#news'>    
            <i class='fas fa-newspaper'></i><span>News</span>
            </a>
        </li>

        <?php if(Context::getInstance()->getSession()->isUserLoggedIn()) { ?>
        <li class='nav-item action'>
        <a href='#action'>    
            <i class='fas fa-exchange-alt'></i><span>Aktionen</span>
            </a>
        </li>
        <?php } ?>

        <?php if(Context::getInstance()->getSession()->isUserLoggedIn()) { ?>
        <li class='nav-item request'>
        <a href='#request'>    
            <i class='fas fa-hand-holding'></i><span>Anfragen</span>
            </a>
        </li>
        <?php } ?>

        <?php if(Context::getInstance()->getSession()->isUserLoggedIn()) { ?>
        <li class='nav-item profile'>
        <a href='#profile'>    
            <i class='fas fa-user'></i><span>Profil</span>
            </a>
        </li>
        <?php } ?>

    </ul>
    <a href='test/login.php'>Fake login</a><br>
    <a href="test/logout.php">Fake Logout</a>
</nav>