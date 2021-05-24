import SwaggerParser from '@apidevtools/swagger-parser';
import { Endpoint, Parser } from './interfaces';

export default class OpenAPIParser implements Parser {
  parse = (filename: string) => {
    SwaggerParser.parse(filename, { parse: { text: true } })
      .then((parsed) => console.log(parsed))
      .catch((error) => console.error(error));
    return [{ path: 'OPEN API', method: 'NOT IMPLEMENTED' }];
  };
}
