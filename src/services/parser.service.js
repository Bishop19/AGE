import axios from 'axios';

const API_URL =
  process.env.REACT_APP_PARSER_API_URL ||
  'https://agp-doc-parser.herokuapp.com';

const parse = (file) => {
  const form_data = new FormData();

  form_data.append('file', file);

  return axios
    .post(`${API_URL}/parser`, form_data, {
      'Content-type': 'multipart/form-data',
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

export default {
  parse,
};
