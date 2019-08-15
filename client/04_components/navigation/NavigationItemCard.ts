class NavigationItemCard extends HtmlComponent {
    rs: RouteSet;
    constructor(routeElement: RouteSet) {
        super();
        this.rs = routeElement;
    }
    public setActive(isActive: boolean): void {
        if (isActive) {
            this.myElement.addClass("active");
        }
        else {
            this.myElement.removeClass("active");
        }
        this.update();
    }
    public update(): void {
        if (this.rs.isVisible()) {
            this.myElement.show();
        }
        else {
            this.myElement.hide();
        }
    }
    public getName(): string {
        return this.rs.getName();
    }
    build(): void {
        this.postRender = () => { this.update(); };
        this.template =
            /*html*/
            `<a href="${this.rs.navTarget}" >${this.rs.navName}</a>`;
    }
}
