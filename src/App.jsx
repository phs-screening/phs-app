import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import routes from 'src/routes'
import React, { useEffect, useState } from 'react'
import customTheme from './theme'
// import { isLoggedin } from './services/authSession'
import { FormContext } from './api/utils'
import FormSubmitStatusHost from './components/form-components/FormSubmitStatusHost'
import './App.css'
import {
  clearPersistedPatient,
  loadPersistedPatient,
  PATIENT_CLEARED_EVENT,
  savePersistedPatient,
} from './utils/patientPersistence'

export const LoginContext = React.createContext({
  login: false,
  isLogin: () => {},
  profile: {},
  setProfile: () => {},
})

const App = () => {
  // const { setProfile } = useContext(LoginContext)
  const [persistedPatient] = useState(loadPersistedPatient)
  const [patientId, setPatientId] = useState(() => persistedPatient.patientId)
  const [patientInfo, setPatientInfo] = useState(() => persistedPatient.patientInfo)
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

  useEffect(() => {
    const handlePatientCleared = () => {
      setPatientId(-1)
      setPatientInfo({})
    }

    window.addEventListener(PATIENT_CLEARED_EVENT, handlePatientCleared)

    return () => {
      window.removeEventListener(PATIENT_CLEARED_EVENT, handlePatientCleared)
    }
  }, [])

  useEffect(() => {
    const handleNumberInputWheel = (event) => {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.type === 'number' &&
        document.activeElement === event.target
      ) {
        event.target.blur()
      }
    }

    document.addEventListener('wheel', handleNumberInputWheel, true)

    return () => {
      document.removeEventListener('wheel', handleNumberInputWheel, true)
    }
  }, [])

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
