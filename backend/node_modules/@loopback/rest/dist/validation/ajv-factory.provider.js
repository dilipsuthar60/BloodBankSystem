"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjvFactoryProvider = exports.DEFAULT_AJV_VALIDATION_OPTIONS = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const ajv_errors_1 = tslib_1.__importDefault(require("ajv-errors"));
const ajv_formats_1 = tslib_1.__importDefault(require("ajv-formats"));
const ajv_keywords_1 = tslib_1.__importDefault(require("ajv-keywords"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const openapi_formats_1 = require("./openapi-formats");
const debug = (0, debug_1.default)('loopback:rest:ajv');
exports.DEFAULT_AJV_VALIDATION_OPTIONS = {
    $data: true,
};
/**
 * A provider class that instantiate an AJV instance
 */
let AjvFactoryProvider = class AjvFactoryProvider {
    constructor(options = exports.DEFAULT_AJV_VALIDATION_OPTIONS) {
        this.options = options;
    }
    value() {
        return options => {
            let validationOptions = {
                ...this.options,
                ...options,
            };
            // See https://github.com/epoberezkin/ajv#options
            validationOptions = {
                allErrors: true,
                strictTypes: false,
                ...validationOptions,
            };
            debug('AJV options', validationOptions);
            const ajvOptions = { ...validationOptions };
            delete ajvOptions.ajvErrors;
            const ajvInst = new ajv_1.default(ajvOptions);
            ajvInst.addKeyword('components');
            ajvInst.addKeyword('x-typescript-type');
            (0, ajv_keywords_1.default)(ajvInst, validationOptions.ajvKeywords);
            (0, ajv_errors_1.default)(ajvInst, validationOptions.ajvErrors);
            if (this.keywords) {
                this.keywords.forEach(keyword => {
                    debug('Adding Ajv keyword %s', keyword.keyword);
                    ajvInst.addKeyword(keyword);
                });
            }
            (0, ajv_formats_1.default)(ajvInst);
            for (const format of openapi_formats_1.openapiFormats) {
                ajvInst.addFormat(format.name, format);
            }
            if (this.formats) {
                this.formats.forEach(format => {
                    debug('Adding Ajv format %s', format.name);
                    ajvInst.addFormat(format.name, format);
                });
            }
            return ajvInst;
        };
    }
};
tslib_1.__decorate([
    (0, core_1.inject)((0, core_1.filterByTag)(keys_1.RestTags.AJV_KEYWORD)),
    tslib_1.__metadata("design:type", Array)
], AjvFactoryProvider.prototype, "keywords", void 0);
tslib_1.__decorate([
    (0, core_1.inject)((0, core_1.filterByTag)(keys_1.RestTags.AJV_FORMAT)),
    tslib_1.__metadata("design:type", Array)
], AjvFactoryProvider.prototype, "formats", void 0);
AjvFactoryProvider = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS.deepProperty('validation'), { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], AjvFactoryProvider);
exports.AjvFactoryProvider = AjvFactoryProvider;
//# sourceMappingURL=ajv-factory.provider.js.map