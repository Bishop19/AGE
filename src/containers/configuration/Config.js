import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';

/* Material UI */
import {
  Box,
  IconButton,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

/* Components */
import Endpoint from '../../components/Endpoint';

/* Services */
import configsService from '../../services/configs.service';
import testsService from '../../services/tests.service';

/* Icons */
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

/* Logos */
import krakend from '../../assets/images/krakend.png';
import kong from '../../assets/images/kong.png';
import tyk from '../../assets/images/tyk.png';
import gcp from '../../assets/images/gcp.png';
import aws from '../../assets/images/aws.png';
import azure from '../../assets/images/azure.png';

const useStyles = makeStyles((theme) => ({
  danger: {
    color: theme.palette.error.main,
  },
  tabs: {
    backgroundColor: 'white',
    color: theme.palette.secondary.main,
    borderRadius: '5px',
  },
  table: {
    minWidth: 650,
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const InfoCard = ({ name, score, className, downloadable }) => {
  const selectImage = (name) => {
    switch (name.toUpperCase()) {
      case 'GCP':
        return gcp;
      case 'AWS':
        return aws;
      case 'AZURE':
        return azure;
      case 'KONG':
        return kong;
      case 'KRAKEND':
        return krakend;
      case 'TYK':
        return tyk;
    }
  };

  const image = selectImage(name);

  const classes = makeStyles(() => ({
    fullHeight: {
      height: score ? '160px' : '100px',
      width: '200px',
      borderRadius: '20px',
    },
    clickable: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }))();

  const dowloadGatewayConfig = async (gateway) => {
    const valid = await configsService.getGatewayConfig(9, gateway);

    if (!valid) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Card
      className={clsx(classes.fullHeight, className, {
        [classes.clickable]: downloadable,
      })}
      onClick={
        downloadable
          ? () => dowloadGatewayConfig(name.toLowerCase())
          : undefined
      }
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          flexGrow={1}
          px={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img src={image} alt="Logo" style={{ maxWidth: '100%' }} />
        </Box>
        {score && (
          <>
            <Box px={2}>
              <hr></hr>
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h4">{score}</Typography>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
};

const Info = ({ gateways, cloud, endpoints }) => {
  return (
    <>
      <Box>
        <Typography variant="h5">Gateways</Typography>
        <Box display="flex">
          {gateways.map((gateway, index) => (
            <Box p={2} key={index}>
              <InfoCard name={gateway} downloadable />
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h5">Cloud</Typography>
        <Box display="flex">
          <Box p={2}>
            <InfoCard name={cloud.provider} />
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5">Endpoints</Typography>

        {endpoints.map((endpoint, index) => (
          <Endpoint key={index} endpoint={endpoint} />
        ))}
      </Box>
    </>
  );
};

const Deploy = ({ config }) => {
  const deployGateways = async () => {
    const valid = await configsService.deployGateways(config.id);

    // Todo: Rabbit?
  };

  return config.cloud.is_deployed ? (
    <>Deployed (TODO)</>
  ) : (
    <>
      <Typography variant="h5">Deploy</Typography>
      <Typography variant="body1">
        Based on your configuration, the following machines will be deployed:
      </Typography>
      {config.gateways.map((gateway, index) => (
        <li key={index}>{gateway}</li>
      ))}
      <Typography variant="body1">
        Each will have one gateway running, which will be used to load test your
        application.
      </Typography>
      <Button variant="contained" onClick={deployGateways}>
        Deploy
      </Button>
    </>
  );
};

const Test = ({ config, onDeploy }) => {
  const [test, setTest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRunningTest = async () => {
      const test = await testsService.getRunningTest(config.id);
      setTest(test);
      setLoading(false);
    };

    if (config.cloud.is_deployed) {
      fetchRunningTest();
    }
  }, []);

  return (
    <>
      {config.cloud.is_deployed ? (
        loading ? (
          <p>Loading</p>
        ) : test ? (
          <p>
            Your test is running. Please, wait until it finishes. Rabbit?
            Percentagens
          </p>
        ) : (
          <p>No tests running</p>
        )
      ) : (
        <>
          <Typography>Please, deploy your instances first</Typography>
          <Button onClick={() => onDeploy(null, 1)}>Deploy</Button>
        </>
      )}
    </>
  );
};

const Results = ({ config_id }) => {
  const [results, setResults] = useState([]);
  const [selected_result, setSelectedResult] = useState(false);

  useEffect(() => {
    const fetchRunningTest = async () => {
      const finished_tests = await testsService.getFinishedTests(config_id);
      setResults(finished_tests);
    };

    fetchRunningTest();
  }, []);

  return selected_result ? (
    <Result result={selected_result} onBack={() => setSelectedResult(false)} />
  ) : (
    <ResultList results={results} onResultSelect={setSelectedResult} />
  );
};

const ResultList = ({ results, onResultSelect }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'gateways',
      headerName: 'Gateways',
      width: 130,
      valueGetter: (params) => {
        const results = params.row.results;
        return results.map((r) => r.gateway).join(', ');
      },
    },
    { field: 'begin', headerName: 'Begin Date', width: 130 },
    { field: 'end', headerName: 'End Date', width: 130 },
  ];

  return (
    <Box height={400} width="100%">
      <DataGrid
        rows={results}
        columns={columns}
        pageSize={5}
        onRowClick={({ row }) => onResultSelect(row)}
      />
    </Box>
  );
};

const Result = ({ result, onBack }) => {
  result.results.sort((g1, g2) => g2.score - g1.score);

  return (
    <>
      <Box display="flex" alignItems="center">
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Test #{result.id}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Scores</Typography>
        <Scores result={result} />
      </Box>
      <Box>
        <Typography variant="h6">Benchmark</Typography>
        <Benchmark results={result.results} />
      </Box>
    </>
  );
};

const Scores = ({ result }) => {
  const classes = makeStyles(() => ({
    winner: {
      boxShadow: '0 0 8px 3px green',
    },
  }))();

  return (
    <Box display="flex" justifyContent="center">
      {result.results.map((gateway, index) => (
        <Box p={2} key={index}>
          <InfoCard
            className={clsx({ [classes.winner]: index === 0 })}
            name={gateway.gateway}
            score={gateway.score}
          />
        </Box>
      ))}
    </Box>
  );
};

const Benchmark = ({ results }) => {
  const gateways = results.map((gateway) => gateway.gateway);
  const gateways_metrics = results.map((gateway) => gateway.metrics);
  const classes = useStyles();

  function createData(metric, values) {
    metric = metric.split('_').join(' ');
    metric = metric.charAt(0).toUpperCase() + metric.slice(1);

    return { metric, ...values };
  }

  const metrics = ['cpu', 'memory']; // TODO
  const nr_gateways = gateways.length;
  const rows = [];

  metrics.forEach((metric) => {
    const values = {};
    for (let i = 0; i < nr_gateways; i++) {
      values[i] = gateways_metrics[i][metric];
    }
    rows.push(createData(metric, values));
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              {gateways.map((gateway, index) => (
                <TableCell key={index}>{gateway}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, ind) => {
              const values = [];
              for (let i = 0; i < nr_gateways; i++) {
                values.push(
                  <TableCell key={'i-' + (ind + 1) * (i + 1)}>
                    {row[i]}
                  </TableCell>
                );
              }

              return (
                <TableRow key={row.metric}>
                  <TableCell component="th" scope="row">
                    {row.metric}
                  </TableCell>
                  {values}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const Config = (props) => {
  const classes = useStyles();

  const [config, setConfig] = useState(false);
  useEffect(() => {
    const fetchConfig = async () => {
      const config = await configsService.getConfig(props.match.params.id);
      setConfig(config);
    };

    fetchConfig();
  }, []);

  const [tab, setTab] = useState(0);
  const handleTabChange = (_, value) => {
    setTab(value);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h3">Config #{config.id}</Typography>
        <Box>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" className={classes.danger}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <Box marginTop={3}>
        <AppBar position="static" className={classes.tabs}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="tabs">
            <Tab label="Info" id="tab-0" />
            <Tab label="Deploy" id="tab-1" />
            <Tab label="Test" id="tab-2" />
            <Tab label="Results" id="tab-3" />
          </Tabs>
        </AppBar>
        {config && (
          <>
            <TabPanel value={tab} index={0}>
              <Info
                gateways={config.gateways}
                cloud={config.cloud}
                endpoints={config.endpoints}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Deploy config={config} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Test onDeploy={handleTabChange} config={config} />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <Results config_id={config.id} />
            </TabPanel>
          </>
        )}
      </Box>
    </>
  );
};

export default Config;

/* Proptypes */

Config.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

Benchmark.propTypes = {
  results: PropTypes.array,
};

InfoCard.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number,
  className: PropTypes.string,
  downloadable: PropTypes.bool,
};

InfoCard.defaultProps = {
  downloadable: false,
};

Info.propTypes = {
  gateways: PropTypes.array.isRequired,
  cloud: PropTypes.object.isRequired,
  endpoints: PropTypes.array.isRequired,
};

Deploy.propTypes = {};

Test.propTypes = {
  config: PropTypes.object.isRequired,
};

Results.propTypes = {
  config_id: PropTypes.number.isRequired,
};

ResultList.propTypes = {
  results: PropTypes.array.isRequired,
  onResultSelect: PropTypes.func.isRequired,
};

Result.propTypes = {
  result: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

Scores.propTypes = {
  result: PropTypes.object.isRequired,
};
