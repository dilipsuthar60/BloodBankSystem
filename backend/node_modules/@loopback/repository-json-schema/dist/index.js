"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const tslib_1 = require("tslib");
/**
 * Convert a TypeScript class/model to a JSON Schema for users, leveraging
 * LoopBack4's decorators, metadata, and reflection system.
 *
 * @remarks
 * Modules to easily convert LoopBack4 models that have been decorated with
 * `@model` and `@property` to a matching JSON Schema Definition.
 *
 * @packageDocumentation
 */
var repository_1 = require("@loopback/repository");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return repository_1.Model; } });
tslib_1.__exportStar(require("./build-schema"), exports);
tslib_1.__exportStar(require("./filter-json-schema"), exports);
tslib_1.__exportStar(require("./keys"), exports);
//# sourceMappingURL=index.js.map