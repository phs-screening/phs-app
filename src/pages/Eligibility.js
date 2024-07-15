import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Typography } from '@mui/material'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import { formatBmi } from '../api/api.js'
import allForms from '../forms/forms.json'

const Eligibility = () => {
    const { patientId, updatePatientId } = useContext(FormContext)
    const [loadingPrevData, isLoadingPrevData] = useState(true)
    const [reg, setReg] = useState({})
    const [pmhx, setPMHX] = useState({})
    const [social, setSocial] = useState({})
    const [patient, setPatient] = useState({})
    const [hxfamily, setHxFamily] = useState({})
    const [triage, setTriage] = useState({})
    const [hcsr, setHcsr] = useState({})

    useEffect(async () => {
        const loadPastForms = async () => {
            isLoadingPrevData(true)
            const pmhxData = getSavedData(patientId, allForms.hxNssForm)
            const socialData = getSavedData(patientId, allForms.hxSocialForm)
            const regData = getSavedData(patientId, allForms.registrationForm)
            const patientData = getSavedPatientData(patientId, 'patients')
            const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
            const triageData = getSavedData(patientId, allForms.triageForm)
            const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
            
            Promise.all([
                pmhxData,
                socialData, 
                regData, 
                patientData,
                hxFamilyData, 
                triageData,
                hcsrData
            ]).then((result) => {
                setPMHX(result[0])
                setSocial(result[1])
                setReg(result[2])
                setPatient(result[3])
                setHxFamily(result[4])
                setTriage(result[5])
                setHcsr(result[6])
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
                            <p className='underlined'>CHAS Status 社保援助计划: {reg && reg.registrationQ12 ? reg.registrationQ12 : '-'} </p>
                            <p className='underlined'>Pioneer Generation Status 建国一代配套: {reg && reg.registrationQ13 ? reg.registrationQ13 : '-'} </p>
                            <p className='underlined'>Patient on any other Government Financial Assistance, other than CHAS and PG: {social && social.SOCIAL3 ? social.SOCIAL3 : '-'} </p>
                            <p className='underlined'>Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following cancers? : {hxfamily && hxfamily.FAMILY1 ? hxfamily.FAMILY1 : '-'} </p>
                            <p className='underlined'>Age of diagnosis: {hxfamily && hxfamily.FAMILYShortAns1 ? hxfamily.FAMILYShortAns1 : '-'} </p>
                        </Typography>
                    </Box>
                </Grid>
                </>
            )}

            {patient.gender === 'Female' && (
                <>
                <Grid item lg={8} md={8} xs={12}>
                    <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                        <Typography variant="h6" paddingRight={5} >Osteoporosis</Typography>
                        <Typography>
                            <p className='underlined'>Birthday: {reg && reg.registrationQ3 ? reg.registrationQ3 : '-'} </p>
                            <p className='underlined'>Age: {reg && reg.registrationQ4 ? reg.registrationQ4 : '-'} </p>
                            <p className='underlined'>Gender: {reg && reg.registrationQ5 ? reg.registrationQ5 : '-'} </p>
                            <p className='underlined'>Height (in cm): {triage && triage.triageQ10 ? triage.triageQ10 : '-'} </p>
                            <p className='underlined'>Weight (in kg): {triage && triage.triageQ11 ? triage.triageQ11 : '-'} </p>
                            <p className='underlined'>Does patient currently smoke: {social && social.SOCIAL10 ? social.SOCIAL10 : '-'} </p>
                            <p className='underlined'>Does patient consume alcoholic drinks: {social && social.SOCIAL12 ? social.SOCIAL12 : '-'} </p>
                        </Typography>
                    </Box>
                </Grid>
                </>
            )}

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >National Kidney Foundation</Typography>
                    <Typography>
                        <p className='underlined'>Age: {reg && reg.registrationQ4 ? reg.registrationQ4 : '-'} </p>
                        <p className='underlined'>BMI: {triage && triage.triageQ9 && triage.triageQ10 ? formatBmi(triage.triageQ9, triage.triageQ10) : '-'} </p>
                        <p className='underlined'>Patient has these conditions: {pmhx && pmhx.PMHX7 ? pmhx.PMHX7 : '-'} </p>
                        <p className='underlined'>Patient has positive family of these conditions: {hxfamily && hxfamily.FAMILY3 ? hxfamily.FAMILY3 : '-'} </p>
                        <p className='underlined'>Has patient has done a kidney screening in the past 1 year: {pmhx && pmhx.PMHX9 ? pmhx.PMHX9 : '-'} </p>
                    </Typography>
                </Box>
            </Grid>
            
            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Mental Health</Typography>
                    <Typography>
                        <p className='underlined'>Age: {reg && reg.registrationQ4 ? reg.registrationQ4 : '-'} </p>
                        <p className='underlined'>DOC11: UNKNOWN DATA </p>
                        <p className='underlined'>DOC12: UNKNOWN DATA </p>
                        <p className='underlined'>PHQ10: UNKNOWN DATA </p>
                        <p className='underlined'>PHQ11: UNKNOWN DATA</p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Geri - Audiometry</Typography>
                    <Typography>
                        <p className='underlined'>Hearing problems: {hcsr && hcsr.hxHcsrQ7 ? hcsr.hxHcsrQ7 : '-'} </p>
                        <p className='underlined'>Currently use hearing aids/have been detected to require hearing aids? {pmhx && pmhx.PMHX13 ? pmhx.PMHX13 : '-'} </p>
                        <p className='underlined'>Has the senior seen an ENT specialist before: {pmhx && pmhx.PMHX14 ? pmhx.PMHX14 : '-'} </p>
                        <p className='underlined'>Hearing aids spoilt/not working?: {pmhx && pmhx.PMHX15 ? pmhx.PMHX15 : '-'} </p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Doctor&apos;s Station</Typography>
                    <Typography>
                        <p className='underlined'></p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Dietician</Typography>
                    <Typography>
                        <p className='underlined'></p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Social Services</Typography>
                    <Typography>
                        <p className='underlined'></p>
                    </Typography>
                </Box>
            </Grid>

            <Grid item lg={8} md={8} xs={12}>
                <Box sx={{ display:"flex", alignItems:"center", width:"100%" }}>
                    <Typography variant="h6" paddingRight={5} >Dental</Typography>
                    <Typography>
                        <p className='underlined'></p>
                    </Typography>
                </Box>
            </Grid>

            </Grid>
        </Container>
        </Box>
    </>
    )
}

export default Eligibility
