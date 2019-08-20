/// <reference path="view/BankApp.ts" />
var app:BankApp;

$(document).ready(()=>{
    
    StaticLogger.getLoggerFactory().deactivateGroup("navigation");
    
    app = new BankApp();
    app.start();
});

