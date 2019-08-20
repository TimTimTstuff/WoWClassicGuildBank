class DemoCard extends HtmlComponent{
    myParam: string;
   
    //define a field for the binding 
    private bindingDemo:string = "";

    //add a getter 
    get myBindingDemo():string{
        return this.bindingDemo;
    }

    //add a setter, call the propertyChanged after the field has changed
    set myBindingDemo(value:string){
        this.bindingDemo = value;
        this.propertyChanged('myBindingDemo');//call with the variable name
    }

    /**
     * You can put all parameters you like
     */
    constructor(myParam:string) {
        super();
        this.myParam = myParam;
    }

   
    build(): void {
        //create events | set the event type, local number (unique), and the event
        let myEvent = this.registerEvent(HtmlEventTrigger.Click,0,()=>{
            //this will add again after each button click
            this.myBindingDemo += " again ";
        });

        //The whole HTML code for the card is put into this template variable, when you call the .render method, this is displayed on the given element
        this.template = 
        /*html*/
        `
        <!-- you can use local fields as placeholders -->
        <span>this is a demo card: ${this.myParam}</span> 
        <!-- bind an event to an element just use the getEventText method with your event -->
        <button ${this.getEventText(myEvent,null)}> click me </button> 
        <!-- you can bind a field to a element -->
        <span data-bind='myBindingDemo'></span>`;
    }


}

function compTest(){
   
    //create a object of your Card
    let card = new DemoCard("my param test");

    //bind it on a element (check index.html)
    card.render("#demo");
    

    
    

}