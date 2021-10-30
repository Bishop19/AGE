import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import Status from '../../components/Status';

/* Material UI */
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

/* Services */
import configsService from '../../services/configs.service';

/* Icons */
import AddIcon from '@material-ui/icons/Add';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import RoomIcon from '@material-ui/icons/Room';
import InputIcon from '@material-ui/icons/Input';
import CloudIcon from '@material-ui/icons/Cloud';

const NoConfigs = () => {
  return (
    <Box
      height="40vh"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <InfoOutlinedIcon style={{ fontSize: '180px' }} color="disabled" />
      <Typography variant="h5" color="textSecondary">
        No configurations. To create one, click on the "NEW" button.
      </Typography>
    </Box>
  );
};

const useCardStyles = makeStyles(() => ({
  card: {
    '&:hover': {
      boxShadow: `0px 2px 4px -1px rgb(0 0 0 / 30%), 
        0px 4px 5px 0px rgb(0 0 0 / 30%), 
        0px 1px 10px 0px rgb(0 0 12 / 30%)`,
    },
  },
}));

const ConfigCard = ({ config }) => {
  const classes = useCardStyles();

  return (
    <RouterLink to={`/configs/${config.id}`} style={{ textDecoration: 'none' }}>
      <Card elevation={4} className={classes.card}>
        <Box padding={2} display="flex" justifyContent="space-between">
          <Typography variant="h5">
            {config.name} #{config.id}
          </Typography>
          <Status state={config.state} />
        </Box>
        <Box
          display="flex"
          paddingLeft={2}
          paddingBottom={1}
          color="text.secondary"
        >
          <Box display="flex" alignItems="center">
            <RoomIcon></RoomIcon>
            <Box pl={1}>{config.endpoints.length}</Box>
          </Box>
          <Box pl={4} display="flex" alignItems="center">
            <InputIcon></InputIcon>
            <Box pl={1}>{config.gateways.length}</Box>
          </Box>
        </Box>
      </Card>
    </RouterLink>
  );
};

const Configs = ({ configs }) => {
  return (
    <Box marginTop={3}>
      <Grid container spacing={3}>
        {configs.map((config, index) => (
          <Grid item xs={3} key={index}>
            <ConfigCard config={config} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ConfigList = () => {
  const [configurations, setConfigurations] = useState([]);
  useEffect(() => {
    const fetchConfigs = async () => {
      const configs = await configsService.getConfigs();
      setConfigurations(configs);
    };

    fetchConfigs();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignContent="center">
        <Box>
          <Typography variant="h3">Configurations</Typography>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Listing of all your configurations.
          </Typography>
        </Box>
        <Box>
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to="/configs/new"
          >
            <AddIcon />
            New
          </Button>
        </Box>
      </Box>
      {configurations.length ? (
        <Configs configs={configurations} />
      ) : (
        <NoConfigs />
      )}
    </>
  );
};

export default ConfigList;

/* Proptypes */

Configs.propTypes = {
  configs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ConfigCard.propTypes = {
  config: PropTypes.object.isRequired,
};
