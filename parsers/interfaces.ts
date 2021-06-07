export interface Endpoint {
  path: string;
  method: string;
  query_params: Record<string, Param>;
  path_params: Record<string, Param>;
  body_params: Record<string, Param>;
}

export interface Config {
  domain: string;
  endpoints: Array<Endpoint>;
}

export interface Parser {
  parse: (filename: string) => Promise<Config>;
}

export type Param = string | Object;
