"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.asSpecEnhancer = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
/**
 * A binding template for spec contributor extensions
 */
const asSpecEnhancer = binding => {
    (0, core_1.extensionFor)(keys_1.OASEnhancerBindings.OAS_ENHANCER_EXTENSION_POINT_NAME)(binding);
    // is it ok to have a different namespace than the extension point name?
    binding.tag({ namespace: 'oas-enhancer' });
};
exports.asSpecEnhancer = asSpecEnhancer;
//# sourceMappingURL=types.js.map