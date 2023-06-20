"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDefaults = exports.ModelBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const base_artifact_booter_1 = require("./base-artifact.booter");
const debug = (0, debug_1.default)('loopback:boot:model-booter');
/**
 * A class that extends BaseArtifactBooter to boot the 'Model' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - Model Artifact Options Object
 */
let ModelBooter = class ModelBooter extends base_artifact_booter_1.BaseArtifactBooter {
    constructor(app, projectRoot, modelConfig = {}) {
        super(projectRoot, 
        // Set Model Booter Options if passed in via bootConfig
        Object.assign({}, exports.ModelDefaults, modelConfig));
        this.app = app;
        this.modelConfig = modelConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        for (const cls of this.classes) {
            if (!isModelClass(cls)) {
                debug('Skipping class %s - no @model is found', cls.name);
                continue;
            }
            debug('Bind class: %s', cls.name);
            // We are binding the model class itself
            const binding = this.app.model(cls);
            debug('Binding created for model class %s: %j', cls.name, binding);
        }
    }
};
ModelBooter = tslib_1.__decorate([
    (0, types_1.booter)('models'),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, (0, core_1.config)()),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object])
], ModelBooter);
exports.ModelBooter = ModelBooter;
/**
 * Default ArtifactOptions for DataSourceBooter.
 */
exports.ModelDefaults = {
    dirs: ['models'],
    extensions: ['.model.js'],
    nested: true,
};
function isModelClass(cls) {
    return repository_1.ModelMetadataHelper.getModelMetadata(cls) != null;
}
//# sourceMappingURL=model.booter.js.map