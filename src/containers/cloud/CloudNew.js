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
      <Box padding={2}>
        <Box display="flex" justifyContent="center">
          <img src={cloud.logo} alt="Logo" style={{ maxWidth: '50%' }} />
        </Box>
      </Box>
    </Card>
  );
};

const GCP = ({
  name,
  region,
  machine_type,
  onNameChange,
  onFileUpload,
  onRegionChange,
  onMachineTypeChange,
}) => {
  const zones = [
    { name: 'Europe West 2 C', value: 'europe-west2-c' },
    { name: 'Europe West 4 A', value: 'europe-west4-a' },
    { name: 'Europe Central 2 A', value: 'europe-central2-a' },
    { name: 'US Central 1 A', value: 'us-central1-a' },
    { name: 'Asia East 2 A', value: 'asia-east2-a' },
  ];

  const machine_types = [
    { name: 'N2 Standard 2', value: 'n2-standard-2', specs: '2CPUs, 8GB RAM' },
    { name: 'N2 Standard 4', value: 'n2-standard-4', specs: '4CPUs, 16GB RAM' },
    { name: 'E2 Medium 2', value: 'e2-medium', specs: '2CPUs, 4GB RAM' },
  ];

  return (
    <Box py={2}>
      <Typography variant="h5">Cloud information</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Provide your service account (JSON file) and your region.
      </Typography>
      <form>
        <Box display="flex">
          <Box display="flex" flexGrow={1}>
            <Grid container spacing={2} alignItems="center">
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
              <Grid item xs={2}>
                Machine Type
              </Grid>
              <Grid item xs={10}>
                <FormControl variant="outlined" style={{ width: '100%' }}>
                  <Select
                    value={machine_type}
                    onChange={(event) =>
                      onMachineTypeChange(event.target.value)
                    }
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
            </Grid>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

const AWS = () => {
  return (
    <Box py={2}>
      <Typography variant="h5">Cloud information</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Not implemented yet.
      </Typography>
    </Box>
  );
};

const Azure = () => {
  return (
    <Box py={2}>
      <Typography variant="h5">Cloud information</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Not implemented yet.
      </Typography>
    </Box>
  );
};

const NoCloudSelected = () => {
  return (
    <Box py={2}>
      <Typography variant="h5">Cloud information</Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        You have to select a cloud provider.
      </Typography>
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
  const [machine_type, setMachineType] = useState('n2-standard-2');
  const [strategy, setStrategy] = useState('GCP');

  const renderStrategy = (strategy) => {
    switch (strategy) {
      case 'GCP':
        return (
          <GCP
            name={name}
            region={region}
            machine_type={machine_type}
            onNameChange={setName}
            onRegionChange={setRegion}
            onFileUpload={parseFile}
            onMachineTypeChange={setMachineType}
          />
        );

      case 'AWS':
        return <AWS />;
      case 'Azure':
        return <Azure />;
      default:
        return <NoCloudSelected />;
    }
  };

  const handleCloudSelect = (index) => {
    clouds.forEach((c, i) => {
      if (i != index) c.is_selected = false;
      else clouds[index].is_selected = !clouds[index].is_selected;
    });

    if (clouds[index].is_selected) {
      setStrategy(clouds[index].name);
    } else {
      setStrategy(null);
    }

    setClouds(JSON.parse(JSON.stringify(clouds)));
  };

  const handleBackClick = () => {
    history.push('/clouds');
  };

  const handleCreateCloud = async () => {
    setSubmitting(true);

    const provider = clouds.filter((c) => c.is_selected)[0].name;
    const cloud = await cloudsService.createCloud(
      name,
      file,
      provider,
      region,
      machine_type
    );

    if (cloud) {
      setSubmitting(false);
      toast.success('Cloud created!');
      history.push('/clouds');
    } else {
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

      <Box py={2}>
        <Typography variant="h5">Cloud provider</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Select your cloud provider.
        </Typography>
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

      {renderStrategy(strategy)}

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
  machine_type: PropTypes.string.isRequired,
  onMachineTypeChange: PropTypes.func.isRequired,
};
