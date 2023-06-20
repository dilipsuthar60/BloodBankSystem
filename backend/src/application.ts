// import { BootMixin } from '@loopback/boot';
// import { ApplicationConfig } from '@loopback/core';
// import {
//   RestExplorerBindings,
//   RestExplorerComponent,
// } from '@loopback/rest-explorer';
// import { RepositoryMixin } from '@loopback/repository';
// import { RestApplication } from '@loopback/rest';
// import { ServiceMixin } from '@loopback/service-proxy';
// import path from 'path';
// import { MySequence } from './sequence';
// import { AuthController } from './controllers/authcontroller';
// import {AuthenticationComponent} from '@loopback/authentication/dist';
// import {JWTAuthenticationComponent, MyUserService, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';

// export { ApplicationConfig };

// export class BloodbankApplication extends BootMixin(
//   ServiceMixin(RepositoryMixin(RestApplication)),
// ) {
//   constructor(options: ApplicationConfig = {}) {
//     super(options);

//     // Set up the custom sequence
//     this.sequence(MySequence);

//     // Set up default home page
//     this.static('/', path.join(__dirname, '../public'));

//     // Customize @loopback/rest-explorer configuration here
//     this.configure(RestExplorerBindings.COMPONENT).to({
//       path: '/explorer',
//     });
//     this.component(RestExplorerComponent);

//     // Set up authentication component
//     this.component(AuthenticationComponent);

//     // Bind your controller(s) here
//     this.controller(AuthController);

//     this.component(JWTAuthenticationComponent);

//     // this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTTokenService);
//     this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

//     this.projectRoot = __dirname;
//     // Customize @loopback/boot Booter Conventions here
//     this.bootOptions = {
//       controllers: {
//         // Customize ControllerBooter Conventions here
//         dirs: ['controllers'],
//         extensions: ['.controller.js'],
//         nested: true,
//       },
//     };
//   }
// }


import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {BloodbankDataSource} from './datasources';
export {ApplicationConfig};

export class BloodbankApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {

    super(options);
  // Mount authentication system
  this.component(AuthenticationComponent);
  // Mount jwt component
  this.component(JWTAuthenticationComponent);
  // Bind datasource
  this.dataSource(BloodbankDataSource, UserServiceBindings.DATASOURCE_NAME);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
