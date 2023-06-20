"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMixinDoc = exports.ServiceMixin = void 0;
/**
 * A mixin class for Application that creates a .serviceProvider()
 * function to register a service automatically. Also overrides
 * component function to allow it to register repositories automatically.
 *
 * @example
 * ```ts
 * class MyApplication extends ServiceMixin(Application) {}
 * ```
 *
 * Please note: the members in the mixin function are documented in a dummy class
 * called <a href="#ServiceMixinDoc">ServiceMixinDoc</a>
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with service proxy related
 * methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 */
function ServiceMixin(superClass) {
    return class extends superClass {
        /**
         * Add a service to this application.
         *
         * @deprecated Use app.service() instead
         *
         * @param provider - The service provider to register.
         *
         * @example
         * ```ts
         * export interface GeocoderService {
         *   geocode(address: string): Promise<GeoPoint[]>;
         * }
         *
         * export class GeocoderServiceProvider implements Provider<GeocoderService> {
         *   constructor(
         *     @inject('services.geocoder')
         *     protected dataSource: juggler.DataSource = new GeocoderDataSource(),
         *   ) {}
         *
         *   value(): Promise<GeocoderService> {
         *     return getService(this.dataSource);
         *   }
         * }
         *
         * app.serviceProvider(GeocoderServiceProvider);
         * ```
         */
        serviceProvider(provider, nameOrOptions) {
            return this.service(provider, nameOrOptions);
        }
        /**
         * Add a component to this application. Also mounts
         * all the components services.
         *
         * @param component - The component to add.
         *
         * @example
         * ```ts
         *
         * export class ProductComponent {
         *   controllers = [ProductController];
         *   repositories = [ProductRepo, UserRepo];
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
            this.mountComponentServices(componentCtor, binding.key);
            return binding;
        }
        /**
         * Get an instance of a component and mount all it's
         * services. This function is intended to be used internally
         * by component()
         *
         * @param component - The component to mount services of
         */
        mountComponentServices(component, componentBindingKey) {
            const componentKey = componentBindingKey !== null && componentBindingKey !== void 0 ? componentBindingKey : `components.${component.name}`;
            const compInstance = this.getSync(componentKey);
            if (compInstance.serviceProviders) {
                for (const provider of compInstance.serviceProviders) {
                    this.serviceProvider(provider);
                }
            }
        }
    };
}
exports.ServiceMixin = ServiceMixin;
/**
 * A dummy class created to generate the tsdoc for the members in service
 * mixin. Please don't use it.
 *
 * The members are implemented in function
 * <a href="#ServiceMixin">ServiceMixin</a>
 */
class ServiceMixinDoc {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
        throw new Error('This is a dummy class created for apidoc! Please do not use it!');
    }
    /**
     * Add a service to this application.
     *
     * @param provider - The service provider to register.
     *
     * @example
     * ```ts
     * export interface GeocoderService {
     *   geocode(address: string): Promise<GeoPoint[]>;
     * }
     *
     * export class GeocoderServiceProvider implements Provider<GeocoderService> {
     *   constructor(
     *     @inject('datasources.geocoder')
     *     protected dataSource: juggler.DataSource = new GeocoderDataSource(),
     *   ) {}
     *
     *   value(): Promise<GeocoderService> {
     *     return getService(this.dataSource);
     *   }
     * }
     *
     * app.serviceProvider(GeocoderServiceProvider);
     * ```
     */
    serviceProvider(provider) {
        throw new Error();
    }
    /**
     * Add a component to this application. Also mounts
     * all the components services.
     *
     * @param component - The component to add.
     *
     * @example
     * ```ts
     *
     * export class ProductComponent {
     *   controllers = [ProductController];
     *   repositories = [ProductRepo, UserRepo];
     *   providers = {
     *     [AUTHENTICATION_STRATEGY]: AuthStrategy,
     *     [AUTHORIZATION_ROLE]: Role,
     *   };
     * };
     *
     * app.component(ProductComponent);
     * ```
     */
    component(component) {
        throw new Error();
    }
    /**
     * Get an instance of a component and mount all it's
     * services. This function is intended to be used internally
     * by component()
     *
     * @param component - The component to mount services of
     */
    mountComponentServices(component) { }
}
exports.ServiceMixinDoc = ServiceMixinDoc;
//# sourceMappingURL=service.mixin.js.map