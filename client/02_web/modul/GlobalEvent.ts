class GlobalEvents{
    private static instance:GlobalEvents;

    private events:{[index:string]:((d:any)=>void)[]} = {};
    logger: ILogger;

    private constructor(){
        GlobalEvents.instance = this;
        this.logger = StaticLogger.Log();
    }

    public static getInstance():GlobalEvents{
        if(GlobalEvents.instance == undefined){
            GlobalEvents.instance = new GlobalEvents();
        }
        return GlobalEvents.instance;
    }

    public static addEvent(name:string,event:(d:any)=>void){
        GlobalEvents.getInstance().addNewEvent(name,event);
    }

    public static triggerEvent(name:string,args:any){
        GlobalEvents.getInstance().triggerNewEvents(name,args);
    }

    triggerNewEvents(name: string, args: any) {
        this.logger.debug(`Trigger global event: ${name}`,"global event");
        if(this.events[name] != undefined){
            this.events[name].forEach(e=>{e(args)});
        }
    }

    addNewEvent(name: string, event: (d: any) => void) {
        this.logger.debug(`Add global event: ${name}`,"global event");
        if(this.events[name] == undefined){
            this.events[name] = [];
        }

        this.events[name].push(event);
    }


    
}