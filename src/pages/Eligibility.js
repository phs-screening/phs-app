import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Typography } from '@mui/material'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'

const Eligibility = () => {
    const { patientId, updatePatientId } = useContext(FormContext)
    const [loadingPrevData, isLoadingPrevData] = useState(true)

    const [patients, setPatients] = useState({})
    const [registration, setRegistration] = useState({})
    const [triage, setTriage] = useState({})

    useEffect(async () => {
        const loadPastForms = async () => {
          isLoadingPrevData(true)
            const registrationData = getSavedData(patientId, allForms.registrationForm)
            const patientsData = getSavedPatientData(patientId, 'patients')
            const triageData = getSavedData(patientId, allForms.triageForm)
            
            Promise.all([
                registrationData, 
                patientsData, 
                triageData,
            ]).then((result) => {
              setRegistration(result[0])
              setPatients(result[1])
              setTriage(result[2])
              isLoadingPrevData(false)
            })
        }
        await loadPastForms()
    }
    , [patientId])

    return (
    <>
        <Helmet>
        <title>Patient Eligibility</title>
        </Helmet>
        <Box
        sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
        }}
        >
        <Container maxWidth='lg'>
            <Grid container direction="column" spacing={3}>
            <Grid item lg={2} md={2} xs={0}>
                <Typography variant="h6">Patient Information</Typography>
                <Typography variant="body1">Initials: {patients.initials}</Typography>
                <Typography variant="body1">Gender: {patients.gender}</Typography>
                <Typography variant="body1">Age: {patients.age}</Typography>
            </Grid>
   
            <Grid item lg={8} md={8} xs={12}>
                <Typography variant="h6">Patient Eligibility</Typography>
                <Typography variant="body1">List of Eligible Tests</Typography>
            </Grid>

            </Grid>
        </Container>
        </Box>
    </>
    )
}

export default Eligibility
