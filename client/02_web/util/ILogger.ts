interface ILogger {
    log(l: any, t: LogLevel, group?: string): void;
    trace(l: any, group?: string): void;
    debug(l: any, group?: string): void;
    info(l: any, group?: string): void;
    warn(l: any, group?: string): void;
    error(l: any, group?: string): void;
}
