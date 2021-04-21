import React from "react";
import PropTypes from "prop-types";
import { Chip } from "@material-ui/core";
import theme from "./../theme";

const Status = ({ state, size }) => {
  const matchState = (state) => {
    switch (state?.toUpperCase()) {
      case "NO RESULTS":
        return theme.palette.secondary.main;
      case "FINISHED":
        return "#58C400";
      case "RUNNING":
        return "#F5B300";
      case "ERROR":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const color = matchState(state);

  return (
    <Chip
      label={state}
      size={size}
      style={{ backgroundColor: color, color: "white" }}
    />
  );
};

Status.defaultProps = {
  size: "medium",
};

Status.propTypes = {
  state: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default Status;
