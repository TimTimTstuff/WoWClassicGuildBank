namespace Profile{

    export function init(){
        console.log("Start Profile JS");
      $('#content_inner').ready(()=>{
        $("#char").hide();
        $('#prof').hide();
        Profile.showProfile();
    });
    }

    export function showChars(){
        $("#char").show();
        $('#prof').hide();

        $.ajax({})

    }

    export function showProfile(){
       
        $("#char").hide();
        $('#prof').show();
        loadUserInfo();
       
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



    export function getCharTemplate(charData:CharDataModel):string{
        let template =
        /*html*/
        `<div data-charid='${charData.userCharId}' class='chartemplate'>
        <div class='toprow'>
            <div class='imgcontainer'>
                ${charData.charRace}
                ${charData.charClass}
                ${charData.charRole}
                ${charData.charRoleSup}
            </div>
            <div class='infocontainer'>
                <span class='info_text'>Spieler: ${charData.userId}</span>
                <span class='info_text'>Name: ${charData.charName}</span>
            </div>
        </div>
        <div class='bottomrow'>
        <span class='info_text'>Beruf 1: ${charData.firstProfession}</span>
        <span class='info_text'>Beruf 2: ${charData.secondProfession}</span>
        <span class='info_text'>Kochen: ${charData.hasCooking}</span>
        <span class='info_text'>Fischen: ${charData.hasFishing}</span>
        <span class='info_text'>Erste Hilfe: ${charData.hasFirstAid}</span>
        </div>
        </div>`;

        return template;
    }

}