"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * A package with utilities to help developers implement
 * {@link https://www.typescriptlang.org/docs/handbook/decorators.html |TypeScript decorators},
 * define/merge metadata, and inspect metadata.
 *
 * @remarks
 * Utilities:
 *
 * - Reflector: Wrapper of
 *   {@link https://github.com/rbuckton/reflect-metadata | reflect-metadata}.
 * - Decorator factories: A set of factories for class/method/property/parameter
 *   decorators to apply metadata to a given class and its static or instance
 *   members.
 * - MetadataInspector: High level APIs to inspect a class and/or its members to
 *   get metadata applied by decorators.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./decorator-factory"), exports);
tslib_1.__exportStar(require("./inspector"), exports);
tslib_1.__exportStar(require("./reflect"), exports);
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map