"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebaseOpenApiSpec = exports.ExternalExpressRoutes = void 0;
const tslib_1 = require("tslib");
const express_1 = require("@loopback/express");
const express_2 = tslib_1.__importDefault(require("express"));
const http_errors_1 = tslib_1.__importDefault(require("http-errors"));
const router_spec_1 = require("./router-spec");
/**
 * A registry of external, Express-style routes. These routes are invoked
 * _after_ no LB4 route (controller or handler based) matched the incoming
 * request.
 *
 * @internal
 */
class ExternalExpressRoutes {
    constructor() {
        this._externalRoutes = express_2.default.Router();
        this._staticRoutes = express_2.default.Router();
        this._specForExternalRoutes = { paths: {} };
    }
    get routerSpec() {
        return this._specForExternalRoutes;
    }
    registerAssets(path, rootDir, options) {
        this._staticRoutes.use(path, express_2.default.static(rootDir, options));
    }
    mountRouter(basePath, router, spec = { paths: {} }) {
        this._externalRoutes.use(basePath, router);
        spec = rebaseOpenApiSpec(spec, basePath);
        (0, router_spec_1.assignRouterSpec)(this._specForExternalRoutes, spec);
    }
    find(request) {
        return new ExternalRoute(this._externalRoutes, this._staticRoutes, request.method, request.url, {
            description: 'External route or a static asset',
            'x-visibility': 'undocumented',
            responses: {},
        });
    }
}
exports.ExternalExpressRoutes = ExternalExpressRoutes;
class ExternalRoute {
    constructor(_externalRouter, _staticAssets, verb, path, spec) {
        this._externalRouter = _externalRouter;
        this._staticAssets = _staticAssets;
        this.verb = verb;
        this.path = path;
        this.spec = spec;
        // ResolvedRoute API
        this.pathParams = [];
        this.schemas = {};
    }
    updateBindings(requestContext) {
        // no-op
    }
    async invokeHandler({ request, response }, args) {
        let handled = await (0, express_1.executeExpressRequestHandler)(this._externalRouter, request, response);
        if (handled)
            return;
        handled = await (0, express_1.executeExpressRequestHandler)(this._staticAssets, request, response);
        if (handled)
            return;
        // Express router called next, which means no route was matched
        throw new http_errors_1.default.NotFound(`Endpoint "${request.method} ${request.path}" not found.`);
    }
    describe() {
        // TODO(bajtos) provide better description for Express routes with spec
        return `External Express route "${this.verb} ${this.path}"`;
    }
}
function rebaseOpenApiSpec(spec, basePath) {
    if (!spec.paths)
        return spec;
    if (!basePath || basePath === '/')
        return spec;
    const localPaths = spec.paths;
    // Don't modify the spec object provided to us.
    spec = Object.assign({}, spec);
    spec.paths = {};
    for (const url in localPaths) {
        spec.paths[`${basePath}${url}`] = localPaths[url];
    }
    return spec;
}
exports.rebaseOpenApiSpec = rebaseOpenApiSpec;
//# sourceMappingURL=external-express-routes.js.map