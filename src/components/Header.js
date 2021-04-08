import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { AppBar, Toolbar, Button, Grid, IconButton } from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

/* ICONS */
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
}));

const Header = ({ auth, onLogout, onOpen, open }) => {
  const classes = useStyles();

  const history = useHistory();

  const account_btns = (
    <>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          component={RouterLink}
          to="/signup"
        >
          Sign Up
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={RouterLink}
          to="/login"
        >
          Login
        </Button>
      </Grid>
    </>
  );

  const handleLogout = () => {
    history.push("/");
    onLogout();
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        {auth ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Button component={RouterLink} to="/">
            NAVBAR
          </Button>
        )}

        <Grid container justify="flex-end">
          {auth ? <Button onClick={handleLogout}>Logout</Button> : account_btns}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  auth: PropTypes.oneOfType([
    PropTypes.string, // token
    PropTypes.bool, // no auth token (false)
  ]),
  onLogout: PropTypes.func,
};

export default Header;
