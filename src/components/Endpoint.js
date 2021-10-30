import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import { Box, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const Params = ({ name, params }) => {
  return (
    <Box>
      <Box>
        <Typography
          variant="subtitle1"
          component="div"
          style={{
            display: 'inline-block',
            padding: '0px 10px',
            borderRadius: 10,
            color: 'white',
            background: 'gray',
          }}
        >
          {name}
        </Typography>
      </Box>
      {Object.keys(params).length ? (
        <ul>
          {Object.entries(params).map(([param, type], index) => (
            <li key={index}>
              {param} - {type}
            </li>
          ))}
        </ul>
      ) : (
        <p>No {name} parameters</p>
      )}
    </Box>
  );
};

const Endpoint = ({ endpoint }) => {
  const {
    base_path,
    endpoint_path,
    method,
    path_params,
    query_params,
    body_params,
    security,
  } = endpoint;

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
        <Box flexGrow="1">{base_path + endpoint_path}</Box>
        {security != 'NONE' && (
          <Box mx={1} display="flex" alignItems="center">
            <LockOutlinedIcon color="action" />
          </Box>
        )}
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
          <Typography variant="h6">Parameters</Typography>
          <Params name="Path" params={path_params} />
          <Params name="Body" params={body_params} />
          <Params name="Query" params={query_params} />
        </Box>
      )}
    </Box>
  );
};

export default Endpoint;

/* Proptypes */

Endpoint.propTypes = {
  endpoint: PropTypes.object.isRequired,
};
