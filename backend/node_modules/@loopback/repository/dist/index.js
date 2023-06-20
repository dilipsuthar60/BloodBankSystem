"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JugglerDataSource = void 0;
const tslib_1 = require("tslib");
/**
 * A common set of interfaces for interacting with databases.
 *
 * This module provides data access facilities to various databases and services
 * as well as the constructs for modeling and accessing those data.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("@loopback/filter"), exports);
/**
 * Export the DataSource to avoid TypeScript 4.2's complaint about
 * RepositoryMixin as it references `juggler.DataSource`
 */
var loopback_datasource_juggler_1 = require("loopback-datasource-juggler");
Object.defineProperty(exports, "JugglerDataSource", { enumerable: true, get: function () { return loopback_datasource_juggler_1.DataSource; } });
tslib_1.__exportStar(require("./common-types"), exports);
tslib_1.__exportStar(require("./connectors"), exports);
tslib_1.__exportStar(require("./datasource"), exports);
tslib_1.__exportStar(require("./decorators"), exports);
tslib_1.__exportStar(require("./define-model-class"), exports);
tslib_1.__exportStar(require("./define-repository-class"), exports);
tslib_1.__exportStar(require("./errors"), exports);
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./mixins"), exports);
tslib_1.__exportStar(require("./model"), exports);
tslib_1.__exportStar(require("./relations"), exports);
tslib_1.__exportStar(require("./repositories"), exports);
tslib_1.__exportStar(require("./transaction"), exports);
tslib_1.__exportStar(require("./type-resolver"), exports);
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map