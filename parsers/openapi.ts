import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';
import { Endpoint, Parser, Param, Config } from './interfaces';

// ONLY ACCEPTS OPENAPI 3; TODO OPENAPI2
export default class OpenAPIParser implements Parser {
  private parseParameterType(parameter: any): Param {
    let type = parameter.schema.type;

    if (type == 'array') type = '[' + parameter.schema.items.type + ']';

    return type;
  }

  private parseRequestBody(request: any): Record<string, Param> {
    const params: Record<string, Param> = {};
    const body = request.content['application/json']?.schema;

    if (body) {
      Object.entries(body.properties).forEach(
        ([param, type]: [string, any]) => (params[param] = type)
      );
    }

    return params;
  }

  private formatBasePath(path: string): string {
    if (path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
    return path;
  }

  private generateEndpoints(api: OpenAPI.Document): Array<Endpoint> {
    const endpoints: Array<Endpoint> = [];

    Object.entries(api.paths).forEach(([endpoint_path, methods]) => {
      Object.entries(methods).forEach(([method, info]) => {
        const query_params: Record<string, Param> = {};
        const path_params: Record<string, Param> = {};
        let is_service: boolean = false;
        let base_path: string = (api as any).servers
          ? this.formatBasePath((api as any).servers[0].url)
          : '';

        // Check if the base path is different from the default
        if ((info as any).servers) {
          base_path = this.formatBasePath((info as any).servers[0].url);
        }

        // Check if endpoint_path should be ignored (server only)
        if ((info as any).description === 'server only') {
          is_service = true;
        }

        // Parse parameters (path & query)
        (info as OpenAPI.Operation).parameters?.forEach((parameter: any) => {
          const type = this.parseParameterType(parameter);

          switch (parameter.in) {
            case 'query':
              query_params[parameter.name] = type;
              break;
            case 'path':
              path_params[parameter.name] = type;
              break;
          }
        });

        // Parse body
        const body = (info as any).requestBody;
        let body_params: Record<string, Param> = {};
        if (body) {
          body_params = this.parseRequestBody(body);
        }

        // Check Authorization
        // TODO : too basic check
        let security = 'NONE';
        if ((info as OpenAPI.Operation).security) {
          security = 'JWT';
        }

        endpoints.push({
          base_path,
          endpoint_path,
          method,
          query_params,
          path_params,
          body_params,
          security,
          is_service,
        });
      });
    });

    console.log(endpoints);

    return endpoints;
  }

  parse = async (filename: string) => {
    const config: Config = await SwaggerParser.dereference(filename)
      .then((parsed) => {
        const endpoints = this.generateEndpoints(parsed);

        return {
          endpoints,
        };
      })
      .catch((error) => {
        console.error(error);
        return { endpoints: [] };
      });

    return config;
  };
}
