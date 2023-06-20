import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { RefreshToken, RefreshTokenRelations } from '../models';
export declare class RefreshTokenRepository extends DefaultCrudRepository<RefreshToken, typeof RefreshToken.prototype.id, RefreshTokenRelations> {
    constructor(dataSource: juggler.DataSource);
}
