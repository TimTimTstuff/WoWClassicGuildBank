class Navigation{

    private pages:{[index:string]:RouteSet} = {};
    private currentLocation:string;
    private pageCtrl: PageController;
    private defaultRoute?: string;
    private log: ILogger;

    private preNavigationEvents:((pre:string,post:string)=>void)[] = [];
    private postNavigationEvents:((pre:string,post:string)=>void)[] = []

    constructor(pageCtrl:PageController,defaultRoute:string, log:ILogger) {
        this.log = log;
        this.pageCtrl = pageCtrl;
        this.defaultRoute = defaultRoute;
        this.currentLocation = "-"; 
    }

    public addNavigationEvent(event:(pre:string,post:string)=>void,isPre = true){
        if(isPre){
            this.preNavigationEvents.push(event);
        }else{
            this.postNavigationEvents.push(event);
        }
    }

    public registerRoute(routeSet:RouteSet | RouteSet[]){
        if(routeSet instanceof RouteSet){
             if(this.defaultRoute == undefined) this.defaultRoute = routeSet.getName();
             this.pages[routeSet.getName()] = routeSet;
        }else{
            routeSet.forEach(rs=>{
                this.registerRoute(rs);
            });
        }
       
    }

    public getPages():RouteSet[]{
        let routeSet: RouteSet[] = [];
        Object.keys(this.pages).forEach(k=>{
            routeSet.push(this.pages[k]);
        });
        return routeSet;
    }

    public getPagesByParent(parent:RouteSet|string|undefined):RouteSet[]{
        let routeSet: RouteSet[] = [];
        Object.keys(this.pages).forEach(k=>{
            if(this.pages[k].hasParent(parent))
                routeSet.push(this.pages[k]);
        });
        return routeSet;
    }

    public onNavigate(){
        this.log.info("Call onNavigate","navigation");
       
        let nextRoute = this.defaultRoute||"";
        if(this.pages[this.getUrlLocation()] !== undefined){
            nextRoute = this.getUrlLocation();
        }

       if(nextRoute == this.currentLocation) return;
      
       this.preNavigationEvents.forEach(pe=>{
        pe(this.currentLocation,nextRoute);
        });
       
        this.log.info(`Navigate to ${nextRoute}` ,"navigation");
       this.currentLocation = nextRoute;
       this.pageCtrl.setPage(this.pages[this.currentLocation]);
       
       this.postNavigationEvents.forEach(pe=>{
           this.log.debug("do post naivgation event","navigation");
            pe(this.currentLocation,nextRoute);
        });
    }

    private getUrlLocation(): string {
       
        return window.location.hash.replace("#","");
    }
}