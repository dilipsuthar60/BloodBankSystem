"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const http_1 = tslib_1.__importDefault(require("http"));
const https_1 = tslib_1.__importDefault(require("https"));
const os_1 = tslib_1.__importDefault(require("os"));
const stoppable_1 = tslib_1.__importDefault(require("stoppable"));
const debug = (0, debug_1.default)('loopback:http-server');
/**
 * HTTP / HTTPS server used by LoopBack's RestServer
 */
class HttpServer {
    /**
     * @param requestListener
     * @param serverOptions
     */
    constructor(requestListener, serverOptions) {
        var _a;
        this._listening = false;
        debug('Http server options', serverOptions);
        this.requestListener = requestListener;
        this.serverOptions = {
            port: 0,
            host: undefined,
            ...serverOptions,
        };
        if (this.serverOptions.path) {
            debug('Http server with IPC path %s', this.serverOptions.path);
            const ipcPath = this.serverOptions.path;
            checkNamedPipe(ipcPath);
            // Remove `port` so that `path` is honored
            delete this.serverOptions.port;
        }
        this._protocol = serverOptions ? (_a = serverOptions.protocol) !== null && _a !== void 0 ? _a : 'http' : 'http';
        if (this._protocol === 'https') {
            this.server = https_1.default.createServer(this.serverOptions, this.requestListener);
        }
        else {
            this.server = http_1.default.createServer(this.requestListener);
        }
        // Apply server properties
        const { keepAliveTimeout, headersTimeout, maxConnections, maxHeadersCount, timeout, } = this.serverOptions;
        if (keepAliveTimeout) {
            this.server.keepAliveTimeout = keepAliveTimeout;
        }
        if (headersTimeout) {
            this.server.headersTimeout = headersTimeout;
        }
        if (maxConnections) {
            this.server.maxConnections = maxConnections;
        }
        if (maxHeadersCount) {
            this.server.maxHeadersCount = maxHeadersCount;
        }
        if (timeout) {
            this.server.timeout = timeout;
        }
        // Set up graceful stop for http server
        if (typeof this.serverOptions.gracePeriodForClose === 'number') {
            debug('Http server gracePeriodForClose %d', this.serverOptions.gracePeriodForClose);
            this._stoppable = (0, stoppable_1.default)(this.server, this.serverOptions.gracePeriodForClose);
        }
    }
    /**
     * Starts the HTTP / HTTPS server
     */
    async start() {
        debug('Starting http server', this.serverOptions);
        this.server.listen(this.serverOptions);
        await (0, events_1.once)(this.server, 'listening');
        this._listening = true;
        const address = this.server.address();
        (0, assert_1.default)(address != null);
        this._address = address;
        debug('Http server is listening on', this.url);
    }
    /**
     * Stops the HTTP / HTTPS server
     */
    async stop() {
        if (!this._listening)
            return;
        debug('Stopping http server');
        if (this._stoppable != null) {
            debug('Stopping http server with graceful close');
            this._stoppable.stop();
        }
        else {
            this.server.close();
        }
        await (0, events_1.once)(this.server, 'close');
        this._listening = false;
        debug('Http server is stopped');
    }
    /**
     * Protocol of the HTTP / HTTPS server
     */
    get protocol() {
        return this._protocol;
    }
    /**
     * Port number of the HTTP / HTTPS server
     */
    get port() {
        var _a;
        if (typeof this._address === 'string')
            return 0;
        return ((_a = this._address) === null || _a === void 0 ? void 0 : _a.port) || this.serverOptions.port;
    }
    /**
     * Host of the HTTP / HTTPS server
     */
    get host() {
        var _a;
        if (typeof this._address === 'string')
            return undefined;
        return ((_a = this._address) === null || _a === void 0 ? void 0 : _a.address) || this.serverOptions.host;
    }
    /**
     * URL of the HTTP / HTTPS server
     */
    get url() {
        if (typeof this._address === 'string') {
            /* istanbul ignore if */
            if (isWin32()) {
                return this._address;
            }
            const basePath = encodeURIComponent(this._address);
            return `${this.protocol}+unix://${basePath}`;
        }
        let host = this.host;
        if ([6, 'IPv6'].includes(this._address.family)) {
            if (host === '::')
                host = '::1';
            host = `[${host}]`;
        }
        else if (host === '0.0.0.0') {
            host = '127.0.0.1';
        }
        return `${this._protocol}://${host}:${this.port}`;
    }
    /**
     * State of the HTTP / HTTPS server
     */
    get listening() {
        return this._listening;
    }
    /**
     * Address of the HTTP / HTTPS server
     */
    get address() {
        return this._listening ? this._address : undefined;
    }
}
exports.HttpServer = HttpServer;
/**
 * Makes sure `path` conform to named pipe naming requirement on Windows
 *
 * See https://nodejs.org/api/net.html#net_identifying_paths_for_ipc_connections
 *
 * @param ipcPath - Named pipe path
 */
function checkNamedPipe(ipcPath) {
    /* istanbul ignore if */
    if (isWin32()) {
        const pipes = ['\\\\?\\pipe\\', '\\\\.\\pipe\\'];
        (0, assert_1.default)(pipes.some(p => ipcPath.startsWith(p)), `Named pipe ${ipcPath} does NOT start with + ${pipes.join(' or ')}`);
    }
}
/**
 * Check if it's Windows OS
 */
function isWin32() {
    return os_1.default.platform() === 'win32';
}
//# sourceMappingURL=http-server.js.map