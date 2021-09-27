import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import React, { useState } from 'react';

import './App.css';

export const FormContext = React.createContext()

const App = () => {
  const [patientId, setPatientId] = useState(-1)
  const updatePatientId = (new_id) => {
    setPatientId(new_id);
    console.log("new id: " + new_id);
  }

  const routing = useRoutes(routes);

  return (
    <FormContext.Provider value={patientId}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
    </FormContext.Provider>
  );
};

export default App;
