import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, Typography, TextField, Button, InputAdornment, SvgIcon } from '@mui/material'
import { isAdmin, getPreRegDataById } from '../services/mongoDB'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from 'react-feather'
import { FormContext } from '../api/utils'

const ManageVolunteers = () => {
  const navigate = useNavigate()
  const ref = useRef()
  const { updatePatientInfo } = useContext(FormContext)
  const [values, setValues] = useState({
    queueNumber: 1,
  })

  useEffect(async () => {
    if (!(await isAdmin())) {
      alert('Only Admins have access to this Page!')
      navigate('/app/registration', { replace: true })
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
    const value = values.queueNumber
    // if response is successful, update state for curr id and redirect to dashboard timeline for specific id
    const data = await getPreRegDataById(value, 'patients')
    if ('initials' in data) {
      updatePatientInfo(data)
      navigate('/app/dashboard', { replace: true })
    } else {
      // if response is unsuccessful/id does not exist, show error style/popup.
      alert('Unsuccessful. There is no patient with this queue number.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.create}>
        <Box sx={{ pl: 7, mb: 3, pt: 2 }}>
          <Typography color='textPrimary' variant='h2'>
            Edit Patient Form
          </Typography>
        </Box>
        <Box sx={{ pl: 7, mb: 1 }}>
          <Typography color='textPrimary' gutterBottom variant='h4'>
            Enter queue number below
          </Typography>
        </Box>
        <Box sx={{ px: 7, mb: 3 }}>
          <TextField
            fullWidth
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
        </Box>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
    // alignItems:"center",
    width: '100%',
    height: '100%',
    // borderStyle: "solid",
  },
  create: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
    // alignItems:"center",
    width: '100%',
    // borderStyle: "solid",
    fontSize: 20,
    paddingLeft: 10,
  },
}

export default ManageVolunteers
