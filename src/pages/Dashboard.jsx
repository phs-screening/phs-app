import React, { useState, useEffect, useContext } from 'react'
import { Box, Container, Grid } from '@mui/material'
import PatientTimeline from 'src/components/dashboard/PatientTimeline'
import { Helmet } from 'react-helmet-async'
import { FormContext } from 'src/api/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { isLoggedin } from '../services/authSession'

const Dashboard = () => {
  const { patientId } = useContext(FormContext)
  const [isValid, setValid] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const initialStationSummary = location.state?.stationSummary

  useEffect(() => {
    console.log("Current Patient ID: " + patientId)
    if (patientId === -1) {
      if (!isLoggedin()) {
        navigate('/login', { replace: true })
        return
      }

      alert('You need to enter the queue number for the patient you are attending to!')
      navigate('/app/registration', { replace: true })
    } else {
      setValid(true)
    }
  }, [navigate, patientId])

  return (
    <>
      <Helmet>
        <title>Patient Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              {isValid ? (
                <PatientTimeline
                  patientId={patientId}
                  initialSummary={initialStationSummary}
                />
              ) : null}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
