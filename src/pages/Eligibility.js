import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid, Typography } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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

    function createData(name, yes, no) {
        return { name, yes, no };
    }
      
    const rows = [
        createData('Healthier SG Booth', 'YES', 'NO'),
        createData('Phlebotomy', 'YES', 'NO'),
        createData('Faecal Immunochemical Testing (FIT)','YES', 'NO'),
        createData('Lung Function Testing', 'YES', 'NO'),
        createData('Women&apos;s Cancer Education', 'YES', 'NO'),
        createData('Osteoporosis Screening', 'YES', 'NO'),
        createData('Kidney Screening', 'YES', 'NO'),
        createData('Geriatric Screening','YES', 'NO'),
        createData('Mental Health', 'YES', 'NO'),
        createData('Adiometry', 'YES', 'NO'),
        createData('HPV On-Site Testing', 'YES', 'NO'),
        createData('Doctor&apos;s Station','YES', 'NO'),
        createData('Dietitian&apos;s Consult', 'YES', 'NO'),
        createData('Oral Health', 'YES', 'NO'),
        createData('Social Services', 'YES', 'NO'),
    ];      

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
        <TableContainer>
            <Table>
            <TableHead>
            <TableRow>
                <TableCell>Modality</TableCell>
                <TableCell>ELIGIBLE?</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell >{row.yes}</TableCell>
                <TableCell >{row.no}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
        </Box>
    </>
    )
}

export default Eligibility
