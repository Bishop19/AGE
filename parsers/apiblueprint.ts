import { Parser } from './interfaces';

export default class APIBlueprintParser implements Parser {
  parse = async (filename: string) => {
    return {
      domain: 'NOT IMPLEMENTED',
      endpoints: [
        {
          base_path: 'API Blueprint',
          endpoint_path: 'NOT IMPLEMENTED',
          method: 'NOT IMPLEMENTED',
          query_params: {},
          path_params: {},
          body_params: {},
          security: 'None',
          is_service: false,
        },
      ],
    };
  };
}
