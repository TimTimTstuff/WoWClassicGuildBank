interface Item{
    itemName:string;
}



function serviceTest(){
    

    let conf = new ServiceConfiguration(Configuration.BASE_URL,Configuration.API_BASE,"");

    let apiService = new ServiceController(conf,SessionStorage.load(Configuration.SESSION_KEY,StaticLogger.Log()));

   let register = ApiRequest.createRequest(
            ApiRequestType.Action,
            ApiEntities.User,
            null,
            ApiActions.RegisterUser,
            {},
            <UserModel>{username:"Testuser2",password:"Testpassword",email:"testmail2@tstuff.de"},
            null);


    let login = ApiRequest.createRequest(
        ApiRequestType.Action,
        ApiEntities.User,
        null,
        ApiActions.Login,
        {},
        {username:"Testuser2",password:"Testpassword"},
        null
    );
    apiService.apiRequest<UserModel>(register,r=>{
        console.log(r);
    });
    apiService.apiRequest<any>(login,r=>{
        console.log(r);
        apiService.setToken(r.token);
    });

  


}