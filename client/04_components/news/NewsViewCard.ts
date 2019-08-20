class NewsViewCard extends HtmlComponent{
    
    private currentCategory:string;
    private sc: ServiceController;
    private news: NewsRecordCard[];

    constructor(sc: ServiceController) {
        super();
        this.sc = sc;
        this.postRender = ()=>{
            this.loadCurrentNews();
        };
    }
   
    private loadCurrentNews(){
        this.news = [];
      new NewsActions(this.sc).loadLatestNews((r)=>{
          r.forEach(n=>{
              let nr = new NewsRecordCard(n);
              nr.render("#news",true)
          });
      });
    }
   
    build(): void {

        this.template = 
        /*html*/
        ` 
          <div id='news'></div>  
        `;
    }
}

