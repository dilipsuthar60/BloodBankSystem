"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * The Express integration package for loopback-next.
 *
 * @remarks
 *
 * This module introduces Koa style cascading middleware that leverage
 * `async/await`. It also enables the ability to plug in existing Express
 * middleware as LoopBack middleware or interceptors so that they can be used at
 * sequence/action, global interceptor, and local interceptor tiers.
 *
 * This module also serves as a standalone extension to Express to provide
 * extensibility and composability for large-scale Express applications by
 * leveraging LoopBack's Dependency Injection and Extension Point/Extension
 * pattern.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./express.application"), exports);
tslib_1.__exportStar(require("./express.server"), exports);
tslib_1.__exportStar(require("./group-sorter"), exports);
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./middleware"), exports);
tslib_1.__exportStar(require("./middleware-interceptor"), exports);
tslib_1.__exportStar(require("./middleware-registry"), exports);
tslib_1.__exportStar(require("./mixins/middleware.mixin"), exports);
tslib_1.__exportStar(require("./providers/invoke-middleware.provider"), exports);
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map