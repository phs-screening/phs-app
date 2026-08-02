import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPatientNamesStrict, getPatientNameMatchesStrict } from '../services/patientData'
import {
  checkInPreRegistrationStrict,
  findPreRegistrationByQueueStrict,
  searchPreRegistrationsStrict,
} from '../services/preRegistrations'
import { getPatientStationSummary } from '../api/stationsApi'
import {
  mergeRegistrationMatches,
  REGISTRATION_LOOKUP_ACTIONS,
  resolveRegistrationLookup,
} from '../services/registrationLookup'
import { FormContext } from '../api/utils.js'
import { toLoadErrorMessage } from '../utils/retryRequest'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  SvgIcon,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { Search as SearchIcon } from 'react-feather'
import Autocomplete from '@mui/material/Autocomplete'

const PATIENT_NAME_PAGE_LIMIT = 20
const PATIENT_MATCH_PAGE_LIMIT = 10

const dedupePatientNames = (patients) => {
  const seen = new Set()

  return patients.filter((patient) => {
    const name = patient.initials
    if (!name || seen.has(name.toLowerCase())) {
      return false
    }

    seen.add(name.toLowerCase())
    return true
  })
}

const formatBirthday = (value) => {
  if (!value) return 'Not recorded'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not recorded'

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getMatchSource = (match) => {
  if (match.action === REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn) {
    return 'Pre-registration'
  }
  if (match.action === REGISTRATION_LOOKUP_ACTIONS.resumeRegistration) {
    return 'Registration incomplete'
  }
  if (match.action === REGISTRATION_LOOKUP_ACTIONS.checkInInProgress) {
    return 'Check-in in progress'
  }
  if (match.action === REGISTRATION_LOOKUP_ACTIONS.dataError) {
    return 'Review required'
  }
  return 'Checked in'
}

const getMatchActionLabel = (action) => {
  if (action === REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn) return 'Check In'
  if (action === REGISTRATION_LOOKUP_ACTIONS.resumeRegistration) return 'Resume Registration'
  if (action === REGISTRATION_LOOKUP_ACTIONS.openDashboard) return 'Open Dashboard'
  if (action === REGISTRATION_LOOKUP_ACTIONS.checkInInProgress) return 'In Progress'
  return 'Review Required'
}

const RegisterPatient = (props) => {
  const [isLoadingQueueNumber, setIsLoadingQueueNumber] = useState(false)
  const [isLoadingPatientName, setIsLoadingPatientName] = useState(false)
  const [values, setValues] = useState({
    isQueueNumber: true,
    selectedValue: null,
  })
  const [patientNames, setPatientNames] = useState([])
  const [patientNameSearch, setPatientNameSearch] = useState('')
  const [patientNamesError, setPatientNamesError] = useState('')
  const [patientMatches, setPatientMatches] = useState([])
  const [patientMatchesError, setPatientMatchesError] = useState('')
  const [preRegistrationCandidate, setPreRegistrationCandidate] = useState(null)
  const [queueNumberError, setQueueNumberError] = useState('')
  const { updatePatientInfo, clearPatient } = useContext(FormContext)
  const navigate = useNavigate()

  useEffect(() => {
    let isCurrent = true

    const getPatientNames = async () => {
      try {
        const data = await getAllPatientNamesStrict('patients', {
          q: patientNameSearch,
          page: 1,
          limit: PATIENT_NAME_PAGE_LIMIT,
        })

        if (isCurrent) {
          setPatientNames(dedupePatientNames(data))
          setPatientNamesError('')
        }
      } catch (error) {
        console.error('Failed to load patient names:', error)
        if (isCurrent) {
          setPatientNames([])
          setPatientNamesError(
            toLoadErrorMessage(error, 'Unable to load patient names. Refresh or try again.'),
          )
        }
      }
    }

    const timeoutId = setTimeout(getPatientNames, patientNameSearch ? 250 : 0)

    return () => {
      isCurrent = false
      clearTimeout(timeoutId)
    }
  }, [patientNameSearch])

  const handleQueueNumberInput = (event) => {
    const value = event.target.value
    setPreRegistrationCandidate(null)
    setQueueNumberError('')
    if (value >= 0 || value === '') {
      setValues({
        isQueueNumber: true,
        selectedValue: parseInt(value),
      })
    } else {
      event.target.value = 0
    }
  }

  const handlePatientNameInput = (params) => {
    return (
      <TextField
        {...params}
        label='Patient name'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SvgIcon fontSize='small' color='action'>
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          ),
          ...params.InputProps,
          type: 'search',
        }}
      />
    )
  }

  const handlePatientNameSelect = (event, value) => {
    console.log(event.target.id)
    setValues({
      isQueueNumber: false,
      selectedValue: value,
    })
    setPatientMatches([])
    setPatientMatchesError('')
  }

  const handlePatientNameSearch = (event, value, reason) => {
    if (reason === 'input' || reason === 'clear') {
      setPatientNameSearch(value)
      setPatientMatches([])
      setPatientMatchesError('')
    }
  }

  const getSelectedPatientName = () => {
    const selected = values.selectedValue
    if (typeof selected === 'string') return selected.trim()
    if (selected?.initials) return selected.initials.trim()
    return patientNameSearch.trim()
  }

  const loadPatientStationSummary = async (patientId) => {
    try {
      const response = await getPatientStationSummary(patientId)
      return response.data || null
    } catch (error) {
      if (error?.status === 404) return null
      throw error
    }
  }

  const openPatientDashboard = (stationSummary) => {
    const patient = stationSummary?.patient

    if (!patient || !('queueNo' in patient || 'patientId' in patient)) {
      return false
    }

    updatePatientInfo(patient)
    navigate('/app/dashboard', {
      replace: true,
      state: { stationSummary },
    })
    return true
  }

  const openPreRegistration = async (queueNo) => {
    const patient = await checkInPreRegistrationStrict(queueNo)
    updatePatientInfo(patient)
    navigate('/app/reg', { replace: true })
  }

  const handleSubmitQueueNumber = async () => {
    setIsLoadingQueueNumber(true)
    const value = values.selectedValue
    setPreRegistrationCandidate(null)
    setQueueNumberError('')
    if (!Number.isFinite(value)) {
      alert('Unsuccessful. Please enter a queue number.')
      setIsLoadingQueueNumber(false)
      return
    }

    try {
      const [stationSummary, preRegistration] = await Promise.all([
        loadPatientStationSummary(value),
        findPreRegistrationByQueueStrict(value),
      ])
      const patient = stationSummary?.patient || null
      const action = resolveRegistrationLookup(patient, preRegistration)

      if (action === REGISTRATION_LOOKUP_ACTIONS.openDashboard) {
        if (!openPatientDashboard(stationSummary)) {
          setQueueNumberError('The patient dashboard could not be loaded.')
        }
      } else if (action === REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn) {
        setPreRegistrationCandidate(preRegistration)
      } else if (action === REGISTRATION_LOOKUP_ACTIONS.resumeRegistration) {
        await openPreRegistration(value)
      } else if (action === REGISTRATION_LOOKUP_ACTIONS.checkInInProgress) {
        setQueueNumberError(
          'This pre-registration is currently being checked in. Try again shortly.',
        )
      } else if (action === REGISTRATION_LOOKUP_ACTIONS.dataError) {
        setQueueNumberError(
          'This pre-registration has inconsistent check-in data. Contact an admin.',
        )
      } else {
        setQueueNumberError('There is no patient with this queue number.')
      }
    } catch (error) {
      console.error('Failed to search patient by queue number:', error)
      alert(toLoadErrorMessage(error, 'Unable to load patient data. Refresh or try again.'))
    } finally {
      setIsLoadingQueueNumber(false)
    }
  }
  const handleSubmitPatientName = async () => {
    setIsLoadingPatientName(true)
    setPatientMatches([])
    setPatientMatchesError('')

    const value = getSelectedPatientName()
    if (!value) {
      alert('Unsuccessful. Please enter patient name.')
      setIsLoadingPatientName(false)
      return
    }

    try {
      const [patientResult, preRegistrationResult] = await Promise.all([
        getPatientNameMatchesStrict({
          initials: value,
          page: 1,
          limit: PATIENT_MATCH_PAGE_LIMIT,
        }),
        searchPreRegistrationsStrict({
          initials: value,
          page: 1,
          limit: PATIENT_MATCH_PAGE_LIMIT,
        }),
      ])
      const matches = mergeRegistrationMatches(patientResult.data, preRegistrationResult.data)

      setPatientMatches(matches)

      if (matches.length === 0) {
        setPatientMatchesError('No patients found with this exact name.')
      }
    } catch (error) {
      console.error('Failed to search patient by name:', error)
      setPatientMatchesError(
        toLoadErrorMessage(error, 'Unable to load matching patients. Refresh or try again.'),
      )
    } finally {
      setIsLoadingPatientName(false)
    }
  }

  const handleSelectPatientMatch = async (match) => {
    setIsLoadingPatientName(true)

    try {
      if (
        match.action === REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn ||
        match.action === REGISTRATION_LOOKUP_ACTIONS.resumeRegistration
      ) {
        await openPreRegistration(match.queueNo)
      } else if (match.action === REGISTRATION_LOOKUP_ACTIONS.openDashboard) {
        const stationSummary = await loadPatientStationSummary(match.queueNo)
        if (!stationSummary || !openPatientDashboard(stationSummary)) {
          setPatientMatchesError('The selected patient could not be loaded.')
        }
      } else if (match.action === REGISTRATION_LOOKUP_ACTIONS.checkInInProgress) {
        setPatientMatchesError(
          'This pre-registration is currently being checked in. Try again shortly.',
        )
      } else {
        setPatientMatchesError('The selected patient could not be loaded.')
      }
    } catch (error) {
      console.error('Failed to select patient by name:', error)
      alert(toLoadErrorMessage(error, 'Unable to load patient data. Refresh or try again.'))
    } finally {
      setIsLoadingPatientName(false)
    }
  }

  const handleRegisterNewPatient = () => {
    clearPatient()
    navigate('/app/reg')
  }

  const handleCheckInPreRegistration = async () => {
    if (!preRegistrationCandidate) return

    setIsLoadingQueueNumber(true)
    try {
      await openPreRegistration(preRegistrationCandidate.queueNo)
    } catch (error) {
      console.error('Failed to check in pre-registered patient:', error)
      alert(toLoadErrorMessage(error, 'Unable to check in this pre-registration. Try again.'))
    } finally {
      setIsLoadingQueueNumber(false)
    }
  }

  return (
    <Card {...props} sx={{ maxWidth: 520, width: '100%', mx: 'auto' }}>
      <CardContent>
        <Stack spacing={4} alignItems='center'>
          <Box sx={{ textAlign: 'center' }}>
            <Typography color='textPrimary' variant='h4' gutterBottom>
              Patient Lookup
            </Typography>
            <Typography color='textSecondary' variant='body2'>
              Register a new patient or select an existing patient to continue.
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button
              color='secondary'
              size='large'
              type='submit'
              variant='contained'
              onClick={handleRegisterNewPatient}
              fullWidth
            >
              Register New Patient
            </Button>

            <Divider>OR</Divider>

            <Box>
              <Typography color='textPrimary' variant='h6' gutterBottom>
                Enter queue number
              </Typography>
              <Stack spacing={2}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SvgIcon fontSize='small' color='action'>
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Queue number'
                  size='small'
                  variant='outlined'
                  fullWidth
                  onChange={handleQueueNumberInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitQueueNumber()
                    }
                  }}
                />
                {isLoadingQueueNumber ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button
                    color='primary'
                    size='large'
                    type='submit'
                    variant='contained'
                    onClick={handleSubmitQueueNumber}
                    fullWidth
                  >
                    Search by Queue Number
                  </Button>
                )}
                {queueNumberError && (
                  <Typography color='error' variant='body2'>
                    {queueNumberError}
                  </Typography>
                )}
                {preRegistrationCandidate && (
                  <Box>
                    <Typography variant='h6' gutterBottom>
                      Pre-registered patient
                    </Typography>
                    <Typography>
                      Queue {preRegistrationCandidate.queueNo}: {preRegistrationCandidate.initials}
                    </Typography>
                    <Typography color='textSecondary' variant='body2' sx={{ mb: 1 }}>
                      Birthday: {formatBirthday(preRegistrationCandidate.birthday)}
                    </Typography>
                    {(preRegistrationCandidate.nameMappingWarnings || []).map((warning) => (
                      <Typography key={warning} color='warning.main' variant='body2'>
                        {warning}
                      </Typography>
                    ))}
                    <Button
                      color='primary'
                      variant='contained'
                      onClick={handleCheckInPreRegistration}
                      sx={{ mt: 1 }}
                      fullWidth
                    >
                      Confirm and Check In
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider>OR</Divider>

            <Box>
              <Typography color='textPrimary' variant='h6' gutterBottom>
                Search by patient name
              </Typography>
              <Stack spacing={2}>
                <Autocomplete
                  freeSolo
                  size='small'
                  disableClearable
                  options={patientNames}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.initials || ''
                  }
                  renderInput={handlePatientNameInput}
                  onChange={handlePatientNameSelect}
                  onInputChange={handlePatientNameSearch}
                  fullWidth
                />
                {patientNamesError && (
                  <Typography color='error' variant='body2'>
                    {patientNamesError}
                  </Typography>
                )}
                {patientMatchesError && (
                  <Typography color='error' variant='body2'>
                    {patientMatchesError}
                  </Typography>
                )}
                {isLoadingPatientName ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button
                    color='primary'
                    size='large'
                    type='submit'
                    variant='contained'
                    onClick={handleSubmitPatientName}
                    fullWidth
                  >
                    Search by Name
                  </Button>
                )}
                {patientMatches.length > 0 && (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Typography color='textSecondary' variant='body2' sx={{ mb: 1 }}>
                      Select the matching patient by birthday.
                    </Typography>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Birthday</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell align='right'>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patientMatches.map((match) => (
                          <TableRow key={match.queueNo}>
                            <TableCell>{match.queueNo}</TableCell>
                            <TableCell>{match.initials}</TableCell>
                            <TableCell>{formatBirthday(match.birthday)}</TableCell>
                            <TableCell>{getMatchSource(match)}</TableCell>
                            <TableCell align='right'>
                              <Button
                                size='small'
                                variant='contained'
                                onClick={() => handleSelectPatientMatch(match)}
                                disabled={[
                                  REGISTRATION_LOOKUP_ACTIONS.checkInInProgress,
                                  REGISTRATION_LOOKUP_ACTIONS.dataError,
                                ].includes(match.action)}
                                sx={{ textTransform: 'none' }}
                              >
                                {getMatchActionLabel(match.action)}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default RegisterPatient
