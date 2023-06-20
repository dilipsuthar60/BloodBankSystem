"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * The core foundation for LoopBack 4. It can also serve as the platform to
 * build large-scale Node.js applications and frameworks.
 *
 * @remarks
 * For examples of how to leverage `@loopback/core` to build composable and
 * extensible projects, check out the
 * {@link https://loopback.io/doc/en/lb4/core-tutorial.html | core tutorial}.
 *
 * @packageDocumentation
 */
// Re-export public Core API coming from dependencies
tslib_1.__exportStar(require("@loopback/context"), exports);
// Export APIs
tslib_1.__exportStar(require("./application"), exports);
tslib_1.__exportStar(require("./component"), exports);
tslib_1.__exportStar(require("./extension-point"), exports);
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./lifecycle"), exports);
tslib_1.__exportStar(require("./lifecycle-registry"), exports);
tslib_1.__exportStar(require("./mixin-target"), exports);
tslib_1.__exportStar(require("./server"), exports);
tslib_1.__exportStar(require("./service"), exports);
//# sourceMappingURL=index.js.map