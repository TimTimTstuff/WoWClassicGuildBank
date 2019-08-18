class NewsRecordCard extends HtmlComponent{
    record: NewsRecord;
    

    constructor(record: NewsRecord) {
        super();
        this.record = record;
        
    }
    
    build(): void {
      this.template = 
      /*html*/
      `
        <div class='record-view news'>
            <div class='news-title'>${this.record.title}</div>
            
        </div>
      `;
    }

}