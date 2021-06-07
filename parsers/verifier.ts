import fs from 'fs';

const openapi = ['openapi', 'swagger'];
const raml = ['raml', 'RAML'];
const apiblueprint = ['FORMAT:'];

export const verify = (filename: string) => {
  const file = fs.readFileSync(filename, 'utf-8');
  const match = file.match(/(openapi)|(swagger)|(raml)|(RAML)|(FORMAT:)/);

  if (match) {
    if (openapi.includes(match[0])) return 'OPENAPI';
    else if (raml.includes(match[0])) return 'RAML';
    else if (apiblueprint.includes(match[0])) return 'APIBLUEPRINT';
  } else null;
};
