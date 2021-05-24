import { Endpoint, Parser } from './interfaces';

export default class RAMLParser implements Parser {
  parse = (filename: string) => {
    return [{ path: 'RAML', method: 'NOT IMPLEMENTED' }];
  };
}
