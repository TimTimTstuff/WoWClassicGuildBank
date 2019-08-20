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
            <div class='news-body'>${this.record.news_text}</div>
            <div class='news-footer'>
              <span class='news-label'>Autor: ${this.record.owner_ref.name}</span>
              <span class='news-label'>Kategorie: ${this.record.category}</span>
              <span class='news-label'>Datum: ${this.record.created_on}</span>
            </div>
        </div>
      `;
    }

}