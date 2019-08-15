class Dictionary implements IKeyValueStorage {
    private store: {
        [index: string]: any;
    } = {};
    private catStore: {
        [index: string]: {
            [index: string]: any;
        };
    } = {};
    setValue(key: string, value: any): void;
    setValue(key: string, value: any, category: string): void;
    setValue(key: any, value: any, category?: any) {
        if (category != undefined) {
            if (this.catStore[category] != undefined) {
                this.catStore[category][key] = value;
            }
            else {
                this.catStore[category] = {};
                this.catStore[category][key] = value;
            }
        }
        else {
            this.store[key] = value;
        }
    }
    getValue(key: string): any;
    getValue(key: string, category: string): any;
    getValue(key: any, category?: any): any {
        if (category != undefined) {
            if (this.catStore[category] != undefined) {
                return this.catStore[category][key];
            }
        }
        else {
            return this.store[key];
        }
        return null;
    }
    toJson(): string {
        return JSON.stringify({ c: this.catStore, s: this.store });
    }
    fromJson(jsonString: string): void {
        var data = JSON.parse(jsonString);
        this.catStore = data.c;
        this.store = data.s;
    }
    fromSaveObject(saveObject: ISaveObject): void {
        if ((<any>saveObject).c != undefined && (<any>saveObject).s != undefined) {
            this.store = (<any>saveObject).s;
            this.catStore = (<any>saveObject).c;
        }
        else {
            throw new Error("Save Object dont match KeyValue Storage");
        }
    }
    getSaveObject(): ISaveObject {
        let so = <any>{};
        so.s = this.store;
        so.c = this.catStore;
        return so;
    }
}
