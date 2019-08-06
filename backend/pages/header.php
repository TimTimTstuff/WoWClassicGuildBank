<header>
<h1><?php echo PAGE_TITLE ?></h1>
<span><?php echo getLang("welcome",["{name}"=>Context::getInstance()->getSession()->getUserName()]) ?></span>
</header>