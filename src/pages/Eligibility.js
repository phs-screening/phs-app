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
import { getEligibilityRows, computeVisitedStationsCount } from '../services/stationCounts'

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