class ServiceController{
   
    private config: ServiceConfiguration;
    private storage: SessionStorage;

    constructor(config:ServiceConfiguration,storage:SessionStorage) {
        this.config = config;
        this.storage = storage;
    }

    public setToken(token: any) {
        this.storage.setValue("token",token);
    }

    public apiRequest<T>(req:ApiRequest,success:(result:T)=>void){
        
        req.token = this.storage.getValueOrSetDefault("token",null);
        let entityName = req.entity;
        if(req.recordId != null){
            entityName += `/${req.recordId}`;
        }
        if(req.actionName != null){
            entityName += `/${req.actionName}`;
        }
        this.sendRequest(this.config.buildRequestUrl(entityName,req.param),req.method,req.token,req.data).then(success);
    }

    public sendRequest(url:string,method:string,token:string,data?:any):JQuery.jqXHR{
       
        let settings:JQueryAjaxSettings = {
            method:method,
            contentType: "application/json",
            url:url,
            headers:{"token":token}
        };

        if(data != undefined){
            settings.data = JSON.stringify(data);
        }

        return $.ajax(settings);
    }
}