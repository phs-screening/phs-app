import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import AuthLayout from './layouts/Auth';

// TODO: figure out what are routing best practices to support authentication (and authorization).
const routes = [
  {
    path: '/',
    exact: true,
    // component: () => <Redirect to="/dashboard" />
    component: () => <Redirect to="/auth" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('./views/Login'))
      }
    ]
  }
];

export default routes;
