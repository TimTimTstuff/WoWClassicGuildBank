class NewsEditRecordCard extends HtmlComponent{
    record: NewsRecord;
  sc: ServiceController;
    

    constructor(record: NewsRecord, sc:ServiceController) {
        super();
        this.record = record;
        this.sc = sc;
        
    }
    
    build(): void {


      this.postRender = ()=>{
        this.myElement.find("select[name='publicpost']").val(this.record.publicpost);
      }

      let ev1 = this.registerEvent(HtmlEventTrigger.Click,1,()=>{

        new NewsActions(this.sc).deleteNews(this.record.id,(r:NewsRecord)=>{
          this.remove();
        });

      });

      let ev = this.registerEvent(HtmlEventTrigger.Click,0,()=>{
        this.record.title = <string>this.myElement.find("input[name='title']").val();
        this.record.category = <string>this.myElement.find('input[name="category"]').val();
        this.record.news_text = <string>this.myElement.find('textarea[name="news_text"]').val();
        this.record.publicpost = <number>this.myElement.find('select[name="publicpost"]').val();

        let updateRec = {
          news_text:this.record.news_text,
          category:this.record.category,
          title:this.record.title,
          publicpost:this.record.publicpost
        };

        new NewsActions(this.sc).updateNews(this.record.id,<NewsRecord>updateRec,(r:NewsRecord)=>{
          this.record = r;
        });
      });

      this.template = 
      /*html*/
      `
        <div class='record-view news'>
            <div class='news-title'>Title: <input name='title' type='text' value='${this.record.title}' /></div>
            <div class='news-body'>Text: <textarea name='news_text'>${this.record.news_text}</textarea></div>
            <div class='news-public'>Öffentlich: <select name='publicpost' value='${this.record.publicpost}'><option value='0'>Nein</option><option value='1'>Ja</option></select></div>
            <div class='news-footer'>
              <span class='news-label'>Autor: ${this.record.owner_ref.name}</span>
              <span class='news-label'>Kategorie: <input type='text' name='category' value='${this.record.category}' /></span>
              <span class='news-label'>Datum: ${this.record.created_on}</span>
            </div>
            <input type='button' value='Save' ${this.getEventText(ev,null)}  />
            <input type='button' value='Delete' ${this.getEventText(ev1,null)}  />
        </div>
      `;
    }

}