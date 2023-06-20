import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Donor } from '../models';
import { CampRepository, DonorRepository } from '../repositories';
export declare class DonorController {
    donorRepository: DonorRepository;
    campRepository: CampRepository;
    constructor(donorRepository: DonorRepository);
    create(donor: Omit<Donor, 'id' | 'camps'>): Promise<Donor>;
    count(where?: Where<Donor>): Promise<Count>;
    find(filter?: Filter<Donor>): Promise<Donor[]>;
    updateAll(donor: Donor, where?: Where<Donor>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Donor>): Promise<Donor>;
    updateById(id: number, donor: Donor): Promise<void>;
    replaceById(id: number, donor: Donor): Promise<void>;
    deleteById(id: number): Promise<void>;
    login(credentials: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        id: number | undefined;
    }>;
    getDonorCamps(id: number): Promise<object[]>;
    isRegister(request: {
        donorId: number;
        campId: number;
    }): Promise<{
        isRegistered: boolean;
    }>;
}
