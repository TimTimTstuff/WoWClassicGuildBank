class LoginCard extends HtmlComponent{
    
    private username:string;
    private password:string;
    private password2:string;
    private email:string;
    private message:string = "";

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
        let baseCheck = this.username == "" || this.password == "" || this.email == ""; 
        baseCheck = baseCheck || this.username.length < 3 || this.password.length < 4 || this.email.length < 6;
        if(baseCheck){
            this.msg = "Username, Password or Email is empty or to short.";
            StaticLogger.Log().info("Register Data is empty");
            return baseCheck;
        }
       
        baseCheck = baseCheck || this.password != this.password2;
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
        });

        let ev2 = this.registerEvent(HtmlEventTrigger.Click,1,()=>{
            this.getFormData();
            if(this.validateRegisterData()){
                return;
            }
            
            
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
                        <div class='form-cell width-h'><input type='button' value='Registration' ${this.getEventText(ev3,"register")} /></div>
                    </div>
                   
                    
                </form>
            </div>
            <div id='register'>
                <form class='form'>
                
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Login Name:</label></div>
                        <div class='form-cell width-h'><input type='text' autocomplete='username' name='username' placeholder='Username' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Password:</label></div>
                        <div class='form-cell width-h'><input type='password' name='password' autocomplete='new-password'  placeholder='Password' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>Password <small>Repeat</small>:</label></div>
                        <div class='form-cell width-h'><input type='password' name='password'  autocomplete='new-password' placeholder='Password' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><label>E-Mail Address:</label></div>
                        <div class='form-cell width-h'><input type='email' autocomplete='email'  name='email' placeholder='E-Mail' /></div>
                    </div>
                    <div class='form-row'>
                        <div class='form-cell width-h'><input type='button' value='Register' ${this.getEventText(ev2,null)} /></div>
                        <div class='form-cell width-h'><input type='button' value='Login' ${this.getEventText(ev3,"login")} /></div>
                    </div>
                    
                </form>
            </div>
                        <div  ><span data-bind='msg' class='error-message' ></span></div>
        </div>
        `;

    }

}