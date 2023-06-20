import { Application, Binding, BindingFilter, Constructor } from '@loopback/core';
import { Bootable, Booter } from '../types';
/**
 * Binding keys excluded from a sub application. These bindings booted from the
 * sub application won't be added to the main application.
 */
export declare const bindingKeysExcludedFromSubApp: string[];
/**
 * Create a booter that boots the component application. Bindings that exist
 * in the component application before `boot` are skipped. Locked bindings in
 * the main application will not be overridden.
 *
 * @param componentApp - The application exposing a component
 * @param filter Binding filter to selected bindings to be added
 */
export declare function createBooterForComponentApplication(componentApp: Application & Bootable, filter?: BindingFilter): Constructor<Booter>;
/**
 * Create a binding to register a booter that boots the component application.
 * Bindings that exist in the component application before `boot` are skipped.
 * Locked bindings in the main application will not be overridden.
 *
 * @param componentApp - The application exposing a component
 * @param filter Binding filter to selected bindings to be added
 */
export declare function createComponentApplicationBooterBinding(componentApp: Application & Bootable, filter?: BindingFilter): Binding<Booter>;
