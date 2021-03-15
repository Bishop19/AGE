import React from "react";
import PropTypes from "prop-types";
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
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";

const styles = (theme) => ({
  fullWidth: {
    width: "100%",
  },
  contained: {
    marginLeft: "14px",
    marginRight: "14px",
  },
  form: {
    [theme.breakpoints.only("md")]: {
      paddingLeft: "10%",
      paddingRight: "10%",
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "15%",
      paddingRight: "15%",
    },
  },
});

const SignUp = ({ classes, onSignup }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      terms: false,
    },
    initialStatus: {
      email: null,
      username: null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const { password, email } = values;

      const user = await AuthService.signup(email, password);
      if (user) {
        setSubmitting(false);
        onSignup(user);
      }
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().required("Password is required"),
      password2: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
      ),
      terms: Yup.bool().oneOf([true], "Accept Terms & Conditions is required"),
    }),
  });

  return (
    <div>
      <Typography variant="h2" paragraph>
        Sign up
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid className={classes.form} container spacing={2}>
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
                "Sign Up"
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
