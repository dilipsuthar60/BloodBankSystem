import { Entity } from '@loopback/repository';
export declare class Donor extends Entity {
    id?: number;
    name: string;
    email: string;
    gender: string;
    dob: string;
    medicalCondition: string;
    bloodGroup: string;
    password: string;
    camps: number[];
    image: string;
    constructor(data?: Partial<Donor>);
}
export interface DonorRelations {
}
export type DonorWithRelations = Donor & DonorRelations;
