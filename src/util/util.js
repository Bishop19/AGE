export const parseGatewayName = (gateway) => {
  switch (gateway.toLowerCase()) {
    case 'krakend':
      return 'KrakenD';
    case 'kong':
      return 'Kong';
    case 'tyk':
      return 'Tyk';
  }
};
