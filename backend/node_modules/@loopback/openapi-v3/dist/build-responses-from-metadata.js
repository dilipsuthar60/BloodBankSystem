"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponsesFromMetadata = void 0;
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isModel(c) {
    return ((c === null || c === void 0 ? void 0 : c.prototype) instanceof repository_1.Model ||
        // Allowing classes decorated with `@model` but not extending from `Model`
        core_1.MetadataInspector.getClassMetadata(repository_1.MODEL_KEY, c) != null);
}
/**
 * Reducer which builds the operation responses
 */
function reduceSpecContent(specContents, [contentType, modelOrSpecs]) {
    if (Array.isArray(modelOrSpecs) && modelOrSpecs.length > 1) {
        specContents[contentType] = {
            schema: {
                anyOf: modelOrSpecs.map(m => {
                    if (isModel(m)) {
                        return { 'x-ts-type': m };
                    }
                    else {
                        return m;
                    }
                }),
            },
        };
    }
    else {
        const modelOrSpec = Array.isArray(modelOrSpecs)
            ? modelOrSpecs[0]
            : modelOrSpecs;
        if (isModel(modelOrSpec)) {
            specContents[contentType] = {
                schema: { 'x-ts-type': modelOrSpec },
            };
        }
        else {
            specContents[contentType] = {
                schema: modelOrSpec,
            };
        }
    }
    return specContents;
}
/**
 * Reducer which builds the content sections of the operation responses
 */
function reduceSpecResponses(specResponses, [responseCode, c]) {
    const responseContent = c.content;
    // check if there is an existing block, from something like an inhered @op spec
    if (Object.prototype.hasOwnProperty.call(specResponses, responseCode)) {
        // we might need to merge
        const content = Array.from(responseContent).reduce(reduceSpecContent, specResponses[responseCode].content);
        specResponses[responseCode] = {
            description: c.description,
            content,
        };
    }
    else {
        const content = Array.from(responseContent).reduce(reduceSpecContent, {});
        specResponses[responseCode] = {
            description: c.description,
            content,
        };
    }
    return specResponses;
}
/**
 * This function takes an array of flat-ish data:
 * ```
 * [
 *  { responseCode, contentType, description, modelOrSpec },
 *  { responseCode, contentType, description, modelOrSpec },
 * ]
 * ```
 * and turns it into a multi-map structure that more closely aligns with
 * the final json
 * ```
 * Map{ [code, Map{[contentType, modelOrSpec], [contentType, modelOrSpec]}]}
 * ```
 */
function buildMapsFromMetadata(metadata) {
    const builder = new Map();
    metadata.forEach(r => {
        var _a;
        if (builder.has(r.responseCode)) {
            const responseRef = builder.get(r.responseCode);
            const codeRef = responseRef === null || responseRef === void 0 ? void 0 : responseRef.content;
            if (codeRef === null || codeRef === void 0 ? void 0 : codeRef.has(r.contentType)) {
                (_a = codeRef.get(r.contentType)) === null || _a === void 0 ? void 0 : _a.push(r.responseModelOrSpec);
            }
            else {
                codeRef === null || codeRef === void 0 ? void 0 : codeRef.set(r.contentType, [r.responseModelOrSpec]);
            }
        }
        else {
            const codeRef = new Map();
            codeRef.set(r.contentType, [r.responseModelOrSpec]);
            builder.set(r.responseCode, {
                description: r.description,
                content: codeRef,
            });
        }
    });
    return builder;
}
function buildResponsesFromMetadata(metadata, existingOperation) {
    const builder = buildMapsFromMetadata(metadata);
    const base = existingOperation
        ? core_1.DecoratorFactory.cloneDeep(existingOperation.responses)
        : {};
    // Now, mega-reduce.
    const responses = Array.from(builder).reduce(reduceSpecResponses, base);
    return {
        responses,
    };
}
exports.buildResponsesFromMetadata = buildResponsesFromMetadata;
//# sourceMappingURL=build-responses-from-metadata.js.map