import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Admin } from '../models';
import { AdminRepository } from '../repositories';
export declare class AdminController {
    adminRepository: AdminRepository;
    constructor(adminRepository: AdminRepository);
    create(admin: Admin): Promise<Admin>;
    count(where?: Where<Admin>): Promise<Count>;
    find(filter?: Filter<Admin>): Promise<Admin[]>;
    updateAll(admin: Admin, where?: Where<Admin>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Admin>): Promise<Admin>;
    updateById(id: number, admin: Admin): Promise<void>;
    replaceById(id: number, admin: Admin): Promise<void>;
    deleteById(id: number): Promise<void>;
    login(credentials: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
