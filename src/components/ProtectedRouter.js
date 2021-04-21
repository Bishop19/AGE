import { React } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth } = rest;

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...rest} {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, // normal func component
    PropTypes.object, // withStyles component
  ]),
};

export default ProtectedRoute;
