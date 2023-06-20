"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataInspector = void 0;
const tslib_1 = require("tslib");
// Copyright IBM Corp. and LoopBack contributors 2017,2019. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const debug_1 = tslib_1.__importDefault(require("debug"));
const decorator_factory_1 = require("./decorator-factory");
const reflect_1 = require("./reflect");
const debug = (0, debug_1.default)('loopback:metadata:inspector');
/**
 * TypeScript reflector without a namespace. The TypeScript compiler can be
 * configured to add design time metadata.
 *
 * See https://www.typescriptlang.org/docs/handbook/decorators.html
 */
const TSReflector = new reflect_1.NamespacedReflect();
/**
 * Inspector for metadata applied by decorators
 */
class MetadataInspector {
    /**
     * Get the metadata associated with the given key for a given class
     * @param key - Metadata key
     * @param target - Class that contains the metadata
     * @param options - Options for inspection
     */
    static getClassMetadata(key, target, options) {
        return (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
    }
    /**
     * Define metadata for the given target
     * @param key - Metadata key
     * @param value - Metadata value
     * @param target - Target for the metadata
     * @param member - Optional property or method name
     */
    static defineMetadata(key, value, target, member) {
        reflect_1.Reflector.defineMetadata(key.toString(), value, target, member);
    }
    /**
     * Get the metadata associated with the given key for all methods of the
     * target class or prototype
     * @param key - Metadata key
     * @param target - Class for static methods or prototype for instance methods
     * @param options - Options for inspection
     */
    static getAllMethodMetadata(key, target, options) {
        return (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
    }
    /**
     * Get the metadata associated with the given key for a given method of the
     * target class or prototype
     * @param key - Metadata key
     * @param target - Class for static methods or prototype for instance methods
     * @param methodName - Method name. If not present, default to '' to use
     * the constructor
     * @param options - Options for inspection
     */
    static getMethodMetadata(key, target, methodName, options) {
        methodName = methodName !== null && methodName !== void 0 ? methodName : '';
        const meta = (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
        return meta === null || meta === void 0 ? void 0 : meta[methodName];
    }
    /**
     * Get the metadata associated with the given key for all properties of the
     * target class or prototype
     * @param key - Metadata key
     * @param target - Class for static methods or prototype for instance methods
     * @param options - Options for inspection
     */
    static getAllPropertyMetadata(key, target, options) {
        return (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
    }
    /**
     * Get the metadata associated with the given key for a given property of the
     * target class or prototype
     * @param key - Metadata key
     * @param target - Class for static properties or prototype for instance
     * properties
     * @param propertyName - Property name
     * @param options - Options for inspection
     */
    static getPropertyMetadata(key, target, propertyName, options) {
        const meta = (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
        return meta === null || meta === void 0 ? void 0 : meta[propertyName];
    }
    /**
     * Get the metadata associated with the given key for all parameters of a
     * given method
     * @param key - Metadata key
     * @param target - Class for static methods or prototype for instance methods
     * @param methodName - Method name. If not present, default to '' to use
     * the constructor
     * @param options - Options for inspection
     */
    static getAllParameterMetadata(key, target, methodName, options) {
        methodName = methodName !== null && methodName !== void 0 ? methodName : '';
        const meta = (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
        return meta === null || meta === void 0 ? void 0 : meta[methodName];
    }
    /**
     * Get the metadata associated with the given key for a parameter of a given
     * method by index
     * @param key - Metadata key
     * @param target - Class for static methods or prototype for instance methods
     * @param methodName - Method name. If not present, default to '' to use
     * the constructor
     * @param index - Index of the parameter, starting with 0
     * @param options - Options for inspection
     */
    static getParameterMetadata(key, target, methodName, index, options) {
        methodName = methodName || '';
        const meta = (options === null || options === void 0 ? void 0 : options.ownMetadataOnly)
            ? reflect_1.Reflector.getOwnMetadata(key.toString(), target)
            : reflect_1.Reflector.getMetadata(key.toString(), target);
        const params = meta === null || meta === void 0 ? void 0 : meta[methodName];
        return params === null || params === void 0 ? void 0 : params[index];
    }
    /**
     * Get TypeScript design time type for a property
     * @param target - Class or prototype
     * @param propertyName - Property name
     * @returns Design time metadata. The return value is `undefined` when:
     * - The property has type `undefined`, `null`
     * - The TypeScript project has not enabled the compiler option `emitDecoratorMetadata`.
     * - The code is written in vanilla JavaScript.
     */
    static getDesignTypeForProperty(target, propertyName) {
        return TSReflector.getMetadata('design:type', target, propertyName);
    }
    /**
     * Get TypeScript design time type for a method.
     * @param target - Class or prototype
     * @param methodName - Method name
     * @returns Design time metadata. The return value is `undefined`
     * in projects that do not enable `emitDecoratorMetadata`
     * in TypeScript compiler options or are written in vanilla JavaScript.
     */
    static getDesignTypeForMethod(target, methodName) {
        const type = TSReflector.getMetadata('design:type', target, methodName);
        const parameterTypes = TSReflector.getMetadata('design:paramtypes', target, methodName);
        const returnType = TSReflector.getMetadata('design:returntype', target, methodName);
        if (type === undefined &&
            parameterTypes === undefined &&
            returnType === undefined) {
            /* istanbul ignore next */
            if (debug.enabled) {
                const targetName = decorator_factory_1.DecoratorFactory.getTargetName(target, methodName);
                debug('No design-time type metadata found while inspecting %s. ' +
                    'Did you forget to enable TypeScript compiler option `emitDecoratorMetadata`?', targetName);
            }
            return undefined;
        }
        return {
            type,
            parameterTypes,
            returnType,
        };
    }
}
exports.MetadataInspector = MetadataInspector;
/**
 * Expose Reflector, which is a wrapper of `Reflect` and it uses `loopback`
 * as the namespace prefix for all metadata keys
 */
MetadataInspector.Reflector = reflect_1.Reflector;
/**
 * Expose the reflector for TypeScript design-time metadata
 */
MetadataInspector.DesignTimeReflector = TSReflector;
//# sourceMappingURL=inspector.js.map