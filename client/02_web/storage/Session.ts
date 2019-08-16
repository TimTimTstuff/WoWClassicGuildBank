/// <reference path="SessionStorage.ts" />

class Session extends SessionStorage{

    private loggedIn:boolean = false;

    get Token():string{
        return this.getValueOrSetDefault("token",null);
    }

    set Token(value:string){
        this.setValue("token",value);
    }

    set login(value:boolean){
        this.loggedIn = value;
    }

    public isLoggedIn(){
        return this.loggedIn;
    }

    get roleLevel():number{
        return this.getValueOrSetDefault("role",0);
    }

    set roleLevel(value:number){
        this.setValue("role",value);
    }

    get username():string{
        return this.getValueOrSetDefault("username","Gast");
    }

    set username(value:string){
        this.setValue("username",value);
    }

    get userId():number{
        return this.getValueOrSetDefault("userid",0);
    }

    set userId(id:number){
        this.setValue("userid",id);
    }

    public static load(key:string,log:ILogger){
        let data = localStorage.getItem(key); 

        if(data==null){
            log.warn(`Can't find data with key: ${key}. Create new`,"SessionStorage");
            data = "{}";
        }
        let newStorage = new Session(key,JSON.parse(data));
        newStorage.save();
        return newStorage;
    }


}