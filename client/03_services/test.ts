interface Item{
    itemName:string;
}
class LoginService{

    private sc: ServiceController;

    constructor(sc:ServiceController) {
        this.sc = sc;
    }
    private getApiRequest(method:string,param?:string,data?:any):ApiRequest{
        return {
            entity:"user",
            data:data,
            method:method,
            param:param,
        };
    }

   
    public doLogin(u:string,p:string,callback:(r:{success:string,error:string})=>void){
        this.sc.apiRequest(this.getApiRequest("POST","",{username:u,password:p,action:"login"}),callback);
    }
}
class ItemService{

    private sc: ServiceController;

    constructor(sc:ServiceController) {
        this.sc = sc;
    }
    private getApiRequest(method:string,param?:string,data?:any):ApiRequest{
        return {
            entity:"item",
            data:data,
            method:method,
            param:param,
        };
    }

    public getAllItems(callback:(r:Item[])=>void){
        this.sc.apiRequest(this.getApiRequest("GET"),callback);
    }

    public getById(id:number,callback:(r:Item)=>void){
        this.sc.apiRequest(this.getApiRequest("GET","&id=1"),callback);
    }
}


function serviceTest(){

    let conf = new ServiceConfiguration("http://localhost/WoWClassicGuildBank","?view=api","&e=");
    console.log(conf.buildRequestUrl("item",""));
    let servCtr = new ServiceController(conf);
    let ic = new ItemService(servCtr);
    let uc = new LoginService(servCtr);

    ic.getAllItems(r=>{
        console.log(r);
    });

    ic.getById(1,r=>{
        console.log(r);
    });

    uc.doLogin("t","t",r=>{
        if(r.success)console.log(r.success);
        if(r.error)console.log(r.error);
    });
  


}