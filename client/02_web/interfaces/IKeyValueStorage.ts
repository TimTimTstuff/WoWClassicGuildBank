interface IKeyValueStorage {
    setValue(key: string, value: any): void;
    setValue(key: string, value: any, category: string): void;
    getValue(key: string): any;
    getValue(key: string, category: string): any;
    toJson(): string;
    fromJson(jsonString: string): void;
    getSaveObject(): ISaveObject;
    fromSaveObject(saveObject: ISaveObject): void;
}
