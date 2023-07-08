import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPreRegData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  SvgIcon,
  CircularProgress,
} from '@material-ui/core'

import { Search as SearchIcon } from 'react-feather'

const RegisterPatient = (props) => {
  const [loading, isLoading] = useState(false)
  const [values, setValues] = useState({
    queueNumber: 1,
  })
  const { patientId, updatePatientInfo } = useContext(FormContext)
  const navigate = useNavigate()
  const ref = useRef()

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        ref.current.click()
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [])

  const handleChange = (event) => {
    const value = event.target.value
    if (value >= 0 || value === '') {
      setValues({
        [event.target.name]: parseInt(value),
      })
    } else {
      event.target.value = 0
    }
  }

  const handleSubmit = async () => {
    isLoading(true)
    const value = values.queueNumber
    // if response is successful, update state for curr id and redirect to dashboard timeline for specific id
    const data = await getPreRegData(value, 'patients')
    if ('initials' in data) {
      updatePatientInfo(data)
      isLoading(false)
      navigate('/app/dashboard', { replace: true })
    } else {
      // if response is unsuccessful/id does not exist, show error style/popup.
      alert('Unsuccessful. There is no patient with this queue number.')
      isLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            color='primary'
            size='large'
            type='submit'
            variant='contained'
            href='/app/prereg'
            sx={{ marginTop: 1, marginBottom: 2 }}
          >
            Register
          </Button>
          <Typography></Typography>
          <Typography color='textPrimary' gutterBottom variant='h3'>
            OR
          </Typography>
          <Typography color='textPrimary' gutterBottom variant='h4'>
            Enter queue number below
          </Typography>
          <TextField
            id='queue-number'
            name='queueNumber'
            sx={{ marginTop: 2, marginBottom: 1 }}
            type='number'
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
            onChange={handleChange}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              ref={ref}
              color='primary'
              size='large'
              type='submit'
              variant='contained'
              onClick={handleSubmit}
            >
              Go
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default RegisterPatient
