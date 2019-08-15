class RouteSet {
    private pageComposition: {
        [index: string]: HtmlComponent | string;
    } = {};
    private pageName: string;
    private navigationName: string | undefined;
    private parentNavigation: string | undefined;
    private navigationIndex: number;
    public isVisible: () => boolean = () => { return true; };
    constructor(name: string, navName?: string, navParent?: string | RouteSet, navIndex?: number) {
        this.pageName = name;
        this.navigationName = navName;
        this.setParent(navParent);
        this.navigationIndex = navIndex || 100;
    }
    public setIsVisibleCheck(check: () => boolean): RouteSet {
        this.isVisible = check;
        return this;
    }
    public getName(): string {
        return this.pageName;
    }
    get navName(): string {
        return this.navigationName || "NotSet";
    }
    get navTarget(): string {
        return `#${this.pageName}`;
    }
    get navIndex(): number {
        return this.navigationIndex;
    }
    public hasParent(name: string | undefined | RouteSet): boolean {
        if (name instanceof RouteSet) {
            return this.parentNavigation == name.getName();
        }
        else {
            return this.parentNavigation == name;
        }
    }
    public setParent(parent: string | RouteSet | undefined) {
        if (parent instanceof RouteSet) {
            this.parentNavigation = parent.getName();
        }
        else {
            this.parentNavigation = parent;
        }
    }
    public addSection(section: string, element: HtmlComponent | string): RouteSet {
        this.pageComposition[section] = element;
        return this;
    }
    public getRoutes(): {
        [index: string]: HtmlComponent | string;
    } {
        return this.pageComposition;
    }
    public getRoute(rs: string): string | HtmlComponent {
        return this.pageComposition[rs];
    }
}
