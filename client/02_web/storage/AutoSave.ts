class AutoSave implements ISaveHandler {
    private saveObjects: {
        [index: string]: ISaveObject;
    } = {};
    private storageKey: string = "autosave";
    private compress: undefined | ((d: string) => string);
    private decompress: undefined | ((d: string) => string);
    private version: string = "0.0.1";
    private intervalId: any = -1;
    private _logger: ILogger;
    private _logGroup: string = "AutoSave";
    constructor(log: ILogger, storageKey?: string, compress?: (d: string) => string, decompress?: (d: string) => string) {
        this._logger = log;
        if (storageKey == null) {
            this.storageKey += Math.floor(Math.random() * 1000);
        }
        else {
            this.storageKey = storageKey;
        }
        this.compress = compress;
        this.decompress = decompress;
    }
    startAutoSave(seconds: number = 20): void {
        if (this.intervalId < 0) {
            this.intervalId = setInterval(() => {
                this.store();
                this._logger.trace("Auto Save!", this._logGroup);
            }, seconds * 1000);
            this._logger.info("Autosave Started each: " + seconds + "s", this._logGroup);
        }
        else {
            this._logger.warn("Autosave is allready started!", this._logGroup);
        }
    }
    stopAutoSave(): void {
        var r = clearInterval(this.intervalId);
        this._logger.info("Stoped autosave, result: " + r, this._logGroup);
    }
    getSaveObject(key: string): ISaveObject {
        return this.saveObjects[key];
    }
    setStorageKey(key: string): void {
        this.storageKey = key;
    }
    load(): void {
        if (localStorage.getItem(this.storageKey) == undefined)
            return;
        this.fromSaveString(<string>localStorage.getItem(this.storageKey));
    }
    toSaveString(): string {
        var st = JSON.stringify(this.saveObjects);
        if (this.compress != undefined) {
            st = this.compress(st);
        }
        return st;
    }
    fromSaveString(saveString: string): void {
        var data = "";
        if (this.decompress != undefined) {
            data = this.decompress(saveString);
        }
        else {
            data = saveString;
        }
        var obj = JSON.parse(data);
        this.saveObjects = <{
            [index: string]: ISaveObject;
        }>obj;
    }
    store(): void {
        for (let key in this.saveObjects) {
            this.saveObjects[key].lastSave = new Date(Date.now());
        }
        localStorage.setItem(this.storageKey, this.toSaveString());
    }
    registerSaveObject(key: string, saveObj: ISaveObject): void {
        this.saveObjects[key] = saveObj;
    }
}
