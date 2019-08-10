/// <reference path="modul/HtmlComponent.ts" />


class SimpleCard extends HtmlComponent{
   
    private num:number = 0;
   
    public set numi(value:number){
        this.num = value;
        this.propertyChanged("numi");
    }

    public get numi():number{
        return this.num;
    }

    build(): void {

       let ev1 = this.registerEvent(HtmlEventTrigger.Click,0,(d)=>{
            this.numi++;
            console.log("hehehe");
        });

      this.template =
      /*html*/
      `
       <h1>Simple Card</h1>
       <button ${this.getEventText(ev1,"")} data-bind='numi'></button>
      `;
    }

}


var allInfo;
function webTest(){
    StaticLogger.getLoggerFactory().setLogLevel(LogLevel.Trace);
    let pc = new PageController(StaticLogger.Log());
    pc.addSection("one","one");
    pc.addSection("two","two");
    let n = new Navigation(pc,"main",StaticLogger.Log());
    allInfo = [pc,n];
    let rs = new RouteSet("main");
    rs.addSection("one",new SimpleCard());
    rs.addSection("two","<h2> Main page </h2>");
    
    let rs2 = new RouteSet("sub");
    rs2.addSection("two",new SimpleCard());
    rs2.addSection("one","<h2> Sub page </h2>");
    
    
    n.registerRoute(rs);
    n.registerRoute(rs2);

    n.onNavigate();
    window.onhashchange = ()=>{
        n.onNavigate();
    }

}