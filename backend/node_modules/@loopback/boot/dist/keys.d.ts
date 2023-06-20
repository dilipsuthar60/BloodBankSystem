import { BindingKey } from '@loopback/core';
import { Bootstrapper } from './bootstrapper';
import { BootOptions } from './types';
/**
 * Namespace for boot related binding keys
 */
export declare namespace BootBindings {
    /**
     * Binding key for boot options
     */
    const BOOT_OPTIONS: BindingKey<BootOptions>;
    /**
     * Binding key for determining project root directory
     */
    const PROJECT_ROOT: BindingKey<string>;
    /**
     * Binding key for binding the BootStrapper class
     */
    const BOOTSTRAPPER_KEY: BindingKey<Bootstrapper>;
    /**
     * Booter binding namespace
     */
    const BOOTERS = "booters";
    const BOOTER_PREFIX = "booters";
}
/**
 * Namespace for boot related tags
 */
export declare namespace BootTags {
    const BOOTER = "booter";
    /**
     * @deprecated Use `BootTags.BOOTER` instead.
     */
    const BOOTER_TAG = "booter";
}
