class BankApp{

    private pageController:PageController;
    private mainNavigation:Navigation;
    private logger:ILogger;
    private sessionStorage:Dictionary;
    private navCard:NavigationCard;

    constructor() {
        let loggerSetup = StaticLogger.getLoggerFactory();
        loggerSetup.setLogLevel(LogLevel.Trace);
        this.sessionStorage = new Dictionary();
        this.logger = StaticLogger.Log();
        this.pageController = new PageController(this.logger);
        this.mainNavigation = new Navigation(this.pageController,"main",this.logger);
        this.navCard = new NavigationCard(this.mainNavigation,this.logger);
        this.setupPageSections();
        this.setupMainNavigation();
        this.setupGlobalEvents();
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
            .addSection("content","<h2>Home</h2>")
            .setIsVisibleCheck(()=>{return this.sessionStorage.getValue("login");}),

            new RouteSet("bank","Bank",null ,20)
            .addSection("content","<h2>Bank</h2>"),

            new RouteSet("profile","Profile",null,30)
            .addSection("content","<h2>Profile</h2>"),

            new RouteSet("char","Chars",null,40)
            .addSection("content","<h2>Chars</h2>"),

            new RouteSet("login","Login",null,50)
            .addSection("content","<h2>Login</h2>"),

            
        ]);
    }

    private setupPageSections(){
        this.pageController.addSection("head","header");
        this.pageController.addSection("nav","nav");
        this.pageController.addSection("content","content");
        this.pageController.addSection("footer","footer");
    }

    private setupGlobalEvents(){
        GlobalEvents.addEvent("update_nav",()=>{ this.navCard.update();});
        window.onhashchange = ()=>{
            this.mainNavigation.onNavigate();
        }
    }
}