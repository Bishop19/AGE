import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

/* Components */
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRouter";

/* Containers */
import Landing from "./containers/Landing";
import Login from "./containers/authentication/Login";
import Signup from "./containers/authentication/Signup";

/* Services */
import AuthService from "./services/auth.service";
import Dashboard from "./containers/Dashboard";

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
                <Landing />
              </Route>
              <ProtectedRoute
                path="/dashboard"
                auth={auth}
                component={Dashboard}
              ></ProtectedRoute>
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
            </Switch>
          </Layout>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;
