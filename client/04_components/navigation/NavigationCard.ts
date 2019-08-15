class NavigationCard extends HtmlComponent{
    
    private navigationItems:NavigationItemCard[] = [];
    private nav: Navigation;
    private log: ILogger;
    
    /**
     *
     */
    constructor(nav:Navigation,log:ILogger) {
        super();
        this.log = log;
        this.nav = nav;
       
    }

    public setActive(name:string){

       this.navigationItems.forEach(n=>{
           this.log.debug(`Call navigate for: ${n.getName()}`);
           n.setActive(n.getName()==name);
       });
    }

    public update():void{  
    
        this.navigationItems.forEach(a=>{
            a.update();
        });
    }
    
    private buildNavItems(){
        this.nav.addNavigationEvent((pre,post)=>{
            this.setActive(post);
        },false);

        this.nav.getPagesByParent(null)
        .sort((a,b)=>{return a.navIndex-b.navIndex;})
        .forEach(nav=>{
            this.navigationItems.push(new NavigationItemCard(nav));
        });
         
    }

    public build(): void {

        this.buildNavItems();
        this.postRender = ()=> { 
            this.navigationItems.forEach(n=>{
                n.render(`#nav${this.getId()}`,true,"li","t-navitem");
            });
        };

        this.template =
        /*html*/
        `
        <ul id='nav${this.getId()}' class='t-navigation'>
      
        </ul>
        `; 
    }

}

