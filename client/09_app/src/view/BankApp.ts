class BankApp{

    private pageController:PageController;
    private mainNavigation:Navigation;
    private logger:ILogger;
    private navCard:NavigationCard;
    private services:ServiceController;

    public static storage:Session;

    constructor() {
        
        let loggerSetup = StaticLogger.getLoggerFactory();
        loggerSetup.setLogLevel(LogLevel.Trace);
        this.logger = StaticLogger.Log();
        BankApp.storage = Session.load(Configuration.SESSION_KEY,this.logger);
        this.pageController = new PageController(this.logger);
        this.mainNavigation = new Navigation(this.pageController,"main",this.logger);
        this.navCard = new NavigationCard(this.mainNavigation,this.logger);

        let sc = new ServiceConfiguration(Configuration.BASE_URL,Configuration.API_BASE,"");
        this.services = new ServiceController(sc,BankApp.storage);

        this.setupPageSections();
        this.setupMainNavigation();
        this.setupGlobalEvents();

        
 
    }

    public start():void{
        new UserActions(this.services).sendWhoAmIRequest((n,i,l,li)=>{
            BankApp.storage.userId = i;
            BankApp.storage.username = n;
            BankApp.storage.login = li;
            BankApp.storage.roleLevel = l;

            this.pageController.loadHtmlComponentInSection("nav",this.navCard);
            this.pageController.loadHtmlComponentInSection("head","<h1> Wow Guild Bank </h1>");
            this.mainNavigation.onNavigate();

        },()=>{
            this.logger.error("WhoAmI Request Faild. Can't load App!","Initialize");
        });
       
    }

    private setupMainNavigation(){
        this.mainNavigation.registerRoute([
            new RouteSet("main","Home",null,10)
            .addSection("c_head","<h2>Home</h2>")
            .setIsVisibleCheck(()=>{
                return true;
            }),
            

            new RouteSet("bank","Bank",null ,20)
            .addSection("c_head","<h2>Bank</h2>")
            .setIsVisibleCheck(()=>{
                return BankApp.storage.isLoggedIn()
            }),

            new RouteSet("profile","Profile",null,30)
            .addSection("c_head","<h2>Profile</h2>")
            .setIsVisibleCheck(()=>{
                return BankApp.storage.isLoggedIn()
            }),

            new RouteSet("char","Chars",null,40)
            .addSection("c_head","<h2>Chars</h2>")
            .setIsVisibleCheck(()=>{
                return BankApp.storage.isLoggedIn()
            }),

            new RouteSet("admin","Admin",null,40)
            .addSection("c_head","<h2>admin</h2>")
            .setIsVisibleCheck(()=>{
                return BankApp.storage.isLoggedIn() && BankApp.storage.roleLevel >= 3
            }),

            new RouteSet("login","Login",null,50)
            .addSection("c_head","<h2>Login</h2>")
            .addSection("c_body",new LoginCard(this.services))
            .setIsVisibleCheck(()=>{
                return !BankApp.storage.isLoggedIn()
            }),
            new RouteSet("logout","Logout",null,50)
            .addSection("c_head","<h2>Logout</h2>")
            .addSection("c_body","")
            .setIsVisibleCheck(()=>{
               return false;
            }),  
                      
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
        GlobalEvents.addEvent("login",(d:boolean)=>{
            BankApp.storage.login = d;
        });
        GlobalEvents.addEvent("go_home",()=>{
            location.hash = "#main";
        });
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