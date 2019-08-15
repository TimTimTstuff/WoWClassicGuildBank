abstract class HtmlComponent{

    
    private static id:number = 0;
    protected myId:number;
    protected myElement:JQuery<HTMLElement> = $();
    protected template:string = "";
    protected observerList:{[index:string]:ObservedElement[]} = {};

    constructor()
    {
        this.myId = HtmlComponent.id++; 
    }

    private static elements:{[index:string]:HtmlComponentEvent} = {};

    public static emitEvent(id:string,param?:string){
      
        var obj = HtmlComponent.elements[id];
        if(obj != undefined){
            if(obj.callback != undefined){
                obj.callback(param);
            }
        }

    }

    public addEventElement(event:HtmlComponentEvent){
       
        let id = event.localId+"_"+event.localEvent+"_"+event.trigger;
        event.genid = id;
        HtmlComponent.elements[id] = event;
    }

    protected registerEvent(trigger: string,localEvent:number,callback:(d?:any)=>void):HtmlComponentEvent{
       var event = <HtmlComponentEvent>{
           localId: this.myId,
            callback: callback,
            localEvent:localEvent,
            trigger:trigger
       };

       this.addEventElement(event);
       return event;

    }

    protected getEventText(event:HtmlComponentEvent,param:string):string{
        var eventName = event.trigger;
        return `${eventName}='HtmlComponent.emitEvent("${event.genid}","${param}")'`;
        
    }

    abstract build():void;
    
    protected propertyChanged(name:string){
       
        
        if(this.observerList[name] != null){
            var x = this.observerList[name];
            x.forEach(e=>{
                if(e.isVal){
                    $(e.element).val((<any>this)[name]);
                }else{
                    if(e.isHtml){
                      
                        e.element.innerHTML = (<any>this)[name];
                    }else{
                        e.element.innerText = (<any>this)[name];
                    }
                    
                }
            });
        }
    }

    render(elementName:string,append:boolean = false,appendElement?:string,styleClass?:string):void{

        setTimeout(()=>{
        this.build();
        var el = $(elementName).first();
        if(append){
            el.append(`
            <${appendElement||"div"} class='${styleClass||""}' id='el_${this.myId}'>
            </${appendElement||"div"}>
            `);
            el = $("#el_"+this.myId);
        }else{
            el.attr("id","el_"+this.myId);
        } 
         
        
        el.html(this.template);
        
        this.myElement = $("#el_"+this.myId);
        this.setBinding();
        if(this.postRender != undefined){
            this.postRender();
        }
        },0);
    }

    public postRender:undefined|(()=>void);

    public remove(){
        for (let e  in HtmlComponent.elements) {
            if(e.startsWith(this.myId+"_")){
                delete HtmlComponent.elements[e];
            }
            }
        this.myElement.remove();
    }

    private setBinding() {
        this.myElement.find("*").each((n, c) => {

            if ($(c).data("bind") != undefined) {
                var isHtml = $(c).data("type")!=undefined&&$(c).data("type")=='html';
                var bindName = <string>c.dataset.bind;
               
                if (this.observerList[bindName] == null) {
                    this.observerList[bindName] = [];
                }
                if (["input", "select"].indexOf(c.tagName.toLocaleLowerCase()) > -1) {
                    // $(c).val((<any>this)[bindName]);
                    // this.observerList[bindName].push(<ObservedElement>{
                    //     element: c,
                    //     isVal: true,
                    //     isHtml:isHtml
                    // });
                }
                else {
                    this.observerList[bindName].push(<ObservedElement>{
                        element: c,
                        isVal: false,
                        isHtml:isHtml
                    });
                    c.innerText = (<any>this)[<string>c.dataset.bind];
                }
            }
           
        });
    }

    public getId(){
        return this.myId;
    }
}
