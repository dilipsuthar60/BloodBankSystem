"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Getter = exports.RelationType = void 0;
var RelationType;
(function (RelationType) {
    RelationType["belongsTo"] = "belongsTo";
    RelationType["hasOne"] = "hasOne";
    RelationType["hasMany"] = "hasMany";
    RelationType["embedsOne"] = "embedsOne";
    RelationType["embedsMany"] = "embedsMany";
    RelationType["referencesOne"] = "referencesOne";
    RelationType["referencesMany"] = "referencesMany";
})(RelationType = exports.RelationType || (exports.RelationType = {}));
// Re-export Getter so that users don't have to import from @loopback/context
var core_1 = require("@loopback/core");
Object.defineProperty(exports, "Getter", { enumerable: true, get: function () { return core_1.Getter; } });
//# sourceMappingURL=relation.types.js.map