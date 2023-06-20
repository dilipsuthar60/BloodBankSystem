import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BloodbankDataSource} from '../datasources';
import {Donor, DonorRelations} from '../models';

export class DonorRepository extends DefaultCrudRepository<
  Donor,
  typeof Donor.prototype.id,
  DonorRelations
> {
  constructor(
    @inject('datasources.bloodbank') dataSource: BloodbankDataSource,
  ) {
    super(Donor, dataSource);
  }
}
