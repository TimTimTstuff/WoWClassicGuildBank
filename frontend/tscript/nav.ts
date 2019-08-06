
namespace Nav{

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
        $("#content").load(`?view=${newPage}`);
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
            default:
                return "main";
        }
    }
}