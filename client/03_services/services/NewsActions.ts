class NewsActions{
    private sc: ServiceController;

    constructor(sc:ServiceController) {
        this.sc = sc;
        
    }

    public loadLatestNews(){
        this.sc.apiRequest<NewsRecord[]>(ApiRequest.createRequest(ApiRequestType.RetrieveMultiple,ApiEntities.News,null,null,{orderdesc:"created_on",limit:5},null),(result)=>{
            
        });
    }

}