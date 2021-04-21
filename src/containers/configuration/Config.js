import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  Typography,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

/* Icons */
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  danger: {
    color: theme.palette.error.main,
  },
  tabs: {
    backgroundColor: "white",
    color: theme.palette.secondary.main,
    borderRadius: "5px",
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

const Endpoints = () => {
  return <p>Endpoints</p>;
};

const APIGateways = () => {
  return <p>API Gateways</p>;
};

const Clouds = () => {
  return <p>Clouds</p>;
};

const Test = () => {
  return (
    <p>
      Your test is running. Please, wait until it finishes. Rabbit? Percentagens
    </p>
  );
};

const Results = () => {
  return <p>List of results</p>;
};

const Config = (props) => {
  const classes = useStyles();

  const [config, setConfig] = useState({});
  useEffect(() => {
    const fetchConfig = async () => {
      const config = { id: props.match.params.id }; // TODO
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
            <Tab label="Endpoints" id="tab-0" />
            <Tab label="API Gateways" id="tab-1" />
            <Tab label="Clouds" id="tab-2" />
            <Tab label="Test" id="tab-3" />
            <Tab label="Results" id="tab-4" />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <Endpoints />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <APIGateways />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Clouds />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Test />
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Results />
        </TabPanel>
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
