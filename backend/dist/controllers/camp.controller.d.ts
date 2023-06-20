import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Camp } from '../models';
import { CampRepository, DonorRepository } from '../repositories';
export declare class CampController {
    campRepository: CampRepository;
    donorRepository: DonorRepository;
    constructor(campRepository: CampRepository, donorRepository: DonorRepository);
    create(camp: Omit<Camp, 'id' | 'donors'>): Promise<Camp>;
    count(where?: Where<Camp>): Promise<Count>;
    find(filter?: Filter<Camp>): Promise<Camp[]>;
    updateAll(camp: Camp, where?: Where<Camp>): Promise<Count>;
    findById(id: number, filter?: FilterExcludingWhere<Camp>): Promise<Camp>;
    updateById(id: number, camp: Camp): Promise<void>;
    replaceById(id: number, camp: Camp): Promise<void>;
    deleteById(id: number): Promise<void>;
    registerCamp(registrationData: {
        campId: number;
        donorId: number;
    }): Promise<Camp>;
    unregisterCamp(unregistrationData: {
        campId: number;
        donorId: number;
    }): Promise<Camp>;
    getCampDonors(campId: number): Promise<object[]>;
    sendEmailsToDonors(campId: number): Promise<string>;
}
