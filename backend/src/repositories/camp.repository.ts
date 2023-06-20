import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BloodbankDataSource} from '../datasources';
import {Camp, CampRelations} from '../models';

export class CampRepository extends DefaultCrudRepository<
  Camp,
  typeof Camp.prototype.id,
  CampRelations
> {
  constructor(
    @inject('datasources.bloodbank') dataSource: BloodbankDataSource,
  ) {
    super(Camp, dataSource);
  }
}
