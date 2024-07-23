import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'

const Eligibility = () => {
    const { patientId } = useContext(FormContext)
    const [loadingPrevData, setLoadingPrevData] = useState(true)
    const [reg, setReg] = useState({})
    const [pmhx, setPMHX] = useState({})
    const [social, setSocial] = useState({})
    const [patient, setPatient] = useState({})
    const [hxfamily, setHxFamily] = useState({})
    const [triage, setTriage] = useState({})
    const [hcsr, setHcsr] = useState({})

    useEffect(() => {
        const loadPastForms = async () => {
            setLoadingPrevData(true)
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
                setLoadingPrevData(false)
            })
        }
        loadPastForms()
    }, [patientId])

    function createData(name, yes, no) {
        console.log("reg", reg);
        return { name, yes, no }
    }

    const rows = [
        // Indicated Yes to REGI15, Checked REGI16, Checked REGI 17
        createData('Phlebotomy', pmhx?.PMHX16 ? 'NO' : 'YES', pmhx?.PMHX16 ? 'YES' : 'NO'),

        // Indicated No/Unsure to REGI11
        createData('Healthier SG Booth', reg?.registrationQ11 != 'YES' ? 'YES' : 'NO', reg?.registrationQ11 != 'YES' ? 'NO' : 'YES'),
        createData('Faecal Immunochemical Testing (FIT)', 'YES', 'NO'),
        createData('Lung Function Testing', 'YES', 'NO'),
        createData("Women's Cancer Education", patient.gender === 'Female' ? 'YES' : 'NO', patient.gender === 'Female' ? 'NO' : 'YES'),
        createData('Osteoporosis Screening', 'YES', 'NO'),
        createData('Kidney Screening', 'YES', 'NO'),
        createData('Geriatric Screening', 'YES', 'NO'),
        createData('Mental Health', 'YES', 'NO'),
        createData('Audiometry', 'YES', 'NO'),
        createData('HPV On-Site Testing', 'YES', 'NO'),
        createData("Doctor's Station", 'YES', 'NO'),
        createData("Dietitian's Consult", 'YES', 'NO'),
        createData('Oral Health', 'YES', 'NO'),
        createData('Social Services', 'YES', 'NO'),
    ]

    const getCellStyle = (value, isAnswer) => ({
        color: value === isAnswer ? 'blue' : 'black'
    })

    return (
        <>
            <Helmet>
                <title>Patient Eligibility</title>
            </Helmet>
            <Box sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Modality</TableCell>
                                <TableCell>ELIGIBILITY (highlighted in blue)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell sx={getCellStyle(row.yes, row.yes)}>
                                        {row.yes}
                                    </TableCell>
                                    <TableCell sx={getCellStyle(row.no, row.yes)}>
                                        {row.no}
                                    </TableCell>
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
