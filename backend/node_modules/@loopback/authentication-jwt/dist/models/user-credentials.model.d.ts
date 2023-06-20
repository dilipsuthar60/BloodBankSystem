import { Entity } from '@loopback/repository';
export declare class UserCredentials extends Entity {
    id: string;
    password: string;
    userId: string;
    [prop: string]: any;
    constructor(data?: Partial<UserCredentials>);
}
export interface UserCredentialsRelations {
}
export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
