"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLifeCycleObserver = void 0;
/**
 * An mock-up `LifeCycleObserver`. Please note that `start` and `stop` methods
 * can be async or sync.
 */
class MyLifeCycleObserver {
    constructor() {
        this.status = '';
    }
    /**
     * Handling `start` event asynchronously
     */
    async start() {
        // Perform some work asynchronously
        // await startSomeAsyncWork(...)
        this.status = 'started';
    }
    /**
     * Handling `stop` event synchronously.
     */
    stop() {
        this.status = 'stopped';
    }
}
exports.MyLifeCycleObserver = MyLifeCycleObserver;
//# sourceMappingURL=lifecycle-observer.artifact.js.map
//# sourceMappingURL=/Users/dianalau/code/loopback/loopback-next/packages/boot/dist/__tests__/fixtures/lifecycle-observer.artifact.js.map