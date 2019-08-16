enum ApiRequestType{
    Create,
    Retrieve,
    RetrieveMultiple,
    Update,
    Delete,
    Action

}

class ApiRequest {
    public method: string;
    public entity: string;
    public param: string;
    public data: any;
    public recordId:number;
    public actionName:string;
    public token:string;

    public static createRequest(requestType:ApiRequestType,entityName:string,recordId:number,actionName:string,urlParam:{[index:string]:string},data:any):ApiRequest{
        return {
            data:data,
            entity:entityName,
            method:ApiRequest.getMethodByType(requestType),
            param:ApiRequest.buildUrlParam(urlParam),
            recordId:recordId,
            actionName:actionName,
            token:null
        };
    }
    private static buildUrlParam(urlParam: { [index: string]: string; }): string {
        let getParam:string[] = [];
        Object.keys(urlParam).forEach(e=>{
            getParam.push(`${e}=${urlParam[e]}`);
        });

        if(getParam.length == 0){
            return "";
        }
        return `?${getParam.join("&")}`;

    }
    private static getMethodByType(requestType: ApiRequestType): string {
        switch(requestType){
            case ApiRequestType.Action:
            case ApiRequestType.Create:
                return "POST";
            case ApiRequestType.Delete:
                return "DELETE";
            case ApiRequestType.Retrieve:
            case ApiRequestType.RetrieveMultiple:
                return "GET";
            case ApiRequestType.Update:
                return "PUT";
            
                
        }
    }
}
