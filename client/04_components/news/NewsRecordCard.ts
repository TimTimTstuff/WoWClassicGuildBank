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
            <div class='news-body'>${this.record.text}</div>
            <div class='news-footer'>
              <span class='news-label'>${this.record.author}</span>
              <span class='news-label'>${this.record.category}</span>
              <span class='news-label'>${this.record.createdOn}</span>
            </div>
        </div>
      `;
    }

}