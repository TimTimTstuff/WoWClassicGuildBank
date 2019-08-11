class ApiRequest{
    public method:string;
    public entity:string;
    public param:string;
    public data:any; 
}

class ServiceController{
    private config: ServiceConfiguration;

    constructor(config:ServiceConfiguration) {
        this.config = config;
    }

    public apiRequest<T>(req:ApiRequest,success:(result:T)=>void){
        this.sendRequest(this.config.buildRequestUrl(req.entity,req.param),req.method,req.data).then(success);
    }

    public sendRequest(url:string,method:string,data?:any):JQuery.jqXHR{
       
        let settings:JQueryAjaxSettings = {
            method:method,
            contentType: "application/json",
            url:url
        };

        if(data != undefined){
            settings.data = JSON.stringify(data);
        }

        return $.ajax(settings);
    }
}