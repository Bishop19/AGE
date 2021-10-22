export interface Endpoint {
  base_path: string;
  endpoint_path: string;
  method: string;
  query_params: Record<string, Param>;
  path_params: Record<string, Param>;
  body_params: Record<string, Param>;
  security: string;
}

export interface Config {
  endpoints: Array<Endpoint>;
}

export interface Parser {
  parse: (filename: string) => Promise<Config>;
}

export type Param = string | Object;
