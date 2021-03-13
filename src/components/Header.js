import React from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button>NAVBAR</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
