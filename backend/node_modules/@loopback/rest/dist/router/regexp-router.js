"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegExpRouter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const path_to_regexp_1 = require("path-to-regexp");
const util_1 = require("util");
const keys_1 = require("../keys");
const openapi_path_1 = require("./openapi-path");
const route_entry_1 = require("./route-entry");
const route_sort_1 = require("./route-sort");
const router_base_1 = require("./router-base");
const debug = require('debug')('loopback:rest:router:regexp');
/**
 * Router implementation based on regexp matching
 */
let RegExpRouter = class RegExpRouter extends router_base_1.BaseRouter {
    _sort() {
        if (!this._sorted) {
            this.routes.sort(route_sort_1.compareRoute);
            this._sorted = true;
        }
    }
    constructor(options) {
        super(options);
        this.routes = [];
    }
    addRouteWithPathVars(route) {
        const path = (0, openapi_path_1.toExpressPath)(route.path);
        const keys = [];
        const regexp = (0, path_to_regexp_1.pathToRegexp)(path, keys, {
            strict: this.options.strict,
            end: true,
        });
        const entry = Object.assign(route, { keys, regexp });
        this.routes.push(entry);
        this._sorted = false;
    }
    findRouteWithPathVars(verb, path) {
        this._sort();
        for (const r of this.routes) {
            debug('trying endpoint %s', (0, util_1.inspect)(r, { depth: 5 }));
            if (r.verb !== verb.toLowerCase()) {
                debug(' -> verb mismatch');
                continue;
            }
            const match = r.regexp.exec(path);
            if (!match) {
                debug(' -> path mismatch');
                continue;
            }
            const pathParams = this._buildPathParams(r, match);
            debug(' -> found with params: %j', pathParams);
            return (0, route_entry_1.createResolvedRoute)(r, pathParams);
        }
        return undefined;
    }
    listRoutesWithPathVars() {
        this._sort();
        return this.routes;
    }
    _buildPathParams(route, pathMatch) {
        const pathParams = {};
        for (const ix in route.keys) {
            const key = route.keys[ix];
            const matchIndex = +ix + 1;
            pathParams[key.name] = pathMatch[matchIndex];
        }
        return pathParams;
    }
};
RegExpRouter = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.ROUTER_OPTIONS, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], RegExpRouter);
exports.RegExpRouter = RegExpRouter;
//# sourceMappingURL=regexp-router.js.map