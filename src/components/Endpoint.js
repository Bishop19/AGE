import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

const Endpoint = ({ path, params, method }) => {
  const getBackgroundColor = () => {
    switch (method.toUpperCase()) {
      case 'GET':
        return '#3097ff';
      case 'POST':
        return '#49cc90';
      case 'PATCH':
        return '#fca130';
      case 'PUT':
        return '#fca130';
      case 'DELETE':
        return '#f93e3e';
      case 'OPTIONS':
        return '#1745ff';
      case 'HEAD':
        return '#1745ff';
    }
  };

  const color = getBackgroundColor();

  const [is_expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!is_expanded);
  };

  return (
    <Box
      margin="12px 0"
      borderRadius="10px"
      border="black 1px solid"
      padding="10px"
      bgcolor="white"
    >
      <Box
        display="flex"
        alignItems="center"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <Box flexGrow="1">{path}</Box>
        <Box
          padding="3px 6px"
          borderRadius="4px"
          width="70px"
          color="white"
          bgcolor={color}
          textAlign="center"
        >
          {method.toUpperCase()}
        </Box>
      </Box>
      {is_expanded && (
        <Box>
          <hr></hr>
          Expanded
        </Box>
      )}
    </Box>
  );
};

export default Endpoint;

/* Proptypes */

Endpoint.propTypes = {
  path: PropTypes.string.isRequired,
  params: PropTypes.object,
  method: PropTypes.string.isRequired,
};
