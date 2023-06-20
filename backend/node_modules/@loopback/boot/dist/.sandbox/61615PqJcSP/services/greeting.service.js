"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetingService = void 0;
// NOTE(bajtos) At the moment, ServiceBooter recognizes only service providers.
// This class is used by tests to verify that non-provider classes are ignored.
class GreetingService {
    greet(whom = 'world') {
        return Promise.resolve(`Hello ${whom}`);
    }
}
exports.GreetingService = GreetingService;
//# sourceMappingURL=service-class.artifact.js.map
//# sourceMappingURL=/Users/dianalau/code/loopback/loopback-next/packages/boot/dist/__tests__/fixtures/service-class.artifact.js.map