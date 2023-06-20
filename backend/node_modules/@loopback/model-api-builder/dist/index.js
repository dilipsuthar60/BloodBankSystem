"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/model-api-builder
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * A packge with types and helpers for packages contributing Model API builders.
 *
 * @remarks
 * Provides a contract for extensions that contribute builders for repositories
 * and controllers. Users provide both the model class and an extension. The
 * extension is then used to build their repository and controller based on the
 * model class.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./model-api-builder"), exports);
tslib_1.__exportStar(require("./model-api-config"), exports);
//# sourceMappingURL=index.js.map