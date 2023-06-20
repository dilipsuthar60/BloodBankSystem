import { DefaultCrudRepository } from '@loopback/repository';
import { BloodbankDataSource } from '../datasources';
import { Donor, DonorRelations } from '../models';
export declare class DonorRepository extends DefaultCrudRepository<Donor, typeof Donor.prototype.id, DonorRelations> {
    constructor(dataSource: BloodbankDataSource);
}
