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
import { getSavedData, getSavedPatientData, updateStationCounts } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'
import { computeVisitedStationsCount } from '../services/stationCounts'

const Eligibility = () => {
  const { patientId } = useContext(FormContext)
  const [forms, setForms] = useState(null)
  const [rows, setRows] = useState([])

  useEffect(() => {
    const loadAndCompute = async () => {
      const [
        pmhx, hxsocial, reg, hxfamily, triage, hcsr, hxoral, wce, phq,
      ] = await Promise.all([
        getSavedData(patientId, allForms.hxNssForm),
        getSavedData(patientId, allForms.hxSocialForm),
        getSavedData(patientId, allForms.registrationForm),
        getSavedData(patientId, allForms.hxFamilyForm),
        getSavedData(patientId, allForms.triageForm),
        getSavedData(patientId, allForms.hxHcsrForm),
        getSavedData(patientId, allForms.hxOralForm),
        getSavedData(patientId, allForms.wceForm),
        getSavedData(patientId, allForms.geriPhqForm),
      ])

      const formData = {
        reg: reg || {},
        pmhx: pmhx || {},
        hxsocial: hxsocial || {},
        hxfamily: hxfamily || {},
        triage: triage || {},
        hcsr: hcsr || {},
        hxoral: hxoral || {},
        wce: wce || {},
        phq: phq || {},
      }

      setForms(formData)

      const patient = await getSavedPatientData(patientId, 'patients')
      const visitedCount = computeVisitedStationsCount(patient)

      const eligibilityRows = getEligibilityRows(formData)
      const eligibleCount = eligibilityRows.filter(r => r.eligibility === 'YES').length
      setRows(eligibilityRows)

      await updateStationCounts(patientId, visitedCount, eligibleCount)
      console.log('visited:', visitedCount, 'eligible:', eligibleCount)
    }

    if (patientId) loadAndCompute()
  }, [patientId])

  return (
    <>
      <Helmet>
        <title>registrationQ5 Eligibility</title>
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

export const getEligibilityRows = (forms = {}) => {
  const {
    reg = {},
    pmhx = {},
    hxsocial = {},
    hxfamily = {},
    triage = {},
    hcsr = {},
    hxoral = {},
    phq = {},
  } = forms

  const createData = (name, isEligible) => ({
    name,
    eligibility: isEligible ? 'YES' : 'NO'
  })

  const isPhlebotomyEligible = reg?.registrationQ15 === 'Yes'
  const isVaccinationEligible = reg?.registrationQ4 >= 65 && reg?.registrationQ7 === 'Singapore Citizen 新加坡公民'
  const isHealthierSGEligible = reg?.registrationQ11 !== 'Yes'
  const isLungFunctionEligible = hxsocial?.SOCIAL10 === 'Yes, (please specify how many pack-years)' || hxsocial?.SOCIAL11 === 'Yes, (please specify)'
  const isFITEligible = reg?.registrationQ4 >= 50 && pmhx?.PMHX10 === 'No' && pmhx?.PMHX11 === 'No'
  const isWomenCancerEducationEligible = reg?.registrationQ5 === 'Female'
  const isOsteoporosisEligible =
    (reg?.registrationQ5 === 'Female' && reg?.registrationQ4 >= 45) ||
    (reg?.registrationQ5 === 'Male' && reg?.registrationQ4 >= 55)

  const isHaveConditions = pmhx.PMHX7 &&
    (pmhx?.PMHX7.includes('Kidney Disease') ||
     pmhx?.PMHX7.includes('Diabetes') ||
     pmhx?.PMHX7.includes('Hypertension'))

  const isHaveFamilyCondition = hxfamily?.FAMILY3 && hxfamily?.FAMILY3.length > 0
  const isExceedTriage = triage?.triageQ12 >= 27.5
  const isNKFEligible = (isHaveConditions || isHaveFamilyCondition || isExceedTriage) &&
    pmhx?.PMHX9 === 'No' && reg?.registrationQ4 <= 80

  const isMentalHealthEligible = (phq?.PHQ10 >= 10 && reg?.registrationQ4 < 60) || phq?.PHQ11 === 'Yes'
  const isAudiometryEligible = reg?.registrationQ4 >= 60 && pmhx?.PMHX13 === 'No'
  const isGeriatricScreeningEligible = reg?.registrationQ4 >= 60

  const isDoctorStationEligible = triage?.triageQ9 === 'Yes' ||
    hcsr?.hxHcsrQ3 === 'Yes' ||
    hcsr?.hxHcsrQ8 === 'Yes' ||
    pmhx?.PMHX12 === 'Yes' ||
    phq?.PHQ10 >= 10 ||
    phq?.PHQ9 !== '0 - Not at all'

  const isDietitianEligible = hxsocial?.SOCIAL15 === 'Yes'
  const isSocialServicesEligible = hxsocial?.SOCIAL6 === 'Yes' ||
    hxsocial?.SOCIAL7 === 'Yes, (please specify)' ||
    (hxsocial?.SOCIAL8 === 'Yes' && hxsocial?.SOCIAL9 === 'No')

  const isDentalEligible = hxoral?.ORAL5 === 'Yes'

  return [
    createData('Healthier SG Booth', isHealthierSGEligible),
    createData('Phlebotomy', isPhlebotomyEligible),
    createData('Faecal Immunochemical Testing (FIT)', isFITEligible),
    createData('Lung Function Testing', isLungFunctionEligible),
    createData("Women's Cancer Education", isWomenCancerEducationEligible),
    createData('Osteoporosis', isOsteoporosisEligible),
    createData('Kidney Screening', isNKFEligible),
    createData('Mental Health', isMentalHealthEligible),
    createData('Vaccination', isVaccinationEligible),
    createData('Geriatric Screening', isGeriatricScreeningEligible),
    createData('Audiometry', isAudiometryEligible),
    { name: 'HPV On-Site Testing', eligibility: 'Determined at another station' },
    createData("Doctor's Station", isDoctorStationEligible),
    createData("Dietitian's Consult", isDietitianEligible),
    createData('Oral Health', isDentalEligible),
    createData('Social Services', isSocialServicesEligible),
  ]
}