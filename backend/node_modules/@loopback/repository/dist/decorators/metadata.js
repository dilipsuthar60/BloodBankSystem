"use strict";
// Copyright IBM Corp. and LoopBack contributors 2017,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelMetadataHelper = void 0;
const core_1 = require("@loopback/core");
const model_1 = require("../model");
const relations_1 = require("../relations");
const model_decorator_1 = require("./model.decorator");
class ModelMetadataHelper {
    /**
     * A utility function to simplify retrieving metadata from a target model and
     * its properties.
     * @param target - The class from which to retrieve metadata.
     * @param options - An options object for the MetadataInspector to customize
     * the output of the metadata retrieval functions.
     */
    static getModelMetadata(target, options) {
        const classDef = core_1.MetadataInspector.getClassMetadata(model_decorator_1.MODEL_WITH_PROPERTIES_KEY, target, 
        // https://github.com/loopbackio/loopback-next/issues/4721
        // The `target` can be a subclass for a base model
        { ...options, ownMetadataOnly: true });
        // Return the cached value, if it exists.
        // XXX(kjdelisle): If we're going to support dynamic updates, then this
        // will be problematic in the future, since it will never update.
        if (classDef) {
            return classDef;
        }
        else {
            const modelMeta = core_1.MetadataInspector.getClassMetadata(model_decorator_1.MODEL_KEY, target, options);
            if (!modelMeta) {
                return {};
            }
            else {
                // sets the metadata to a dedicated key if cached value does not exist
                // set ModelDefinition properties if they don't already exist
                const meta = new model_1.ModelDefinition({ ...modelMeta });
                // set properties lost from creating instance of ModelDefinition
                Object.assign(meta, modelMeta);
                meta.properties = Object.assign(meta.properties, core_1.MetadataInspector.getAllPropertyMetadata(model_decorator_1.MODEL_PROPERTIES_KEY, target.prototype, options));
                meta.relations = Object.assign(meta.relations, core_1.MetadataInspector.getAllPropertyMetadata(relations_1.RELATIONS_KEY, target.prototype, options));
                core_1.MetadataInspector.defineMetadata(model_decorator_1.MODEL_WITH_PROPERTIES_KEY.key, meta, target);
                return meta;
            }
        }
    }
}
exports.ModelMetadataHelper = ModelMetadataHelper;
//# sourceMappingURL=metadata.js.map