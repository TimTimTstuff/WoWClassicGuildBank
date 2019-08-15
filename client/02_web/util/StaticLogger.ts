class StaticLogger {
    private static instance: LoggerFactory;
    public static getLoggerFactory(): LoggerFactory {
        if (StaticLogger.instance == undefined) {
            StaticLogger.createLogger();
        }
        return StaticLogger.instance;
    }
    public static Log(): ILogger {
        if (StaticLogger.instance == undefined)
            StaticLogger.createLogger();
        return StaticLogger.instance;
    }
    private static createLogger(): void {
        StaticLogger.instance = new LoggerFactory();
        StaticLogger.instance.setLogLevel(LogLevel.Trace);
        StaticLogger.instance.registerLogger("Global", new DefaultLogger(), LogLevel.Trace);
    }
}
