import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import React, { useState } from 'react';
import mongoDB from "./services/mongoDB";
import './App.css';
export const FormContext = React.createContext()
export const LoginContext = React.createContext({
  login : false,
  isLogin: (status) => {

  },
    profile: {},
    setProfile: (status) => {

    }
});

const App = () => {
  const [patientId, setPatientId] = useState(-1)
  const [login, isLogin] = useState(mongoDB.currentUser === null)
  const [profile, setProfile] = useState(false)

  const updatePatientId = (new_id) => {
    setPatientId(new_id);
    console.log("new id: " + new_id);
  }

  const routing = useRoutes(routes);

  return (
      <LoginContext.Provider value={{login, isLogin, profile, setProfile}} >
        <FormContext.Provider value={patientId}>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              {routing}
            </ThemeProvider>
        </FormContext.Provider>
      </LoginContext.Provider>
  );
};

export default App;
