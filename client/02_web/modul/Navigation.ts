class RouteSet{
    public getName():string {
        return this.pageName;
    }
   
    private pageComposition:{[index:string]:HtmlComponent|HTMLElement|string} = {};
    private pageName:string;

    constructor(name:string) {
        this.pageName = name;
    }

    public addSection(section:string, element:HtmlComponent | HTMLElement |string){
        this.pageComposition[section] = element;
    }

    public getRoutes():{[index:string]:HtmlComponent|HTMLElement|string}{
        return this.pageComposition;
    }

    public  getRoute(rs: string): string | HtmlComponent | HTMLElement {
      return this.pageComposition[rs];
    }
    
}


class Navigation{
  
 
    private pages:{[index:string]:RouteSet} = {};
    private currentLocation:string;
    private pageCtrl: PageController;
    private defaultRoute?: string;
    private log: ILogger;


    /**
     *
     */
    constructor(pageCtrl:PageController,defaultRoute:string, log:ILogger) {
        this.log = log;
        this.pageCtrl = pageCtrl;
        this.defaultRoute = defaultRoute;
        this.currentLocation = "-";
        
    }

    public registerRoute(routeSet:RouteSet){
        if(this.defaultRoute === undefined) this.defaultRoute = routeSet.getName();
        this.pages[routeSet.getName()] = routeSet;
    }


    public onNavigate(){
        this.log.info("Call onNavigate","navigation");
        let nextRoute = this.defaultRoute||"";
        if(this.pages[this.getUrlLocation()] !== undefined){
            nextRoute = this.getUrlLocation();
        }

       if(nextRoute == this.currentLocation) return;
       this.log.info(`Navigate to ${nextRoute}` ,"navigation");
       this.currentLocation = nextRoute;
       this.pageCtrl.setPage(this.pages[this.currentLocation]);
    }

    private getUrlLocation(): string {
       
        return window.location.hash.replace("#","");
    }
}