"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * A LoopBack 4 component for authentication support.
 *
 * @remarks
 * The core logic for the authentication layer in LoopBack 4.
 *
 * It contains:
 *
 *  - A decorator to express an authentication requirement on controller methods
 *  - A provider to access method-level authentication metadata
 *  - An action in the REST sequence to enforce authentication
 *  - An extension point to discover all authentication strategies and handle
 *    the delegation
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./authentication.component"), exports);
tslib_1.__exportStar(require("./decorators"), exports);
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./providers"), exports);
tslib_1.__exportStar(require("./services"), exports);
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map