import React, { Fragment, Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  content: {
    height: '100%',
    paddingTop: 50,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 50
    }
  }
}));

const Auth = props => {
  const { route } = props;

  const classes = useStyles();

  return (
    <Fragment>
      <main className={classes.content}>
        <Suspense fallback={<LinearProgress />}>
          {renderRoutes(route.routes)}
        </Suspense>
      </main>
    </Fragment>
  );
};

Auth.propTypes = {
  route: PropTypes.object
};

export default Auth;
