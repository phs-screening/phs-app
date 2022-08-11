import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import React, {useContext, useEffect, useState} from 'react';
import mongoDB, {getProfile, isLoggedin} from "./services/mongoDB";
import { FormContext } from './api/utils';
import './App.css';
export const LoginContext = React.createContext({
  login : false,
  isLogin: (status) => {

  },
    profile: {},
    setProfile: (status) => {

    },
});

const App = () => {
const waitProfile = async () => {
    const profile = await getProfile();
    return profile
}
  const {setProfile} = useContext(LoginContext);
  const [patientId, setPatientId] = useState(-1)
  const [patientInfo, setPatientInfo] = useState({})
  const [login, isLogin] = useState(isLoggedin())
  const [profile, setProfiles] = useState()
    const [isAdmin, setIsAdmin] = useState(false)


  const updatePatientId = (new_id) => {
    setPatientId(new_id);
  }

  const updatePatientInfo = (new_info) => {
    setPatientInfo(new_info);
    // need to do checks as data is named differently locally and in database
    if ("queueNo" in new_info) {
      updatePatientId(new_info.queueNo);
    } else if ("patientId" in new_info) {
      updatePatientId(new_info.patientId);
    } else {
      updatePatientId(-1);
    }
  }

  const updateIsAdmin = (new_state) => {
      setIsAdmin(new_state)
  }

  const routing = useRoutes(routes);

  return (
      <LoginContext.Provider value={{login, isLogin, profile, setProfile}} >
        <FormContext.Provider value={{patientId, updatePatientId, patientInfo, updatePatientInfo, isAdmin, updateIsAdmin}}>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              {routing}
            </ThemeProvider>
        </FormContext.Provider>
      </LoginContext.Provider>
  );
};

export default App;
