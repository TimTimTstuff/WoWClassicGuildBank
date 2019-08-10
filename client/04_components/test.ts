function compTest(){
   
    StaticLogger.getLoggerFactory().setLogLevel(LogLevel.Trace);
    StaticLogger.getLoggerFactory().deactivateGroup("navigation");
    let pc = new PageController(StaticLogger.Log());
    pc.addSection("one","one");
    pc.addSection("two","two");
    pc.addSection("fix","fix");

    let n = new Navigation(pc,"main",StaticLogger.Log());
    allInfo = [pc,n];
    let rs = new RouteSet("main","Home",null,0);
    rs.addSection("one",new SimpleCard());
    rs.addSection("two","<h2> Main page </h2>");

    
    let rs2 = new RouteSet("sub","Help",null,99);
    rs2.addSection("two",new SimpleCard());
    rs2.addSection("one","<h2> Sub page </h2>");

    let rs3 = new RouteSet("sub2","Profile",null,10);
    rs3.addSection("two",new SimpleCard());
    rs3.addSection("one","<h2> Sub pap </h2>");

    let rs4 = new RouteSet("pop","Chars",rs3,2);
    rs4.addSection("two",new SimpleCard());
    rs4.addSection("one","<h2> Sub pop </h2>");
    
    
    n.registerRoute([rs,rs2,rs3,rs4]);
    
    
    pc.loadHtmlComponentInSection("fix",new NavigationCard(n));
    n.onNavigate();
    window.onhashchange = ()=>{
        n.onNavigate();
    }

}