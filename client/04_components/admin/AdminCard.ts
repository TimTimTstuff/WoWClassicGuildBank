class AdminCard extends HtmlComponent{
    build(): void {
        this.template =
        /*html*/
        `
        <div class='admincard'>
            <ul>
                <li><a href='#editpostlist'>Edit Posts</a></li>
            </ul>
        </div>
        `;
    }


}