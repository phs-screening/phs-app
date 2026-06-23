import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllPatientNamesStrict,
  getPreRegDataByIdStrict,
  getPreRegDataByNameStrict,
} from '../services/patientData'
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
} from '@mui/material'
import { Search as SearchIcon } from 'react-feather'
import Autocomplete from '@mui/material/Autocomplete'
import { updateAllStationCounts } from '../services/stationCounts'

const PATIENT_NAME_PAGE_LIMIT = 20

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
          setPatientNames(data)
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
  }

  const handlePatientNameSearch = (event, value, reason) => {
    if (reason === 'input' || reason === 'clear') {
      setPatientNameSearch(value)
    }
  }

  const handleSubmitQueueNumber = async () => {
    setIsLoadingQueueNumber(true)
    const value = values.selectedValue
    // if response is successful, update state for curr id and redirect to dashboard timeline for specific id
    try {
      const data = await getPreRegDataByIdStrict(value, 'patients')
      console.log(data)
      if (data && 'initials' in data) {
        updatePatientInfo(data)
        await updateAllStationCounts(data.queueNo)
        navigate('/app/dashboard', { replace: true })
      } else if (data && 'age' in data) {
        updatePatientInfo(data)
        navigate('/app/dashboard', { replace: true })
      } else {
        // if response is unsuccessful/id does not exist, show error style/popup.
        alert('Unsuccessful. There is no patient with this queue number.')
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

    const value = values.selectedValue?.initials
    if (value) {
      try {
        const data = await getPreRegDataByNameStrict(value, 'patients')
        console.log('Value', value)
        if (data && 'initials' in data) {
          updatePatientInfo(data)
          navigate('/app/dashboard', { replace: true })
        } else {
          alert('Unsuccessful. There is no patient with this name.')
        }
      } catch (error) {
        console.error('Failed to search patient by name:', error)
        alert(toLoadErrorMessage(error, 'Unable to load patient data. Refresh or try again.'))
      } finally {
        setIsLoadingPatientName(false)
      }
    } else {
      alert('Unsuccessful. Please enter patient name.')
      setIsLoadingPatientName(false)
    }
  }

  const handleRegisterNewPatient = () => {
    clearPatient()
    navigate('/app/reg')
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
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default RegisterPatient
