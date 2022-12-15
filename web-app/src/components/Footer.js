import React from "react";
import { AppBar, Toolbar, Grid, Typography } from "@material-ui/core";

const Footer = () => {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Grid container justify="center" alignContent="center">
          <Typography>Terms of Use &#8226; Privacy Policy</Typography>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
