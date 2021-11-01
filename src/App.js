import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

/* Components */
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRouter';

/* Containers */
// import Landing from './containers/Landing';
import Login from './containers/authentication/Login';
import Signup from './containers/authentication/Signup';
import Dashboard from './containers/Dashboard';
import Config from './containers/configuration/Config';
import ConfigNew from './containers/configuration/ConfigNew';
import ConfigList from './containers/configuration/ConfigList';
import Cloud from './containers/cloud/Cloud';
import CloudNew from './containers/cloud/CloudNew';
import CloudList from './containers/cloud/CloudList';

/* Services */
import AuthService from './services/auth.service';

const App = () => {
  const [loading, setLoading] = useState(true);

  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setAuth(await AuthService.getCurrentUser());
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handlerLogin = (user) => {
    setAuth(user);
  };

  const handlerLogout = () => {
    setAuth(AuthService.logout());
  };

  return (
    <ThemeProvider theme={theme}>
      {!loading && (
        <BrowserRouter>
          <Layout auth={auth} onLogout={handlerLogout}>
            <Switch>
              <Route exact path="/">
                {auth ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Login onLogin={handlerLogin} />
                )}
              </Route>
              <Route path="/login">
                {auth ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Login onLogin={handlerLogin} />
                )}
              </Route>
              <Route path="/signup">
                {auth ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Signup onSignup={handlerLogin} />
                )}
              </Route>
              <ProtectedRoute
                path="/dashboard"
                auth={auth}
                component={Dashboard}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/configs/new"
                auth={auth}
                component={ConfigNew}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/configs/:id"
                auth={auth}
                component={Config}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/configs"
                auth={auth}
                component={ConfigList}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/clouds/new"
                auth={auth}
                component={CloudNew}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/clouds/:id"
                auth={auth}
                component={Cloud}
              ></ProtectedRoute>
              <ProtectedRoute
                path="/clouds"
                auth={auth}
                component={CloudList}
              ></ProtectedRoute>
            </Switch>
          </Layout>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;
