class RouteSet{
    
    private pageComposition:{[index:string]:HtmlComponent|string} = {};
    private pageName:string;
    private navigationName:string | undefined;
    private parentNavigation:string | undefined;
    private navigationIndex:number;
    constructor(name:string, navName?:string, navParent?:string|RouteSet, navIndex?:number) {
        this.pageName = name;
        this.navigationName = navName;
        this.setParent(navParent);
        this.navigationIndex = navIndex||100;
    }

    public getName():string {
        return this.pageName;
    }
   
    get navName():string{
        return this.navigationName||"NotSet";
    }

    get navTarget():string{
        return `#${this.pageName}`;
    }

    get navIndex():number{
        return this.navigationIndex;
    }

    public hasParent(name:string|undefined|RouteSet):boolean{
        if(name instanceof RouteSet){ 
            return this.parentNavigation == name.getName();
        }else{
            return this.parentNavigation == name;
        }
    }

    public setParent(parent:string|RouteSet|undefined){
        if(parent instanceof RouteSet){
            this.parentNavigation = parent.getName();
        }else{
            this.parentNavigation = parent;
        }
    }

    public addSection(section:string, element:HtmlComponent  |string){
        this.pageComposition[section] = element;
    }

    public getRoutes():{[index:string]:HtmlComponent|string}{
        return this.pageComposition;
    }

    public  getRoute(rs: string): string | HtmlComponent  {
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
       this.log.info(`Navigate to ${nextRoute}` ,"navigation");
       this.currentLocation = nextRoute;
       this.pageCtrl.setPage(this.pages[this.currentLocation]);
    }

    private getUrlLocation(): string {
       
        return window.location.hash.replace("#","");
    }
}