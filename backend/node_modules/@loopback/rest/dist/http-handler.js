"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHandler = void 0;
const keys_1 = require("./keys");
const request_context_1 = require("./request-context");
const router_1 = require("./router");
class HttpHandler {
    constructor(_rootContext, _serverConfig, _routes = new router_1.RoutingTable()) {
        this._rootContext = _rootContext;
        this._serverConfig = _serverConfig;
        this._routes = _routes;
        this.handleRequest = (req, res) => this._handleRequest(req, res);
    }
    registerController(spec, controllerCtor, controllerFactory) {
        this._routes.registerController(spec, controllerCtor, controllerFactory);
    }
    registerRoute(route) {
        this._routes.registerRoute(route);
    }
    /**
     * @deprecated Use `registerApiComponents`
     * @param defs Schemas
     */
    registerApiDefinitions(defs) {
        this.registerApiComponents({ schemas: defs });
    }
    /**
     * Merge components into the OpenApi spec
     * @param defs - Components
     */
    registerApiComponents(defs) {
        var _a;
        this._openApiComponents = (_a = this._openApiComponents) !== null && _a !== void 0 ? _a : {};
        for (const p in defs) {
            // Merge each child, such as `schemas`, `parameters`, and `headers`
            this._openApiComponents[p] = { ...this._openApiComponents[p], ...defs[p] };
        }
    }
    getApiComponents() {
        return this._openApiComponents;
    }
    /**
     * @deprecated Use `getApiComponents`
     */
    getApiDefinitions() {
        var _a;
        return (_a = this._openApiComponents) === null || _a === void 0 ? void 0 : _a.schemas;
    }
    describeApiPaths() {
        return this._routes.describeApiPaths();
    }
    findRoute(request) {
        const route = this._routes.find(request);
        Object.assign(route.schemas, this.getApiDefinitions());
        return route;
    }
    async _handleRequest(request, response) {
        const requestContext = new request_context_1.RequestContext(request, response, this._rootContext, this._serverConfig);
        const sequence = await requestContext.get(keys_1.RestBindings.SEQUENCE);
        await sequence.handle(requestContext);
    }
}
exports.HttpHandler = HttpHandler;
//# sourceMappingURL=http-handler.js.map