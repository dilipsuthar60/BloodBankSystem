"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteSource = exports.BaseRoute = void 0;
/**
 * Base implementation of RouteEntry
 */
class BaseRoute {
    /**
     * Construct a new route
     * @param verb - http verb
     * @param path - http request path pattern
     * @param spec - OpenAPI operation spec
     */
    constructor(verb, path, spec) {
        this.path = path;
        this.spec = spec;
        this.verb = verb.toLowerCase();
    }
    describe() {
        return `${this.verb} ${this.path}`;
    }
    toString() {
        return `${this.constructor.name} - ${this.describe()}`;
    }
}
exports.BaseRoute = BaseRoute;
class RouteSource {
    constructor(value) {
        this.value = value;
        this.type = 'route';
    }
    toString() {
        return this.value.toString();
    }
}
exports.RouteSource = RouteSource;
//# sourceMappingURL=base-route.js.map