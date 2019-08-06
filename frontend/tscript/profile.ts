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

    export function validatePassword(){
        let oldpass = $("input[name='oldpass']").val();
        let newpass = $("input[name='newpass']").val();
        let newpass2 = $("input[name='newpass2']").val();

        if(newpass != newpass2 || newpass == ""){
            alert("Das neu gewählte passwort stimmt nicht mit der widerholung ein!");
            return;
        }

        $.ajax({
            url:"?view=api&e=user",
            method:"put",
            data:JSON.stringify({old:oldpass, new:newpass, action:'changepass'}),
            contentType: "application/json",
        }).then(data=>{
            console.log(data);
        });

    }

}