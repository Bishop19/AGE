import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

/* Material UI */
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Card,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

/* Components */
import Endpoint from '../../components/Endpoint';
import Stepper from '../../components/Stepper';

/* Services */
import cloudsService from '../../services/clouds.service';
import configsService from '../../services/configs.service';

/* Logos */
import krakend from '../../assets/images/krakend.png';
import kong from '../../assets/images/kong.png';
import tyk from '../../assets/images/tyk.png';
import gcp from '../../assets/images/gcp.png';
import aws from '../../assets/images/aws.png';
import azure from '../../assets/images/azure.png';

const APIDoc = ({ endpoints }) => {
  const [loading, setLoading] = useState(false);
  const [show_endpoints, setShowEndpoints] = useState(false);

  const parseFile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowEndpoints(true);
    }, 2000);
  };

  return (
    <Box>
      <Box py={2}>
        <Typography variant="h5">Information</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Basic configuration's information
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              Name
            </Grid>
            <Grid item xs={10}>
              <TextField fullWidth label="Name" variant="outlined" />
            </Grid>
            <Grid item xs={2}>
              Domain
            </Grid>
            <Grid item xs={10}>
              <TextField fullWidth label="Domain" variant="outlined" />
            </Grid>
            <Grid item xs={2}>
              File
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                type="file"
                variant="outlined"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (output) => {
                      parseFile(output.target.result);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
      {!loading && show_endpoints && (
        <>
          <hr></hr>
          <Box py={2}>
            <Typography variant="h5">Endpoints</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
              Check if the endpoints are correct
            </Typography>

            {endpoints.map((endpoint, index) => (
              <Endpoint
                key={index}
                path={endpoint.path}
                method={endpoint.method}
              ></Endpoint>
            ))}
          </Box>
        </>
      )}
      {loading && !show_endpoints && (
        <>
          <hr></hr>
          <Box display="flex" justifyContent="center" margin={4}>
            <CircularProgress size="96px" color="secondary" />
          </Box>
        </>
      )}
    </Box>
  );
};

const APIGatewayCard = ({ gateway, onSelect }) => {
  const classes = makeStyles(() => ({
    selected: {
      boxShadow: '0 0 8px 3px green',
    },
    pointer: {
      cursor: 'pointer',
    },
    fullHeight: {
      height: '100%',
      borderRadius: '20px',
    },
  }))();

  const handleLearnMoreClick = (event) => {
    event.stopPropagation();
    window.open('https://www.google.com', '_blank');
  };

  return (
    <Card
      onClick={onSelect}
      className={clsx(classes.pointer, classes.fullHeight, {
        [classes.selected]: gateway.is_selected,
      })}
    >
      <Box padding={3}>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <img src={gateway.logo} alt="Logo" style={{ maxWidth: '50%' }} />
        </Box>
        <hr></hr>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="fontWeightBold"
        >
          <Typography variant="h5">{gateway.name}</Typography>
          <p onClick={handleLearnMoreClick}>Learn more</p>
        </Box>
      </Box>
    </Card>
  );
};

