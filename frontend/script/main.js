"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function testBase() {
}
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Util;
}());
var HtmlEventTrigger;
(function (HtmlEventTrigger) {
    HtmlEventTrigger[HtmlEventTrigger["None"] = 0] = "None";
    HtmlEventTrigger["Click"] = "onclick";
    HtmlEventTrigger["HoverIn"] = "onmouseover";
    HtmlEventTrigger["HoverOut"] = "onmouseout";
    HtmlEventTrigger["Change"] = "onchange";
    HtmlEventTrigger["KeyDown"] = "onkeydown";
    HtmlEventTrigger["KeyUp"] = "onkeyup";
})(HtmlEventTrigger || (HtmlEventTrigger = {}));
var HtmlComponentEvent = /** @class */ (function () {
    function HtmlComponentEvent() {
        this.trigger = "";
        this.localEvent = -1;
        this.callback = undefined;
        this.localId = -1;
        this.genid = "";
    }
    return HtmlComponentEvent;
}());
var ObservedElement = /** @class */ (function () {
    function ObservedElement() {
        this.element = null;
        this.isVal = false;
        this.isHtml = false;
    }
    return ObservedElement;
}());
var HtmlComponent = /** @class */ (function () {
    function HtmlComponent() {
        this.myElement = $();
        this.template = "";
        this.observerList = {};
        this.myId = HtmlComponent.id++;
    }
    HtmlComponent.emitEvent = function (id, param) {
        var obj = HtmlComponent.elements[id];
        if (obj != undefined) {
            if (obj.callback != undefined) {
                obj.callback(param);
            }
        }
    };
    HtmlComponent.prototype.addEventElement = function (event) {
        var id = event.localId + "_" + event.localEvent + "_" + event.trigger;
        event.genid = id;
        HtmlComponent.elements[id] = event;
    };
    HtmlComponent.prototype.registerEvent = function (trigger, localEvent, callback) {
        var event = {
            localId: this.myId,
            callback: callback,
            localEvent: localEvent,
            trigger: trigger
        };
        this.addEventElement(event);
        return event;
    };
    HtmlComponent.prototype.getEventText = function (event, param) {
        var eventName = event.trigger;
        return eventName + "='HtmlComponent.emitEvent(\"" + event.genid + "\",\"" + param + "\")'";
    };
    HtmlComponent.prototype.propertyChanged = function (name) {
        var _this = this;
        if (this.observerList[name] != null) {
            var x = this.observerList[name];
            x.forEach(function (e) {
                if (e.isVal) {
                    $(e.element).val(_this[name]);
                }
                else {
                    if (e.isHtml) {
                        e.element.innerHTML = _this[name];
                    }
                    else {
                        e.element.innerText = _this[name];
                    }
                }
            });
        }
    };
    HtmlComponent.prototype.render = function (elementName, append, appendElement, styleClass) {
        var _this = this;
        if (append === void 0) { append = false; }
        setTimeout(function () {
            _this.build();
            var el = $(elementName).first();
            if (append) {
                el.append("\n            <" + (appendElement || "div") + " class='" + (styleClass || "") + "' id='el_" + _this.myId + "'>\n            </" + (appendElement || "div") + ">\n            ");
                el = $("#el_" + _this.myId);
            }
            else {
                el.attr("id", "el_" + _this.myId);
            }
            el.html(_this.template);
            _this.myElement = $("#el_" + _this.myId);
            _this.setBinding();
            if (_this.postRender != undefined) {
                _this.postRender();
            }
        }, 0);
    };
    HtmlComponent.prototype.remove = function () {
        for (var e in HtmlComponent.elements) {
            if (e.startsWith(this.myId + "_")) {
                delete HtmlComponent.elements[e];
            }
        }
        this.myElement.remove();
    };
    HtmlComponent.prototype.setBinding = function () {
        var _this = this;
        this.myElement.find("*").each(function (n, c) {
            if ($(c).data("bind") != undefined) {
                var isHtml = $(c).data("type") != undefined && $(c).data("type") == 'html';
                var bindName = c.dataset.bind;
                if (_this.observerList[bindName] == null) {
                    _this.observerList[bindName] = [];
                }
                if (["input", "select"].indexOf(c.tagName.toLocaleLowerCase()) > -1) {
                    // $(c).val((<any>this)[bindName]);
                    // this.observerList[bindName].push(<ObservedElement>{
                    //     element: c,
                    //     isVal: true,
                    //     isHtml:isHtml
                    // });
                }
                else {
                    _this.observerList[bindName].push({
                        element: c,
                        isVal: false,
                        isHtml: isHtml
                    });
                    c.innerText = _this[c.dataset.bind];
                }
            }
        });
    };
    HtmlComponent.prototype.getId = function () {
        return this.myId;
    };
    HtmlComponent.id = 0;
    HtmlComponent.elements = {};
    return HtmlComponent;
}());
/// <reference path="modul/HtmlComponent.ts" />
var SimpleCard = /** @class */ (function (_super) {
    __extends(SimpleCard, _super);
    function SimpleCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.num = 0;
        return _this;
    }
    Object.defineProperty(SimpleCard.prototype, "numi", {
        get: function () {
            return this.num;
        },
        set: function (value) {
            this.num = value;
            this.propertyChanged("numi");
        },
        enumerable: true,
        configurable: true
    });
    SimpleCard.prototype.build = function () {
        var _this = this;
        var ev1 = this.registerEvent(HtmlEventTrigger.Click, 0, function (d) {
            _this.numi++;
        });
        this.template =
            /*html*/
            "\n       <h1>Simple Card</h1>\n       <button " + this.getEventText(ev1, "") + " data-bind='numi'></button>\n      ";
    };
    return SimpleCard;
}(HtmlComponent));
var allInfo;
function webTest() {
    StaticLogger.getLoggerFactory().setLogLevel(LogLevel.Trace);
    var pc = new PageController(StaticLogger.Log());
    pc.addSection("one", "one");
    pc.addSection("two", "two");
    pc.addSection("fix", "fix");
    var n = new Navigation(pc, "main", StaticLogger.Log());
    allInfo = [pc, n];
    var rs = new RouteSet("main");
    rs.addSection("one", new SimpleCard());
    rs.addSection("two", "<h2> Main page </h2>");
    rs.addSection("fix", new SimpleCard());
    var rs2 = new RouteSet("sub");
    rs2.addSection("two", new SimpleCard());
    rs2.addSection("one", "<h2> Sub page </h2>");
    n.registerRoute(rs);
    n.registerRoute(rs2);
    n.onNavigate();
    window.onhashchange = function () {
        n.onNavigate();
    };
}
var GlobalEvents = /** @class */ (function () {
    function GlobalEvents() {
        this.events = {};
        GlobalEvents.instance = this;
        this.logger = StaticLogger.Log();
    }
    GlobalEvents.getInstance = function () {
        return GlobalEvents.instance;
    };
    GlobalEvents.addEvent = function (name, event) {
        GlobalEvents.instance.addNewEvent(name, event);
    };
    GlobalEvents.triggerEvent = function (name, args) {
        GlobalEvents.instance.triggerNewEvents(name, args);
    };
    GlobalEvents.prototype.triggerNewEvents = function (name, args) {
        this.logger.trace("Trigger global event: " + name, "global event");
        if (this.events[name] != undefined) {
            this.events[name].forEach(function (e) { e(args); });
        }
    };
    GlobalEvents.prototype.addNewEvent = function (name, event) {
        this.logger.trace("Add global event: " + name, "global event");
        if (this.events[name] == undefined) {
            this.events[name] = [];
        }
        this.events[name].push(event);
    };
    return GlobalEvents;
}());
var RouteSet = /** @class */ (function () {
    function RouteSet(name, navName, navParent, navIndex) {
        this.pageComposition = {};
        this.isVisible = function () { return true; };
        this.pageName = name;
        this.navigationName = navName;
        this.setParent(navParent);
        this.navigationIndex = navIndex || 100;
    }
    RouteSet.prototype.setIsVisibleCheck = function (check) {
        this.isVisible = check;
        return this;
    };
    RouteSet.prototype.getName = function () {
        return this.pageName;
    };
    Object.defineProperty(RouteSet.prototype, "navName", {
        get: function () {
            return this.navigationName || "NotSet";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteSet.prototype, "navTarget", {
        get: function () {
            return "#" + this.pageName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteSet.prototype, "navIndex", {
        get: function () {
            return this.navigationIndex;
        },
        enumerable: true,
        configurable: true
    });
    RouteSet.prototype.hasParent = function (name) {
        if (name instanceof RouteSet) {
            return this.parentNavigation == name.getName();
        }
        else {
            return this.parentNavigation == name;
        }
    };
    RouteSet.prototype.setParent = function (parent) {
        if (parent instanceof RouteSet) {
            this.parentNavigation = parent.getName();
        }
        else {
            this.parentNavigation = parent;
        }
    };
    RouteSet.prototype.addSection = function (section, element) {
        this.pageComposition[section] = element;
        return this;
    };
    RouteSet.prototype.getRoutes = function () {
        return this.pageComposition;
    };
    RouteSet.prototype.getRoute = function (rs) {
        return this.pageComposition[rs];
    };
    return RouteSet;
}());
var Navigation = /** @class */ (function () {
    function Navigation(pageCtrl, defaultRoute, log) {
        this.pages = {};
        this.preNavigationEvents = [];
        this.postNavigationEvents = [];
        this.log = log;
        this.pageCtrl = pageCtrl;
        this.defaultRoute = defaultRoute;
        this.currentLocation = "-";
    }
    Navigation.prototype.addNavigationEvent = function (event, isPre) {
        if (isPre === void 0) { isPre = true; }
        if (isPre) {
            this.preNavigationEvents.push(event);
        }
        else {
            this.postNavigationEvents.push(event);
        }
    };
    Navigation.prototype.registerRoute = function (routeSet) {
        var _this = this;
        if (routeSet instanceof RouteSet) {
            if (this.defaultRoute == undefined)
                this.defaultRoute = routeSet.getName();
            this.pages[routeSet.getName()] = routeSet;
        }
        else {
            routeSet.forEach(function (rs) {
                _this.registerRoute(rs);
            });
        }
    };
    Navigation.prototype.getPages = function () {
        var _this = this;
        var routeSet = [];
        Object.keys(this.pages).forEach(function (k) {
            routeSet.push(_this.pages[k]);
        });
        return routeSet;
    };
    Navigation.prototype.getPagesByParent = function (parent) {
        var _this = this;
        var routeSet = [];
        Object.keys(this.pages).forEach(function (k) {
            if (_this.pages[k].hasParent(parent))
                routeSet.push(_this.pages[k]);
        });
        return routeSet;
    };
    Navigation.prototype.onNavigate = function () {
        var _this = this;
        this.log.info("Call onNavigate", "navigation");
        var nextRoute = this.defaultRoute || "";
        if (this.pages[this.getUrlLocation()] !== undefined) {
            nextRoute = this.getUrlLocation();
        }
        if (nextRoute == this.currentLocation)
            return;
        this.preNavigationEvents.forEach(function (pe) {
            pe(_this.currentLocation, nextRoute);
        });
        this.log.info("Navigate to " + nextRoute, "navigation");
        this.currentLocation = nextRoute;
        this.pageCtrl.setPage(this.pages[this.currentLocation]);
        this.postNavigationEvents.forEach(function (pe) {
            _this.log.debug("do post naivgation event", "navigation");
            pe(_this.currentLocation, nextRoute);
        });
    };
    Navigation.prototype.getUrlLocation = function () {
        return window.location.hash.replace("#", "");
    };
    return Navigation;
}());
var PageController = /** @class */ (function () {
    function PageController(logger) {
        this.pageSections = {};
        this.activeComponents = {};
        this.log = logger;
    }
    PageController.prototype.addSection = function (name, elementId) {
        this.pageSections[name] = elementId;
    };
    PageController.prototype.loadHtmlComponentInSection = function (sectionName, component) {
        if (this.pageSections[sectionName] === undefined) {
            this.log.error("Page section not found: " + sectionName, "PageController");
            return;
        }
        this.clearSection(sectionName);
        if (component instanceof HtmlComponent) {
            this.activeComponents[sectionName] = component;
            component.render(this.pageSections[sectionName], true);
        }
        else {
            $(this.pageSections[sectionName]).html(component);
        }
    };
    PageController.prototype.clearSection = function (sectionName) {
        if (this.activeComponents[sectionName] !== undefined) {
            this.activeComponents[sectionName].remove();
            delete this.activeComponents[sectionName];
        }
        $("" + this.pageSections[sectionName]).html("");
    };
    PageController.prototype.setPage = function (routeSet) {
        var _this = this;
        Object.keys(routeSet.getRoutes()).forEach(function (rs) {
            _this.loadHtmlComponentInSection(rs, routeSet.getRoute(rs));
        });
    };
    return PageController;
}());
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.store = {};
        this.catStore = {};
    }
    Dictionary.prototype.setValue = function (key, value, category) {
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
    };
    Dictionary.prototype.getValue = function (key, category) {
        if (category != undefined) {
            if (this.catStore[category] != undefined) {
                return this.catStore[category][key];
            }
        }
        else {
            return this.store[key];
        }
        return null;
    };
    Dictionary.prototype.toJson = function () {
        return JSON.stringify({ c: this.catStore, s: this.store });
    };
    Dictionary.prototype.fromJson = function (jsonString) {
        var data = JSON.parse(jsonString);
        this.catStore = data.c;
        this.store = data.s;
    };
    Dictionary.prototype.fromSaveObject = function (saveObject) {
        if (saveObject.c != undefined && saveObject.s != undefined) {
            this.store = saveObject.s;
            this.catStore = saveObject.c;
        }
        else {
            throw new Error("Save Object dont match KeyValue Storage");
        }
    };
    Dictionary.prototype.getSaveObject = function () {
        var so = {};
        so.s = this.store;
        so.c = this.catStore;
        return so;
    };
    return Dictionary;
}());
var AutoSave = /** @class */ (function () {
    function AutoSave(log, storageKey, compress, decompress) {
        this.saveObjects = {};
        this.storageKey = "autosave";
        this.version = "0.0.1";
        this.intervalId = -1;
        this._logGroup = "AutoSave";
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
    AutoSave.prototype.startAutoSave = function (seconds) {
        var _this = this;
        if (seconds === void 0) { seconds = 20; }
        if (this.intervalId < 0) {
            this.intervalId = setInterval(function () {
                _this.store();
                _this._logger.trace("Auto Save!", _this._logGroup);
            }, seconds * 1000);
            this._logger.info("Autosave Started each: " + seconds + "s", this._logGroup);
        }
        else {
            this._logger.warn("Autosave is allready started!", this._logGroup);
        }
    };
    AutoSave.prototype.stopAutoSave = function () {
        var r = clearInterval(this.intervalId);
        this._logger.info("Stoped autosave, result: " + r, this._logGroup);
    };
    AutoSave.prototype.getSaveObject = function (key) {
        return this.saveObjects[key];
    };
    AutoSave.prototype.setStorageKey = function (key) {
        this.storageKey = key;
    };
    AutoSave.prototype.load = function () {
        if (localStorage.getItem(this.storageKey) == undefined)
            return;
        this.fromSaveString(localStorage.getItem(this.storageKey));
    };
    AutoSave.prototype.toSaveString = function () {
        var st = JSON.stringify(this.saveObjects);
        if (this.compress != undefined) {
            st = this.compress(st);
        }
        return st;
    };
    AutoSave.prototype.fromSaveString = function (saveString) {
        var data = "";
        if (this.decompress != undefined) {
            data = this.decompress(saveString);
        }
        else {
            data = saveString;
        }
        var obj = JSON.parse(data);
        this.saveObjects = obj;
    };
    AutoSave.prototype.store = function () {
        for (var key in this.saveObjects) {
            this.saveObjects[key].lastSave = new Date(Date.now());
        }
        localStorage.setItem(this.storageKey, this.toSaveString());
    };
    AutoSave.prototype.registerSaveObject = function (key, saveObj) {
        this.saveObjects[key] = saveObj;
    };
    return AutoSave;
}());
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Error"] = 8] = "Error";
})(LogLevel || (LogLevel = {}));
var LoggerRegister;
(function (LoggerRegister) {
    LoggerRegister[LoggerRegister["Logger"] = 0] = "Logger";
    LoggerRegister[LoggerRegister["Level"] = 1] = "Level";
    LoggerRegister[LoggerRegister["Group"] = 2] = "Group";
})(LoggerRegister || (LoggerRegister = {}));
var StaticLogger = /** @class */ (function () {
    function StaticLogger() {
    }
    StaticLogger.getLoggerFactory = function () {
        if (StaticLogger.instance == undefined) {
            StaticLogger.createLogger();
        }
        return StaticLogger.instance;
    };
    StaticLogger.Log = function () {
        if (StaticLogger.instance == undefined)
            StaticLogger.createLogger();
        return StaticLogger.instance;
    };
    StaticLogger.createLogger = function () {
        StaticLogger.instance = new LoggerFactory();
        StaticLogger.instance.setLogLevel(LogLevel.Trace);
        StaticLogger.instance.registerLogger("Global", new DefaultLogger(), LogLevel.Trace);
    };
    return StaticLogger;
}());
var LoggerFactory = /** @class */ (function () {
    function LoggerFactory() {
        this._logger = {};
        this._logLevel = LogLevel.Info;
        this._defaultGroup = "Global";
        this._usedGroups = [];
        this._removedGroups = [];
    }
    LoggerFactory.prototype.setLogLevel = function (level) {
        this._logLevel = level;
    };
    LoggerFactory.prototype.registerLogger = function (key, logger, level) {
        if (this._logger[key] != undefined)
            return;
        this._logger[key] = [logger, level, key];
    };
    LoggerFactory.prototype.setLoggerLevel = function (key, level) {
        this._logger[key][LoggerRegister.Level] = level;
    };
    LoggerFactory.prototype.deactivateGroup = function (group) {
        if (this._removedGroups.indexOf(group) < 0)
            this._removedGroups.push(group);
    };
    LoggerFactory.prototype.activateGroupe = function (group) {
        var index = this._removedGroups.indexOf(group);
        if (index > -1) {
            this._removedGroups.splice(index, 1);
        }
    };
    LoggerFactory.prototype.log = function (msg, t, group) {
        if (group == null)
            group = this._defaultGroup;
        if (this._usedGroups.indexOf(group) < 0) {
            this._usedGroups.push(group);
        }
        var data = msg; // JSON.parse(JSON.stringify(msg));
        if (this._logLevel > t)
            return;
        for (var l in this._logger) {
            if (this._logger[l][LoggerRegister.Level] < this._logLevel || this._removedGroups.indexOf(group) >= 0)
                continue;
            msg = group.toUpperCase() + ": " + msg;
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
    };
    LoggerFactory.prototype.trace = function (l, group) {
        this.log(l, LogLevel.Trace, group);
    };
    LoggerFactory.prototype.debug = function (l, group) {
        this.log(l, LogLevel.Debug, group);
    };
    LoggerFactory.prototype.info = function (l, group) {
        this.log(l, LogLevel.Info, group);
    };
    LoggerFactory.prototype.warn = function (l, group) {
        this.log(l, LogLevel.Warning, group);
    };
    LoggerFactory.prototype.error = function (l, group) {
        this.log(l, LogLevel.Error, group);
    };
    return LoggerFactory;
}());
var DefaultLogger = /** @class */ (function () {
    function DefaultLogger() {
    }
    DefaultLogger.prototype.log = function (l, t) {
        console.log({ m: l, l: t });
    };
    DefaultLogger.prototype.trace = function (l) {
        console.trace(l);
    };
    DefaultLogger.prototype.debug = function (l) {
        console.debug(l);
    };
    DefaultLogger.prototype.info = function (l) {
        console.info(l);
    };
    DefaultLogger.prototype.warn = function (l) {
        console.warn(l);
    };
    DefaultLogger.prototype.error = function (l) {
        console.error(l);
    };
    return DefaultLogger;
}());
/// <reference path="../../dist/lib/config.lib.d.ts" />
/// <reference path="../../dist/lib/webhelper.lib.d.ts" />
/// <reference path="../../dist/lib/config.lib.d.ts" />
/// <reference path="../../dist/lib/webhelper.lib.d.ts" />
/// <reference path="../../dist/lib/service.lib.d.ts" />
function compTest() {
    StaticLogger.getLoggerFactory().setLogLevel(LogLevel.Trace);
    var pc = new PageController(StaticLogger.Log());
    pc.addSection("one", "#one");
    pc.addSection("two", "#two");
    pc.addSection("fix", "#fix");
    var n = new Navigation(pc, "main", StaticLogger.Log());
    allInfo = [pc, n];
    var rs = new RouteSet("main", "Home", null, 0);
    rs.addSection("one", new SimpleCard());
    rs.addSection("two", "<h2> Main page </h2>");
    var rs2 = new RouteSet("sub", "Help", null, 99);
    rs2.addSection("two", new SimpleCard());
    rs2.addSection("one", "<h2> Sub page </h2>");
    var rs3 = new RouteSet("sub2", "Profile", null, 10);
    rs3.addSection("two", new SimpleCard());
    rs3.addSection("one", "<h2> Sub pap </h2>");
    var rs4 = new RouteSet("pop", "Chars", rs3, 2);
    rs4.addSection("two", new SimpleCard());
    rs4.addSection("one", "<h2> Sub pop </h2>");
    n.registerRoute([rs, rs2, rs3, rs4]);
    pc.loadHtmlComponentInSection("fix", new NavigationCard(n, StaticLogger.Log()));
    setTimeout(function () {
        n.onNavigate();
    }, 250);
    window.onhashchange = function () {
        n.onNavigate();
    };
}
var NavigationCard = /** @class */ (function (_super) {
    __extends(NavigationCard, _super);
    /**
     *
     */
    function NavigationCard(nav, log) {
        var _this = _super.call(this) || this;
        _this.navigationItems = [];
        _this.log = log;
        _this.nav = nav;
        return _this;
    }
    NavigationCard.prototype.setActive = function (name) {
        var _this = this;
        this.navigationItems.forEach(function (n) {
            _this.log.debug("Call navigate for: " + n.getName());
            n.setActive(n.getName() == name);
        });
    };
    NavigationCard.prototype.update = function () {
        this.navigationItems.forEach(function (a) {
            a.update();
        });
    };
    NavigationCard.prototype.buildNavItems = function () {
        var _this = this;
        this.nav.addNavigationEvent(function (pre, post) {
            _this.setActive(post);
        }, false);
        this.nav.getPagesByParent(null)
            .sort(function (a, b) { return a.navIndex - b.navIndex; })
            .forEach(function (nav) {
            _this.navigationItems.push(new NavigationItemCard(nav));
        });
    };
    NavigationCard.prototype.build = function () {
        var _this = this;
        this.buildNavItems();
        this.postRender = function () {
            _this.navigationItems.forEach(function (n) {
                n.render("#nav" + _this.getId(), true, "li", "t-navitem");
            });
        };
        this.template =
            /*html*/
            "\n        <ul id='nav" + this.getId() + "' class='t-navigation'>\n      \n        </ul>\n        ";
    };
    return NavigationCard;
}(HtmlComponent));
var NavigationItemCard = /** @class */ (function (_super) {
    __extends(NavigationItemCard, _super);
    function NavigationItemCard(routeElement) {
        var _this = _super.call(this) || this;
        _this.rs = routeElement;
        return _this;
    }
    NavigationItemCard.prototype.setActive = function (isActive) {
        if (isActive) {
            this.myElement.addClass("active");
        }
        else {
            this.myElement.removeClass("active");
        }
        this.update();
    };
    NavigationItemCard.prototype.update = function () {
        if (this.rs.isVisible()) {
            this.myElement.show();
        }
        else {
            this.myElement.hide();
        }
    };
    NavigationItemCard.prototype.getName = function () {
        return this.rs.getName();
    };
    NavigationItemCard.prototype.build = function () {
        var _this = this;
        this.postRender = function () { _this.update(); };
        this.template =
            /*html*/
            "<a href=\"" + this.rs.navTarget + "\" >" + this.rs.navName + "</a>";
    };
    return NavigationItemCard;
}(HtmlComponent));
/// <reference path="../../dist/lib/config.lib.d.ts" />
/// <reference path="../../dist/lib/webhelper.lib.d.ts" />
/// <reference path="../../dist/lib/service.lib.d.ts" />
/// <reference path="../../dist/lib/components.lib.d.ts" />
var BankApp = /** @class */ (function () {
    function BankApp() {
        var loggerSetup = StaticLogger.getLoggerFactory();
        loggerSetup.setLogLevel(LogLevel.Trace);
        this.sessionStorage = new Dictionary();
        this.logger = StaticLogger.Log();
        this.pageController = new PageController(this.logger);
        this.mainNavigation = new Navigation(this.pageController, "main", this.logger);
        this.navCard = new NavigationCard(this.mainNavigation, this.logger);
        this.setupPageSections();
        this.setupMainNavigation();
        this.setupGlobalEvents();
    }
    BankApp.prototype.start = function () {
        this.sessionStorage.setValue("login", false);
        this.pageController.loadHtmlComponentInSection("nav", this.navCard);
        this.pageController.loadHtmlComponentInSection("head", "<h1> Wow Guild Bank </h1>");
        this.mainNavigation.onNavigate();
    };
    BankApp.prototype.setupMainNavigation = function () {
        var _this = this;
        this.mainNavigation.registerRoute([
            new RouteSet("main", "Home", null, 10)
                .addSection("content", "<h2>Home</h2>")
                .setIsVisibleCheck(function () { return _this.sessionStorage.getValue("login"); }),
            new RouteSet("bank", "Bank", null, 20)
                .addSection("content", "<h2>Bank</h2>"),
            new RouteSet("profile", "Profile", null, 30)
                .addSection("content", "<h2>Profile</h2>"),
            new RouteSet("char", "Chars", null, 40)
                .addSection("content", "<h2>Chars</h2>"),
            new RouteSet("login", "Login", null, 50)
                .addSection("content", "<h2>Login</h2>"),
        ]);
    };
    BankApp.prototype.setupPageSections = function () {
        this.pageController.addSection("head", "header");
        this.pageController.addSection("nav", "nav");
        this.pageController.addSection("content", "content");
        this.pageController.addSection("footer", "footer");
    };
    BankApp.prototype.setupGlobalEvents = function () {
        var _this = this;
        GlobalEvents.addEvent("update_nav", function () { _this.navCard.update(); });
        window.onhashchange = function () {
            _this.mainNavigation.onNavigate();
        };
    };
    return BankApp;
}());
/// <reference path="view/BankApp.ts" />
var app;
$(document).ready(function () {
    app = new BankApp();
    app.start();
});
var Nav;
(function (Nav) {
    function initialize() {
        $(document).ready(function () {
            changeLocation();
        });
        window.onhashchange = changeLocation;
        $("ul#nav li").click(function (el) {
            window.location.hash = $(el.target).find("a").attr("href");
        });
    }
    Nav.initialize = initialize;
    function changeLocation() {
        var newPage = getCurrentNavigation();
        $("li.active").removeClass("active");
        $("." + newPage).addClass("active");
        if (Nav.currentHash == newPage)
            return;
        Nav.currentHash = newPage;
        if (newPage != "raid") {
            $("#content").load("?view=" + newPage);
        }
        else {
            $("#content").html("<iframe style='width:1200px;height:800px;' src='http://localhost/raid'></iframe>");
        }
    }
    function getCurrentNavigation() {
        switch (location.hash) {
            case "#news":
                return "news";
            case "#action":
                return "action";
            case "#request":
                return "request";
            case "#profile":
                return "profile";
            case "#raid":
                return "raid";
            case "#login":
                return "login";
            default:
                return "main";
        }
    }
})(Nav || (Nav = {}));
/// <reference path="nav.ts" />
console.log("Start WoWGuildBankApp");
Nav.initialize();
var Login;
(function (Login) {
    function sendLogin() {
        var username = $("#username").val();
        var password = $("#password").val();
        $.ajax({
            url: "?view=api&e=user",
            data: JSON.stringify({ action: "login", username: username, password: password }),
            contentType: "application/json",
            method: "post",
        }).then(function (data) {
            if (data.success != undefined) {
                console.log("login");
                window.location.href = "?";
            }
            else {
                console.log("login fail");
            }
        });
    }
    Login.sendLogin = sendLogin;
    function sendLogout() {
        $.ajax({
            url: "?view=api&e=user",
            data: JSON.stringify({ action: "logout" }),
            contentType: "application/json",
            method: "post",
        }).then(function (data) {
            if (data.success != undefined) {
                console.log("logout");
                window.location.href = "?";
            }
            else {
                console.log("logout fail");
            }
        });
    }
    Login.sendLogout = sendLogout;
})(Login || (Login = {}));
var Profile;
(function (Profile) {
    function init() {
        console.log("Start Profile JS");
        $('#content_inner').ready(function () {
            $("#char").hide();
            $('#prof').hide();
            Profile.showProfile();
        });
    }
    Profile.init = init;
    function showChars() {
        $("#char").show();
        $('#prof').hide();
        $.ajax({});
    }
    Profile.showChars = showChars;
    function showProfile() {
        $("#char").hide();
        $('#prof').show();
        loadUserInfo();
    }
    Profile.showProfile = showProfile;
    function loadUserInfo() {
        $.get("?view=api&e=user").then(function (data) {
            $("#username").text(data.name);
            $("#email").text(data.email);
            $("#regdate").text(data.registerDate.date);
        });
    }
    function validatePassword() {
        var oldpass = $("input[name='oldpass']").val();
        var newpass = $("input[name='newpass']").val();
        var newpass2 = $("input[name='newpass2']").val();
        if (newpass != newpass2 || newpass == "") {
            alert("Das neu gewählte passwort stimmt nicht mit der widerholung ein!");
            return;
        }
        $.ajax({
            url: "?view=api&e=user",
            method: "put",
            data: JSON.stringify({ old: oldpass, new: newpass, action: 'changepass' }),
            contentType: "application/json",
        }).then(function (data) {
            console.log(data);
        });
    }
    Profile.validatePassword = validatePassword;
    function getCharTemplate(charData) {
        var template = 
        /*html*/
        "<div data-charid='" + charData.userCharId + "' class='chartemplate'>\n        <div class='toprow'>\n            <div class='imgcontainer'>\n                " + charData.charRace + "\n                " + charData.charClass + "\n                " + charData.charRole + "\n                " + charData.charRoleSup + "\n            </div>\n            <div class='infocontainer'>\n                <span class='info_text'>Spieler: " + charData.userId + "</span>\n                <span class='info_text'>Name: " + charData.charName + "</span>\n            </div>\n        </div>\n        <div class='bottomrow'>\n        <span class='info_text'>Beruf 1: " + charData.firstProfession + "</span>\n        <span class='info_text'>Beruf 2: " + charData.secondProfession + "</span>\n        <span class='info_text'>Kochen: " + charData.hasCooking + "</span>\n        <span class='info_text'>Fischen: " + charData.hasFishing + "</span>\n        <span class='info_text'>Erste Hilfe: " + charData.hasFirstAid + "</span>\n        </div>\n        </div>";
        return template;
    }
    Profile.getCharTemplate = getCharTemplate;
})(Profile || (Profile = {}));
