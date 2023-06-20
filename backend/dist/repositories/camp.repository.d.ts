import { DefaultCrudRepository } from '@loopback/repository';
import { BloodbankDataSource } from '../datasources';
import { Camp, CampRelations } from '../models';
export declare class CampRepository extends DefaultCrudRepository<Camp, typeof Camp.prototype.id, CampRelations> {
    constructor(dataSource: BloodbankDataSource);
}
