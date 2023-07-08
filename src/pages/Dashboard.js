import React, { useState, useEffect, useContext } from 'react'
import { Box, Container, Grid } from '@material-ui/core'
import PatientTimeline from 'src/components/dashboard/PatientTimeline'
import { Helmet } from 'react-helmet'
import { FormContext } from 'src/api/utils'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [isValid, setValid] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (patientId === -1) {
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
              {isValid ? <PatientTimeline patientId={patientId} /> : null}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard
