class SessionStorage {
  
    private data:{[index:string]:any} = {};
    private key: string;
    /**
     *
     */
    constructor(key:string,data:{[index:string]:any}) {
        this.data = data;
        this.key = key;
    }

    public getValue(key:string):any|undefined{
        return this.data[key];
    }

    public getValueOrSetDefault(key:string,defaultValue:any){
        let d = this.data[key];
        if(d == null) d = defaultValue;
        this.data[key] = d;
        this.save();
        return d;
    }

    public setValue(key:string,data:any){
        this.data[key] = data;
        this.save();
    }

    public static load(key:string,log:ILogger
        ){
        let data = localStorage.getItem(key); 

        if(data==null){
            log.warn(`Can't find data with key: ${key}. Create new`,"SessionStorage");
            data = "{}";
        }
        let newStorage = new SessionStorage(key,JSON.parse(data));
        newStorage.save();
        return newStorage;
    }

    save() {
        localStorage.setItem(this.key,JSON.stringify(this.data));
    }
}