import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  withStyles,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  FormHelperText,
  CircularProgress,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';

const styles = (theme) => ({
  fullWidth: {
    width: '100%',
  },
  contained: {
    marginLeft: '14px',
    marginRight: '14px',
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

const SignUp = ({ classes, onSignup }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: '',
      terms: false,
    },
    initialStatus: {
      email: null,
      username: null,
      first_name: null,
      last_name: null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { password, email, first_name, last_name } = values;

      const user = await AuthService.signup(
        email,
        password,
        first_name,
        last_name
      );
      if (user) {
        setSubmitting(false);
        onSignup(user);
      }
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().email().required('Email is required'),
      password: Yup.string().required('Password is required'),
      password2: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      ),
      terms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
    }),
  });

  return (
    <div>
      <Typography variant="h2" paragraph>
        Sign up
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid className={classes.form} container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              error={formik.errors.first_name && formik.touched.first_name}
              label="First Name"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.first_name &&
                formik.touched.first_name &&
                formik.errors.first_name
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={formik.errors.last_name && formik.touched.last_name}
              label="Last Name"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.last_name &&
                formik.touched.last_name &&
                formik.errors.last_name
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={
                (formik.errors.email && formik.touched.email) ||
                Boolean(formik.status.email)
              }
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                (formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email) ||
                formik.status.email
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <TextField
              error={formik.errors.password2 && formik.touched.password2}
              label="Confirm password"
              name="password2"
              value={formik.values.password2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.password2 &&
                formik.touched.password2 &&
                formik.errors.password2
              }
              type="password"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="terms"
                  checked={formik.values.terms}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label="I accept the Terms & Conditions"
            />
            <FormHelperText error className={classes.contained}>
              {formik.errors.terms &&
                formik.touched.terms &&
                formik.errors.terms}
            </FormHelperText>
          </Grid>
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
                'Sign Up'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

SignUp.propTypes = {
  classes: PropTypes.object,
  onSignup: PropTypes.func,
};

export default withStyles(styles)(SignUp);
