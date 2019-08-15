class LoggerFactory implements ILogger {
    private _logger: {
        [index: string]: any[];
    } = {};
    private _logLevel: LogLevel = LogLevel.Info;
    private _defaultGroup: string = "Global";
    private _usedGroups: string[] = [];
    private _removedGroups: string[] = [];
    constructor() {
    }
    public setLogLevel(level: LogLevel) {
        this._logLevel = level;
    }
    public registerLogger(key: string, logger: ILogger, level: LogLevel): void {
        if (this._logger[key] != undefined)
            return;
        this._logger[key] = [logger, level, key];
    }
    public setLoggerLevel(key: string, level: LogLevel) {
        this._logger[key][LoggerRegister.Level] = level;
    }
    public deactivateGroup(group: string) {
        if (this._removedGroups.indexOf(group) < 0)
            this._removedGroups.push(group);
    }
    public activateGroupe(group: string) {
        let index = this._removedGroups.indexOf(group);
        if (index > -1) {
            this._removedGroups.splice(index, 1);
        }
    }
    log(msg: any, t: LogLevel, group?: string): void {
        if (group == null)
            group = this._defaultGroup;
        if (this._usedGroups.indexOf(group) < 0) {
            this._usedGroups.push(group);
        }
        let data = msg; // JSON.parse(JSON.stringify(msg));
        if (this._logLevel > t)
            return;
        for (let l in this._logger) {
            if (this._logger[l][LoggerRegister.Level] < this._logLevel || this._removedGroups.indexOf(group) >= 0)
                continue;
            msg = `${group.toUpperCase()}: ${msg}`;
            switch (t) {
                case LogLevel.Trace:
                    this._logger[l][LoggerRegister.Logger].trace(msg);
                    break;
                case LogLevel.Debug:
                    this._logger[l][LoggerRegister.Logger].debug(msg);
                    break;
                case LogLevel.Info:
                    this._logger[l][LoggerRegister.Logger].info(msg);
                    break;
                case LogLevel.Warning:
                    this._logger[l][LoggerRegister.Logger].warn(msg);
                    break;
                case LogLevel.Error:
                    this._logger[l][LoggerRegister.Logger].error(msg);
                    break;
            }
        }
    }
    trace(l: any, group?: string): void {
        this.log(l, LogLevel.Trace, group);
    }
    debug(l: any, group?: string): void {
        this.log(l, LogLevel.Debug, group);
    }
    info(l: any, group?: string): void {
        this.log(l, LogLevel.Info, group);
    }
    warn(l: any, group?: string): void {
        this.log(l, LogLevel.Warning, group);
    }
    error(l: any, group?: string): void {
        this.log(l, LogLevel.Error, group);
    }
}
