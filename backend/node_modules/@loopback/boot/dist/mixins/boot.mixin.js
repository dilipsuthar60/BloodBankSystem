"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports._bindBooter = exports.bindBooter = exports.BootMixin = exports.Binding = void 0;
const core_1 = require("@loopback/core");
Object.defineProperty(exports, "Binding", { enumerable: true, get: function () { return core_1.Binding; } });
const boot_component_1 = require("../boot.component");
const component_application_booter_1 = require("../booters/component-application.booter");
const keys_1 = require("../keys");
/**
 * Mixin for @loopback/boot. This Mixin provides the following:
 * - Implements the Bootable Interface as follows.
 * - Add a `projectRoot` property to the Class
 * - Adds an optional `bootOptions` property to the Class that can be used to
 *    store the Booter conventions.
 * - Adds the `BootComponent` to the Class (which binds the Bootstrapper and default Booters)
 * - Provides the `boot()` convenience method to call Bootstrapper.boot()
 * - Provides the `booter()` convenience method to bind a Booter(s) to the Application
 * - Override `component()` to call `mountComponentBooters`
 * - Adds `mountComponentBooters` which binds Booters to the application from `component.booters[]`
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with boot related methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 */
function BootMixin(superClass) {
    return class extends superClass {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args) {
            super(...args);
            this.component(boot_component_1.BootComponent);
            // We Dynamically bind the Project Root and Boot Options so these values can
            // be used to resolve an instance of the Bootstrapper (as they are dependencies)
            this.bind(keys_1.BootBindings.PROJECT_ROOT).toDynamicValue(() => this.projectRoot);
            this.bind(keys_1.BootBindings.BOOT_OPTIONS).toDynamicValue(() => { var _a; return (_a = this.bootOptions) !== null && _a !== void 0 ? _a : {}; });
        }
        /**
         * Override to detect and warn about starting without booting.
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        async start() {
            await super.start();
            if (!this.booted) {
                process.emitWarning('App started without booting. Did you forget to call ' +
                    '`await app.boot()`?', 'LoopBackWarning');
            }
        }
        /**
         * Convenience method to call bootstrapper.boot() by resolving bootstrapper
         */
        async boot() {
            /* eslint-disable @typescript-eslint/ban-ts-comment */
            // A workaround to access protected Application methods
            const self = this;
            if (this.state === 'booting') {
                // @ts-ignore
                return self.awaitState('booted');
            }
            // @ts-ignore
            self.assertNotInProcess('boot');
            // @ts-ignore
            self.assertInStates('boot', 'created', 'booted');
            if (this.state === 'booted')
                return;
            // @ts-ignore
            self.setState('booting');
            // Get a instance of the BootStrapper
            const bootstrapper = await this.get(keys_1.BootBindings.BOOTSTRAPPER_KEY);
            await bootstrapper.boot();
            // @ts-ignore
            this.setState('booted');
            this.booted = true;
            /* eslint-enable @typescript-eslint/ban-ts-comment */
        }
        /**
         * Given a N number of Booter Classes, this method binds them using the
         * prefix and tag expected by the Bootstrapper.
         *
         * @param booterCls - Booter classes to bind to the Application
         *
         * @example
         * ```ts
         * app.booters(MyBooter, MyOtherBooter)
         * ```
         */
        booters(...booterCls) {
            return booterCls.map(cls => bindBooter(this, cls));
        }
        /**
         * Register a booter to boot a sub-application. See
         * {@link createComponentApplicationBooterBinding} for more details.
         *
         * @param subApp - A sub-application with artifacts to be booted
         * @param filter - A binding filter to select what bindings from the sub
         * application should be added to the main application.
         */
        applicationBooter(subApp, filter) {
            const binding = (0, component_application_booter_1.createComponentApplicationBooterBinding)(subApp, filter);
            this.add(binding);
            return binding;
        }
        /**
         * Override to ensure any Booter's on a Component are also mounted.
         *
         * @param component - The component to add.
         *
         * @example
         * ```ts
         *
         * export class ProductComponent {
         *   booters = [ControllerBooter, RepositoryBooter];
         *   providers = {
         *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
         *     [AUTHORIZATION_ROLE]: Role,
         *   };
         * };
         *
         * app.component(ProductComponent);
         * ```
         */
        // Unfortunately, TypeScript does not allow overriding methods inherited
        // from mapped types. https://github.com/microsoft/TypeScript/issues/38496
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        component(componentCtor, nameOrOptions) {
            const binding = super.component(componentCtor, nameOrOptions);
            const instance = this.getSync(binding.key);
            this.mountComponentBooters(instance);
            return binding;
        }
        /**
         * Get an instance of a component and mount all it's
         * booters. This function is intended to be used internally
         * by component()
         *
         * @param component - The component to mount booters of
         */
        mountComponentBooters(componentInstanceOrClass) {
            const componentInstance = resolveComponentInstance(this);
            if (componentInstance.booters) {
                this.booters(...componentInstance.booters);
            }
            /**
             * Determines if componentInstanceOrClass is an instance of a component,
             * or a class that needs to be instantiated from context.
             * @param ctx
             */
            function resolveComponentInstance(ctx) {
                if (typeof componentInstanceOrClass !== 'function') {
                    return componentInstanceOrClass;
                }
                // TODO(semver-major) @bajtos: Reminder to remove this on the next major release
                const componentName = componentInstanceOrClass.name;
                const componentKey = `${core_1.CoreBindings.COMPONENTS}.${componentName}`;
                return ctx.getSync(componentKey);
            }
        }
    };
}
exports.BootMixin = BootMixin;
/**
 * Method which binds a given Booter to a given Context with the Prefix and
 * Tags expected by the Bootstrapper
 *
 * @param ctx - The Context to bind the Booter Class
 * @param booterCls - Booter class to be bound
 */
function bindBooter(ctx, booterCls) {
    const binding = (0, core_1.createBindingFromClass)(booterCls, {
        namespace: keys_1.BootBindings.BOOTERS,
        defaultScope: core_1.BindingScope.SINGLETON,
    }).tag(keys_1.BootTags.BOOTER);
    ctx.add(binding);
    /**
     * Set up configuration binding as alias to `BootBindings.BOOT_OPTIONS`
     * so that the booter can use `@config`.
     */
    if (binding.tagMap.artifactNamespace) {
        ctx
            .configure(binding.key)
            .toAlias(`${keys_1.BootBindings.BOOT_OPTIONS.key}#${binding.tagMap.artifactNamespace}`);
    }
    return binding;
}
exports.bindBooter = bindBooter;
// eslint-disable-next-line @typescript-eslint/naming-convention
exports._bindBooter = bindBooter; // For backward-compatibility
//# sourceMappingURL=boot.mixin.js.map