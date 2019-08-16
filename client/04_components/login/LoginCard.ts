class LoginCard extends HtmlComponent{
    
    private username:string;
    private password:string;
    private password2:string;
    private email:string;
    private message:string = "";
    private service:ServiceController;
    private password_new: string;
    private username_new: string;

    /**
     *
     */
    constructor(service:ServiceController) {
        super();
        this.service = service;
  
    }

    get msg():string{
        return this.message;
    }

    set msg(value:string){
        this.message = value;
        this.propertyChanged('msg');
    }

    private getFormData(){
        this.username = <string>this.myElement.find("[name='username']").val();
        this.password = <string>this.myElement.find("[name='password']").val();
        this.password_new = <string>this.myElement.find("[name='password_new']").val();
        this.username_new = <string>this.myElement.find("[name='username_new']").val();
        this.password2 = <string>this.myElement.find("[name='password_check']").val();
        this.email = <string>this.myElement.find("[name='email']").val();
      
    }

    private validateLoginData():boolean{
        let baseCheck = this.username == "" || this.password == "" || this.username.length < 3 && this.password.length < 4;
      
        if(baseCheck){
            this.msg = "Username or Password is empty or to short.";
            StaticLogger.Log().info("Login Data is empty");
        } 
       
        return baseCheck;
    }

    private validateRegisterData():boolean{
        console.log(this);
        let baseCheck = this.username_new == "" || this.password_new == "" || this.email == ""; 
        baseCheck = baseCheck || this.username_new.length < 3 || this.password_new.length < 4 || this.email.length < 6;
        if(baseCheck){
            this.msg = "Username, Password or Email is empty or to short.";
            StaticLogger.Log().info("Register Data is empty");
        
            return baseCheck;
        }
       
        baseCheck = baseCheck || this.password_new != this.password2;
        if(baseCheck){
            this.msg = "Both passwords have to be the same!";
            StaticLogger.Log().info("not same password");
            return baseCheck;
        }

        return baseCheck;
    }
    
    
    build(): void {
    
        let ev1 = this.registerEvent(HtmlEventTrigger.Click,0,()=>{
            this.msg = "";
            
            this.getFormData();
            if(this.validateLoginData()){
                return;
            }
            let request = new UserActions(this.service);
            request.sendLoginRequest(this.username,this.password,(m,c,t)=>{
                this.msg = "Login erfolgreich";
                setTimeout(()=>{
                    this.service.setToken(t);
                    GlobalEvents.triggerEvent("login",true);
                    GlobalEvents.triggerEvent("update_nav",null);
                    GlobalEvents.triggerEvent("go_home",null);
                    
                    
                    
                },500);
            },(m,c)=>{
                this.msg = `Login nicht erfolgreich: ${m} `;
            });
        });

        let ev2 = this.registerEvent(HtmlEventTrigger.Click,1,()=>{
            this.getFormData();
            if(this.validateRegisterData()){
                return;
            }
            let request = new UserActions(this.service);
            request.sendRegistrationRequest(this.username_new,this.password_new,this.email,(m,c)=>{
                this.msg = "Registrierung erfolgreich! Sie können sich jetzt Anmelden";
                setTimeout(()=>{
                    this.myElement.find("#login").show();
                    this.myElement.find("#register").hide();
                },2000);
            },(m,c)=>{
                this.msg = `Registrierung nicht erfolgreich: ${m} `;
            });
        
        });

        let ev3 =  this.registerEvent(HtmlEventTrigger.Click,2,(to)=>{
            if(to == "login"){
                this.myElement.find("#login").show();
                this.myElement.find("#register").hide();
            }else if(to == "register"){
                this.myElement.find("#login").hide();
                this.myElement.find("#register").show();
            }
        });

        this.postRender = ()=>{
            this.myElement.find("#login").show();
            this.myElement.find("#register").hide();

        };
        
        this.template = 
        /*html*/
        `
        <div id='login-handler' class='modal'>
            
           <div id='login'>
                <form class='form'>
                
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Login Name:</label></div>
                        <div class='form-cell width-h'><input type='text' autocomplete='username' name='username' placeholder='Username' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Password:</label></div>
                        <div class='form-cell width-h'><input type='password' autocomplete='current-password' name='password' placeholder='Password' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><input type='button' value='Login' ${this.getEventText(ev1,null)} /></div>
                        <div class='form-cell width-h'><a href='javascript:;'  ${this.getEventText(ev3,"register")}>Registrieren?</a></div>
                    </div>
                   
                    
                </form>
            </div>
            <div id='register'>
                <form class='form'>
                
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Login Name:</label></div>
                        <div class='form-cell width-h'><input type='text' autocomplete='username' name='username_new' placeholder='Username' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Password:</label></div>
                        <div class='form-cell width-h'><input type='password' name='password_new' autocomplete='new-password'  placeholder='Password' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Password <small>Repeat</small>:</label></div>
                        <div class='form-cell width-h'><input type='password' name='password_check'  autocomplete='new-password' placeholder='Password' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>E-Mail Address:</label></div>
                        <div class='form-cell width-h'><input type='email' autocomplete='email'  name='email' placeholder='E-Mail' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><input type='button' value='Register' ${this.getEventText(ev2,null)} /></div>
                        <div class='form-cell width-h'><a href='javascript:;'  ${this.getEventText(ev3,"login")}>Login?</a></div>
                    </div>
                    
                </form>
            </div>
                        <div  ><span data-bind='msg' class='error-message' ></span></div>
        </div>
        `;

    }

}