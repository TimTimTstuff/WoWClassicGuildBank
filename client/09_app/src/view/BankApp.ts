class BankApp{

    private pageController:PageController;
    private mainNavigation:Navigation;
    private logger:ILogger;
    private sessionStorage:Dictionary;
    private navCard:NavigationCard;
    private services:ServiceController;

    public static storage:Session;

    constructor() {
        
        let loggerSetup = StaticLogger.getLoggerFactory();
        loggerSetup.setLogLevel(LogLevel.Trace);
        this.sessionStorage = new Dictionary();
        this.logger = StaticLogger.Log();
        BankApp.storage = Session.load(Configuration.SESSION_KEY,this.logger);
        this.pageController = new PageController(this.logger);
        this.mainNavigation = new Navigation(this.pageController,"main",this.logger);
        this.navCard = new NavigationCard(this.mainNavigation,this.logger);
        this.setupPageSections();
        this.setupMainNavigation();
        this.setupGlobalEvents();

        let sc = new ServiceConfiguration(Configuration.BASE_URL,Configuration.API_BASE,"");
        this.services = new ServiceController(sc,BankApp.storage);
    }

    public start():void{
        this.sessionStorage.setValue("login",false);
        this.pageController.loadHtmlComponentInSection("nav",this.navCard);
        this.pageController.loadHtmlComponentInSection("head","<h1> Wow Guild Bank </h1>");
        this.mainNavigation.onNavigate();
    }

    private setupMainNavigation(){
        this.mainNavigation.registerRoute([
            new RouteSet("main","Home",null,10)
            .addSection("c_head","<h2>Home</h2>"),

            new RouteSet("bank","Bank",null ,20)
            .addSection("c_head","<h2>Bank</h2>"),

            new RouteSet("profile","Profile",null,30)
            .addSection("c_head","<h2>Profile</h2>"),

            new RouteSet("char","Chars",null,40)
            .addSection("c_head","<h2>Chars</h2>"),

            new RouteSet("login","Login",null,50)
            .addSection("c_head","<h2>Login</h2>")
            .addSection("c_body",new LoginCard()),            
        ]);
    }

    private setupPageSections(){
        this.pageController.addSection("head","header");
        this.pageController.addSection("nav","nav");
        this.pageController.addSection("content","content");
        this.pageController.addSection("footer","footer");
        this.pageController.addSection("c_head","contentheader");
        this.pageController.addSection("c_body","contentbody");
        this.pageController.addSection("c_foot","contentfooter");
    }

    private setupGlobalEvents(){
        GlobalEvents.addEvent("update_nav",()=>{ this.navCard.update();});
        this.mainNavigation.addNavigationEvent((pre,post)=>{
            this.pageController.clearSection("c_head");
            this.pageController.clearSection("c_body");
            this.pageController.clearSection("c_foot");
        },true);
        window.onhashchange = ()=>{
            this.mainNavigation.onNavigate();
        }
    }
}