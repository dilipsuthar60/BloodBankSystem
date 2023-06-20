"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateValueAgainstSchema = exports.validateRequestBody = void 0;
const tslib_1 = require("tslib");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const util_1 = tslib_1.__importDefault(require("util"));
const __1 = require("..");
const ajv_factory_provider_1 = require("./ajv-factory.provider");
const toJsonSchema = require('@openapi-contrib/openapi-schema-to-json-schema');
const debug = (0, debug_1.default)('loopback:rest:validation');
/**
 * Check whether the request body is valid according to the provided OpenAPI schema.
 * The JSON schema is generated from the OpenAPI schema which is typically defined
 * by `@requestBody()`.
 * The validation leverages AJV schema validator.
 * @param body - The request body parsed from an HTTP request.
 * @param requestBodySpec - The OpenAPI requestBody specification defined in `@requestBody()`.
 * @param globalSchemas - The referenced schemas generated from `OpenAPISpec.components.schemas`.
 * @param options - Request body validation options for AJV
 */
async function validateRequestBody(body, requestBodySpec, globalSchemas = {}, options = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS) {
    const required = requestBodySpec === null || requestBodySpec === void 0 ? void 0 : requestBodySpec.required;
    if (required && body.value == null) {
        const err = Object.assign(new __1.HttpErrors.BadRequest('Request body is required'), {
            code: 'MISSING_REQUIRED_PARAMETER',
            parameterName: 'request body',
        });
        throw err;
    }
    if (!required && !body.value)
        return;
    const schema = body.schema;
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Request body schema:', util_1.default.inspect(schema, { depth: null }));
        if (schema &&
            (0, openapi_v3_1.isReferenceObject)(schema) &&
            schema.$ref.startsWith('#/components/schemas/')) {
            const ref = schema.$ref.slice('#/components/schemas/'.length);
            debug('  referencing:', util_1.default.inspect(globalSchemas[ref], { depth: null }));
        }
    }
    if (!schema)
        return;
    options = { coerceTypes: !!body.coercionRequired, ...options };
    await validateValueAgainstSchema(body.value, schema, globalSchemas, {
        ...options,
        source: 'body',
    });
}
exports.validateRequestBody = validateRequestBody;
/**
 * Convert an OpenAPI schema to the corresponding JSON schema.
 * @param openapiSchema - The OpenAPI schema to convert.
 */
function convertToJsonSchema(openapiSchema) {
    const jsonSchema = toJsonSchema(openapiSchema);
    delete jsonSchema['$schema'];
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Converted OpenAPI schema to JSON schema: %s', util_1.default.inspect(jsonSchema, { depth: null }));
    }
    return jsonSchema;
}
/**
 * Built-in cache for complied schemas by AJV
 */
const DEFAULT_COMPILED_SCHEMA_CACHE = new WeakMap();
/**
 * Build a cache key for AJV options
 * @param options - Request body validation options
 */
function getKeyForOptions(options = ajv_factory_provider_1.DEFAULT_AJV_VALIDATION_OPTIONS) {
    const ajvOptions = {};
    // Sort keys for options
    const keys = Object.keys(options).sort();
    for (const k of keys) {
        if (k === 'compiledSchemaCache')
            continue;
        ajvOptions[k] = options[k];
    }
    return JSON.stringify(ajvOptions);
}
/**
 * Validate the value against JSON schema.
 * @param value - The data value.
 * @param schema - The JSON schema used to perform the validation.
 * @param globalSchemas - Schema references.
 * @param options - Value validation options.
 */
async function validateValueAgainstSchema(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value, schema, globalSchemas = {}, options = {}) {
    var _a, _b, _c;
    let validate;
    const cache = (_a = options.compiledSchemaCache) !== null && _a !== void 0 ? _a : DEFAULT_COMPILED_SCHEMA_CACHE;
    const key = getKeyForOptions(options);
    let validatorMap;
    if (cache.has(schema)) {
        validatorMap = cache.get(schema);
        validate = validatorMap.get(key);
    }
    if (!validate) {
        const ajvFactory = (_b = options.ajvFactory) !== null && _b !== void 0 ? _b : new ajv_factory_provider_1.AjvFactoryProvider(options).value();
        const ajvInst = ajvFactory(options);
        validate = createValidator(schema, globalSchemas, ajvInst);
        validatorMap = validatorMap !== null && validatorMap !== void 0 ? validatorMap : new Map();
        validatorMap.set(key, validate);
        cache.set(schema, validatorMap);
    }
    let validationErrors = [];
    try {
        const validationResult = validate(value);
        debug(`Value from ${options.source} passed AJV validation.`, validationResult);
        return await validationResult;
    }
    catch (error) {
        validationErrors = error.errors;
    }
    /* istanbul ignore if */
    if (debug.enabled) {
        debug('Invalid value: %s. Errors: %s', util_1.default.inspect(value, { depth: null }), util_1.default.inspect(validationErrors));
    }
    if (typeof options.ajvErrorTransformer === 'function') {
        validationErrors = options.ajvErrorTransformer(validationErrors);
    }
    // Throw invalid request body error
    if (options.source === 'body') {
        const error = __1.RestHttpErrors.invalidRequestBody(buildErrorDetails(validationErrors));
        throw error;
    }
    // Throw invalid value error
    const error = __1.RestHttpErrors.invalidData(value, (_c = options.name) !== null && _c !== void 0 ? _c : '(unknown)', {
        details: buildErrorDetails(validationErrors),
    });
    throw error;
}
exports.validateValueAgainstSchema = validateValueAgainstSchema;
function buildErrorDetails(validationErrors) {
    return validationErrors.map((e) => {
        var _a;
        return {
            path: e.instancePath,
            code: e.keyword,
            message: (_a = e.message) !== null && _a !== void 0 ? _a : `must pass validation rule ${e.keyword}`,
            info: e.params,
        };
    });
}
/**
 * Create a validate function for the given schema
 * @param schema - JSON schema for the target
 * @param globalSchemas - Global schemas
 * @param ajvInst - An instance of Ajv
 */
function createValidator(schema, globalSchemas = {}, ajvInst) {
    const jsonSchema = convertToJsonSchema(schema);
    // Clone global schemas to set `$async: true` flag
    const schemas = {};
    for (const name in globalSchemas) {
        // See https://github.com/loopbackio/loopback-next/issues/4939
        schemas[name] = { ...globalSchemas[name], $async: true };
    }
    const schemaWithRef = { components: { schemas }, ...jsonSchema };
    // See https://js.org/#asynchronous-validation for async validation
    schemaWithRef.$async = true;
    return ajvInst.compile(schemaWithRef);
}
//# sourceMappingURL=request-body.validator.js.map