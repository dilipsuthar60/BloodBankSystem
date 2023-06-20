"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
var InfoSpecEnhancer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSpecEnhancer = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const openapi_v3_1 = require("@loopback/openapi-v3");
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = (0, debug_1.default)('loopback:openapi:spec-enhancer:info');
/**
 * An OpenAPI spec enhancer to populate `info` with application metadata
 * (package.json).
 */
let InfoSpecEnhancer = InfoSpecEnhancer_1 = class InfoSpecEnhancer {
    constructor(pkg) {
        this.pkg = pkg;
        this.name = 'info';
    }
    modifySpec(spec) {
        var _a, _b, _c, _d;
        if (this.pkg == null) {
            debug('Application metadata is not found. Skipping spec enhancing.');
            return spec;
        }
        const contact = InfoSpecEnhancer_1.parseAuthor(this.pkg.author);
        // Only override `info` if the `spec.info` is not customized
        const overrideInfo = spec.info.title === openapi_v3_1.DEFAULT_OPENAPI_SPEC_INFO.title &&
            spec.info.version === openapi_v3_1.DEFAULT_OPENAPI_SPEC_INFO.version;
        const patchSpec = {
            info: {
                title: overrideInfo ? this.pkg.name : (_a = spec.info.title) !== null && _a !== void 0 ? _a : this.pkg.name,
                description: overrideInfo
                    ? this.pkg.description
                    : (_b = spec.info.description) !== null && _b !== void 0 ? _b : this.pkg.description,
                version: overrideInfo
                    ? this.pkg.version
                    : (_c = spec.info.version) !== null && _c !== void 0 ? _c : this.pkg.version,
                contact: overrideInfo ? contact : (_d = spec.info.contact) !== null && _d !== void 0 ? _d : contact,
            },
        };
        debug('Enhancing OpenAPI spec with %j', patchSpec);
        return (0, openapi_v3_1.mergeOpenAPISpec)(spec, patchSpec);
    }
    /**
     * Parse package.json
     * {@link https://docs.npmjs.com/files/package.json#people-fields-author-contributors | author}
     *
     * @param author - Author string or object from package.json
     */
    static parseAuthor(author) {
        var _a, _b, _c, _d, _e, _f;
        let contact = {};
        if (author == null) {
            contact = {};
        }
        else if (typeof author === 'string') {
            // "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
            const emailRegex = /<([^<>]+)>/; // <email>
            const urlRegex = /\(([^()]+)\)/; // (url)
            const nameRegex = /([^<>()]+)/;
            contact = {
                name: (_b = (_a = nameRegex.exec(author)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim(),
                email: (_d = (_c = emailRegex.exec(author)) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.trim(),
                url: (_f = (_e = urlRegex.exec(author)) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.trim(),
            };
        }
        else if (typeof author === 'object') {
            const authorObj = author;
            contact = {
                name: authorObj.name,
                email: authorObj.email,
                url: authorObj.url,
            };
        }
        // Remove undefined/null values
        for (const p in contact) {
            if (contact[p] == null)
                delete contact[p];
        }
        return contact;
    }
};
InfoSpecEnhancer = InfoSpecEnhancer_1 = tslib_1.__decorate([
    (0, core_1.injectable)(openapi_v3_1.asSpecEnhancer, { scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_METADATA, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], InfoSpecEnhancer);
exports.InfoSpecEnhancer = InfoSpecEnhancer;
//# sourceMappingURL=info.spec-enhancer.js.map