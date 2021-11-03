import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { Bar, Pie } from 'react-chartjs-2';
import { parseGatewayName } from '../../util/util';

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
  FormControl,
  Select,
  MenuItem,
  Grid,
  TextField,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

/* Components */
import Endpoint from '../../components/Endpoint';
import Status from '../../components/Status';

/* Services */
import configsService from '../../services/configs.service';
import testsService from '../../services/tests.service';

/* Icons */
// import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PollIcon from '@material-ui/icons/Poll';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Icon } from '@iconify/react';

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
  dangerBackground: {
    color: 'white',
    backgroundColor: theme.palette.error.main,
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

const InfoCard = ({
  config_id,
  name,
  score,
  className,
  downloadable,
  cloud_name,
}) => {
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
      height: score ? '140px' : '80px',
      width: '200px',
      borderRadius: '20px',
    },
    clickable: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }))();

  const dowloadGatewayConfig = async (config_id, gateway) => {
    const valid = await configsService.getGatewayConfig(config_id, gateway);

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
          ? () => dowloadGatewayConfig(config_id, name.toLowerCase())
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
          {cloud_name ? (
            <Box display="flex">
              <Box width="40%">
                <img src={image} alt="Logo" style={{ maxWidth: '85%' }} />
              </Box>
              <Box width="60%" display="flex" alignItems="center">
                <Typography variant="h6"> {cloud_name} </Typography>
              </Box>
            </Box>
          ) : (
            <img src={image} alt="Logo" style={{ maxWidth: '100%' }} />
          )}
        </Box>
        {score && (
          <>
            <Box px={2}>
              <hr style={{ margin: 0 }}></hr>
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

const Info = ({ config_id, gateways, cloud, endpoints }) => {
  return (
    <>
      <Box py={1}>
        <Typography variant="h5">Gateways</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Gateways that will be tested for this configuration. To download the
          gateway's configuration, click on the respective gateway.
        </Typography>

        <Box display="flex">
          {gateways.map((gateway, index) => (
            <Box p={2} key={index}>
              <InfoCard config_id={config_id} name={gateway} downloadable />
            </Box>
          ))}
        </Box>
      </Box>
      <Box py={1}>
        <Typography variant="h5">Cloud</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Cloud in which the configuration will run.
        </Typography>

        <Box display="flex">
          <Box p={2}>
            <InfoCard name={cloud.provider} cloud_name={cloud.name} />
          </Box>
        </Box>
      </Box>
      <Box py={1}>
        <Typography variant="h5">Endpoints</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          List of the endpoints provided in the API documentation file.
        </Typography>

        {endpoints.map((endpoint, index) => (
          <Endpoint key={index} endpoint={endpoint} />
        ))}
      </Box>
    </>
  );
};

const Deploy = ({ config }) => {
  const classes = useStyles();

  const deployGateways = async () => {
    const valid = await configsService.deployGateways(config.id);

    // Todo: Rabbit?
    console.log(valid);
  };

  const getMachineConfigs = (machine) => {
    let cpu = 2;
    let ram = 8;

    switch (machine) {
      case 'n2-standard-2':
        cpu = 2;
        ram = 8;
        break;
      case 'n2-standard-4':
        cpu = 4;
        ram = 16;
        break;
      case 'e2-medium':
        cpu = 2;
        ram = 4;
        break;
    }

    return (
      <Box
        display="inline-block"
        borderRadius="20px"
        style={{
          boxShadow:
            '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        }}
      >
        <Box display="flex">
          <Box
            p={2}
            display="flex"
            borderRight="1px solid rgba(0,0,0,0.14)"
            alignItems="center"
          >
            <Icon color="gray" icon="gg:server" height={32} />
            <Box pl={2}>{machine}</Box>
          </Box>
          <Box
            p={2}
            borderRight="1px solid rgba(0,0,0,0.14)"
            display="flex"
            alignItems="center"
          >
            <Icon color="gray" icon="bi:cpu" height={32} />
            <Box pl={2}>{cpu} CPUs</Box>
          </Box>
          <Box p={2} display="flex" alignItems="center">
            <Icon color="gray" icon="fa-solid:memory" height={32} />
            <Box pl={2}>{ram} GB</Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return config.cloud.is_deployed ? (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Deployment</Typography>
        <Status state="Deployed" />
      </Box>

      <Box py={2}>
        <Typography variant="h6">Instances</Typography>
        <Box py={2}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Cloud ID</TableCell>
                  <TableCell>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {config.instances.map((instance) => (
                  <TableRow key={instance.gateway}>
                    <TableCell component="th" scope="row">
                      {parseGatewayName(instance.gateway)}
                    </TableCell>
                    <TableCell>{instance.id}</TableCell>
                    <TableCell>{instance.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box
        mt={4}
        p={2}
        style={{ borderRadius: '20px', border: '1px solid red' }}
      >
        <Box py={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6">Danger Zone</Typography>
              <Typography paragraph color="textSecondary">
                Once you delete this configuration, there is no going back.
                Please be certain.
              </Typography>
            </Box>
            <Button className={classes.dangerBackground} variant="contained">
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Deployment</Typography>
        <Status state="Not Deployed" />
      </Box>

      <Box py={2}>
        <Typography variant="h6">Machine specification</Typography>
        <Typography variant="body1">
          Based on your configuration, {config.gateways.length} machines will be
          deployed. Each will have one gateway running, which will be used to
          load test your application.
        </Typography>
        <Box p={2}>{getMachineConfigs(config.cloud.machine_type)}</Box>
      </Box>

      {/* <Box py={1}>
        <Typography variant="h6">Gateways</Typography>
        <Typography variant="body1">
          {config.gateways
            .map((gateway) => parseGatewayName(gateway))
            .join(', ')}
        </Typography>
      </Box> */}

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          onClick={deployGateways}
          style={{ marginRight: 0 }}
        >
          Deploy
        </Button>
      </Box>
    </>
  );
};

const Test = ({ config, onDeploy, onConfigChange }) => {
  const [test, setTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [test_file, setTestFile] = useState(false);
  const [can_start, setCanStart] = useState(false);
  const [name, setName] = useState('');
  const [file_name, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [is_visible, setIsVisible] = useState(false);
  const [machine_type, setMachineType] = useState('n2-standard-2');
  const [region, setRegion] = useState('europe-west2-c');

  const machine_types = [
    { name: 'N2 Standard 2', value: 'n2-standard-2', specs: '2CPUs, 8GB RAM' },
    { name: 'N2 Standard 4', value: 'n2-standard-4', specs: '4CPUs, 16GB RAM' },
    { name: 'E2 Medium 2', value: 'e2-medium', specs: '2CPUs, 4GB RAM' },
  ];

  const zones = [
    { name: 'Europe West 2 C', value: 'europe-west2-c' },
    { name: 'Europe West 4 A', value: 'europe-west4-a' },
    { name: 'Europe Central 2 A', value: 'europe-central2-a' },
    { name: 'US Central 1 A', value: 'us-central1-a' },
    { name: 'Asia East 2 A', value: 'asia-east2-a' },
  ];

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

  const handleTestFileChange = (test_file_id) => {
    if (!test_file_id) setCanStart(false);
    else setCanStart(true);

    setTestFile(test_file_id);
  };

  const handleStartClick = async () => {
    const valid = await testsService.createTest(
      config.id,
      name,
      test_file,
      machine_type,
      region
    );

    if (valid) {
      setTest(true);
    } else {
      toast.error('Something went wrong.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (event) {
        setFile(event.target.result);
      };
    }
  };

  const handleFileSubmit = async () => {
    const test_file = await testsService.addTestFile(
      config.id,
      file_name,
      file
    );

    if (test_file) {
      config.test_files.push(test_file);
      onConfigChange(config);
      setFileName('');
      setIsVisible(false);
      toast.success('File uploaded.');
    } else {
      toast.error('Invalid file.');
    }
  };

  return (
    <>
      {config.cloud.is_deployed ? (
        loading ? (
          <p>Loading</p>
        ) : test ? (
          <Box
            mt={4}
            p={2}
            style={{ borderRadius: '20px', border: '1px solid gray' }}
          >
            <Box py={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">Test running</Typography>
                  <Typography paragraph color="textSecondary">
                    A test is already running. Please wait for the results to be
                    able to make a new test.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">Testing</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsVisible(!is_visible)}
              >
                Upload File
              </Button>
            </Box>
            <Typography variant="subtitle1" color="textSecondary">
              Select the name, test file and the machine where the test will
              run. If you don't have a test file upload a new one.
            </Typography>
            {is_visible && (
              <Box
                p={2}
                my={2}
                style={{ borderRadius: '20px', border: '1px solid black' }}
              >
                <Typography variant="h6">Upload test file</Typography>
                <Box pt={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      Name
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        value={file_name}
                        name="name"
                        fullWidth
                        variant="outlined"
                        onChange={(event) => setFileName(event.target.value)}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      Test file
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        name="file"
                        fullWidth
                        type="file"
                        variant="outlined"
                        onChange={(event) => handleFileUpload(event)}
                      />
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={!file || !file_name}
                        onClick={handleFileSubmit}
                      >
                        <CloudUploadIcon />
                        <span>&nbsp;&nbsp;Add</span>
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            )}
            <Box pt={4}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  Name
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    value={name}
                    name="name"
                    fullWidth
                    variant="outlined"
                    onChange={(event) => setName(event.target.value)}
                  />
                </Grid>

                <Grid item xs={2}>
                  Test File
                </Grid>
                <Grid item xs={10}>
                  <FormControl variant="outlined" style={{ width: '100%' }}>
                    <Select
                      value={test_file}
                      onChange={(event) =>
                        handleTestFileChange(event.target.value)
                      }
                    >
                      <MenuItem selected="selected" value={false}>
                        -
                      </MenuItem>
                      {config.test_files.map((file, index) => (
                        <MenuItem key={index} value={file}>
                          {file.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  Machine Type
                </Grid>
                <Grid item xs={10}>
                  <FormControl variant="outlined" style={{ width: '100%' }}>
                    <Select
                      value={machine_type}
                      onChange={(event) => setMachineType(event.target.value)}
                    >
                      {machine_types.map((type, index) => {
                        if (index === 0) {
                          return (
                            <MenuItem
                              selected="selected"
                              value={type.value}
                              key={type.value}
                            >
                              {type.name} ({type.specs})
                            </MenuItem>
                          );
                        } else {
                          return (
                            <MenuItem value={type.value} key={type.value}>
                              {type.name} ({type.specs})
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  Region
                </Grid>
                <Grid item xs={10}>
                  <FormControl variant="outlined" style={{ width: '100%' }}>
                    <Select
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                    >
                      {zones.map((zone, index) => {
                        if (index === 0) {
                          return (
                            <MenuItem
                              selected="selected"
                              value={zone.value}
                              key={zone.value}
                            >
                              {zone.name}
                            </MenuItem>
                          );
                        } else {
                          return (
                            <MenuItem value={zone.value} key={zone.value}>
                              {zone.name}
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Box display="flex" justifyContent="flex-end" width="100%">
              <Button disabled={!can_start} onClick={handleStartClick}>
                Start
              </Button>
            </Box>
          </Box>
        )
      ) : (
        <>
          <Box
            mt={4}
            p={2}
            style={{ borderRadius: '20px', border: '1px solid red' }}
          >
            <Box py={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">Instances not deployed</Typography>
                  <Typography paragraph color="textSecondary">
                    Deploy your instances first in order to test this
                    configuration.
                  </Typography>
                </Box>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => onDeploy(null, 1)}
                >
                  Deploy
                </Button>
              </Box>
            </Box>
          </Box>
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
    { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'gateways',
      headerName: 'Gateways',
      width: 300,
      valueGetter: (params) => {
        const results = params.row.results;
        return results.map((r) => parseGatewayName(r.gateway)).join(', ');
      },
    },
    { field: 'start_date', headerName: 'Start Date', width: 250 },
    { field: 'finish_date', headerName: 'Finish Date', width: 250 },
  ];

  return (
    <>
      <Typography variant="h5">Results</Typography>

      <Box height={400} width="100%" pt={2}>
        <DataGrid
          rows={results}
          columns={columns}
          pageSize={5}
          onRowClick={({ row }) => onResultSelect(row)}
        />
      </Box>
    </>
  );
};

const ResultsCharts = ({ results }) => {
  const endpoints = Object.keys(results[0].metrics);
  const charts = {};
  const colors = [
    'rgb(116, 196, 118)',
    'rgb(65, 182, 196)',
    'rgb(34, 94, 168)',
    'rgb(0, 150, 0)', // success
    'rgb(150, 0, 0)', // error
  ];

  const createDataEndpoint = (endpoint) => {
    console.log(results);
    const data = [
      {
        title: 'Percentiles',
        chart: 'Bar',
        labels: ['Median', '90%', '95%', '99%'],
        datasets: results.map((gateway, index) => {
          return {
            label: parseGatewayName(gateway.gateway),
            data: [
              gateway.metrics[endpoint]['Median'],
              gateway.metrics[endpoint]['90% Line'],
              gateway.metrics[endpoint]['95% Line'],
              gateway.metrics[endpoint]['99% Line'],
            ],
            backgroundColor: colors[index],
          };
        }),
      },
      {
        title: 'Min, Average, Max, Std. Dev.',
        chart: 'Bar',
        labels: ['Min', 'Average', 'Max', 'Std. Dev.'],
        datasets: results.map((gateway, index) => ({
          label: parseGatewayName(gateway.gateway),
          data: [
            gateway.metrics[endpoint]['Min'],
            gateway.metrics[endpoint]['Average'],
            gateway.metrics[endpoint]['Max'],
            gateway.metrics[endpoint]['Std. Dev.'],
          ],
          backgroundColor: colors[index],
        })),
      },
      {
        title: 'Success/Error rate',
        chart: 'Pie',
        data: results.map((gateway) => ({
          labels: ['Success', 'Error'],
          label: parseGatewayName(gateway.gateway),
          datasets: [
            {
              data: [
                100 - parseFloat(gateway.metrics[endpoint]['Error %']),
                parseFloat(gateway.metrics[endpoint]['Error %']),
              ],
              backgroundColor: [colors[3], colors[4]],
            },
          ],
        })),
      },
      {
        title: 'Throughput',
        chart: 'HorizontalBar',
        labels: results.map((result) => parseGatewayName(result.gateway)),
        datasets: [
          {
            // label: 'Throughput',
            data: results.map(
              (result) => result.metrics[endpoint]['Throughput']
            ),
            backgroundColor: [colors[0], colors[1], colors[2]],
          },
        ],
      },
    ];

    return data;
  };

  endpoints.forEach((endpoint) => {
    charts[endpoint] = createDataEndpoint(endpoint);
  });

  const options = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return value + ' ms';
          },
        },
      },
    },
  };

  const optionsHorizontal = {
    indexAxis: 'y',
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
  };

  return Object.entries(charts).map(([endpoint, data], i) => (
    <Box key={i}>
      <Box py={1}>
        <Typography>{endpoint}</Typography>
      </Box>
      <Box width="80%" margin="auto">
        {data.map((type, j) => {
          switch (type.chart) {
            case 'Bar':
              return (
                <Box py={2} key={i + endpoint + j}>
                  <Bar
                    data={type}
                    options={{
                      ...options,
                      plugins: {
                        title: {
                          display: true,
                          text: type.title,
                        },
                      },
                    }}
                  />
                </Box>
              );
            case 'Pie':
              return (
                <Box py={2} key={i + endpoint + j}>
                  <Box display="flex" justifyContent="center">
                    <Typography
                      variant="subtitle2"
                      component="span"
                      color="textSecondary"
                    >
                      {type.title}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    {type.data.map((t, k) => (
                      <Box key={i + endpoint + j + '-' + k} width="30%">
                        <Pie data={t} />
                        <Box display="flex" justifyContent="center" pt={1}>
                          <Typography
                            variant="subtitle2"
                            component="span"
                            color="textSecondary"
                          >
                            {t.label}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            case 'HorizontalBar':
              return (
                <Box py={2} key={i + endpoint + j}>
                  <Bar
                    data={type}
                    options={{
                      ...optionsHorizontal,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: 'Throughput (req/s)',
                        },
                      },
                    }}
                  />
                </Box>
              );
          }
        })}
      </Box>
    </Box>
  ));
};

const Result = ({ result, onBack }) => {
  const [chartView, setChartView] = useState(false);
  result.results.sort((g1, g2) => g2.score - g1.score);

  return (
    <>
      <Box display="flex" alignItems="center">
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">{result.name}</Typography>

        <Typography
          variant="h6"
          color="textSecondary"
          style={{ fontSize: '0.95em' }}
        >
          &nbsp;&nbsp;(Test #{result.id})
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6">Scores</Typography>
        <Scores result={result} />
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Benchmark</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Results are grouped by endpoint.
            </Typography>
          </Box>

          <Box>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>View:</Grid>
              <Grid item>
                <IconButton
                  color={!chartView ? 'primary' : 'default'}
                  onClick={() => setChartView(false)}
                >
                  <TableChartIcon />
                </IconButton>

                <IconButton
                  color={chartView ? 'primary' : 'default'}
                  onClick={() => setChartView(true)}
                >
                  <PollIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {chartView ? (
          <ResultsCharts results={result.results} />
        ) : (
          <Benchmark results={result.results} />
        )}
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

  function getMetricNamesFromTest(metrics) {
    const metric_names = [];
    const endpoint_metrics = Object.entries(metrics)[0][1];

    Object.entries(endpoint_metrics).forEach(([name]) => {
      metric_names.push(name);
    });

    return metric_names;
  }

  const nr_gateways = gateways.length;
  const metrics = getMetricNamesFromTest(gateways_metrics[0]);
  const rows_by_endpoint = {};

  const metric_values = {};
  metrics.forEach((metric) => {
    gateways_metrics.forEach((gateway_metrics) => {
      Object.entries(gateway_metrics).forEach(
        ([endpoint, endpoint_metrics]) => {
          if (metric_values[endpoint]) {
            metric_values[endpoint].push(endpoint_metrics[metric]);
          } else {
            metric_values[endpoint] = [endpoint_metrics[metric]];
          }
        }
      );
    });
  });

  Object.entries(metric_values).forEach(([endpoint, values]) => {
    const a = [];
    for (let i = 0; i < values.length; i += nr_gateways) {
      const b = {};
      for (let j = 0; j < nr_gateways; j++) {
        b[j] = values[i + j];
        b['metric'] = metrics[i / nr_gateways];
      }
      b['endpoint'] = endpoint;
      a[i / nr_gateways] = b;
    }
    rows_by_endpoint[endpoint] = a;
  });

  return Object.entries(rows_by_endpoint).map(([endpoint, rows], index) => (
    <Box key={index} mt={2} pb={2}>
      <Box pb={2}>
        <Typography>{endpoint}</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              {gateways.map((gateway, index) => (
                <TableCell key={index}>{parseGatewayName(gateway)}</TableCell>
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
                row.metric != 'Label' && (
                  <TableRow key={row.metric}>
                    <TableCell component="th" scope="row">
                      {row.metric}
                    </TableCell>
                    {values}
                  </TableRow>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ));
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
        <Box display="flex" alignItems="center">
          <Typography variant="h3">{config.name}</Typography>
          <Typography variant="h6" color="textSecondary">
            &nbsp;&nbsp;&nbsp;(Config #{config.id})
          </Typography>
        </Box>
        <Box>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          {/* <IconButton aria-label="delete" className={classes.danger}>
            <DeleteIcon />
          </IconButton> */}
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
                config_id={config.id}
                gateways={config.gateways}
                cloud={config.cloud}
                endpoints={config.endpoints}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Deploy config={config} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Test
                onDeploy={handleTabChange}
                config={config}
                onConfigChange={setConfig}
              />
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
  config_id: PropTypes.number,
  name: PropTypes.string.isRequired,
  score: PropTypes.number,
  className: PropTypes.string,
  downloadable: PropTypes.bool,
  cloud_name: PropTypes.string,
};

InfoCard.defaultProps = {
  downloadable: false,
};

Info.propTypes = {
  config_id: PropTypes.number,
  gateways: PropTypes.array.isRequired,
  cloud: PropTypes.object.isRequired,
  endpoints: PropTypes.array.isRequired,
};

Deploy.propTypes = {
  config: PropTypes.object,
};

Test.propTypes = {
  config: PropTypes.object.isRequired,
  onDeploy: PropTypes.func.isRequired,
  onConfigChange: PropTypes.func.isRequired,
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
