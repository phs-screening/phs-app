import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { getAllPatientNames, getPreRegDataById, getPreRegDataByName } from '../services/patientData'
import { FormContext } from '../api/utils.js'
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

const RegisterPatient = (props) => {
  const [isLoadingQueueNumber, setIsLoadingQueueNumber] = useState(false)
  const [isLoadingPatientName, setIsLoadingPatientName] = useState(false)
  const [values, setValues] = useState({
    isQueueNumber: true,
    selectedValue: null,
  })
  const [patientNames, setPatientNames] = useState([])
  const { updatePatientInfo } = useContext(FormContext)
  const navigate = useNavigate()

  useEffect(() => {
    const getPatientNames = async () => {
      const data = await getAllPatientNames('patients')
      setPatientNames(data)
    }
    getPatientNames()
  }, [])

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

  const handleSubmitQueueNumber = async () => {
    setIsLoadingQueueNumber(true)
    const value = values.selectedValue
    // if response is successful, update state for curr id and redirect to dashboard timeline for specific id
    const data = await getPreRegDataById(value, 'patients')
    console.log(data)
    if ('initials' in data) {
      updatePatientInfo(data)
      await updateAllStationCounts(data.queueNo)
      setIsLoadingQueueNumber(false)
      navigate('/app/dashboard', { replace: true })
    } else if ('age' in data) {
      updatePatientInfo(data)
      setIsLoadingQueueNumber(false)
      navigate('/app/dashboard', { replace: true })
    } else {
      // if response is unsuccessful/id does not exist, show error style/popup.
      alert('Unsuccessful. There is no patient with this queue number.')
      setIsLoadingQueueNumber(false)
    }
  }
  const handleSubmitPatientName = async () => {
    setIsLoadingPatientName(true)

    const value = values.selectedValue?.initials
    if (value) {
      const data = await getPreRegDataByName(value, 'patients')
      console.log('Value', value)
      if ('initials' in data) {
        updatePatientInfo(data)
        setIsLoadingPatientName(false)
        navigate('/app/dashboard', { replace: true })
      } else {
        alert('Unsuccessful. There is no patient with this name.')
        setIsLoadingPatientName(false)
      }
    } else {
      alert('Unsuccessful. Please enter patient name.')
      setIsLoadingPatientName(false)
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
              component={RouterLink}
              to='/app/reg'
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
                  getOptionLabel={(option) => option.initials}
                  renderInput={handlePatientNameInput}
                  onChange={handlePatientNameSelect}
                  fullWidth
                />
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
