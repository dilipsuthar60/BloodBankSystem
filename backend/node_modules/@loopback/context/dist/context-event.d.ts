import { Binding } from './binding';
import { Context } from './context';
/**
 * Events emitted by a context
 */
export type ContextEvent = {
    /**
     * Source context that emits the event
     */
    context: Context;
    /**
     * Binding that is being added/removed/updated
     */
    binding: Readonly<Binding<unknown>>;
    /**
     * Event type
     */
    type: string;
};
/**
 * Synchronous listener for context events
 */
export type ContextEventListener = (event: ContextEvent) => void;
