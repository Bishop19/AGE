import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";

/* ICONS */
import DashboardIcon from "@material-ui/icons/Dashboard";
import BuildIcon from "@material-ui/icons/Build";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CloudIcon from "@material-ui/icons/Cloud";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  active: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    "& .icon": {
      color: theme.palette.primary.dark,
    },
  },
  colors: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const Menu = ({ onClose, open }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.colors, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          component={NavLink}
          to="/dashboard"
          activeClassName={classes.active}
        >
          <ListItemIcon>
            <DashboardIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          button
          component={NavLink}
          to="/configs"
          activeClassName={classes.active}
        >
          <ListItemIcon>
            <BuildIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Configurations" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/clouds"
          activeClassName={classes.active}
        >
          <ListItemIcon>
            <CloudIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Clouds" />
        </ListItem>
        <ListItem
          button
          component={NavLink}
          to="/results"
          activeClassName={classes.active}
        >
          <ListItemIcon>
            <AssessmentIcon className="icon" />
          </ListItemIcon>
          <ListItemText primary="Results" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;

/* Proptypes */

Menu.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
