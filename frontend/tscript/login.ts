namespace Login{

    export function sendLogin(){
        let username = $("#username").val();
        let password = $("#password").val();
        $.ajax({
            url:"?view=api&e=user",
            data:JSON.stringify({action:"login",username:username,password:password}),
            contentType: "application/json",
            method:"post",
        }).then(data=>{
            if(data.success != undefined){
                console.log("login")
                window.location.href = "?";
            }else{
                console.log("login fail");
            }
        });
    }

    export function sendLogout(){
        $.ajax({
            url:"?view=api&e=user",
            data:JSON.stringify({action:"logout"}),
            contentType: "application/json",
            method:"post",
        }).then(data=>{
            if(data.success != undefined){
                console.log("logout")
                window.location.href = "?";
            }else{
                console.log("logout fail");
            }
        });
    }

}