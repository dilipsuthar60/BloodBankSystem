"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018. All Rights Reserved.
// Node module: @loopback/rest
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBodyParser = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const body_parser_1 = require("body-parser");
const type_is_1 = require("type-is");
const keys_1 = require("../keys");
const body_parser_helpers_1 = require("./body-parser.helpers");
let TextBodyParser = class TextBodyParser {
    constructor(options = {}) {
        this.name = body_parser_helpers_1.builtinParsers.text;
        const textOptions = Object.assign({ type: 'text/*' }, (0, body_parser_helpers_1.getParserOptions)('text', options));
        this.textParser = (0, body_parser_1.text)(textOptions);
    }
    supports(mediaType) {
        // Please note that `text/*` matches `text/plain` and `text/html` but`text`
        // does not.
        return !!(0, type_is_1.is)(mediaType, 'text/*');
    }
    async parse(request) {
        const body = await (0, body_parser_helpers_1.invokeBodyParserMiddleware)(this.textParser, request);
        return { value: body };
    }
};
TextBodyParser = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], TextBodyParser);
exports.TextBodyParser = TextBodyParser;
//# sourceMappingURL=body-parser.text.js.map