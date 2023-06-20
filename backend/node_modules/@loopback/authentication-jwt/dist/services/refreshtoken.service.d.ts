import { TokenService } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { RefreshToken, RefreshTokenRelations } from '../models';
import { RefreshTokenRepository } from '../repositories';
import { TokenObject } from '../types';
import { MyUserService } from './user.service';
export declare class RefreshtokenService {
    private refreshSecret;
    private refreshExpiresIn;
    private refreshIssure;
    refreshTokenRepository: RefreshTokenRepository;
    userService: MyUserService;
    jwtService: TokenService;
    constructor(refreshSecret: string, refreshExpiresIn: string, refreshIssure: string, refreshTokenRepository: RefreshTokenRepository, userService: MyUserService, jwtService: TokenService);
    /**
     * Generate a refresh token, bind it with the given user profile + access
     * token, then store them in backend.
     */
    generateToken(userProfile: UserProfile, token: string): Promise<TokenObject>;
    refreshToken(refreshToken: string): Promise<TokenObject>;
    revokeToken(refreshToken: string): Promise<void>;
    /**
     * Verify the validity of a refresh token, and make sure it exists in backend.
     * @param refreshToken
     */
    verifyToken(refreshToken: string): Promise<RefreshToken & RefreshTokenRelations>;
}
