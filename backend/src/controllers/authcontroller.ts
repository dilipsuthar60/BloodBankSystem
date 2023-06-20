// import { post, requestBody } from '@loopback/rest';
// import { Donor } from '../models';
// import { DonorRepository } from '../repositories';
// import { repository } from '@loopback/repository';
// import { compareSync } from 'bcrypt';
// import { inject } from '@loopback/core';
// import { TokenService, UserService } from '@loopback/authentication/dist';
// import { Credentials, TokenServiceBindings, UserServiceBindings } from '@loopback/authentication-jwt';
// import {UserProfile, securityId} from '@loopback/security/dist';

// export class AuthController {
//   constructor(
//     @repository(DonorRepository)
//     public donorRepository: DonorRepository,

//     @inject(TokenServiceBindings.TOKEN_SERVICE)
//     public jwtService: TokenService,

//     @inject(UserServiceBindings.USER_SERVICE)
//     public userService: UserService<Donor, Credentials>,
//   ) {}

//   @post('/login')
//   async login(
//     @requestBody() credentials: Credentials,
//   ): Promise<{ token: string }> {
//     const { email, password } = credentials;

//     // Find the donor by email
//     const donor = await this.donorRepository.findOne({ where: { email } });

//     if (!donor) {
//       throw new Error('Invalid email or password');
//     }

//     // Compare the provided password with the stored hashed password
//     const passwordMatched = compareSync(password, donor.password);

//     if (!passwordMatched) {
//       throw new Error('Invalid email or password');
//     }

//     // Create a user profile from the donor object
//     const userProfile: UserProfile = {
//       id: donor?.id?.toString() ?? '',
//       [securityId]: donor?.id?.toString() ?? '',
//       name: donor.name,
//       email: donor.email
//     };

//     // Generate and sign the JWT token
//     const token = await this.jwtService.generateToken(userProfile);

//     return { token };
//   }
// }
