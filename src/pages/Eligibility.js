import React, { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'

const Eligibility = () => {
  const { patientId } = useContext(FormContext)
  const [reg, setReg] = useState({})
  const [pmhx, setPMHX] = useState({})
  const [social, setSocial] = useState({})
  const [patient, setPatient] = useState({})
  const [hxfamily, setHxFamily] = useState({})
  const [triage, setTriage] = useState({})
  const [hcsr, setHcsr] = useState({})
  const [oral, setOral] = useState({})
  const [wce, setWce] = useState({})
  const [phq, setPhq] = useState({})

  useEffect(() => {
    const loadPastForms = async () => {
      const pmhxData = getSavedData(patientId, allForms.hxNssForm)
      const socialData = getSavedData(patientId, allForms.hxSocialForm)
      const regData = getSavedData(patientId, allForms.registrationForm)
      const patientData = getSavedPatientData(patientId, 'patients')
      const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const oralData = getSavedData(patientId, allForms.oralHealthForm)
      const wceData = getSavedData(patientId, allForms.wceForm)
      const phqData = getSavedData(patientId, allForms.hxPhqForm)

      Promise.all([
        pmhxData,
        socialData,
        regData,
        patientData,
        hxFamilyData,
        triageData,
        hcsrData,
        oralData,
        wceData,
        phqData,
      ]).then((result) => {
        setPMHX(result[0])
        setSocial(result[1])
        setReg(result[2])
        setPatient(result[3])
        setHxFamily(result[4])
        setTriage(result[5])
        setHcsr(result[6])
        setOral(result[7])
        setWce(result[8])
        setPhq(result[9])
      })
    }
    loadPastForms()
  }, [patientId])

  useEffect(() => {
    console.log(reg.registrationQ4)
    console.log(hxfamily)
    console.log(patientId)
  }, [reg])

  function createData(name, isEligible) {
    const eligibility = isEligible ? 'YES' : 'NO'
    return { name, eligibility }
  }

  const isPhlebotomyEligible = reg.registrationQ15 === 'Yes'
  const isVaccinationEligible =
    reg?.registrationQ4 >= 65 && reg.registrationQ7 === 'Singapore Citizen 新加坡公民'
  const isHealthierSGEligible = reg.registrationQ11 !== 'Yes'
  const isLungFunctionEligible = social.SOCIAL10 === 'Yes' || social.SOCIAL11 === 'Yes'
  const isFITEligible = reg.registrationQ4 >= 50 && pmhx.PMHX10 === 'No' && pmhx?.PMHX11 === 'No'
  const isWomenCancerEducationEligible = reg.gender === 'Female'
  const isOsteoporosisEligible =
    (patient.gender === 'Female' && reg.registrationQ4 >= 45) ||
    (patient.gender === 'Male' && reg.registrationQ4 >= 55)
  const isNKFEligible =
    (pmhx.PMHX7 === 'Kidney Disease' ||
      pmhx.PMHX7 === 'Diabetes' ||
      pmhx.PMHX7 === 'Hypertension' ||
      (hxfamily.FAMILY3 !== undefined && hxfamily.FAMILY3.length > 0) ||
      triage.triageQ12 >= 27.5) &&
    pmhx.PMHX9 === 'No ' &&
    reg.registrationQ4 <= 80
  const isMentalHealthEligible = phq.PHQ10 >= 10 && reg.registrationQ4 < 60
  const isAudiometryEligible = reg.registrationQ4 >= 60 && pmhx.PMHX13 === 'No'
  const isGeriatricScreeningEligible = reg.registrationQ4 >= 60 && pmhx.PMHX13 === 'No'
  const isOnSiteHPVTestingEligible = wce.wceQ7 === 'Yes'
  const isDoctorStationEligible =
    triage.triageQ9 === 'Yes' ||
    hcsr.hxHcsrQ3 === 'Yes' ||
    hcsr.hxHcsrQ8 === 'Yes' ||
    pmhx.PMHX12 === 'Yes' ||
    phq.PHQ10 >= 10 ||
    phq.PHQ9 !== '0 - Not at all'

  const isDietitianEligible = social.SOCIAL15 === 'Yes'
  const isSocialServicesEligible =
    social.SOCIAL6 === 'Yes' || social.SOCIAL7 === 'Yes' || social.SOCIAL9 !== 'Yes'
  const isDentalEligible = oral.DENT5 === 'Yes'

  const rows = [
    createData('Phlebotomy', isPhlebotomyEligible),
    createData('Vaccination', isVaccinationEligible),
    createData('Healthier SG Booth', isHealthierSGEligible),
    createData('Faecal Immunochemical Testing (FIT)', isFITEligible),
    createData('Lung Function Testing', isLungFunctionEligible),
    createData("Women's Cancer Education", isWomenCancerEducationEligible),
    createData('Osteoporosis', isOsteoporosisEligible),
    createData('Kidney Screening', isNKFEligible),
    createData('Mental Health', isMentalHealthEligible),
    createData('Audiometry', isAudiometryEligible),
    createData('HPV On-Site Testing', isOnSiteHPVTestingEligible),
    createData('Geriatric Screening', isGeriatricScreeningEligible),
    createData("Doctor's Station", isDoctorStationEligible),
    createData("Dietitian's Consult", isDietitianEligible),
    createData('Social Services', isSocialServicesEligible),
    createData('Dental', isDentalEligible),
  ]

  const getCellStyle = (isEligible) => {
    if (isEligible) {
      return 'blue'
    } else {
      return 'red'
    }
  }

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
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ color: row.eligibility === 'YES' ? 'blue' : 'red' }}>
                    {row.eligibility}
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

