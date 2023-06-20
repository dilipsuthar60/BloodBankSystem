import { OpenApiSpecForm, RequestContext, RestServer, RestServerConfig } from '@loopback/rest';
import { RestExplorerConfig } from './rest-explorer.types';
export declare class ExplorerController {
    private serverBasePath;
    private restServer;
    private requestContext;
    static readonly OPENAPI_RELATIVE_URL = "openapi.json";
    static readonly OPENAPI_FORM: OpenApiSpecForm;
    private openApiSpecUrl;
    private useSelfHostedSpec;
    private swaggerThemeFile;
    private indexTemplatePath;
    private indexTemplateTitle;
    constructor(restConfig: RestServerConfig | undefined, explorerConfig: RestExplorerConfig | undefined, serverBasePath: string, restServer: RestServer, requestContext: RequestContext);
    indexRedirect(): void;
    index(): void;
    spec(): Promise<import("@loopback/rest").OpenAPIObject>;
    private getOpenApiSpecUrl;
}
