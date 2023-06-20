"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const http_server_1 = require("@loopback/http-server");
const debug_1 = tslib_1.__importDefault(require("debug"));
const express_1 = tslib_1.__importDefault(require("express"));
const middleware_1 = require("./middleware");
const middleware_registry_1 = require("./middleware-registry");
const types_1 = require("./types");
const debug = (0, debug_1.default)('loopback:middleware');
/**
 * An Express server that provides middleware composition and injection
 */
let ExpressServer = class ExpressServer extends middleware_registry_1.BaseMiddlewareRegistry {
    constructor(config, parent) {
        var _a;
        super(parent);
        this.config = config;
        this.scope = core_1.BindingScope.SERVER;
        let basePath = (_a = config === null || config === void 0 ? void 0 : config.basePath) !== null && _a !== void 0 ? _a : '';
        // Trim leading and trailing `/`
        basePath = basePath.replace(/(^\/)|(\/$)/, '');
        if (basePath)
            basePath = '/' + basePath;
        this.basePath = basePath;
        this.expressApp = (0, express_1.default)();
        if (config === null || config === void 0 ? void 0 : config.settings) {
            for (const p in config === null || config === void 0 ? void 0 : config.settings) {
                this.expressApp.set(p, config === null || config === void 0 ? void 0 : config.settings[p]);
            }
        }
        this.httpServer = new http_server_1.HttpServer(this.expressApp, config);
        // Set up the middleware chain as the 1st Express middleware
        this.expressApp.use(this.basePath, (0, middleware_1.toExpressMiddleware)(this));
    }
    /**
     * Some of the methods below are copied from RestServer
     * TODO(rfeng): We might want to refactor some methods from RestServer into
     * the base ExpressServer.
     */
    get listening() {
        return this.httpServer ? this.httpServer.listening : false;
    }
    /**
     * The base url for the server, including the basePath if set. For example,
     * the value will be 'http://localhost:3000/api' if `basePath` is set to
     * '/api'.
     */
    get url() {
        let serverUrl = this.rootUrl;
        if (!serverUrl)
            return serverUrl;
        serverUrl = serverUrl + this.basePath;
        return serverUrl;
    }
    /**
     * The root url for the server without the basePath. For example, the value
     * will be 'http://localhost:3000' regardless of the `basePath`.
     */
    get rootUrl() {
        var _a;
        return (_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.url;
    }
    async start() {
        await this.httpServer.start();
        debug('ExpressServer listening at %s', this.httpServer.url);
    }
    stop() {
        return this.httpServer.stop();
    }
    /**
     * Retrieve the middleware context from the request
     * @param request - Request object
     */
    getMiddlewareContext(request) {
        return (0, types_1.getMiddlewareContext)(request);
    }
};
ExpressServer = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_CONFIG.deepProperty('express'))),
    tslib_1.__param(1, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Context])
], ExpressServer);
exports.ExpressServer = ExpressServer;
//# sourceMappingURL=express.server.js.map