import { Entity } from '@loopback/repository';
export declare class Camp extends Entity {
    id?: number;
    name: string;
    date: string;
    location: string;
    createdBy: string;
    donors: object[];
    startTime: string;
    endTime: string;
    constructor(data?: Partial<Camp>);
}
export interface CampRelations {
}
export type CampWithRelations = Camp & CampRelations;
