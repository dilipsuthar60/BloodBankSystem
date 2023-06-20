/// <reference types="node" />
/// <reference types="node" />
/// <reference types="express" />
import { BindingKey, Context } from '@loopback/core';
import { InvokeMiddleware } from '@loopback/express';
import { HttpProtocol } from '@loopback/http-server';
import { OpenApiSpec, OperationObject } from '@loopback/openapi-v3';
import https from 'https';
import { ErrorWriterOptions } from 'strong-error-handler';
import { BodyParser, RequestBodyParser } from './body-parsers';
import { HttpHandler } from './http-handler';
import { RestServer, RestServerConfig } from './rest.server';
import { ResolvedRoute, RestRouter, RestRouterOptions } from './router';
import { SequenceHandler } from './sequence';
import { AjvFactory, FindRoute, InvokeMethod, LogError, OperationArgs, ParseParams, Reject, Request, RequestBodyParserOptions, Response, Send } from './types';
/**
 * RestServer-specific bindings
 */
export declare namespace RestBindings {
    /**
     * Binding key for setting and injecting RestComponentConfig
     */
    const CONFIG: BindingKey<RestServerConfig>;
    /**
     * Binding key for setting and injecting the host name of RestServer
     */
    const HOST: BindingKey<string | undefined>;
    /**
     * Binding key for setting and injecting the port number of RestServer
     */
    const PORT: BindingKey<number>;
    /**
     * Binding key for setting and injecting the socket path of the RestServer
     */
    const PATH: BindingKey<string | undefined>;
    /**
     * Binding key for setting and injecting the URL of RestServer
     */
    const URL: BindingKey<string>;
    /**
     * Binding key for setting and injecting the protocol of RestServer
     */
    const PROTOCOL: BindingKey<HttpProtocol>;
    /**
     * Binding key for HTTPS options
     */
    const HTTPS_OPTIONS: BindingKey<https.ServerOptions<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
    /**
     * Binding key for the server itself
     */
    const SERVER: BindingKey<RestServer>;
    /**
     * Internal binding key for basePath
     */
    const BASE_PATH: BindingKey<string>;
    /**
     * Internal binding key for http-handler
     */
    const HANDLER: BindingKey<HttpHandler>;
    /**
     * Internal binding key for rest router
     */
    const ROUTER: BindingKey<RestRouter>;
    const ROUTER_OPTIONS: BindingKey<RestRouterOptions>;
    /**
     * Binding key for setting and injecting Reject action's error handling
     * options.
     *
     * See https://github.com/loopbackio/strong-error-handler#options for
     * the list of available options. Please note that the flag `log` is not used
     * by `@loopback/rest`.
     */
    const ERROR_WRITER_OPTIONS: BindingKey<ErrorWriterOptions>;
    /**
     * Binding key for request body parser options
     */
    const REQUEST_BODY_PARSER_OPTIONS: BindingKey<RequestBodyParserOptions>;
    /**
     * Binding key for request body parser
     */
    const REQUEST_BODY_PARSER: BindingKey<RequestBodyParser>;
    /**
     * Binding key for request json body parser
     */
    const REQUEST_BODY_PARSER_JSON: BindingKey<BodyParser>;
    /**
     * Binding key for request urlencoded body parser
     */
    const REQUEST_BODY_PARSER_URLENCODED: BindingKey<BodyParser>;
    /**
     * Binding key for request text body parser
     */
    const REQUEST_BODY_PARSER_TEXT: BindingKey<BodyParser>;
    /**
     * Binding key for request raw body parser
     */
    const REQUEST_BODY_PARSER_RAW: BindingKey<BodyParser>;
    /**
     * Binding key for request raw body parser
     */
    const REQUEST_BODY_PARSER_STREAM: BindingKey<BodyParser>;
    /**
     * Binding key for AJV
     */
    const AJV_FACTORY: BindingKey<AjvFactory>;
    /**
     * Binding key for setting and injecting an OpenAPI spec
     */
    const API_SPEC: BindingKey<OpenApiSpec>;
    /**
     * Binding key for setting and injecting an OpenAPI operation spec
     */
    const OPERATION_SPEC_CURRENT: BindingKey<OperationObject>;
    /**
     * Binding key for setting and injecting a Sequence
     */
    const SEQUENCE: BindingKey<SequenceHandler>;
    /**
     * Binding key for setting and injecting a `invokeMiddleware` function for
     * middleware based sequence
     */
    const INVOKE_MIDDLEWARE_SERVICE: BindingKey<InvokeMiddleware>;
    /**
     * Bindings for potential actions that could be used in a sequence
     */
    namespace SequenceActions {
        /**
         * Binding key for setting and injecting `invokeMiddleware` function
         */
        const INVOKE_MIDDLEWARE: BindingKey<InvokeMiddleware>;
        /**
         * Binding key for setting and injecting a route finding function
         */
        const FIND_ROUTE: BindingKey<FindRoute>;
        /**
         * Binding key for setting and injecting a parameter parsing function
         */
        const PARSE_PARAMS: BindingKey<ParseParams>;
        /**
         * Binding key for setting and injecting a controller route invoking function
         */
        const INVOKE_METHOD: BindingKey<InvokeMethod>;
        /**
         * Binding key for setting and injecting an error logging function
         */
        const LOG_ERROR: BindingKey<LogError>;
        /**
         * Binding key for setting and injecting a response writing function
         */
        const SEND: BindingKey<Send>;
        /**
         * Binding key for setting and injecting a bad response writing function
         */
        const REJECT: BindingKey<Reject>;
    }
    namespace Operation {
        const ROUTE: BindingKey<ResolvedRoute>;
        const PARAMS: BindingKey<OperationArgs>;
        const RETURN_VALUE: BindingKey<any>;
    }
    /**
     * Request-specific bindings
     */
    namespace Http {
        /**
         * Binding key for setting and injecting the http request
         */
        const REQUEST: BindingKey<Request>;
        /**
         * Binding key for setting and injecting the http response
         */
        const RESPONSE: BindingKey<Response<any, Record<string, any>>>;
        /**
         * Binding key for setting and injecting the http request context
         */
        const CONTEXT: BindingKey<Context>;
    }
    /**
     * Namespace for REST routes
     */
    const ROUTES = "routes";
}
/**
 * Binding tags for RestServer
 */
export declare namespace RestTags {
    /**
     * Binding tag to identify REST routes
     */
    const REST_ROUTE = "restRoute";
    /**
     * Binding tag for the REST route verb
     */
    const ROUTE_VERB = "restRouteVerb";
    /**
     * Binding tag for the REST route path
     */
    const ROUTE_PATH = "restRoutePath";
    /**
     * Binding tag to identify controller based REST routes
     */
    const CONTROLLER_ROUTE = "controllerRoute";
    /**
     * Binding tag for controller route bindings to represent the controller
     * binding key
     */
    const CONTROLLER_BINDING = "controllerBinding";
    const AJV_KEYWORD = "ajvKeyword";
    const AJV_FORMAT = "ajvFormat";
    const REST_MIDDLEWARE_CHAIN = "middlewareChain.default";
    /**
     * Legacy middleware chain for action-based REST sequence
     */
    const ACTION_MIDDLEWARE_CHAIN = "middlewareChain.rest.actions";
}
