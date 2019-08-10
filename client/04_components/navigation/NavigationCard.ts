class NavigationCard extends HtmlComponent{
    
    private navigationItems:NavigationItemCard[] = [];
    private nav: Navigation;
    
    /**
     *
     */
    constructor(nav:Navigation) {
        super();
        this.nav = nav;
       

    }
    
    public build(): void {
        
  
       
       

        this.postRender = ()=> { 
            
            this.nav.getPagesByParent(null).sort((a,b)=>b.navIndex - a.navIndex).forEach(nav=>{
                new NavigationItemCard(nav).render(`#nav${this.getId()}`,true,"li","t-navitem");
          
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

class NavigationItemCard extends HtmlComponent{
    rs: RouteSet;

    /**
     *
     */
    constructor(routeElement:RouteSet) {
        super();
        this.rs = routeElement;
    }

    build(): void {
       this.template = 
       /*html*/
       `<a href="${this.rs.navTarget}">${this.rs.navName}</a>`;
    }

}