"use strict";
/// <reference path="../../typings/jquery/dist/jquery.slim.d.ts" />
/// <reference path="../../typings/lzstring.d.ts" />
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Util;
}());
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
            case "#login":
                return "login";
            default:
                return "main";
        }
    }
})(Nav || (Nav = {}));
/// <reference path="nav.ts" />
console.log("Start WoWGuildBankApp");
Nav.initialize();
var Login;
(function (Login) {
    function sendLogin() {
        var username = $("#username").val();
        var password = $("#password").val();
        $.ajax({
            url: "?view=api&e=user",
            data: JSON.stringify({ action: "login", username: username, password: password }),
            contentType: "application/json",
            method: "post",
        }).then(function (data) {
            if (data.success != undefined) {
                console.log("login");
                window.location.href = "?";
            }
            else {
                console.log("login fail");
            }
        });
    }
    Login.sendLogin = sendLogin;
    function sendLogout() {
        $.ajax({
            url: "?view=api&e=user",
            data: JSON.stringify({ action: "logout" }),
            contentType: "application/json",
            method: "post",
        }).then(function (data) {
            if (data.success != undefined) {
                console.log("logout");
                window.location.href = "?";
            }
            else {
                console.log("logout fail");
            }
        });
    }
    Login.sendLogout = sendLogout;
})(Login || (Login = {}));
var Profile;
(function (Profile) {
    function init() {
        console.log("Start Profile JS");
        $('#content_inner').ready(function () {
            $("#char").hide();
            $('#prof').hide();
            Profile.showProfile();
        });
    }
    Profile.init = init;
    function showChars() {
        $("#char").show();
        $('#prof').hide();
        $.ajax({});
    }
    Profile.showChars = showChars;
    function showProfile() {
        $("#char").hide();
        $('#prof').show();
        loadUserInfo();
    }
    Profile.showProfile = showProfile;
    function loadUserInfo() {
        $.get("?view=api&e=user").then(function (data) {
            $("#username").text(data.name);
            $("#email").text(data.email);
            $("#regdate").text(data.registerDate.date);
        });
    }
    function validatePassword() {
        var oldpass = $("input[name='oldpass']").val();
        var newpass = $("input[name='newpass']").val();
        var newpass2 = $("input[name='newpass2']").val();
        if (newpass != newpass2 || newpass == "") {
            alert("Das neu gewählte passwort stimmt nicht mit der widerholung ein!");
            return;
        }
        $.ajax({
            url: "?view=api&e=user",
            method: "put",
            data: JSON.stringify({ old: oldpass, new: newpass, action: 'changepass' }),
            contentType: "application/json",
        }).then(function (data) {
            console.log(data);
        });
    }
    Profile.validatePassword = validatePassword;
    function getCharTemplate(charData) {
        var template = 
        /*html*/
        "<div data-charid='" + charData.userCharId + "' class='chartemplate'>\n        <div class='toprow'>\n            <div class='imgcontainer'>\n                " + charData.charRace + "\n                " + charData.charClass + "\n                " + charData.charRole + "\n                " + charData.charRoleSup + "\n            </div>\n            <div class='infocontainer'>\n                <span class='info_text'>Spieler: " + charData.userId + "</span>\n                <span class='info_text'>Name: " + charData.charName + "</span>\n            </div>\n        </div>\n        <div class='bottomrow'>\n        <span class='info_text'>Beruf 1: " + charData.firstProfession + "</span>\n        <span class='info_text'>Beruf 2: " + charData.secondProfession + "</span>\n        <span class='info_text'>Kochen: " + charData.hasCooking + "</span>\n        <span class='info_text'>Fischen: " + charData.hasFishing + "</span>\n        <span class='info_text'>Erste Hilfe: " + charData.hasFirstAid + "</span>\n        </div>\n        </div>";
        return template;
    }
    Profile.getCharTemplate = getCharTemplate;
})(Profile || (Profile = {}));
