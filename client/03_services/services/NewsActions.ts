class NewsActions{
    private sc: ServiceController;

    constructor(sc:ServiceController) {
        this.sc = sc;
        
    }

    public loadLatestNews(callback:(result:NewsRecord[])=>void){
        this.sc.apiRequest<NewsRecord[]>(ApiRequest.createRequest(
            ApiRequestType.RetrieveMultiple,
            ApiEntities.News,
            null,
            null,
            {orderdesc:"created_on",limit:"5"},
            null),(result)=>{
            
            callback(result);
        });
    }

    public allNews(callback:(result:NewsRecord[])=>void){
        this.sc.apiRequest<NewsRecord[]>(ApiRequest.createRequest(
            ApiRequestType.RetrieveMultiple,
            ApiEntities.News,
            null,
            null,
            {orderdesc:"created_on"},
            null),(result)=>{
            
            callback(result);
        });
    }

    public createNews(record:NewsRecord,callback:(result:NewsRecord)=>void){
        this.sc.apiRequest<NewsRecord>(ApiRequest.createRequest(
            ApiRequestType.Create,
            ApiEntities.News,
            null,
            null,
            {},
            record),(result)=>{
                callback(result);
        });
    }

    public updateNews(id:number,record:NewsRecord,callback:(result:NewsRecord)=>void){
        this.sc.apiRequest<NewsRecord>(ApiRequest.createRequest(
            ApiRequestType.Update,
            ApiEntities.News,
            id,
            null,
            {},
            record),(result)=>{
                callback(result);
        });
    }

    public deleteNews(id:number,callback:(result:NewsRecord)=>void){
        this.sc.apiRequest<NewsRecord>(ApiRequest.createRequest(
            ApiRequestType.Delete,
            ApiEntities.News,
            id,
            null,
            {},
            null),(result)=>{
                callback(result);
        });
    }

}