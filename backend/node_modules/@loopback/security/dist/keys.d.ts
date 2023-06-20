import { BindingKey } from '@loopback/core';
import { Subject, UserProfile } from './types';
/**
 * Binding keys for security related metadata
 */
export declare namespace SecurityBindings {
    /**
     * Binding key for subject
     */
    const SUBJECT: BindingKey<Subject>;
    /**
     * Binding key for current user profile
     */
    const USER: BindingKey<UserProfile>;
}
