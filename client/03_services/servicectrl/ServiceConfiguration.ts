class ServiceConfiguration{
    private baseUrl: string;
    private apiPath: string;
    private entityTemplate: string;

    /**
     *
     */
    constructor(baseUrl:string,apiPath:string,entityTemplate:string) {
        this.baseUrl = baseUrl;
        this.apiPath = apiPath;
        this.entityTemplate = entityTemplate;
    }

    public buildRequestUrl(entity:string,param:string){
        return `${this.baseUrl}/${this.apiPath}${(this.entityTemplate)}${entity}${param||""}`;
    }



   



}