"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhereSchemaFor = exports.getFilterSchemaFor = void 0;
const repository_json_schema_1 = require("@loopback/repository-json-schema");
const openapi3_ts_1 = require("openapi3-ts");
const json_to_schema_1 = require("./json-to-schema");
/**
 * Build an OpenAPI schema describing the format of the "filter" object
 * used to query model instances.
 *
 * Note we don't take the model properties into account yet and return
 * a generic json schema allowing any "where" condition.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 * @param options - Options to build the filter schema.
 */
function getFilterSchemaFor(modelCtor, options) {
    const jsonSchema = (0, repository_json_schema_1.getFilterJsonSchemaFor)(modelCtor, options);
    const schema = (0, json_to_schema_1.jsonToSchemaObject)(jsonSchema);
    if ((0, openapi3_ts_1.isSchemaObject)(schema)) {
        schema['x-typescript-type'] = `@loopback/repository#Filter<${modelCtor.name}>`;
    }
    return schema;
}
exports.getFilterSchemaFor = getFilterSchemaFor;
/**
 * Build a OpenAPI schema describing the format of the "where" object
 * used to filter model instances to query, update or delete.
 *
 * Note we don't take the model properties into account yet and return
 * a generic json schema allowing any "where" condition.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 */
function getWhereSchemaFor(modelCtor) {
    const jsonSchema = (0, repository_json_schema_1.getWhereJsonSchemaFor)(modelCtor);
    const schema = (0, json_to_schema_1.jsonToSchemaObject)(jsonSchema);
    if ((0, openapi3_ts_1.isSchemaObject)(schema)) {
        schema['x-typescript-type'] = `@loopback/repository#Where<${modelCtor.name}>`;
    }
    return schema;
}
exports.getWhereSchemaFor = getWhereSchemaFor;
//# sourceMappingURL=filter-schema.js.map