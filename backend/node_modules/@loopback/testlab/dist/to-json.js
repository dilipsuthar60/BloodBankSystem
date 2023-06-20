"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = void 0;
function toJSON(value) {
    return JSON.parse(JSON.stringify({ value })).value;
}
exports.toJSON = toJSON;
//# sourceMappingURL=to-json.js.map