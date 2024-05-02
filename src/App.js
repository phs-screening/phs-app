import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import 'src/mixins/chartjs'
import routes from 'src/routes'
import React, { useContext, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { getProfile, isLoggedin } from './services/mongoDB'
import { FormContext } from './api/utils'
import './App.css'

export const LoginContext = React.createContext({
  login: false,
  isLogin: (status) => {},
  profile: {},
  setProfile: (status) => {},
})

const App = () => {
  const waitProfile = async () => {
    const profile = await getProfile()
    return profile
  }
  const { setProfile } = useContext(LoginContext)
  const [patientId, setPatientId] = useState(-1)
  const [patientInfo, setPatientInfo] = useState({})
  const [login, isLogin] = useState(isLoggedin())
  const [profile, setProfiles] = useState()

  const updatePatientId = (new_id) => {
    setPatientId(new_id)
  }

  const updatePatientInfo = (new_info) => {
    setPatientInfo(new_info)
    // need to do checks as data is named differently locally and in database
    if ('queueNo' in new_info) {
      updatePatientId(new_info.queueNo)
    } else if ('patientId' in new_info) {
      updatePatientId(new_info.patientId)
    } else {
      updatePatientId(-1)
    }
  }

  const theme = useTheme()
  const routing = useRoutes(routes)

  return (
    <LoginContext.Provider value={{ login, isLogin, profile, setProfile }}>
      <FormContext.Provider value={{ patientId, updatePatientId, patientInfo, updatePatientInfo }}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>{routing}</ThemeProvider>
        </StyledEngineProvider>
      </FormContext.Provider>
    </LoginContext.Provider>
  );
}

export default App
