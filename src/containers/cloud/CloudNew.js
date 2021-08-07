import React, { useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toast } from 'react-toastify';

/* Material UI */
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  TextField,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

/* Services */
import cloudsService from '../../services/clouds.service';

/* Logos */
import gcp from '../../assets/images/gcp.png';
import aws from '../../assets/images/aws.png';
import azure from '../../assets/images/azure.png';

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

const GCP = ({ name, region, onNameChange, onFileUpload, onRegionChange }) => {
  return (
    <Box py={2}>
      <Typography variant="h5">Cloud information</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Please, provide your service account (JSON file) and your region.
      </Typography>
      <form>
        <Box display="flex" width="60%">
          <Box display="flex" flexGrow={1}>
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
                  onChange={(event) => onNameChange(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                Service Account
              </Grid>
              <Grid item xs={10}>
                <TextField
                  name="file"
                  fullWidth
                  type="file"
                  variant="outlined"
                  onChange={(event) => onFileUpload(event)}
                />
              </Grid>
              <Grid item xs={2}>
                Region
              </Grid>
              <Grid item xs={10}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <Select
                    value={region}
                    onChange={(event) => onRegionChange(event.target.value)}
                  >
                    <MenuItem selected="selected" value={'europe-west4-a'}>
                      Europe West 4 A
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
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
  const [file, setFile] = useState();
  const [region, setRegion] = useState('europe-west4-a');
  const [name, setName] = useState('');

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

    const provider = clouds.filter((c) => c.is_selected)[0].name;
    const cloud = await cloudsService.createCloud(name, file, provider, region);

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

  const parseFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (event) {
        setFile(JSON.parse(event.target.result));
      };
    }
  };

  return (
    <>
      <Typography variant="h3">Create a cloud configuration</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        TODO
      </Typography>

      <Box py={2}>
        <Grid container spacing={3}>
          {clouds.map((cloud, index) => (
            <Grid key={index} item xs={3}>
              <CloudCard
                cloud={cloud}
                onSelect={() => handleCloudSelect(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <hr></hr>

      <GCP
        name={name}
        region={region}
        onNameChange={setName}
        onRegionChange={setRegion}
        onFileUpload={parseFile}
      />

      {/* <Box py={2}>
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
      </Box> */}

      <hr></hr>

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

GCP.propTypes = {
  name: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  region: PropTypes.string.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};
