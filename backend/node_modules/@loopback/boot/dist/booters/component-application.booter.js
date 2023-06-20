"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentApplicationBooterBinding = exports.createBooterForComponentApplication = exports.bindingKeysExcludedFromSubApp = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const types_1 = require("../types");
const debug = (0, debug_1.default)('loopback:boot:booter:component-application');
/**
 * Binding keys excluded from a sub application. These bindings booted from the
 * sub application won't be added to the main application.
 */
exports.bindingKeysExcludedFromSubApp = [
    keys_1.BootBindings.BOOT_OPTIONS.key,
    keys_1.BootBindings.PROJECT_ROOT.key,
    keys_1.BootBindings.BOOTSTRAPPER_KEY.key,
    core_1.CoreBindings.APPLICATION_CONFIG.key,
    core_1.CoreBindings.APPLICATION_INSTANCE.key,
    core_1.CoreBindings.APPLICATION_METADATA.key,
    core_1.CoreBindings.LIFE_CYCLE_OBSERVER_REGISTRY.key,
    core_1.CoreBindings.LIFE_CYCLE_OBSERVER_OPTIONS.key,
];
/**
 * Create a booter that boots the component application. Bindings that exist
 * in the component application before `boot` are skipped. Locked bindings in
 * the main application will not be overridden.
 *
 * @param componentApp - The application exposing a component
 * @param filter Binding filter to selected bindings to be added
 */
function createBooterForComponentApplication(componentApp, filter = () => true) {
    /**
     * A booter to boot artifacts for the component application
     */
    let ComponentApplicationBooter = class ComponentApplicationBooter {
        constructor(mainApp) {
            this.mainApp = mainApp;
        }
        async load() {
            /**
             * List all bindings before boot
             */
            let bindings = componentApp.find(() => true);
            const bindingsBeforeBoot = new Set(bindings);
            // Boot the component application
            await componentApp.boot();
            /**
             * Add bindings from the component application to the main application
             */
            bindings = componentApp.find(filter);
            for (const binding of bindings) {
                // Exclude boot related bindings
                if (exports.bindingKeysExcludedFromSubApp.includes(binding.key))
                    continue;
                // Exclude bindings from the app before boot
                if (bindingsBeforeBoot.has(binding)) {
                    debug('Skipping binding %s that exists before booting %s', binding.key, componentApp.name);
                    continue;
                }
                // Do not override locked bindings
                const locked = this.mainApp.find(binding.key).some(b => b.isLocked);
                if (locked) {
                    debug('Skipping binding %s from %s - locked in %s', binding.key, componentApp.name, this.mainApp.name);
                    continue;
                }
                debug('Adding binding from %s to %s', componentApp.name, this.mainApp.name, binding);
                this.mainApp.add(binding);
            }
        }
    };
    ComponentApplicationBooter = tslib_1.__decorate([
        (0, types_1.booter)('componentApplications'),
        tslib_1.__param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
        tslib_1.__metadata("design:paramtypes", [core_1.Application])
    ], ComponentApplicationBooter);
    return ComponentApplicationBooter;
}
exports.createBooterForComponentApplication = createBooterForComponentApplication;
/**
 * Create a binding to register a booter that boots the component application.
 * Bindings that exist in the component application before `boot` are skipped.
 * Locked bindings in the main application will not be overridden.
 *
 * @param componentApp - The application exposing a component
 * @param filter Binding filter to selected bindings to be added
 */
function createComponentApplicationBooterBinding(componentApp, filter) {
    return (0, core_1.createBindingFromClass)(createBooterForComponentApplication(componentApp, filter), { key: `booters.${componentApp.name}` });
}
exports.createComponentApplicationBooterBinding = createComponentApplicationBooterBinding;
//# sourceMappingURL=component-application.booter.js.map