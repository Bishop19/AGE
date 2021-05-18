import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, Card, Grid } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

/* Icons */
import AddIcon from '@material-ui/icons/Add';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import cloudsService from '../../services/clouds.service';

const NoClouds = () => {
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
        No cloud projects. To create one, click on the "NEW" button.
      </Typography>
    </Box>
  );
};

const CloudCard = ({ cloud }) => {
  return (
    <RouterLink to={`/clouds/${cloud.id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <Box p={2}>
          <Typography variant="h5">
            {cloud.name} #{cloud.id}
          </Typography>
        </Box>
      </Card>
    </RouterLink>
  );
};

const Clouds = ({ clouds }) => {
  return (
    <Grid container spacing={3}>
      {clouds.map((cloud, index) => (
        <Grid item xs={4} key={index}>
          <CloudCard cloud={cloud} />
        </Grid>
      ))}
    </Grid>
  );
};

const CloudList = () => {
  const [clouds, setClouds] = useState([]);
  useEffect(() => {
    const fetchClouds = async () => {
      const clouds = await cloudsService.getClouds();
      setClouds(clouds);
    };

    fetchClouds();
  }, []);

  // TODO - Remove this
  const addDummyCloud = () => {
    setClouds([{ id: 1, name: 'Teste' }]);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignContent="center">
        <Box>
          <Typography variant="h3">Clouds</Typography>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Listing of all your cloud configurations.
          </Typography>
        </Box>
        <Box>
          <Button color="secondary" variant="outlined" onClick={addDummyCloud}>
            Add dummy cloud
          </Button>
          <Button
            color="secondary"
            variant="contained"
            component={RouterLink}
            to="/clouds/new"
          >
            <AddIcon />
            New
          </Button>
        </Box>
      </Box>
      {clouds.length ? <Clouds clouds={clouds} /> : <NoClouds />}
    </>
  );
};

export default CloudList;

/* Proptypes */

Clouds.propTypes = {
  clouds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CloudCard.propTypes = {
  cloud: PropTypes.object.isRequired,
};
