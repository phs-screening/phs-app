import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Typography } from '@mui/material'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'

const Eligibility = () => {
    const { patientId, updatePatientId } = useContext(FormContext)
    const [loadingPrevData, isLoadingPrevData] = useState(true)
    const [registration , setRegistration] = useState({}) 
    const [pmhx, setPMHX] = useState({})
    const [social, setSocial] = useState({})
    const [patient, setPatient] = useState({})
    const [hxfamily, setHxFamily] = useState({})

    useEffect(async () => {
        const loadPastForms = async () => {
            isLoadingPrevData(true)
            const pmhxData = getSavedData(patientId, allForms.hxNssForm)
            const socialData = getSavedData(patientId, allForms.hxSocialForm)
            const registrationData = getSavedData(patientId, allForms.registrationForm)
            const patientData = getSavedPatientData(patientId, 'patients')
            const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
            
            Promise.all([
                pmhxData,
                socialData, 
                registrationData, 
                patientData,
                hxFamilyData
            ]).then((result) => {
                setPMHX(result[0])
                setSocial(result[1])
                setRegistration(result[2])
                setPatient(result[3])
                setHxFamily(result[4])
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
        <Box sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
        }} >
        <Container maxWidth='lg'>
            <Grid container direction="column" spacing={3}>

            <Grid item lg={8} md={8} xs={12}>
                <Typography variant="h4">List of Eligible Tests</Typography>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Influenza Vaccination</Typography>
                    <Typography>
                    {pmhx && pmhx.PMHX16 ? (
                        <p className='blue'>{pmhx.PMHX16}</p>
                    ) : (
                        <p className='blue'>nil</p>
                    )}
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Lung Function</Typography>
                    <Typography>
                        <p className='underlined'>Does patient currently smoke: {social && social.SOCIAL10 ? social.SOCIAL10 : '-'} </p>
                        <p className='underlined'>Has patient smoked before: {social && social.SOCIAL11 ? social.SOCIAL11 : '-'} </p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >FIT</Typography>
                    <Typography>
                        <p className='underlined'>Patient Age: {patient.age} </p>
                        <p className='underlined'>Has patient done a FIT test in the last 1 year: {pmhx && pmhx.PMHX10 ? pmhx.PMHX10 : '-'} </p>
                        <p className='underlined'>Has patient done a colonoscopy in the last 10 years or otherwise advised by their doctor: {pmhx && pmhx.PMHX11 ? pmhx.PMHX11 : '-'} </p>
                    </Typography>
                </Box>
            </Grid>

            {patient.gender === 'Female' && (
                <>
                <Grid item lg={8} md={8} xs={12}>
                    <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                        <Typography variant="h6" paddingRight={5} >Women’s Cancer Education & Appointment</Typography>
                        <Typography>
                            <p className='underlined'>Are you currently part of healthiersg: {registration && registration.registrationQ12 ? registration.registrationQ12 : '-'} </p>
                            <p className='underlined'>CHAS status: {registration && registration.registrationQ13 ? registration.registrationQ13 : '-'} </p>
                            <p className='underlined'>Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?: {social && social.SOCIAL3 ? social.SOCIAL3 : '-'} </p>
                            <p className='underlined'>Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following cancers? Please specify age of diagnosis.: {hxfamily && hxfamily.FAMILY1 ? hxfamily.FAMILY1 : '-'} </p>
                        </Typography>
                    </Box>
                </Grid>
                </>
            )}

            </Grid>
        </Container>
        </Box>
    </>
    )
}

export default Eligibility
