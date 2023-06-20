import { Entity } from '@loopback/repository';
export declare class Admin extends Entity {
    email: string;
    id?: number;
    password: string;
    constructor(data?: Partial<Admin>);
}
export interface AdminRelations {
}
export type AdminWithRelations = Admin & AdminRelations;
