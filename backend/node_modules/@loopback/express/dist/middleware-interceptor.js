"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddlewareInterceptorBinding = exports.registerExpressMiddlewareInterceptor = exports.buildName = exports.defineInterceptorProvider = exports.ExpressMiddlewareInterceptorProvider = exports.createInterceptor = exports.toInterceptor = exports.executeExpressRequestHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const assert_1 = tslib_1.__importDefault(require("assert"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const on_finished_1 = tslib_1.__importDefault(require("on-finished"));
const util_1 = require("util");
const keys_1 = require("./keys");
const debug = (0, debug_1.default)('loopback:middleware');
const onFinishedAsync = (0, util_1.promisify)(on_finished_1.default);
/**
 * Execute an Express-style callback-based request handler.
 *
 * @param handler - Express middleware handler function
 * @param request
 * @param response
 * @returns A promise resolved to:
 * - `true` when the request was handled
 * - `false` when the handler called `next()` to proceed to the next
 *    handler (middleware) in the chain.
 */
function executeExpressRequestHandler(handler, request, response) {
    const responseWritten = onFinishedAsync(response).then(() => true);
    const handlerFinished = new Promise((resolve, reject) => {
        handler(request, response, (err) => {
            if (err) {
                reject(err);
            }
            else {
                // Express router called next, which means no route was matched
                debug('[%s] Handler calling next()', handler.name, err);
                resolve(false);
            }
        });
    });
    /**
     * Express middleware may handle the response by itself and not call
     * `next`. We use `Promise.race()` to determine if we need to proceed
     * with next interceptor in the chain or just return.
     */
    return Promise.race([handlerFinished, responseWritten]);
}
exports.executeExpressRequestHandler = executeExpressRequestHandler;
/**
 * Wrap an express middleware handler function as an interceptor
 *
 * @example
 * ```ts
 * toInterceptor(fn);
 * toInterceptor(fn1, fn2, fn3);
 * ```
 * @param firstHandler - An Express middleware handler
 * @param additionalHandlers - A list of Express middleware handler function
 *
 * @typeParam CTX - Context type
 */
function toInterceptor(firstHandler, ...additionalHandlers) {
    if (additionalHandlers.length === 0) {
        const handlerFn = firstHandler;
        return toInterceptorFromExpressMiddleware(handlerFn);
    }
    const handlers = [firstHandler, ...additionalHandlers];
    const interceptorList = handlers.map(handler => toInterceptor(handler));
    return async (invocationCtx, next) => {
        const middlewareChain = new core_1.GenericInterceptorChain(invocationCtx, interceptorList);
        return middlewareChain.invokeInterceptors(next);
    };
}
exports.toInterceptor = toInterceptor;
function toInterceptorFromExpressMiddleware(handlerFn) {
    return async (context, next) => {
        const middlewareCtx = await context.get(keys_1.MiddlewareBindings.CONTEXT);
        const finished = await executeExpressRequestHandler(handlerFn, middlewareCtx.request, middlewareCtx.response);
        if (!finished) {
            debug('[%s] Proceed with downstream interceptors', handlerFn.name);
            const val = await next();
            debug('[%s] Result received from downstream interceptors', handlerFn.name);
            return val;
        }
        // Return response to indicate the response has been produced
        return middlewareCtx.response;
    };
}
/**
 * Create an interceptor function from express middleware.
 * @param middlewareFactory - Express middleware factory function. A wrapper
 * can be created if the Express middleware module does not conform to the
 * factory pattern and signature.
 * @param middlewareConfig - Configuration for the Express middleware
 *
 * @typeParam CFG - Configuration type
 * @typeParam CTX - Context type
 */
function createInterceptor(middlewareFactory, middlewareConfig) {
    const handlerFn = middlewareFactory(middlewareConfig);
    return toInterceptor(handlerFn);
}
exports.createInterceptor = createInterceptor;
/**
 * Base class for MiddlewareInterceptor provider classes
 *
 * @example
 *
 * To inject the configuration without automatic reloading:
 *
 * ```ts
 * class SpyInterceptorProvider extends ExpressMiddlewareInterceptorProvider<
 *   SpyConfig
 *   > {
 *     constructor(@config() spyConfig?: SpyConfig) {
 *       super(spy, spyConfig);
 *     }
 * }
 * ```
 *
 * To inject the configuration without automatic reloading:
 * ```ts
 * class SpyInterceptorProvider extends ExpressMiddlewareInterceptorProvider<
 *   SpyConfig
 * > {
 *   constructor(@config.view() configView?: ContextView<SpyConfig>) {
 *     super(spy, configView);
 *   }
 * }
 * ```
 *
 * @typeParam CFG - Configuration type
 */
