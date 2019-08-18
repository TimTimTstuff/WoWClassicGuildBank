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
