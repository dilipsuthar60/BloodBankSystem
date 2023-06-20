"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectRoute = void 0;
class RedirectRoute {
    constructor(sourcePath, targetLocation, statusCode = 303) {
        this.sourcePath = sourcePath;
        this.targetLocation = targetLocation;
        this.statusCode = statusCode;
        // ResolvedRoute API
        this.pathParams = [];
        this.schemas = {};
        // RouteEntry implementation
        this.verb = 'get';
        this.spec = {
            description: 'LoopBack Redirect route',
            'x-visibility': 'undocumented',
            responses: {},
        };
        this.path = sourcePath;
    }
    async invokeHandler({ response }, args) {
        response.redirect(this.statusCode, this.targetLocation);
    }
    updateBindings(requestContext) {
        // no-op
    }
    describe() {
        return `Redirect: "${this.sourcePath}" => "${this.targetLocation}"`;
    }
    /**
     * type guard type checker for this class
     * @param obj
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static isRedirectRoute(obj) {
        var _a;
        const redirectOptions = obj;
        if ((redirectOptions === null || redirectOptions === void 0 ? void 0 : redirectOptions.targetLocation) &&
            ((_a = redirectOptions.spec) === null || _a === void 0 ? void 0 : _a.description) === 'LoopBack Redirect route') {
            return true;
        }
        return false;
    }
}
exports.RedirectRoute = RedirectRoute;
//# sourceMappingURL=redirect-route.js.map