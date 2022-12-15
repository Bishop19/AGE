import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

const Step = ({ index, text, active }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" textAlign="center" flexGrow="1">
      <Box
        margin="auto"
        height="100px"
        width="100px"
        borderRadius="50px"
        bgcolor={active ? theme.palette.secondary.main : "gray"}
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2.5rem"
      >
        {index}
      </Box>
      <Box marginTop="10px">{text}</Box>
    </Box>
  );
};

const Stepper = ({ steps, active_index }) => {
  return (
    <Box display="flex" justifyItems="center" width="100%" padding="25px 0">
      {steps.map((step, i) => (
        <Step key={i} index={i + 1} text={step} active={i === active_index} />
      ))}
    </Box>
  );
};

export default Stepper;

/* Proptypes */

Step.propTypes = {
  index: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  active_index: PropTypes.number.isRequired,
};
