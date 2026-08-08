import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { formatBmi, formatGeriVision, formatWceStation } from '../api/formHelpers.jsx'
import { FormContext } from '../api/utils.js'
import { getSummaryReportDataStrict } from '../services/patientData'
import { Button } from '@mui/material'

// TODO: add triage and SACS

const formName = 'summaryForm'

const SummaryForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loadingPrevData, isLoadingPrevData] = useState(true)
  const [saveData, setSaveData] = useState({})
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportError, setReportError] = useState('')
  const [loadError, setLoadError] = useState('')

  // Oh my god this is terrible PLEASE SOMEONE FIX THIS
  // All the forms
  const [hcsr, setHcsr] = useState({})
  const [nss, setNss] = useState({})
  const [social, setSocial] = useState({})
  const [vision, setVision] = useState({})
  const [cancer, setCancer] = useState({})
  const [fit, setFit] = useState({})
  const [wce, setWce] = useState({})
  const [patients, setPatients] = useState({})
  const [phlebotomy, setPhlebotomy] = useState({})
  const [registration, setRegistration] = useState({})
  const [geriMmse, setGeriMmse] = useState({})
  const [geriVision, setGeriVision] = useState({})
  const [geriAudiometry, setGeriAudiometry] = useState({})
  const [geriPtConsult, setGeriPtConsult] = useState({})
  const [geriOtConsult, setGeriOtConsult] = useState({})
  const [geriEbasDep, setGeriEbasDep] = useState({})
  const [geriAmt, setGeriAmt] = useState({})
  //const [sacs, setSacs] = useState({})
  const [socialService, setSocialService] = useState({})
  const [doctorSConsult, setDoctorSConsult] = useState({})
  const [dietitiansConsult, setDietiatiansConsult] = useState({})
  const [oralHealth, setOralHealth] = useState({})
  const [triage, setTriage] = useState({})
  const [patientNo, updatePatientNo] = useState(patientId)

  const [vaccine, setVaccine] = useState({})
  const [lung, setLung] = useState({})
  const [nkf, setNKF] = useState({})
  const [hsg, setHSG] = useState({})
  const [grace, setGrace] = useState({})
  const [hearts, setHearts] = useState({})
  const [mental, setMental] = useState({})
  const [podiatry, setPodiatry] = useState({})
  const [mammobus, setMammobus] = useState({})
  const [hpv, setHpv] = useState({})
  const [scoliosisData, setScoliosisData] = useState({})
  const [hxOsa, setHxOsa] = useState({})

  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadForms = async () => {
      isLoadingPrevData(true)
      setLoadError('')

      try {
        const data = await getSummaryReportDataStrict(patientId)
        if (!mounted) return

        setHcsr(data?.hcsr || {})
        setNss(data?.nss || {})
        setSocial(data?.social || {})
        setCancer(data?.cancer || {})
        setVision(data?.vision || {})
        setFit(data?.fit || {})
        setWce(data?.wce || {})
        setPatients(data?.patients || {})
        setGeriPtConsult(data?.geriPtConsult || {})
        setGeriOtConsult(data?.geriOtConsult || {})
        setSocialService(data?.socialService || {})
        setDoctorSConsult(data?.doctorSConsult || {})
        setRegistration(data?.registration || {})
        setPhlebotomy(data?.phlebotomy || {})
        setGeriEbasDep(data?.geriEbasDep || {})
        setGeriAmt(data?.geriAmt || {})
        setDietiatiansConsult(data?.dietitiansConsult || {})
        setOralHealth(data?.oralHealth || {})
        setGeriMmse(data?.geriMmse || {})
        setGeriVision(data?.geriVision || {})
        setGeriAudiometry(data?.geriAudiometry || {})
        setTriage(data?.triage || {})
        setVaccine(data?.vaccine || {})
        setLung(data?.lung || {})
        setNKF(data?.nkf || {})
        setHSG(data?.hsg || {})
        setGrace(data?.grace || {})
        setHearts(data?.hearts || {})
        setMental(data?.mental || {})
        setPodiatry(data?.podiatry || {})
        setMammobus(data?.mammobus || {})
        setHpv(data?.hpv || {})
        setScoliosisData(data?.scoliosis || {})
        setHxOsa(data?.hxOsa || {})
      } catch (error) {
        console.error('Failed to load screening report data:', error)
        if (mounted) {
          setLoadError(
            error?.message
              ? `Unable to load screening report data. Details: ${error.message}`
              : 'Unable to load screening report data. Please refresh and try again.',
          )
        }
      } finally {
        if (mounted) isLoadingPrevData(false)
      }
    }

    loadForms()

    return () => {
      mounted = false
    }
  }, [patientId, refresh])

  const handleDownloadReport = async () => {
    setGeneratingReport(true)
    setReportError('')

    try {
      const { generate_pdf_updated } = await import('../reports/patientReportPdfUpdated')
      await generate_pdf_updated(
        registration,
        patients,
        cancer,
        phlebotomy,
        fit,
        wce,
        doctorSConsult,
        socialService,
        geriMmse,
        geriVision,
        geriAudiometry,
        dietitiansConsult,
        oralHealth,
        triage,
        vaccine,
        lung,
        nkf,
        hsg,
        grace,
        hearts,
        geriPtConsult,
        geriOtConsult,
        mental,
        social,
        podiatry,
        mammobus,
        hpv,
        scoliosisData,
        hxOsa,
      )
    } catch (error) {
      console.error('Failed to generate screening report:', error)
      setReportError(
        error?.message
          ? `Unable to generate screening report. Details: ${error.message}`
          : 'Unable to generate screening report. Please try again.',
      )
    } finally {
      setGeneratingReport(false)
    }
  }

  // TODO: add triage to summary form
  return (
    <Paper elevation={2} pt={3} m={3}>
      {loadingPrevData ? (
        <CircularProgress />
      ) : loadError ? (
        <Alert severity='error' sx={{ m: 2 }}>
          {loadError}
        </Alert>
      ) : (
        <Fragment>
          <div>
            {reportError && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {reportError}
              </Alert>
            )}
            <Button onClick={handleDownloadReport} disabled={generatingReport}>
              {generatingReport ? 'Generating Report...' : 'Download Screening Report'}
            </Button>
          </div>
        </Fragment>
      )}
    </Paper>
  )
}

export default function Summaryform(props) {
  const navigate = useNavigate()
  return <SummaryForm {...props} navigate={navigate} />
  // return <div>Test...</div>
}
