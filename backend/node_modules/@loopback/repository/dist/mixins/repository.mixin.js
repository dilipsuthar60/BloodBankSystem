"use strict";
// Copyright IBM Corp. and LoopBack contributors 2018,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModelClassBinding = exports.RepositoryMixinDoc = exports.RepositoryMixin = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("../keys");
const repositories_1 = require("../repositories");
const debug = (0, debug_1.default)('loopback:repository:mixin');
/* eslint-enable @typescript-eslint/no-unused-vars */
/**
 * A mixin class for Application that creates a .repository()
 * function to register a repository automatically. Also overrides
 * component function to allow it to register repositories automatically.
 *
 * @example
 * ```ts
 * class MyApplication extends RepositoryMixin(Application) {}
 * ```
 *
 * Please note: the members in the mixin function are documented in a dummy class
 * called <a href="#RepositoryMixinDoc">RepositoryMixinDoc</a>
 *
 * @param superClass - Application class
 * @returns A new class that extends the super class with repository related
 * methods
 *
 * @typeParam T - Type of the application class as the target for the mixin
 *
 */
function RepositoryMixin(superClass) {
    return class extends superClass {
        /**
         * Add a repository to this application.
         *
         * @param repoClass - The repository to add.
         * @param nameOrOptions - Name or options for the binding
         *
         * @example
         * ```ts
         *
         * class NoteRepo {
         *   model: any;
         *
         *   constructor() {
         *     const ds: juggler.DataSource = new juggler.DataSource({
         *       name: 'db',
         *       connector: 'memory',
         *     });
         *
         *     this.model = ds.createModel(
         *       'note',
         *       {title: 'string', content: 'string'},
         *       {}
         *     );
         *   }
         * };
         *
         * app.repository(NoteRepo);
         * ```
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repository(repoClass, nameOrOptions) {
            const binding = (0, core_1.createBindingFromClass)(repoClass, {
                namespace: keys_1.RepositoryBindings.REPOSITORIES,
                type: keys_1.RepositoryTags.REPOSITORY,
                defaultScope: core_1.BindingScope.TRANSIENT,
                ...toOptions(nameOrOptions),
            }).tag(keys_1.RepositoryTags.REPOSITORY);
            this.add(binding);
            return binding;
        }
        /**
         * Retrieve the repository instance from the given Repository class
         *
         * @param repo - The repository class to retrieve the instance of
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async getRepository(repo) {
            return this.get(`repositories.${repo.name}`);
        }
        /**
         * Add the dataSource to this application.
         *
         * @param dataSource - The dataSource to add.
         * @param nameOrOptions - The binding name or options of the datasource;
         * defaults to dataSource.name
         *
         * @example
         * ```ts
         *
         * const ds: juggler.DataSource = new juggler.DataSource({
         *   name: 'db',
         *   connector: 'memory',
         * });
         *
         * app.dataSource(ds);
         *
         * // The datasource can be injected with
         * constructor(@inject('datasources.db') dataSource: DataSourceType) {
         *
         * }
         * ```
         */
        dataSource(dataSource, nameOrOptions) {
            var _a;
            const options = toOptions(nameOrOptions);
            // We have an instance of
            if (dataSource instanceof repositories_1.juggler.DataSource) {
                const name = options.name || dataSource.name;
                const namespace = (_a = options.namespace) !== null && _a !== void 0 ? _a : keys_1.RepositoryBindings.DATASOURCES;
                const key = `${namespace}.${name}`;
                return this.bind(key).to(dataSource).tag(keys_1.RepositoryTags.DATASOURCE);
            }
            else if (typeof dataSource === 'function') {
                options.name = options.name || dataSource.dataSourceName;
                const binding = (0, core_1.createBindingFromClass)(dataSource, {
                    namespace: keys_1.RepositoryBindings.DATASOURCES,
                    type: keys_1.RepositoryTags.DATASOURCE,
                    defaultScope: core_1.BindingScope.SINGLETON,
                    ...options,
                });
                this.add(binding);
                return binding;
            }
            else {
                throw new Error('not a valid DataSource.');
            }
        }
        /**
         * Register a model class as a binding in the target context
         * @param modelClass - Model class
         */
        model(modelClass) {
            const binding = createModelClassBinding(modelClass);
            this.add(binding);
            return binding;
        }
        /**
         * Add a component to this application. Also mounts
         * all the components repositories.
         *
         * @param component - The component to add.
         * @param nameOrOptions - Name or options for the binding.
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
            const instance = this.getSync(binding.key);
            this.mountComponentRepositories(instance);
            this.mountComponentModels(instance);
            return binding;
        }
        /**
         * Get an instance of a component and mount all it's
         * repositories. This function is intended to be used internally
         * by `component()`.
         *
         * NOTE: Calling `mountComponentRepositories` with a component class
         * constructor is deprecated. You should instantiate the component
         * yourself and provide the component instance instead.
         *
         * @param componentInstanceOrClass - The component to mount repositories of
         * @internal
         */
        mountComponentRepositories(
        // accept also component class to preserve backwards compatibility
        // TODO(semver-major) Remove support for component class constructor
        componentInstanceOrClass) {
            const component = resolveComponentInstance(this);
            if (component.repositories) {
                for (const repo of component.repositories) {
                    this.repository(repo);
                }
            }
            // `Readonly<Application>` is a hack to remove protected members
            // and thus allow `this` to be passed as a value for `ctx`
            function resolveComponentInstance(ctx) {
                if (typeof componentInstanceOrClass !== 'function')
                    return componentInstanceOrClass;
                const componentName = componentInstanceOrClass.name;
                const componentKey = `${core_1.CoreBindings.COMPONENTS}.${componentName}`;
                return ctx.getSync(componentKey);
            }
        }
        /**
         * Bind all model classes provided by a component.
         * @param component
         * @internal
         */
        mountComponentModels(component) {
            if (!component.models)
                return;
            for (const m of component.models) {
                this.model(m);
            }
        }
        /**
         * Update or recreate the database schema for all repositories.
         *
         * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
         * while updating the schema in your target database, but this is not
         * guaranteed to be safe.
         *
         * Please check the documentation for your specific connector(s) for
         * a detailed breakdown of behaviors for automigrate!
         *
         * @param options - Migration options, e.g. whether to update tables
         * preserving data or rebuild everything from scratch.
         */
        async migrateSchema(options = {}) {
            var _a;
            const operation = options.existingSchema === 'drop' ? 'automigrate' : 'autoupdate';
            // Instantiate all repositories to ensure models are registered & attached
            // to their datasources
            const repoBindings = this.findByTag('repository');
            await Promise.all(repoBindings.map(b => this.get(b.key)));
            // Look up all datasources and update/migrate schemas one by one
            const dsBindings = this.findByTag(keys_1.RepositoryTags.DATASOURCE);
            for (const b of dsBindings) {
                const ds = await this.get(b.key);
                const disableMigration = (_a = ds.settings.disableMigration) !== null && _a !== void 0 ? _a : false;
                if (operation in ds &&
                    typeof ds[operation] === 'function' &&
                    !disableMigration) {
                    debug('Migrating dataSource %s', b.key);
                    await ds[operation](options.models);
                }
                else {
                    debug('Skipping migration of dataSource %s', b.key);
                }
            }
        }
    };
}
exports.RepositoryMixin = RepositoryMixin;
/**
 * Normalize name or options to `BindingFromClassOptions`
 * @param nameOrOptions - Name or options for binding from class
 */
