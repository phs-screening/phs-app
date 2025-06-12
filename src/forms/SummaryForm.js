import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { formatBmi, formatGeriVision, formatWceStation, generate_pdf, generate_pdf_updated } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import allForms from './forms.json'
import { Button } from '@mui/material'

// TODO: add triage and SACS

const formName = 'summaryForm'

const SummaryForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loadingPrevData, isLoadingPrevData] = useState(true)
  const [saveData, setSaveData] = useState({})

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

  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const loadForms = async () => {
      const loadPastForms = async () => {
        isLoadingPrevData(true)
        const registrationData = getSavedData(patientId, allForms.registrationForm)
        const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
        const nssData = getSavedData(patientId, allForms.hxNssForm)
        const socialData = getSavedData(patientId, allForms.hxSocialForm)
        const cancerData = getSavedData(patientId, allForms.hxCancerForm)
        const visionData = getSavedData(patientId, allForms.geriVisionForm)
        const fitData = getSavedData(patientId, allForms.fitForm)
        const wceData = getSavedData(patientId, allForms.wceForm)
        const patientsData = getSavedPatientData(patientId, 'patients')
        const phlebotomyData = getSavedData(patientId, allForms.phlebotomyForm)
        const geriPtConsultData = getSavedData(patientId, allForms.geriPtConsultForm)
        const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
        const geriAudiometryData = getSavedData(patientId, allForms.geriAudiometryForm)
        const geriOtConsultData = getSavedData(patientId, allForms.geriOtConsultForm)
        const geriEbasDepData = getSavedData(patientId, allForms.geriEbasDepForm)
        const geriMmseData = getSavedData(patientId, allForms.geriMmseForm)
        const geriAmtData = getSavedData(patientId, allForms.geriAmtForm)
        //const sacsData = getSavedData(patientId, allForms.sacsForm)
        const socialServiceData = getSavedData(patientId, allForms.socialServiceForm)
        const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
        const dietitiansConsultData = getSavedData(patientId, allForms.dietitiansConsultForm)
        const oralHealthData = getSavedData(patientId, allForms.oralHealthForm)
        const triageData = getSavedData(patientId, allForms.triageForm)

        const vaccineData = getSavedData(patientId, allForms.vaccineForm)
        const lungData = getSavedData(patientId, allForms.lungForm)
        const nkfData = getSavedData(patientId, allForms.nkfForm)
        const hsgData = getSavedData(patientId, allForms.hsgForm)
        const graceData = getSavedData(patientId, allForms.geriGraceForm)
        const heartsData = getSavedData(patientId, allForms.geriWhForm)
        const mentalData = getSavedData(patientId, allForms.mentalHealthForm)

        Promise.all([
          hcsrData,
          nssData,
          socialData,
          cancerData,
          visionData,
          fitData,
          wceData,
          patientsData,
          geriPtConsultData,
          geriOtConsultData,
          socialServiceData,
          doctorConsultData,
          registrationData,
          phlebotomyData,
          geriEbasDepData,
          geriAmtData,
          dietitiansConsultData,
          oralHealthData,
          geriMmseData,
          geriVisionData,
          geriAudiometryData,
          triageData,
          vaccineData,
          lungData,
          nkfData,
          hsgData,
          graceData,
          heartsData,
          mentalData
          //sacsData,
        ]).then((result) => {
          setHcsr(result[0])
          setNss(result[1])
          setSocial(result[2])
          setCancer(result[3])
          setVision(result[4])
          setFit(result[5])
          setWce(result[6])
          setPatients(result[7])
          setGeriPtConsult(result[8])
          setGeriOtConsult(result[9])
          setSocialService(result[10])
          setDoctorSConsult(result[11])
          setRegistration(result[12])
          setPhlebotomy(result[13])
          setGeriEbasDep(result[14])
          setGeriAmt(result[15])
          setDietiatiansConsult(result[16])
          setOralHealth(result[17])
          setGeriMmse(result[18])
          setGeriVision(result[19])
          setGeriAudiometry(result[20])
          setTriage(result[21])
          setVaccine(result[22])
          setLung(result[23])
          setNKF(result[24])
          setHSG(result[25])
          setGrace(result[26])
          setHearts(result[27])
          setMental(result[28])
          //setSacs(result[])
          isLoadingPrevData(false)
        })
      }
      await loadPastForms()
    }
    loadForms()
  }, [refresh])

  // TODO: add triage to summary form
  return (
    <Paper elevation={2} pt={3} m={3}>
      {loadingPrevData ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <div>
            <Button
              onClick={() =>
                generate_pdf_updated(
                  // TODO: add triage here
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
                  social
                )
              }
            >
              Download Screening Report
            </Button>
          </div>
        </Fragment>
      )}
    </Paper>
  )
}

SummaryForm.contextType = FormContext

export default function Summaryform(props) {
  const navigate = useNavigate()
  return <SummaryForm {...props} navigate={navigate} />
  // return <div>Test...</div>
}
