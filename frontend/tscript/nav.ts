
namespace Nav{

    export var currentHash:string;

    export function initialize():void{
        $(document).ready(()=>{
            changeLocation();
        });
        
        window.onhashchange = changeLocation;
        
        $("ul#nav li").click((el)=>{
            window.location.hash = <string>$(el.target).find("a").attr("href");
        });
        
    }


    function changeLocation():void{
        var newPage = getCurrentNavigation();
        $("li.active").removeClass("active");
        $(`.${newPage}`).addClass("active");

        if(currentHash == newPage)return;
        currentHash = newPage;

        if(newPage != "raid"){
            $("#content").load(`?view=${newPage}`);
        }else{
            $("#content").html("<iframe style='width:1200px;height:800px;' src='http://localhost/raid'></iframe>");
        }
    }

    function getCurrentNavigation():string{
        switch(location.hash){
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
}