function toOptions(nameOrOptions) {
    if (typeof nameOrOptions === 'string') {
        return { name: nameOrOptions };
    }
    return nameOrOptions !== null && nameOrOptions !== void 0 ? nameOrOptions : {};
}
/**
 * A dummy class created to generate the tsdoc for the members in repository
 * mixin. Please don't use it.
 *
 * The members are implemented in function
 * <a href="#RepositoryMixin">RepositoryMixin</a>
 */
class RepositoryMixinDoc {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args) {
        throw new Error('This is a dummy class created for apidoc!' + 'Please do not use it!');
    }
    /**
     * Add a repository to this application.
     *
     * @param repo - The repository to add.
     *
     * @example
     * ```ts
     *
     * class NoteRepo {
     *   model: any;
     *
     *   constructor() {
     *     const ds: juggler.DataSource = new juggler.DataSource({
     *       name: 'db',
     *       connector: 'memory',
     *     });
     *
     *     this.model = ds.createModel(
     *       'note',
     *       {title: 'string', content: 'string'},
     *       {}
     *     );
     *   }
     * };
     *
     * app.repository(NoteRepo);
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository(repo) {
        throw new Error();
    }
    /**
     * Retrieve the repository instance from the given Repository class
     *
     * @param repo - The repository class to retrieve the instance of
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getRepository(repo) {
        return new repo();
    }
    /**
     * Add the dataSource to this application.
     *
     * @param dataSource - The dataSource to add.
     * @param name - The binding name of the datasource; defaults to dataSource.name
     *
     * @example
     * ```ts
     *
     * const ds: juggler.DataSource = new juggler.DataSource({
     *   name: 'db',
     *   connector: 'memory',
     * });
     *
     * app.dataSource(ds);
     *
     * // The datasource can be injected with
     * constructor(@inject('datasources.db') dataSource: DataSourceType) {
     *
     * }
     * ```
     */
    dataSource(dataSource, name) {
        throw new Error();
    }
    /**
     * Add a component to this application. Also mounts
     * all the components repositories.
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
     * repositories. This function is intended to be used internally
     * by component()
     *
     * @param component - The component to mount repositories of
     */
    mountComponentRepository(component) { }
    /**
     * Update or recreate the database schema for all repositories.
     *
     * **WARNING**: By default, `migrateSchema()` will attempt to preserve data
     * while updating the schema in your target database, but this is not
     * guaranteed to be safe.
     *
     * Please check the documentation for your specific connector(s) for
     * a detailed breakdown of behaviors for automigrate!
     *
     * @param options - Migration options, e.g. whether to update tables
     * preserving data or rebuild everything from scratch.
     */
    async migrateSchema(options) { }
}
exports.RepositoryMixinDoc = RepositoryMixinDoc;
/**
 * Create a binding for the given model class
 * @param modelClass - Model class
 */
function createModelClassBinding(modelClass) {
    return core_1.Binding.bind(`${keys_1.RepositoryBindings.MODELS}.${modelClass.name}`)
        .to(modelClass)
        .tag(keys_1.RepositoryTags.MODEL);
}
exports.createModelClassBinding = createModelClassBinding;
//# sourceMappingURL=repository.mixin.js.map