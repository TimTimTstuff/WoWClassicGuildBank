class PageController{
  
    private pageSections:{[index:string]:string} = {};
    private log: ILogger;
    private activeComponents:{[index:string]:HtmlComponent} = {};

    constructor(logger:ILogger) {
        this.log = logger;
    }

    public addSection(name:string, elementId:string){
        this.pageSections[name] = elementId;
    }

    public loadHtmlComponentInSection(sectionName:string,component:HtmlComponent  | string){
       
        if(this.pageSections[sectionName] === undefined){
            this.log.error(`Page section not found: ${sectionName}`,"PageController");
            return;
        }

        this.clearSection(sectionName);

        if(component instanceof HtmlComponent){
            this.activeComponents[sectionName] = component;
            component.render(this.pageSections[sectionName],true);
        }
        
        else{
            $(this.pageSections[sectionName]).html(component);
        } 
    }
   
    private clearSection(sectionName: string) {
        if(this.activeComponents[sectionName] !== undefined){
            this.activeComponents[sectionName].remove();
            delete this.activeComponents[sectionName];
        }
        
        $(""+this.pageSections[sectionName]).html("");
    }

    public setPage(routeSet: RouteSet) {

        Object.keys(routeSet.getRoutes()).forEach(rs=>{
            
            this.loadHtmlComponentInSection(rs,routeSet.getRoute(rs));
        });
    }

}