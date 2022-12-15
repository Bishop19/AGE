import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import theme from './../theme';
import { withRouter } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const Content = styled(Box)({
  backgroundColor: theme.palette.background.root,
  minHeight: 'calc(100vh - 64px)',
  paddingTop: 64,
});

const Inside = styled(Box)({
  padding: '20px 10% 40px 10%',
});

const useStyles = makeStyles((theme) => ({
  drawerOpen: {
    marginLeft: 240,
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    marginLeft: 55,
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const Layout = ({ auth, onLogout, children }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Header
        auth={auth}
        onLogout={onLogout}
        onOpen={handleDrawerOpen}
        open={open}
      />
      <Content>
        {auth && <Menu onClose={handleDrawerClose} open={open} />}
        <Inside
          className={clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
        >
          {children}
        </Inside>
      </Content>
      {!auth && <Footer />}
    </>
  );
};

Layout.propTypes = {
  auth: PropTypes.oneOfType([
    PropTypes.string, // token
    PropTypes.bool, // no auth token (false)
  ]),
  onLogout: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default withRouter(Layout);
