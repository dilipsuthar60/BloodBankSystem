"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2019. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonBodyParser = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const body_parser_1 = require("body-parser");
const type_is_1 = require("type-is");
const keys_1 = require("../keys");
const parse_json_1 = require("../parse-json");
const body_parser_helpers_1 = require("./body-parser.helpers");
let JsonBodyParser = class JsonBodyParser {
    constructor(options = {}) {
        var _a, _b;
        this.name = body_parser_helpers_1.builtinParsers.json;
        const jsonOptions = (0, body_parser_helpers_1.getParserOptions)('json', options);
        const prohibitedKeys = [
            '__proto__',
            'constructor.prototype',
            ...((_b = (_a = options.validation) === null || _a === void 0 ? void 0 : _a.prohibitedKeys) !== null && _b !== void 0 ? _b : []),
        ];
        jsonOptions.reviver = (0, parse_json_1.sanitizeJsonParse)(jsonOptions.reviver, prohibitedKeys);
        this.jsonParser = (0, body_parser_1.json)(jsonOptions);
    }
    supports(mediaType) {
        return !!(0, type_is_1.is)(mediaType, '*/json', '*/*+json');
    }
    async parse(request) {
        let body = await (0, body_parser_helpers_1.invokeBodyParserMiddleware)(this.jsonParser, request);
        // https://github.com/expressjs/body-parser/blob/master/lib/types/json.js#L71-L76
        const contentLength = request.get('content-length');
        if (contentLength != null && +contentLength === 0) {
            body = undefined;
        }
        return { value: body };
    }
};
JsonBodyParser = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], JsonBodyParser);
exports.JsonBodyParser = JsonBodyParser;
//# sourceMappingURL=body-parser.json.js.map