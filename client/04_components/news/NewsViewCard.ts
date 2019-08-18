class NewsViewCard extends HtmlComponent{
    
    private currentCategory:string;
    private newsRecords:NewsRecord[];
    private sc: ServiceController;

    constructor(sc: ServiceController) {
        super();
        this.sc = sc;
    }
   
   
    private loadCurrentNews(){
        
    }
   
   
    build(): void {
        this.template = 
        /*html*/
        ` 

        `;
    }



}

