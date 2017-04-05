"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
let globalConsoleStack = null;
let originalConsoleDebug;
let originalConsoleLog;
let originalConsoleWarn;
let originalConsoleError;
function _push(logger) {
    if (globalConsoleStack.length == 0) {
        originalConsoleDebug = console.debug; // Some environment (node) don't have debug.
        originalConsoleLog = console.log;
        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;
        console.debug = (msg, ...args) => {
            globalConsoleStack[globalConsoleStack.length - 1].debug(msg, { args });
        };
        console.log = (msg, ...args) => {
            globalConsoleStack[globalConsoleStack.length - 1].info(msg, { args });
        };
        console.warn = (msg, ...args) => {
            globalConsoleStack[globalConsoleStack.length - 1].warn(msg, { args });
        };
        console.error = (msg, ...args) => {
            globalConsoleStack[globalConsoleStack.length - 1].error(msg, { args });
        };
    }
    globalConsoleStack.push(logger);
    return logger;
}
function _pop() {
    globalConsoleStack[globalConsoleStack.length - 1].complete();
    globalConsoleStack.pop();
    if (globalConsoleStack.length == 0) {
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
        console.debug = originalConsoleDebug; // Some environment (node) don't have debug.
        globalConsoleStack = null;
    }
}
class ConsoleLoggerStack {
    static push(nameOrLogger = '', ...args) {
        if (typeof nameOrLogger == 'string') {
            return _push(new logger_1.Logger(nameOrLogger, this.top()));
        }
        else if (nameOrLogger instanceof logger_1.Logger) {
            const logger = nameOrLogger;
            if (logger.parent !== this.top()) {
                throw new Error('Pushing a logger that is not a direct child of the top of the stack.');
            }
            return _push(logger);
        }
        else {
            const klass = nameOrLogger;
            return _push(new klass(...args, this.top()));
        }
    }
    static pop() {
        _pop();
        return this.top();
    }
    static top() {
        return globalConsoleStack && globalConsoleStack[globalConsoleStack.length - 1];
    }
    static start(nameOrLogger = '', ...args) {
        if (globalConsoleStack !== null) {
            throw new Error('Cannot start a new console logger stack while one is already going.');
        }
        globalConsoleStack = [];
        if (typeof nameOrLogger == 'string') {
            return _push(new logger_1.Logger(nameOrLogger, this.top()));
        }
        else if (nameOrLogger instanceof logger_1.Logger) {
            return _push(nameOrLogger);
        }
        else {
            const klass = nameOrLogger;
            return _push(new klass(...args, this.top()));
        }
    }
    static end() {
        while (globalConsoleStack !== null) {
            this.pop();
        }
    }
}
exports.ConsoleLoggerStack = ConsoleLoggerStack;
//# sourceMappingURL=/users/mikkeldamm/forked-repos/angular-cli/src/console-logger-stack.js.map