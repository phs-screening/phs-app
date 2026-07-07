import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import routes from 'src/routes'
import React, { useState } from 'react'
import customTheme from './theme'
// import { isLoggedin } from './services/authSession'
import { FormContext } from './api/utils'
import FormSubmitStatusHost from './components/form-components/FormSubmitStatusHost'
import './App.css'
import { clearPersistedPatient, loadPersistedPatient, savePersistedPatient } from './utils/patientPersistence'

export const LoginContext = React.createContext({
  login: false,
  isLogin: () => {},
  profile: {},
  setProfile: () => {},
})

const App = () => {
  // const { setProfile } = useContext(LoginContext)
  const [patientId, setPatientId] = useState(() => loadPersistedPatient().patientId)
  const [patientInfo, setPatientInfo] = useState(() => loadPersistedPatient().patientInfo)
  // const [login, isLogin] = useState(isLoggedin())
  // const profile = undefined
  const [login, isLogin] = useState(!!localStorage.getItem('authToken')) // start as false, not isLoggedin()
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('profile')) || null
    } catch {
      return null
    }
  })

  const updatePatientId = (new_id) => {
    setPatientId(new_id)
    if (new_id === -1) {
      clearPersistedPatient()
    }
  }

  const updatePatientInfo = (new_info) => {
    setPatientInfo(new_info)
    // need to do checks as data is named differently locally and in database
    if ('queueNo' in new_info) {
      updatePatientId(new_info.queueNo)
      savePersistedPatient(new_info.queueNo, new_info)
    } else if ('patientId' in new_info) {
      updatePatientId(new_info.patientId)
      savePersistedPatient(new_info.patientId, new_info)
    } else {
      updatePatientId(-1)
    }
  }

  const clearPatient = () => {
    setPatientId(-1)
    setPatientInfo({})
    clearPersistedPatient()
  }

  const theme = customTheme
  const routing = useRoutes(routes)

  return (
    <LoginContext.Provider value={{ login, isLogin, profile, setProfile }}>
      <FormContext.Provider
        value={{ patientId, updatePatientId, patientInfo, updatePatientInfo, clearPatient }}
      >
        <ThemeProvider theme={theme}>
          {routing}
          <FormSubmitStatusHost />
        </ThemeProvider>
      </FormContext.Provider>
    </LoginContext.Provider>
  )
}

export default App
