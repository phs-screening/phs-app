import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import React, {useContext, useEffect, useState} from 'react';
import mongoDB, {getProfile, isLoggedin} from "./services/mongoDB";
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
const waitProfile = async () => {
    const profile = await getProfile();
    return profile
}
  const {setProfile} = useContext(LoginContext);
  const [patientId, setPatientId] = useState(-1)
  const [login, isLogin] = useState(isLoggedin())
  const [profile, setProfiles] = useState()


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
