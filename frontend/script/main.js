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
        if (Nav.currentHash == newPage)
            return;
        Nav.currentHash = newPage;
        if (newPage != "raid") {
            $("#content").load("?view=" + newPage);
        }
        else {
            $("#content").html("<iframe style='width:1200px;height:800px;' src='http://localhost/raid'></iframe>");
        }
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
            case "#raid":
                return "raid";
            default:
                return "main";
        }
    }
})(Nav || (Nav = {}));
/// <reference path="nav.ts" />
console.log("Start WoWGuildBankApp");
Nav.initialize();
var Profile;
(function (Profile) {
    function init() {
        console.log("Start Profile JS");
    }
    Profile.init = init;
    function showChars() {
        console.log("Show char view");
    }
    Profile.showChars = showChars;
    function showProfile() {
        console.log("Show Profile");
    }
    Profile.showProfile = showProfile;
})(Profile || (Profile = {}));
