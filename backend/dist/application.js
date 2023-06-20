"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodbankApplication = void 0;
const tslib_1 = require("tslib");
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
const boot_1 = require("@loopback/boot");
const rest_explorer_1 = require("@loopback/rest-explorer");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const path_1 = tslib_1.__importDefault(require("path"));
const sequence_1 = require("./sequence");
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const datasources_1 = require("./datasources");
class BloodbankApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // Mount authentication system
        this.component(authentication_1.AuthenticationComponent);
        // Mount jwt component
        this.component(authentication_jwt_1.JWTAuthenticationComponent);
        // Bind datasource
        this.dataSource(datasources_1.BloodbankDataSource, authentication_jwt_1.UserServiceBindings.DATASOURCE_NAME);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
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
exports.BloodbankApplication = BloodbankApplication;
//# sourceMappingURL=application.js.map