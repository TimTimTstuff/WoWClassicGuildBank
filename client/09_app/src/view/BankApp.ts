class BankApp{

    /**
     * Controlles the page build.
     */
    private pageController:PageController;
    /**
     * Navigation handler
     */
    private mainNavigation:Navigation;
    /**
     * Logger extension
     */
    private logger:ILogger;
    /**
     * Navigation Card
     */
    private navCard:NavigationCard;
    /**
     * Web Api Client
     */
    private services:ServiceController;

    /**
     * Local storage handler
     * It is static because i was lazy and didn't want to build an injection
     */
    public static storage:Session;

    constructor() {
        
        //setup logger
        let loggerSetup = StaticLogger.getLoggerFactory();
        loggerSetup.setLogLevel(LogLevel.Trace);
        this.logger = StaticLogger.Log();

        //set the Session
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

        //Start the app by sending an whoami request, which will result the user information
        new UserActions(this.services).sendWhoAmIRequest((username,userId,userRoleLevel,isLoggedIn)=>{
            BankApp.storage.userId = userId;
            BankApp.storage.username = username;
            BankApp.storage.login = isLoggedIn;
            BankApp.storage.roleLevel = userRoleLevel;
            
            this.pageController.loadHtmlComponentInSection("nav",this.navCard);
            this.pageController.loadHtmlComponentInSection("head","<h1> Wow Guild Bank </h1> <span class='greeting'>Hallo "+BankApp.storage.username+"</span>");
            this.mainNavigation.onNavigate();

        },()=>{
            this.logger.error("WhoAmI Request Faild. Can't load App!","Initialize");
            this.pageController.loadHtmlComponentInSection("c_body","<h1>App couldn't be loaded</h1>");
        });
       
    }

    private setupMainNavigation(){
        this.mainNavigation.registerRoute([
            new RouteSet("main","Home",null,10)
            .addSection("c_head","<h2>Home</h2>")
            .addSection("c_body",new NewsViewCard(this.services))
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
            .addSection("c_head","<h2>Admin</h2>")
            .addSection("c_body",new AdminCard())
            .setIsVisibleCheck(()=>{
                return BankApp.storage.isLoggedIn() && BankApp.storage.roleLevel >= 3
            }),

            new RouteSet("editpostlist","News Edit","admin",40)
            .addSection("c_head","<h2>News Edit</h2>")
            .addSection("c_body",new NewsEditCard(this.services))
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
        //define all sections which are controlled by the PageController
        this.pageController.addSection("head","header");
        this.pageController.addSection("nav","nav");
        this.pageController.addSection("content","content");
        this.pageController.addSection("footer","footer");
        this.pageController.addSection("c_head","contentheader");
        this.pageController.addSection("c_body","contentbody");
        this.pageController.addSection("c_foot","contentfooter");
    }

    private setupGlobalEvents(){
        //call to update the navigation
        GlobalEvents.addEvent("update_nav",()=>{ this.navCard.update();});
        
        //call the login was successfull
        //@todo set all the values, else you will be user "guest" with "guest" role
        GlobalEvents.addEvent("login",(d:boolean)=>{
            BankApp.storage.login = d;
        });
        //navigate to the main page
        GlobalEvents.addEvent("go_home",()=>{
            location.hash = "#main";
        });

        //After each navigation, clear this sections
        this.mainNavigation.addNavigationEvent((pre,post)=>{
            this.pageController.clearSection("c_head");
            this.pageController.clearSection("c_body");
            this.pageController.clearSection("c_foot");
        },true);

        //call the onNavigate event when the url hash changed
        window.onhashchange = ()=>{
            this.mainNavigation.onNavigate();
        }
    }
}