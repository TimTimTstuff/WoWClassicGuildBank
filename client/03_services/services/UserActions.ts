class UserActions{
    private sc: ServiceController;

   

    constructor(sc:ServiceController) {
        this.sc = sc;
        
    }

    public sendRegistrationRequest(username:string, password:string, email:string,success:(message:string,code:number)=>void,error:(message:string,code:number)=>void){
        this.sc.apiRequest<RegistrationResult>(
            ApiRequest.createRequest(ApiRequestType.Action,ApiEntities.User,null,ApiActions.RegisterUser,{},{username:username,password:password,email:email}),(r)=>{
                if(r.success){
                    success(r.message,r.code);
                }else{
                    error(r.message,r.code);
                }
            });
    }

    public sendLoginRequest(username:string,password:string,success:(message:string,code:number,token:string)=>void,error:(message:string,code:number)=>void){
        this.sc.apiRequest<LoginResult>(
            ApiRequest.createRequest(ApiRequestType.Action,ApiEntities.User,null,ApiActions.Login,{},{username:username,password:password}),(r)=>{
                if(r.success){
                    success(r.message,r.code,r.token);
                }else{
                    error(r.message,r.code);
                }
            });
    }



}

 interface RegistrationResult {
    success: boolean;
    message: string;
    code:    number;
}

interface LoginResult {
    success: boolean;
    message: string;
    code:    number;
    token:  string;
}
