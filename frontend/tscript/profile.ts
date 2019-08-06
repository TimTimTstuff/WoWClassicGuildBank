namespace Profile{

    export function init(){
        console.log("Start Profile JS");
        showProfile();
    }

    export function showChars(){
        console.log("Show char view");
    }

    export function showProfile(){
        loadUserInfo();
        console.log("Show Profile");
    }

    function loadUserInfo(){
        $.get("?view=api&e=user").then(data=>{
           $("#username").text(data.name);
           $("#email").text(data.email);
           $("#regdate").text(data.registerDate.date);
        });
    }

    function validatePassword(){
        
    }

}