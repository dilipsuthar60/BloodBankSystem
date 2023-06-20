"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.OASEnhancerBindings = void 0;
const core_1 = require("@loopback/core");
var OASEnhancerBindings;
(function (OASEnhancerBindings) {
    /**
     * Strongly-typed binding key for SpecService
     */
    OASEnhancerBindings.OAS_ENHANCER_SERVICE = core_1.BindingKey.create('services.SpecService');
    /**
     * Name/id of the OAS enhancer extension point
     */
    OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME = 'oas-enhancer';
})(OASEnhancerBindings = exports.OASEnhancerBindings || (exports.OASEnhancerBindings = {}));
//# sourceMappingURL=keys.js.map