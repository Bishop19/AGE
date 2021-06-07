import { Parser } from './interfaces';

export default class RAMLParser implements Parser {
  parse = async (filename: string) => {
    return {
      domain: 'NOT IMPLEMENTED',
      endpoints: [
        {
          path: 'RAML',
          method: 'NOT IMPLEMENTED',
          query_params: {},
          path_params: {},
          body_params: {},
        },
      ],
    };
  };
}
