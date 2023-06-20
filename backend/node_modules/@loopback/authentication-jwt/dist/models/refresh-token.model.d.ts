import { Entity } from '@loopback/repository';
export declare class RefreshToken extends Entity {
    id: number;
    userId: string;
    refreshToken: string;
    [prop: string]: any;
    constructor(data?: Partial<RefreshToken>);
}
export interface RefreshTokenRelations {
}
export type RefereshTokenWithRelations = RefreshToken & RefreshTokenRelations;
