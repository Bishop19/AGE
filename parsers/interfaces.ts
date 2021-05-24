export interface Endpoint {
  path: string;
  method: string;
}

export interface Parser {
  parse: (filename: string) => Array<Endpoint>;
}
