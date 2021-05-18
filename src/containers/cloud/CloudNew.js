import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';

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

/* Logos */
import gcp from '../../assets/images/gcp.png';
import aws from '../../assets/images/aws.png';
import azure from '../../assets/images/azure.png';
import { useHistory } from 'react-router';
import cloudsService from '../../services/clouds.service';

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

const CloudNew = () => {
  const history = useHistory();
  const [clouds, setClouds] = useState([
    { name: 'GCP', logo: gcp, is_selected: true },
    { name: 'AWS', logo: aws, is_selected: false },
    { name: 'Azure', logo: azure, is_selected: false },
  ]);

  const [is_submitting, setSubmitting] = useState(false);

  const handleCloudSelect = (index) => {
    clouds.forEach((c, i) => {
      if (i != index) c.is_selected = false;
      else clouds[index].is_selected = !clouds[index].is_selected;
    });

    setClouds(JSON.parse(JSON.stringify(clouds))); // TODO
  };

  const handleBackClick = () => {
    history.push('/clouds');
  };

  const handleCreateCloud = async () => {
    setSubmitting(true);

    const cloud = await cloudsService.createCloud('todo', 'TODO', 'GCP');
    if (cloud) {
      // TODO
      setSubmitting(false);
      toast.success('Cloud created!');
      history.push('/clouds');
    } else {
      // TODO
      setSubmitting(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Typography variant="h3">Create a cloud configuration</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        TODO
      </Typography>
      <Grid container spacing={2}>
        {clouds.map((cloud, index) => (
          <Grid key={index} item xs={4}>
            <CloudCard
              cloud={cloud}
              onSelect={() => handleCloudSelect(index)}
            />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleBackClick()}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCreateCloud()}
          disabled={is_submitting}
        >
          {is_submitting ? (
            <CircularProgress size="20px" color="secondary" />
          ) : (
            <>Create</>
          )}
        </Button>
      </Box>
    </>
  );
};

export default CloudNew;

CloudCard.propTypes = {
  cloud: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
