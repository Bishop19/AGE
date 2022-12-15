import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  withStyles,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const styles = (theme) => ({
  fullWidth: {
    width: '100%',
  },
  form: {
    [theme.breakpoints.only('md')]: {
      paddingLeft: '10%',
      paddingRight: '10%',
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '15%',
      paddingRight: '15%',
    },
  },
});

const Login = ({ classes, onLogin }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      error: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      const { email, password } = values;
      setFieldValue('error', null);

      const user = await AuthService.login(email, password);

      if (user) {
        setSubmitting(false);

        onLogin(user);
      } else {
        setFieldValue(
          'error',
          <Grid item xs={12}>
            <Alert severity="error">Your credentials doesn&#39;t match.</Alert>
          </Grid>
        );
        setSubmitting(false);
      }
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
  });

  return (
    <div>
      <Typography variant="h2" paragraph>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={formik.errors.email && formik.touched.email}
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
              }
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={formik.errors.password && formik.touched.password}
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.password &&
                formik.touched.password &&
                formik.errors.password
              }
              type="password"
              variant="outlined"
              fullWidth
            />
          </Grid>

          {formik.values.error}

          <Grid container justify="flex-end">
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={formik.handleReset}
              disabled={!formik.dirty || formik.isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress color="secondary" size={20} />
              ) : (
                'Login'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.object,
  onLogin: PropTypes.func,
};

export default withStyles(styles)(Login);
