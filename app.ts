import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Parser } from './parsers/interfaces';
import { verify } from './parsers/verifier';
import APIBlueprintParser from './parsers/apiblueprint';
import OpenAPIParser from './parsers/openapi';
import RAMLParser from './parsers/raml';

const app = express();
const upload = multer({ dest: './uploads/' });

app.use(cors());

app.post('/parser', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.sendStatus(400);
  }

  let parser: Parser;
  let response;

  switch (verify('./uploads/' + file.filename)) {
    case 'OPENAPI':
      parser = new OpenAPIParser();
      response = parser.parse('./uploads/' + file.filename);
      break;
    // case 'RAML':
    //   parser = new RAMLParser();
    //   response = parser.parse('./uploads/' + file.filename);
    //   break;
    // case 'APIBLUEPRINT':
    //   parser = new APIBlueprintParser();
    //   response = parser.parse('./uploads/' + file.filename);
    //   break;
    default:
      res.status(500).send({ error: 'Documentation file not valid' });
  }
  res.send(await response);
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
});
