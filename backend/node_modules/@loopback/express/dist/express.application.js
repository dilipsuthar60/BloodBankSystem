"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApplication = void 0;
const core_1 = require("@loopback/core");
const express_server_1 = require("./express.server");
/**
 * A LoopBack application with Express server
 */
class ExpressApplication extends core_1.Application {
    constructor(config) {
        super(config);
        this.config = config;
        const binding = this.server(express_server_1.ExpressServer);
        this.expressServer = this.getSync(binding.key);
    }
}
exports.ExpressApplication = ExpressApplication;
//# sourceMappingURL=express.application.js.map