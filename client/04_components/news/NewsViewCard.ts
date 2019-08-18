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
        throw new Error("Method not implemented.");
    }



}

 interface NewsRecord{
     id:number;
     title:string;
     text:string;
     author:string;
     createdOn:Date;
     category:string;
 }


 interface NewsModel {
    id:          number;
    title:       string;
    news_text:   string;
    category:    string;
    created_by:  string;
    created_on:  string;
    modified_by: number;
    modified_on: string;
    status:      number;
    owner:       number;
 }
