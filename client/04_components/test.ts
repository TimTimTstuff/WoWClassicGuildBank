function compTest(){
   
    StaticLogger.getLoggerFactory().setLogLevel(LogLevel.Trace);
  
    let pc = new PageController(StaticLogger.Log());
    pc.addSection("one","#one");
    pc.addSection("two","#two");
    pc.addSection("fix","#fix");

    let n = new Navigation(pc,"main",StaticLogger.Log());
    allInfo = [pc,n];
    let rs = new RouteSet("main","Home",null,0);
    rs.addSection("one",new SimpleCard());
    rs.addSection("two","<h2> Main page </h2>");

    let rs2 = new RouteSet("sub","Help",null,99);
    rs2.addSection("two","<h2> Sub page </h2>");
    rs2.addSection("one",new LoginCard());

    n.registerRoute([rs,rs2]);
    
    
    pc.loadHtmlComponentInSection("fix",new NavigationCard(n,StaticLogger.Log()));

    setTimeout(() => {
        n.onNavigate();    
    }, 250);
    
    window.onhashchange = ()=>{
       
        n.onNavigate();
    }

}