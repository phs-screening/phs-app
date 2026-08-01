import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  Alert,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { Helmet } from 'react-helmet-async'

import { FormContext } from '../api/utils.js'
import { getPatientStationEligibility } from '../api/stationsApi'

// Eligibility page

function Eligibility() {
  const { patientId } = useContext(FormContext)
  const [rows, setRows] = useState([])
  const [loadingPrevData, isLoadingPrevData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const generatePDFRef = useRef(() => {})

  const isValidPatientId = Number.isFinite(patientId) && patientId > 0

  useEffect(() => {
    let mounted = true

    const loadStationEligibility = async () => {
      isLoadingPrevData(true)
      setLoadError('')

      try {
        const eligibility = await getPatientStationEligibility(patientId)
        if (mounted) setRows(eligibility.data?.rows || [])
      } catch (error) {
        console.error('Failed to load backend station eligibility:', error)
        if (mounted) {
          setRows([])
          setLoadError(error?.message || 'Unable to load station eligibility from the backend.')
        }
      } finally {
        if (mounted) isLoadingPrevData(false)
      }
    }

    if (isValidPatientId) {
      loadStationEligibility()
    } else {
      if (mounted) {
        setRows([])
        setLoadError('Please select a valid patient before checking eligibility.')
        isLoadingPrevData(false)
      }
    }

    return () => {
      mounted = false
    }
  }, [patientId, isValidPatientId])

  generatePDFRef.current = async () => {
    try {
      const { generateFormAPdf } = await import('../reports/formAPdf')
      await generateFormAPdf(patientId)
    } catch (error) {
      console.error('Failed to generate Form A PDF:', error)
      alert('Unable to generate Form A PDF because backend station eligibility is unavailable.')
    }
  }

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
        {loadingPrevData ? (
          <CircularProgress />
        ) : (
          <Button disabled={!isValidPatientId} onClick={() => generatePDFRef.current()}>
            Download Form A
          </Button>
        )}
        {loadError ? (
          <Alert severity='error' sx={{ my: 2 }}>
            {loadError}
          </Alert>
        ) : null}
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