class ExpressMiddlewareInterceptorProvider {
    constructor(middlewareFactory, middlewareConfig) {
        this.middlewareFactory = middlewareFactory;
        if (middlewareConfig != null && middlewareConfig instanceof core_1.ContextView) {
            this.middlewareConfigView = middlewareConfig;
        }
        else {
            this.middlewareConfig = middlewareConfig;
        }
        this.setupConfigView();
    }
    setupConfigView() {
        if (this.middlewareConfigView) {
            // Set up a listener to reset the cached interceptor function for the
            // first time
            this.middlewareConfigView.on('refresh', () => {
                if (this.binding != null) {
                    debug('Configuration change is detected for binding %s.' +
                        ' The Express middleware handler function will be recreated.', this.binding.key);
                }
                this.interceptor = null;
            });
        }
    }
    value() {
        return async (ctx, next) => {
            var _a;
            // Get the latest configuration
            if (this.middlewareConfigView != null) {
                this.middlewareConfig =
                    (_a = (await this.middlewareConfigView.singleValue())) !== null && _a !== void 0 ? _a : this.middlewareConfig;
            }
            if (this.interceptor == null) {
                // Create a new interceptor for the first time or recreate it if it
                // was reset to `null` when its configuration changed
                debug('Creating interceptor for %s with config', this.middlewareFactory.name, this.middlewareConfig);
                this.interceptor = createInterceptor(this.middlewareFactory, this.middlewareConfig);
            }
            return this.interceptor(ctx, next);
        };
    }
}
tslib_1.__decorate([
    core_1.inject.binding(),
    tslib_1.__metadata("design:type", core_1.Binding)
], ExpressMiddlewareInterceptorProvider.prototype, "binding", void 0);
exports.ExpressMiddlewareInterceptorProvider = ExpressMiddlewareInterceptorProvider;
/**
 * Define a provider class that wraps the middleware as an interceptor
 * @param middlewareFactory - Express middleware factory function
 * @param defaultMiddlewareConfig - Default middleware config
 * @param className - Class name for the generated provider class
 *
 * @typeParam CFG - Configuration type
 * @typeParam CTX - Context type
 */
function defineInterceptorProvider(middlewareFactory, defaultMiddlewareConfig, options) {
    let className = options === null || options === void 0 ? void 0 : options.providerClassName;
    className = buildName(middlewareFactory, className);
    (0, assert_1.default)(className, 'className is missing and it cannot be inferred.');
    const defineNamedClass = new Function('middlewareFactory', 'defaultMiddlewareConfig', 'MiddlewareInterceptorProvider', 'createInterceptor', `return class ${className} extends MiddlewareInterceptorProvider {
       constructor(middlewareConfig) {
         super(
           middlewareFactory,
           middlewareConfig,
         );
         if (this.middlewareConfig == null) {
           this.middlewareConfig = defaultMiddlewareConfig;
         }
       }
     };`);
    const cls = defineNamedClass(middlewareFactory, defaultMiddlewareConfig, ExpressMiddlewareInterceptorProvider, createInterceptor);
    if ((options === null || options === void 0 ? void 0 : options.injectConfiguration) === 'watch') {
        // Inject the config view
        core_1.config.view()(cls, '', 0);
        new core_1.NamespacedReflect().metadata('design:paramtypes', [core_1.ContextView])(cls);
    }
    else {
        // Inject the config
        (0, core_1.config)()(cls, '', 0);
    }
    return cls;
}
exports.defineInterceptorProvider = defineInterceptorProvider;
/**
 * Build a name for the middleware
 * @param middlewareFactory - Express middleware factory function
 * @param providedName - Provided name
 * @param suffix - Suffix
 */
function buildName(middlewareFactory, providedName, suffix) {
    if (!providedName) {
        let name = middlewareFactory.name;
        name = name.replace(/[^\w]/g, '_');
        if (name) {
            providedName = `${name}${suffix !== null && suffix !== void 0 ? suffix : ''}`;
        }
    }
    return providedName;
}
exports.buildName = buildName;
/**
 * Bind a middleware interceptor to the given context
 *
 * @param ctx - Context object
 * @param middlewareFactory - Express middleware factory function
 * @param middlewareConfig - Express middleware config
 * @param options - Options for registration
 *
 * @typeParam CFG - Configuration type
 */
function registerExpressMiddlewareInterceptor(ctx, middlewareFactory, middlewareConfig, options = {}) {
    options = {
        injectConfiguration: true,
        global: true,
        group: keys_1.DEFAULT_MIDDLEWARE_GROUP,
        ...options,
    };
    if (!options.injectConfiguration) {
        let key = options.key;
        if (!key) {
            const name = buildName(middlewareFactory);
            const namespace = options.global
                ? keys_1.GLOBAL_MIDDLEWARE_INTERCEPTOR_NAMESPACE
                : keys_1.MIDDLEWARE_INTERCEPTOR_NAMESPACE;
            key = name ? `${namespace}.${name}` : core_1.BindingKey.generate(namespace);
        }
        const binding = ctx
            .bind(key)
            .to(createInterceptor(middlewareFactory, middlewareConfig));
        if (options.global) {
            binding.tag({ [core_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: 'route' });
            binding.apply((0, core_1.asGlobalInterceptor)(options.group));
        }
        return binding;
    }
    const providerClass = defineInterceptorProvider(middlewareFactory, middlewareConfig, options);
    const binding = createMiddlewareInterceptorBinding(providerClass, options);
    ctx.add(binding);
    return binding;
}
exports.registerExpressMiddlewareInterceptor = registerExpressMiddlewareInterceptor;
/**
 * Create a binding for the middleware based interceptor
 *
 * @param middlewareProviderClass - Middleware provider class
 * @param options - Options to create middlewareFactory interceptor binding
 *
 */
function createMiddlewareInterceptorBinding(middlewareProviderClass, options = {}) {
    options = {
        global: true,
        group: keys_1.DEFAULT_MIDDLEWARE_GROUP,
        ...options,
    };
    const namespace = options.global
        ? keys_1.GLOBAL_MIDDLEWARE_INTERCEPTOR_NAMESPACE
        : keys_1.MIDDLEWARE_INTERCEPTOR_NAMESPACE;
    const binding = (0, core_1.createBindingFromClass)(middlewareProviderClass, {
        defaultScope: core_1.BindingScope.SINGLETON,
        namespace,
    });
    if (options.global) {
        binding.tag({ [core_1.ContextTags.GLOBAL_INTERCEPTOR_SOURCE]: 'route' });
        binding.apply((0, core_1.asGlobalInterceptor)(options.group));
    }
    return binding;
}
exports.createMiddlewareInterceptorBinding = createMiddlewareInterceptorBinding;
//# sourceMappingURL=middleware-interceptor.js.map