const APIGateways = ({ gateways, onSelect }) => {
  return (
    <Box>
      <Box py={2}>
        <Typography variant="h5">API Gateways</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Choose which API Gateways will be tested.
        </Typography>
        <Grid container spacing={2}>
          {gateways.map((gateway, index) => (
            <Grid item xs={4} key={index}>
              <APIGatewayCard
                gateway={gateway}
                onSelect={() => onSelect(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const CloudCard = ({ cloud, onSelect }) => {
  const classes = makeStyles(() => ({
    selected: {
      boxShadow: '0 0 8px 3px green',
    },
    pointer: {
      cursor: 'pointer',
    },
    fullHeight: {
      height: '100%',
      borderRadius: '20px',
    },
  }))();

  const handleLearnMoreClick = (event) => {
    event.stopPropagation();
    window.open('https://www.google.com', '_blank');
  };

  return (
    <Card
      onClick={onSelect}
      className={clsx(classes.pointer, classes.fullHeight, {
        [classes.selected]: cloud.is_selected,
      })}
    >
      <Box padding={3}>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <img src={cloud.logo} alt="Logo" style={{ maxWidth: '40%' }} />
        </Box>
        <hr></hr>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="fontWeightBold"
        >
          <Typography variant="h5">{cloud.name}</Typography>
        </Box>
      </Box>
    </Card>
  );
};

const Clouds = ({ clouds, onSelect }) => {
  return (
    <Box>
      <Box py={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h5">Cloud Providers</Typography>
            <Typography variant="subtitle1" color="textSecondary" paragraph>
              Choose in which clouds the API Gateways will be deployed.
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/clouds/new"
            >
              New
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {clouds.length ? (
            clouds.map((cloud, index) => (
              <Grid item xs={4} key={index}>
                <CloudCard cloud={cloud} onSelect={() => onSelect(index)} />
              </Grid>
            ))
          ) : (
            <Box display="flex" margin="auto">
              <Typography>
                There are no clouds available. Please, create a new one.
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>

      <hr></hr>

      <Box py={2}>
        <Typography variant="h5">Machine Specification</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Choose the hardware in which the API Gateway will be deployed.
        </Typography>
        <form>
          <Box display="flex">
            <Box display="flex" flexGrow={1} pr={12}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  CPU
                </Grid>
                <Grid item xs={10}>
                  <TextField fullWidth label="CPU" variant="outlined" />
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" flexGrow={1} pr={12}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  RAM
                </Grid>
                <Grid item xs={10}>
                  <TextField fullWidth label="RAM" variant="outlined" />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

const Confirmation = ({ endpoints, gateways, clouds, onError }) => {
  const filtered_gateways = gateways.filter((gateway) => gateway.is_selected);
  const filtered_clouds = clouds.filter((cloud) => cloud.is_selected);

  useEffect(() => {
    if (
      endpoints.length &&
      filtered_gateways.length &&
      filtered_clouds.length
    ) {
      onError(false);
    } else {
      onError(true);
    }
  });

  return (
    <Box>
      <Box margin="20px 0">
        <Typography variant="h5">Confirmation</Typography>
        <p>Endpoints: {endpoints.length}</p>
        <p>Gateways: {filtered_gateways.map((gateway) => gateway.name)}</p>
        <p>Clouds: {filtered_clouds.map((cloud) => cloud.id)}</p>
      </Box>
    </Box>
  );
};

const ConfigNew = () => {
  const history = useHistory();
  const steps = ['Documentation', 'API Gateways', 'Cloud', 'Confirmation'];
  const [is_submitting, setSubmitting] = useState(false);
  const [endpoints, setEndpoints] = useState([
    { path: '/endpoint1', method: 'GET' },
    { path: '/endpoint2', method: 'POST' },
    { path: '/endpoint3', method: 'PUT' },
    { path: '/endpoint4', method: 'DELETE' },
    { path: '/endpoint5', method: 'PATCH' },
    { path: '/endpoint6', method: 'OPTIONS' },
    { path: '/endpoint7', method: 'HEAD' },
  ]);

  const [gateways, setGateways] = useState([
    { name: 'KrakenD', logo: krakend, is_selected: true },
    { name: 'Kong', logo: kong, is_selected: false },
    { name: 'Tyk', logo: tyk, is_selected: false },
  ]);

  const handleGatewaySelect = (index) => {
    gateways[index].is_selected = !gateways[index].is_selected;
    setGateways(JSON.parse(JSON.stringify(gateways))); // TODO
  };

  const [clouds, setClouds] = useState([]);

  const handleCloudSelect = (index) => {
    clouds[index].is_selected = !clouds[index].is_selected;
    setClouds(JSON.parse(JSON.stringify(clouds))); // TODO
  };

  useEffect(() => {
    const fetchClouds = async () => {
      const clouds = await cloudsService.getClouds();

      clouds.forEach((cloud) => {
        cloud.is_selected = false;
        switch (cloud.provider) {
          case 'GCP':
            cloud.logo = gcp;
            break;
          case 'AZURE':
            cloud.logo = azure;
            break;
          case 'AWS':
            cloud.logo = aws;
            break;
        }
      });

      setClouds(clouds);
    };

    fetchClouds();
  }, []);

  const [error, setError] = useState(false);
  const handleError = (value) => {
    setError(value);
  };

  /* eslint-disable react/jsx-key */
  const components = [
    <APIDoc endpoints={endpoints} />,
    <APIGateways gateways={gateways} onSelect={handleGatewaySelect} />,
    <Clouds clouds={clouds} onSelect={handleCloudSelect} />,
    <Confirmation
      endpoints={endpoints}
      gateways={gateways}
      clouds={clouds}
      onError={setError}
    />,
  ];
  /* eslint-enable react/jsx-key */

  const [active_index, setActiveIndex] = useState(0);

  const handleStepChange = (step) => {
    switch (active_index + step) {
      case -1:
        setActiveIndex(0);
        break;
      case steps.length:
        setActiveIndex(steps.length - 1);
        break;
      default:
        setActiveIndex(active_index + step);
    }
  };

  const handleCreateConfig = async () => {
    setSubmitting(true);

    const filtered_gateways = gateways
      .filter((gateway) => gateway.is_selected)
      .map((gateway) => gateway.name.toUpperCase());
    const filtered_clouds = clouds
      .filter((cloud) => cloud.is_selected)
      .map((cloud) => cloud.id);

    const config = await configsService.createConfig(
      endpoints,
      filtered_gateways,
      filtered_clouds
    );

    if (config) {
      // TODO
      setSubmitting(false);
      toast.success('Configuration created!');
      history.push('/configs');
    } else {
      // TODO
      setSubmitting(false);
      toast.success('Something went wrong!');
    }
  };

  return (
    <>
      <Typography variant="h3">Create a configuration</Typography>
      <Stepper steps={steps} active_index={active_index} />
      <hr></hr>
      {components[active_index]}
      <hr></hr>
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleStepChange(-1)}
          disabled={active_index === 0}
        >
          Back
        </Button>
        {active_index === steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCreateConfig()}
            disabled={error || is_submitting}
          >
            {is_submitting ? (
              <CircularProgress size="20px" color="secondary" />
            ) : (
              <>Create</>
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleStepChange(1)}
          >
            Next
          </Button>
        )}
      </Box>
    </>
  );
};

export default ConfigNew;

/* Proptypes */

APIDoc.propTypes = {
  endpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
};

APIGatewayCard.propTypes = {
  gateway: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

APIGateways.propTypes = {
  gateways: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

CloudCard.propTypes = {
  cloud: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

Clouds.propTypes = {
  clouds: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
};

Confirmation.propTypes = {
  endpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  gateways: PropTypes.arrayOf(PropTypes.object).isRequired,
  clouds: PropTypes.arrayOf(PropTypes.object).isRequired,
  onError: PropTypes.func.isRequired,
};
