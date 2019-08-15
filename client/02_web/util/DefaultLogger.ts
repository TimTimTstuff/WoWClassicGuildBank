class DefaultLogger implements ILogger {
    log(l: any, t: LogLevel): void {
        console.log({ m: l, l: t });
    }
    trace(l: any): void {
        console.trace(l);
    }
    debug(l: any): void {
        console.debug(l);
    }
    info(l: any): void {
        console.info(l);
    }
    warn(l: any): void {
        console.warn(l);
    }
    error(l: any): void {
        console.error(l);
    }
}
