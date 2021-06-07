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

  private parseRequestBody(request: any) {
    const params: Record<string, Param> = {};
    const body = request.content['application/json'].schema;
    Object.entries(body.properties).forEach(
      ([param, type]: [string, any]) => (params[param] = type)
    );

    return params;
  }

  private generateEndpoints(api: OpenAPI.Document): Array<Endpoint> {
    const endpoints: Array<Endpoint> = [];

    Object.entries(api.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, info]) => {
        const query_params: Record<string, Param> = {};
        const path_params: Record<string, Param> = {};

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

        const body = (info as any).requestBody;
        let body_params: Record<string, Param> = {};
        if (body) {
          body_params = this.parseRequestBody(body);
        }

        endpoints.push({
          path,
          method,
          query_params,
          path_params,
          body_params,
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
        const domain = (parsed as any).servers[0].url;

        return {
          domain,
          endpoints,
        };
      })
      .catch((error) => {
        console.error(error);
        return { domain: 'Error', endpoints: [] };
      });

    return config;
  };
}
