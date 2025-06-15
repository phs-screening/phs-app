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
  Button
} from '@mui/material'
import { getSavedData } from '../services/mongoDB'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.vfs

const Eligibility = () => {
  const { patientId } = useContext(FormContext)
  const [reg, setReg] = useState({})
  const [pmhx, setPmhx] = useState({})
  const [hxsocial, setHxSocial] = useState({})
  const [hxfamily, setHxFamily] = useState({})
  const [triage, setTriage] = useState({})
  const [hcsr, setHcsr] = useState({})
  const [hxoral, setHxOral] = useState({})
  const [wce, setWce] = useState({})
  const [phq, setPhq] = useState({})

  useEffect(() => {
    const loadPastForms = async () => {
      const pmhxData = getSavedData(patientId, allForms.hxNssForm)
      const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
      const regData = getSavedData(patientId, allForms.registrationForm)
      const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const hxOralData = getSavedData(patientId, allForms.hxOralForm)
      const wceData = getSavedData(patientId, allForms.wceForm)
      const phqData = getSavedData(patientId, allForms.geriPhqForm)

      Promise.all([
        pmhxData,
        hxSocialData,
        regData,
        hxFamilyData,
        triageData,
        hcsrData,
        hxOralData,
        wceData,
        phqData,
      ]).then((result) => {
        setPmhx(result[0])
        setHxSocial(result[1])
        setReg(result[2])
        setHxFamily(result[3])
        setTriage(result[4])
        setHcsr(result[5])
        setHxOral(result[6])
        setWce(result[7])
        setPhq(result[8])
      })
    }
    loadPastForms()
  }, [patientId])

  function createData(name, isEligible) {
    const eligibility = isEligible ? 'YES' : 'NO'
    return { name, eligibility }
  }

  const isPhlebotomyEligible = reg.registrationQ15 === 'Yes'
  const isVaccinationEligible =
    reg?.registrationQ4 >= 65 && reg.registrationQ7 === 'Singapore Citizen 新加坡公民'
  const isHealthierSGEligible = reg.registrationQ11 !== 'Yes'
  const isLungFunctionEligible =
    hxsocial.SOCIAL10 === 'Yes, (please specify how many pack-years)' ||
    hxsocial.SOCIAL11 === 'Yes, (please specify)'
  const isFITEligible = reg.registrationQ4 >= 50 && pmhx.PMHX10 === 'No' && pmhx?.PMHX11 === 'No'
  const isWomenCancerEducationEligible = reg.registrationQ5 === 'Female'
  const isOsteoporosisEligible =
    (reg.registrationQ5 === 'Female' && reg.registrationQ4 >= 45) ||
    (reg.registrationQ5 === 'Male' && reg.registrationQ4 >= 55)

  const isHaveConditions =
    pmhx.PMHX7 !== undefined &&
    (pmhx.PMHX7.includes('Kidney Disease') ||
      pmhx.PMHX7.includes('Diabetes') ||
      pmhx.PMHX7.includes('Hypertension'))
  const isHaveFamilyCondition = hxfamily.FAMILY3 !== undefined && hxfamily.FAMILY3.length > 0
  const isExceedTriage = triage.triageQ12 >= 27.5
  const isNKFEligible =
    (isHaveConditions || isHaveFamilyCondition || isExceedTriage) &&
    pmhx.PMHX9 === 'No' &&
    reg.registrationQ4 <= 80
  const isMentalHealthEligible = (phq.PHQ10 >= 10 && reg.registrationQ4 < 60) || phq.PHQ11 === 'Yes'
  const isAudiometryEligible = reg.registrationQ4 >= 60 && pmhx.PMHX13 === 'No'
  const isGeriatricScreeningEligible = reg.registrationQ4 >= 60
  const isDoctorStationEligible =
    triage.triageQ9 === 'Yes' ||
    hcsr.hxHcsrQ3 === 'Yes' ||
    hcsr.hxHcsrQ8 === 'Yes' ||
    pmhx.PMHX12 === 'Yes' ||
    phq.PHQ10 >= 10 ||
    phq.PHQ9 !== '0 - Not at all'
  const isDietitianEligible = hxsocial.SOCIAL15 === 'Yes'
  const isSocialServicesEligible =
    hxsocial.SOCIAL6 === 'Yes' ||
    hxsocial.SOCIAL7 === 'Yes, (please specify)' ||
    (hxsocial.SOCIAL8 === 'Yes' && hxsocial.SOCIAL9 === 'No')
  const isDentalEligible = hxoral.ORAL5 === 'Yes'

  const rows = [
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

  function generate_pdf_updated(){
    let content = [];
    const docDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        subheader: {
          fontSize: 11,
          bold: true,
        },
        normal: {
          fontSize: 10,
        },
        italicSmall: {
          italics: true,
          fontSize: 8,
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: [40, 60, 40, 60],
    }
    let fileName = 'Report.pdf'
    if (patients.initials) {
      fileName = patients.initials.split(' ').join('_') + '_Eligiblity_Report.pdf'
    }
  
    pdfMake.createPdf(docDefinition).download(fileName)
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
        <Button onClick={() =>
                generate_pdf_updated()
              }>
          Download Eligibility Report
        </Button>
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
