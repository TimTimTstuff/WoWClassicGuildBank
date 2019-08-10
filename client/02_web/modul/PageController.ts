class PageController{
  

    private pageSections:{[index:string]:string} = {};
    private log: ILogger;
    private activeComponents:HtmlComponent[] = [];

    /**
     *
     */
    constructor(logger:ILogger) {
        this.log = logger;
        
    }

    public addSection(name:string, elementId:string){
        this.pageSections[name] = elementId;
    }

    public loadHtmlComponentInSection(sectionName:string,component:HtmlComponent | HTMLElement | string){
        if(this.pageSections[sectionName] === undefined){
            this.log.error(`Page section not found: ${sectionName}`,"PageController");
            return;
        }
        $("#"+this.pageSections[sectionName]).html("");
        if(component instanceof HtmlComponent){
            this.activeComponents[this.activeComponents.length] = component;
            component.render("#"+this.pageSections[sectionName],true);
        }
        else if(component instanceof HTMLElement){
            $("#"+this.pageSections[sectionName]).html(component);
        }
        else{
            $("#"+this.pageSections[sectionName]).html(component);
        }
        
       
    }

    public setPage(routeSet: RouteSet) {
        this.activeComponents.forEach(a=>{
            a.remove();
        });
        this.activeComponents = [];
        Object.keys(routeSet.getRoutes()).forEach(rs=>{
            
            this.loadHtmlComponentInSection(rs,routeSet.getRoute(rs));
        });
    }

}