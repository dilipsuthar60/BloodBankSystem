"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiSpec = void 0;
const validator = require('oas-validator');
const util_1 = require("util");
const validateAsync = (0, util_1.promisify)(validator.validate);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function validateApiSpec(spec) {
    await validateAsync(spec, {});
}
exports.validateApiSpec = validateApiSpec;
//# sourceMappingURL=validate-api-spec.js.map