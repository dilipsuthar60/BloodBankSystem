"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Common types/interfaces for LoopBack 4 security including authentication and
 * authorization.
 *
 * @remarks
 * - Subject
 *   - It's the "who" for security
 *   - contains a set of Principles, a set of Credentials, and a set of
 *     Permissions
 * - Principle
 *   - Represent a user, an application, or a device
 * - Credential
 *   - Security attributes used to authenticate the subject. Such credentials
 *     include passwords, Kerberos tickets, and public key certificates.
 * - Permission
 *   - It's the what for security.
 *
 * @packageDocumentation
 */
tslib_1.__exportStar(require("./keys"), exports);
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map