/// <reference path="view/BankApp.ts" />
var app:BankApp;

$(document).ready(()=>{
    
    //Logger configuration
    StaticLogger.getLoggerFactory().deactivateGroup("navigation");
    
    app = new BankApp();
    app.start();
});

