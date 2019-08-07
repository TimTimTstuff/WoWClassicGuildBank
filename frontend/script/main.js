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
        showProfile();
    }
    Profile.init = init;
    function showChars() {
        console.log("Show char view");
    }
    Profile.showChars = showChars;
    function showProfile() {
        loadUserInfo();
        console.log("Show Profile");
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
})(Profile || (Profile = {}));
