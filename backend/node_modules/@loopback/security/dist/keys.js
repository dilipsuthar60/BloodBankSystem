"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityBindings = void 0;
const core_1 = require("@loopback/core");
/**
 * Binding keys for security related metadata
 */
var SecurityBindings;
(function (SecurityBindings) {
    /**
     * Binding key for subject
     */
    SecurityBindings.SUBJECT = core_1.BindingKey.create('security.subject');
    /**
     * Binding key for current user profile
     */
    SecurityBindings.USER = core_1.BindingKey.create('security.user');
})(SecurityBindings = exports.SecurityBindings || (exports.SecurityBindings = {}));
//# sourceMappingURL=keys.js.map