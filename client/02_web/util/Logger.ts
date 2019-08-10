enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warning = 4,
    Error = 8
}
interface ILogger {
    log(l: any, t: LogLevel,group?:string): void;
    trace(l: any,group?:string): void;
    debug(l: any,group?:string): void;
    info(l: any,group?:string): void;
    warn(l: any,group?:string): void;
    error(l: any,group?:string): void;
}

enum LoggerRegister{
    Logger,
    Level,
    Group
}

class StaticLogger{
    private static instance:LoggerFactory;
    public static getLoggerFactory():LoggerFactory{
        if(StaticLogger.instance == undefined){
          StaticLogger.createLogger();
        }
        return StaticLogger.instance;
    }

    public static Log():ILogger{
        if(StaticLogger.instance == undefined)
            StaticLogger.createLogger();
        return StaticLogger.instance;
    }

    private static createLogger():void{
        StaticLogger.instance = new LoggerFactory();
        StaticLogger.instance.setLogLevel(LogLevel.Trace);
        StaticLogger.instance.registerLogger("Global",new DefaultLogger(),LogLevel.Trace);

    }
}

class LoggerFactory implements ILogger {

    private _logger: { [index: string]:any[] } = {};
    
    private _logLevel:LogLevel = LogLevel.Info;

 
    private _defaultGroup:string = "Global";
    private _usedGroups:string[] = [];
    private _removedGroups:string[] = [];

    constructor(){
        
    }

    public setLogLevel(level:LogLevel){
        this._logLevel = level;
    }

    public registerLogger(key: string, logger: ILogger,level:LogLevel): void {
        if(this._logger[key] != undefined)return;
        this._logger[key] = [logger,level,key];
       
        
    }

    public setLoggerLevel(key:string,level:LogLevel){
       this._logger[key][LoggerRegister.Level] = level;
    }

    public deactivateGroup(group:string){
        if(this._removedGroups.indexOf(group)<0) 
            this._removedGroups.push(group);
    }

    public activateGroupe(group:string){
        let index = this._removedGroups.indexOf(group);
        if(index > -1){
            this._removedGroups.splice(index,1);
        }
    
    }

   

    log(msg: any, t: LogLevel,group?:string): void {

        if(group == null)group = this._defaultGroup;

        if(this._usedGroups.indexOf(group) < 0){
            this._usedGroups.push(group);
          
        }
      
        let data = msg;// JSON.parse(JSON.stringify(msg));
      
        if(this._logLevel > t)return;
        
        for (let l in this._logger) {
          
            if(this._logger[l][LoggerRegister.Level] < this._logLevel || this._removedGroups.indexOf(group)>=0)continue;
          
            msg = [group,data];

            switch (t) {
                case LogLevel.Trace:
                    this._logger[l][LoggerRegister.Logger].trace(msg);
                    break;
                case LogLevel.Debug:
                    this._logger[l][LoggerRegister.Logger].debug(msg);
                    break;
                case LogLevel.Info:
                    this._logger[l][LoggerRegister.Logger].info(msg);
                    break;
                case LogLevel.Warning:
                    this._logger[l][LoggerRegister.Logger].warn(msg);
                    break;
                case LogLevel.Error:
                    this._logger[l][LoggerRegister.Logger].error(msg);
                    break;
            }
        }
    }
    trace(l: any,group?:string): void {
        this.log(l,LogLevel.Trace,group);
    }
    debug(l: any,group?:string): void {
        this.log(l,LogLevel.Debug,group);
    }
    info(l: any,group?:string): void {
        this.log(l,LogLevel.Info,group);
    }
    warn(l: any,group?:string): void {
        this.log(l,LogLevel.Warning,group);
    }
    error(l: any,group?:string): void {
        this.log(l,LogLevel.Error,group);
    }






}

class DefaultLogger implements ILogger{
    log(l: any, t: LogLevel): void {
        console.log({m:l,l:t});
    }  
      trace(l: any): void {
        console.trace(l)
    }
    debug(l: any): void {
        console.debug(l);
    }
    info(l: any): void {
       console.info(l);
    }
    warn(l: any): void {
        console.warn(l);
    }
    error(l: any): void {
        console.error(l);
    }


}

