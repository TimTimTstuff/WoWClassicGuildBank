

    class Dictionary implements IKeyValueStorage{

        private store:{[index:string]:any} = {};
        private catStore:{[index:string]:{[index:string]:any}} ={};
        
        setValue(key: string, value: any): void;       
        setValue(key: string, value: any, category: string): void;
        setValue(key: any, value: any, category?: any) {
            if(category != undefined){
                if(this.catStore[category] != undefined){
                    this.catStore[category][key] = value;
                }else{
                    this.catStore[category] = {};
                    this.catStore[category][key] = value;
                }
            }else{
                this.store[key] = value;
            }
        }

        getValue(key: string):any;
        getValue(key: string, category: string):any;
        getValue(key: any, category?: any):any {
            if(category != undefined){
                if(this.catStore[category] != undefined){
                    return this.catStore[category][key] ;
                }
            }else{
               return this.store[key];
            }
            return null;
        }


        toJson(): string {
           return JSON.stringify({c:this.catStore,s:this.store});
        }
        fromJson(jsonString: string): void {
            var data = JSON.parse(jsonString);
            this.catStore = data.c;
            this.store = data.s;
        }

        fromSaveObject(saveObject:ISaveObject):void{
            if((<any>saveObject).c != undefined && (<any>saveObject).s != undefined){
                this.store = (<any>saveObject).s;
                this.catStore = (<any>saveObject).c;
            }else{
                throw new Error("Save Object dont match KeyValue Storage")
            }
        }

        getSaveObject(): ISaveObject {
           let so = <any>{  };
            so.s = this.store;
            so.c = this.catStore;
            return so;
        }


    }

    class AutoSave implements ISaveHandler{
       


        private saveObjects: {[index:string]:ISaveObject} = {};
        private storageKey:string = "autosave";
        private compress:undefined | ((d:string)=>string );
        private decompress:undefined | ((d:string)=>string );
        private version:string = "0.0.1";
        private intervalId:any = -1;
        private _logger: ILogger;
        private _logGroup:string = "AutoSave";
        constructor(log:ILogger,storageKey?:string,compress?:(d:string)=>string,decompress?:(d:string)=>string){
      
            this._logger = log;
            
            if(storageKey == null){
                this.storageKey += Math.floor(Math.random()*1000);
            }else{
                this.storageKey = storageKey;
            }
            this.compress = compress;
            this.decompress = decompress;
            
        }

        startAutoSave(seconds:number = 20):void{
            if(this.intervalId < 0){
                this.intervalId = setInterval(()=>{
                    this.store();
                    this._logger.trace("Auto Save!",this._logGroup);
                },seconds*1000);
                this._logger.info("Autosave Started each: "+seconds+"s",this._logGroup);
            }
            else{
                this._logger.warn("Autosave is allready started!",this._logGroup);
            }
        }

        stopAutoSave():void{
            var r = clearInterval(this.intervalId);
            this._logger.info("Stoped autosave, result: "+r,this._logGroup);
        }

        getSaveObject(key: string): ISaveObject {
            return this.saveObjects[key];
        }

        setStorageKey(key: string): void {
            this.storageKey = key;
        }

        load(): void {
            if(localStorage.getItem(this.storageKey) == undefined)return;
            this.fromSaveString(<string>localStorage.getItem(this.storageKey));
        }

        toSaveString(): string {
            var st = JSON.stringify(this.saveObjects);
            if(this.compress != undefined){
                st = this.compress(st);
            }

            return st;
        }       
         
        fromSaveString(saveString: string): void {
            var data = "";
            if(this.decompress != undefined){
                data = this.decompress(saveString);
            }else{
                data = saveString;
            }
            var obj = JSON.parse(data);
            this.saveObjects = <{[index:string]:ISaveObject}>obj;
        }

        store(): void {
            for(let key in this.saveObjects){
                this.saveObjects[key].lastSave = new Date(Date.now());
            }
            localStorage.setItem(this.storageKey,this.toSaveString());
        }
        
        registerSaveObject(key:string,saveObj: ISaveObject): void {
            this.saveObjects[key] = saveObj;
        }


    }



