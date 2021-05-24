import { Endpoint, Parser } from './interfaces';

export default class APIBlueprintParser implements Parser {
  parse = (filename: string) => {
    return [{ path: 'API Blueprint', method: 'NOT IMPLEMENTED' }];
  };
}
