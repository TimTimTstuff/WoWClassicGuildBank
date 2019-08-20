class NewsEditCard extends HtmlComponent{
    
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
      new NewsActions(this.sc).allNews((r)=>{
          r.forEach(n=>{
              let nr = new NewsEditRecordCard(n,this.sc);
              nr.render("#newsedit",true)
          });
      });
    }
   
    build(): void {

        this.template = 
        /*html*/
        ` 
          <div id='newsedit'></div>  
        `;
    }
}

