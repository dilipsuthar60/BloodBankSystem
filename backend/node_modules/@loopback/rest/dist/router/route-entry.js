"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolvedRoute = void 0;
function createResolvedRoute(route, pathParams) {
    return Object.create(route, {
        pathParams: {
            writable: false,
            value: pathParams,
        },
        schemas: {
            value: {},
        },
    });
}
exports.createResolvedRoute = createResolvedRoute;
//# sourceMappingURL=route-entry.js.map