"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const base_route_1 = require("./base-route");
class Route extends base_route_1.BaseRoute {
    constructor(verb, path, spec, _handler) {
        super(verb, path, spec);
        this.spec = spec;
        this._handler = _handler;
    }
    describe() {
        return `${super.describe()} => ${this._handler.name || this._handler.toString()}`;
    }
    updateBindings(requestContext) {
        requestContext.bind(keys_1.RestBindings.OPERATION_SPEC_CURRENT).to(this.spec);
    }
    async invokeHandler(requestContext, args) {
        // Use `invokeMethodWithInterceptors` to invoke the handler function so
        // that global interceptors are applied
        return (0, core_1.invokeMethodWithInterceptors)(requestContext, this, '_handler', args, { source: new base_route_1.RouteSource(this) });
    }
}
exports.Route = Route;
//# sourceMappingURL=handler-route.js.map