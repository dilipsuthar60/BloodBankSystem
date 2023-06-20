"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolidationEnhancer = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const json_schema_compare_1 = tslib_1.__importDefault(require("json-schema-compare"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const debug = (0, debug_1.default)('loopback:openapi:spec-enhancer:consolidate');
/**
 * This enhancer consolidates schemas into `/components/schemas` and replaces
 * instances of said schema with a $ref pointer.
 *
 * Please note that the title property must be set on a schema in order to be
 * considered for consolidation.
 *
 * For example, with the following schema instance:
 *
 * ```json
 * schema: {
 *   title: 'loopback.example',
 *   properties: {
 *     test: {
 *       type: 'string',
 *     },
 *   },
 * }
 * ```
 *
 * The consolidator will copy the schema body to
 * `/components/schemas/loopback.example` and replace any instance of the schema
 * with a reference to the component schema as follows:
 *
 * ```json
 * schema: {
 *   $ref: '#/components/schemas/loopback.example',
 * }
 * ```
 *
 * When comparing schemas to avoid naming collisions, the description field
 * is ignored.
 */
let ConsolidationEnhancer = class ConsolidationEnhancer {
    constructor(config) {
        var _a, _b, _c;
        this.config = config;
        this.name = 'consolidate';
        this.disabled = ((_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.rest) === null || _b === void 0 ? void 0 : _b.openApiSpec) === null || _c === void 0 ? void 0 : _c.consolidate) === false;
    }
    modifySpec(spec) {
        return !this.disabled ? this.consolidateSchemaObjects(spec) : spec;
    }
    /**
     * Recursively search OpenApiSpec PathsObject for SchemaObjects with title
     * property. Moves reusable schema bodies to #/components/schemas and replace
     * with json pointer. It handles title collisions with schema body comparision.
     */
    consolidateSchemaObjects(spec) {
        // use 'paths' as crawl root
        this.recursiveWalk(spec.paths, ['paths'], spec);
        return spec;
    }
    recursiveWalk(rootSchema, parentPath, spec) {
        if (this.isTraversable(rootSchema)) {
            Object.entries(rootSchema).forEach(([key, subSchema]) => {
                if (subSchema) {
                    this.recursiveWalk(subSchema, parentPath.concat(key), spec);
                    this.processSchema(subSchema, parentPath.concat(key), spec);
                }
            });
        }
    }
    /**
     * Carry out schema consolidation after tree traversal. If 'title' property
     * set then we consider current schema for consolidation. SchemaObjects with
     * properties (and title set) are moved to #/components/schemas/<title> and
     * replaced with ReferenceObject.
     *
     * Features:
     *  - name collision protection
     *
     * @param schema - current schema element to process
     * @param parentPath - path object to parent
     * @param spec - subject OpenApi specification
     */
    processSchema(schema, parentPath, spec) {
        const schemaObj = this.ifConsolidationCandidate(schema);
        if (schemaObj) {
            // name collison protection
            let instanceNo = 1;
            let title = schemaObj.title;
            let refSchema = this.getRefSchema(title, spec);
            while (refSchema &&
                !(0, json_schema_compare_1.default)(schemaObj, refSchema, {
                    ignore: ['description'],
                })) {
                title = `${schemaObj.title}${instanceNo++}`;
                refSchema = this.getRefSchema(title, spec);
            }
            if (!refSchema) {
                debug('Creating new component $ref with schema %j', schema);
                this.patchRef(title, schema, spec);
            }
            debug('Creating link to $ref %j', title);
            this.patchPath(title, parentPath, spec);
        }
    }
    getRefSchema(name, spec) {
        const schema = lodash_1.default.get(spec, ['components', 'schemas', name]);
        return schema;
    }
    patchRef(name, value, spec) {
        lodash_1.default.set(spec, ['components', 'schemas', name], value);
    }
    patchPath(name, path, spec) {
        const patch = {
            $ref: `#/components/schemas/${name}`,
        };
        lodash_1.default.set(spec, path, patch);
    }
    ifConsolidationCandidate(schema) {
        // use title to discriminate references
        return (0, openapi_v3_1.isSchemaObject)(schema) && schema.properties && schema.title
            ? schema
            : undefined;
    }
    isTraversable(schema) {
        return schema && typeof schema === 'object' ? true : false;
    }
};
ConsolidationEnhancer = tslib_1.__decorate([
    (0, core_1.injectable)(openapi_v3_1.asSpecEnhancer, { scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_CONFIG, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], ConsolidationEnhancer);
exports.ConsolidationEnhancer = ConsolidationEnhancer;
//# sourceMappingURL=consolidate.spec-enhancer.js.map