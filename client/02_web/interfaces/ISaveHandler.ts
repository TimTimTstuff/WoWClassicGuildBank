interface ISaveHandler {
    setStorageKey(key: string): void;
    toSaveString(): string;
    fromSaveString(saveString: string): void;
    store(): void;
    load(): void;
    registerSaveObject(key: string, saveObj: ISaveObject): void;
    getSaveObject(key: string): ISaveObject;
}
