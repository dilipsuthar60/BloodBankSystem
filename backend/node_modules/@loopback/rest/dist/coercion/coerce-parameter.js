"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceParameter = void 0;
const tslib_1 = require("tslib");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const __1 = require("../");
const parse_json_1 = require("../parse-json");
const ajv_factory_provider_1 = require("../validation/ajv-factory.provider");
const utils_1 = require("./utils");
const validator_1 = require("./validator");
const isRFC3339 = require('validator/lib/isRFC3339');
const debug = (0, debug_1.default)('loopback:rest:coercion');
/**
 * Coerce the http raw data to a JavaScript type data of a parameter
 * according to its OpenAPI schema specification.
 *
 * @param data - The raw data get from http request
 * @param schema - The parameter's schema defined in OpenAPI specification
 * @param options - The ajv validation options
 */
async function coerceParameter(data, spec, options) {
    const schema = extractSchemaFromSpec(spec);
    if (!schema || (0, openapi_v3_1.isReferenceObject)(schema)) {
        debug('The parameter with schema %s is not coerced since schema' +
            'dereference is not supported yet.', schema);
        return data;
    }
    const OAIType = (0, utils_1.getOAIPrimitiveType)(schema.type, schema.format);
    const validator = new validator_1.Validator({ parameterSpec: spec });
    validator.validateParamBeforeCoercion(data);
    if (data === undefined)
        return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = data;
    switch (OAIType) {
        case 'byte':
            result = coerceBuffer(data, spec);
            break;
        case 'date':
            result = coerceDatetime(data, spec, { dateOnly: true });
            break;
        case 'date-time':
            result = coerceDatetime(data, spec);
            break;
        case 'float':
        case 'double':
        case 'number':
            result = coerceNumber(data, spec);
            break;
        case 'long':
            result = coerceInteger(data, spec, { isLong: true });
            break;
        case 'integer':
            result = coerceInteger(data, spec);
            break;
        case 'boolean':
            result = coerceBoolean(data, spec);
            break;
        case 'object':
            result = await coerceObject(data, spec, options);
            break;
        case 'string':
        case 'password':
            result = coerceString(data, spec);
            break;
        case 'array':
            result = coerceArray(data, spec);
            break;
    }
    if (result != null) {
        // For date/date-time/byte, we need to pass the raw string value to AJV
        if (OAIType === 'date' || OAIType === 'date-time' || OAIType === 'byte') {
            await validateParam(spec, data, options);
            return result;
        }
        result = await validateParam(spec, result, options);
    }
    return result;
}
exports.coerceParameter = coerceParameter;
function coerceString(data, spec) {
    if (typeof data !== 'string')
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    debug('data of type string is coerced to %s', data);
    return data;
}
function coerceBuffer(data, spec) {
    if (typeof data === 'object')
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    return Buffer.from(data, 'base64');
}
function coerceDatetime(data, spec, options) {
    if (typeof data === 'object' || (0, utils_1.isEmpty)(data))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    if (options === null || options === void 0 ? void 0 : options.dateOnly) {
        if (!(0, utils_1.matchDateFormat)(data))
            throw __1.RestHttpErrors.invalidData(data, spec.name);
    }
    else {
        if (!isRFC3339(data))
            throw __1.RestHttpErrors.invalidData(data, spec.name);
    }
    const coercedDate = new Date(data);
    if (!(0, utils_1.isValidDateTime)(coercedDate))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    return coercedDate;
}
function coerceNumber(data, spec) {
    if (typeof data === 'object' || (0, utils_1.isEmpty)(data))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    const coercedNum = Number(data);
    if (isNaN(coercedNum))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    debug('data of type number is coerced to %s', coercedNum);
    return coercedNum;
}
function coerceInteger(data, spec, options) {
    if (typeof data === 'object' || (0, utils_1.isEmpty)(data))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    const coercedInt = Number(data);
    if (isNaN(coercedInt))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    if (options === null || options === void 0 ? void 0 : options.isLong) {
        if (!Number.isInteger(coercedInt))
            throw __1.RestHttpErrors.invalidData(data, spec.name);
    }
    else {
        if (!Number.isSafeInteger(coercedInt))
            throw __1.RestHttpErrors.invalidData(data, spec.name);
    }
    debug('data of type integer is coerced to %s', coercedInt);
    return coercedInt;
}
function coerceBoolean(data, spec) {
    if (typeof data === 'object' || (0, utils_1.isEmpty)(data))
        throw __1.RestHttpErrors.invalidData(data, spec.name);
    if ((0, utils_1.isTrue)(data))
        return true;
    if ((0, utils_1.isFalse)(data))
        return false;
    throw __1.RestHttpErrors.invalidData(data, spec.name);
}
async function coerceObject(input, spec, options) {
    const data = parseJsonIfNeeded(input, spec, options);
    if (data == null) {
        // Skip any further checks and coercions, nothing we can do with `undefined`
        return data;
    }
    if (typeof data !== 'object' || Array.isArray(data))
        throw __1.RestHttpErrors.invalidData(input, spec.name);
    return data;
}
function coerceArray(data, spec) {
    if (spec.in === 'query') {
        if (data == null || Array.isArray(data))
            return data;
        return [data];
    }
    return data;
}
function validateParam(spec, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data, options = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS) {
    const schema = extractSchemaFromSpec(spec);
    if (schema) {
        // Apply coercion based on properties defined by spec.schema
        return (0, __1.validateValueAgainstSchema)(data, schema, {}, { ...options, coerceTypes: true, source: 'parameter', name: spec.name });
    }
    return data;
}
/**
 * Extract the schema from an OpenAPI parameter specification. If the root level
 * one not found, search from media type 'application/json'.
 *
 * @param spec The parameter specification
 */
function extractSchemaFromSpec(spec) {
    var _a, _b;
    let schema = spec.schema;
    // If a query parameter is a url encoded Json object,
    // the schema is defined under content['application/json']
    if (!schema && spec.in === 'query') {
        schema = (_b = (_a = spec.content) === null || _a === void 0 ? void 0 : _a['application/json']) === null || _b === void 0 ? void 0 : _b.schema;
    }
    return schema;
}
function parseJsonIfNeeded(data, spec, options) {
    if (typeof data !== 'string')
        return data;
    if (spec.in !== 'query' || (spec.in === 'query' && !spec.content)) {
        debug('Skipping JSON.parse, argument %s is not a url encoded json object query parameter (since content field is missing in parameter schema)', spec.name);
        return data;
    }
    if (data === '') {
        debug('Converted empty string to object value `undefined`');
        return undefined;
    }
    try {
        const result = (0, parse_json_1.parseJson)(data, (0, parse_json_1.sanitizeJsonParse)(undefined, options === null || options === void 0 ? void 0 : options.prohibitedKeys));
        debug('Parsed parameter %s as %j', spec.name, result);
        return result;
    }
    catch (err) {
        debug('Cannot parse %s value %j as JSON: %s', spec.name, data, err.message);
        throw __1.RestHttpErrors.invalidData(data, spec.name, {
            details: {
                syntaxError: err.message,
            },
        });
    }
}
//# sourceMappingURL=coerce-parameter.js.map