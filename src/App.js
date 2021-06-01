import React from "react";
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import routes from './routes';
import {
  ScrollReset,
} from './components';

const history = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <ScrollReset />
        {renderRoutes(routes)}
      </Router>
    </ThemeProvider>
  );
}

export default App;
