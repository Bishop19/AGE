import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";

const Header = ({ auth, onLogout }) => {
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
    <AppBar position="sticky">
      <Toolbar>
        <Button component={RouterLink} to="/">
          NAVBAR
        </Button>

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
