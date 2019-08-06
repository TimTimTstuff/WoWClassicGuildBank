"use strict";
var Nav;
(function (Nav) {
    function initialize() {
        $(document).ready(function () {
            changeLocation();
        });
        window.onhashchange = changeLocation;
        $("ul#nav li").click(function (el) {
            window.location.hash = $(el.target).find("a").attr("href");
        });
    }
    Nav.initialize = initialize;
    function changeLocation() {
        var newPage = getCurrentNavigation();
        $("li.active").removeClass("active");
        $("." + newPage).addClass("active");
        $("#content").load("?view=" + newPage);
    }
    function getCurrentNavigation() {
        switch (location.hash) {
            case "#news":
                return "news";
            case "#action":
                return "action";
            case "#request":
                return "request";
            case "#profile":
                return "profile";
            default:
                return "main";
        }
    }
})(Nav || (Nav = {}));
/// <reference path="nav.ts" />
console.log("Start WoWGuildBankApp");
Nav.initialize();
