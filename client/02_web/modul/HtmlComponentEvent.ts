class HtmlComponentEvent {
    trigger: string = "";
    localEvent: number = -1;
    callback: undefined | ((d: any) => void) = undefined;
    localId: number = -1;
    genid: string = "";
}
