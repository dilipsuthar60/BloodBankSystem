"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeFieldIfNot = void 0;
const lodash_1 = require("lodash");
function includeFieldIfNot(fields, fieldToInclude) {
    if (!fields) {
        return false;
    }
    else if (Array.isArray(fields)) {
        const fieldsCloned = fields.reduce((prev, current) => ({ ...prev, [current]: true }), {});
        if (Object.keys(fieldsCloned).length > 0) {
            if (fieldsCloned[fieldToInclude] === true) {
                return false;
            }
            fieldsCloned[fieldToInclude] = true;
            return fieldsCloned;
        }
        return false;
    }
    const fieldsCloned = (0, lodash_1.cloneDeep)(fields);
    if (Object.keys(fieldsCloned).length > 0) {
        let containsTrue = false;
        for (const k in fieldsCloned) {
            if (fieldsCloned[k] === true) {
                containsTrue = true;
            }
        }
        for (const k in fieldsCloned) {
            if (k === fieldToInclude) {
                if (fieldsCloned[k] === true) {
                    return false;
                }
                else {
                    if (containsTrue) {
                        fieldsCloned[k] = true;
                    }
                    else {
                        delete fieldsCloned[k];
                    }
                    return fieldsCloned;
                }
            }
        }
        if (containsTrue) {
            fieldsCloned[fieldToInclude] = true;
            return fieldsCloned;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
exports.includeFieldIfNot = includeFieldIfNot;
//# sourceMappingURL=relation.filter.solver.js.map