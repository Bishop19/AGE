import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { parseGatewayName } from '../util/util';

/* Services */
import dashboardService from '../services/dashboard.service';

/* Material UI */
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

/* Icons */
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const InfoCard = ({ title, info, color, icon }) => {
  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      width: '66%',
    },
    content: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'space-between',
    },
    cover: {
      width: '33%',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }));

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <div className={classes.cover}>{icon}</div>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="subtitle1" color="textSecondary">
            {title}
          </Typography>
          <Typography component="h5" variant="h5">
            {info}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
};

const Cards = ({ configs, tests, running_tests, deployed_configs }) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <InfoCard
          title="Configs"
          info={configs}
          color="linear-gradient(60deg, #ffa726, #fb8c00);"
          icon={<SettingsIcon fontSize="large" />}
        ></InfoCard>
      </Grid>
      <Grid item xs={3}>
        <InfoCard
          title="Tests"
          info={tests}
          color="linear-gradient(60deg, #66bb6a, #43a047)"
          icon={<AssignmentTurnedInIcon fontSize="large" />}
        ></InfoCard>
      </Grid>
      <Grid item xs={3}>
        <InfoCard
          title="Running"
          info={running_tests}
          color="linear-gradient(60deg, #26c6da, #00acc1);"
          icon={<HourglassEmptyIcon fontSize="large" />}
        ></InfoCard>
      </Grid>
      <Grid item xs={3}>
        <InfoCard
          title="Deployed"
          info={deployed_configs}
          color="linear-gradient(60deg, #ef5350, #e53935);"
          icon={<PlayCircleFilledWhiteIcon fontSize="large" />}
        ></InfoCard>
      </Grid>
    </Grid>
  );
};

const Results = ({ results }) => {
  return (
    <Box py={2}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Config</TableCell>
              <TableCell>Gateway</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell component="th" scope="row">
                  {result.id}
                </TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.config}</TableCell>
                <TableCell>{parseGatewayName(result.gateway)}</TableCell>
                <TableCell>
                  <IconButton
                    to={`/configs/${result.config_id}`}
                    component={RouterLink}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Tests = ({ tests }) => {
  return (
    <Box py={2}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Config</TableCell>
              <TableCell>Gateways</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell component="th" scope="row">
                  {test.id}
                </TableCell>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.config}</TableCell>
                <TableCell>
                  {test.gateways
                    .map((gateway) => parseGatewayName(gateway))
                    .join(', ')}
                </TableCell>
                <TableCell>{test.start_date}</TableCell>
                <TableCell>
                  <IconButton
                    to={`/configs/${test.config_id}`}
                    component={RouterLink}
                  >
                    <NavigateNextIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Dashboard = () => {
  const [nr_configs, setNumberConfigs] = useState(0);
  const [nr_tests, setNumberTests] = useState(0);
  const [running_tests, setRunningTests] = useState([]);
  const [first_name, setFirstName] = useState('');
  const [results, setResults] = useState([]);
  const [deployed_configs, setDeployedConfigs] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      const info = await dashboardService.getDashboardInfo();

      if (info) {
        setNumberConfigs(info.nr_configs);
        setNumberTests(info.nr_tests);
        setRunningTests(info.running_tests);
        setResults(info.latest_results);
        setDeployedConfigs(info.deployed_configs);
        setFirstName('Joe Doe');
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Typography variant="subtitle2" color="textSecondary">
        Dashboard
      </Typography>
      <Typography variant="h3">Hello, {first_name}</Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Here's what's happening with your projects today
      </Typography>
      <Box py={3}>
        <Cards
          configs={nr_configs}
          tests={nr_tests}
          running_tests={running_tests.length}
          deployed_configs={deployed_configs}
        />
      </Box>

      <hr></hr>

      <Box pt={2}>
        <Typography variant="h5">Latest results</Typography>
        <Box py={3}>
          <Results results={results} />
        </Box>
      </Box>

      <Box pt={2}>
        <Typography variant="h5">Running tests</Typography>
        <Box py={3}>
          <Tests tests={running_tests} />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;

InfoCard.propTypes = {
  title: PropTypes.string,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  icon: PropTypes.element,
};

Tests.propTypes = {
  tests: PropTypes.array,
};

Cards.propTypes = {
  configs: PropTypes.number,
  tests: PropTypes.number,
  running_tests: PropTypes.number,
  deployed_configs: PropTypes.number,
};

Results.propTypes = {
  results: PropTypes.array,
};
