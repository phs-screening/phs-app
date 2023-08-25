import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import { calculateBMI, formatGeriVision, formatWceStation, generate_pdf } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import allForms from './forms.json'
import { bold, underlined, blueText, redText, blueRedText } from 'src/theme/commonComponents.js'
import { Button } from '@material-ui/core'

// TODO: add triage and SACS

const formName = 'summaryForm'

const SummaryForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loadingPrevData, isLoadingPrevData] = useState(true)
  const [saveData, setSaveData] = useState({})

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
  const [sacs, setSacs] = useState({})
  const [socialService, setSocialService] = useState({})
  const [doctorSConsult, setDoctorSConsult] = useState({})
  const [dietitiansConsult, setDietiatiansConsult] = useState({})
  const [oralHealth, setOralHealth] = useState({})
  const [triage, setTriage] = useState({})
  const [patientNo, updatePatientNo] = useState(patientId)
  const [refresh, setRefresh] = useState(false)

  useEffect(async () => {
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
      const sacsData = getSavedData(patientId, allForms.sacsForm)
      const socialServiceData = getSavedData(patientId, allForms.socialServiceForm)
      const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
      const dietitiansConsultData = getSavedData(patientId, allForms.dietitiansConsultForm)
      const oralHealthData = getSavedData(patientId, allForms.oralHealthForm)
      const triageData = getSavedData(patientId, allForms.triageForm)

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
        sacsData,
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
        setSacs(result[22])
        isLoadingPrevData(false)
      })
    }
    await loadPastForms()
  }, [refresh])

  // TODO: add triage to summary form
  return (
    <Paper elevation={2} pt={3} m={3}>
      {loadingPrevData ? (
        <CircularProgress />
      ) : (
        <Fragment>
          <div>
            <div>
              For report printer only:
              <input
                value={patientNo}
                onChange={(x) => updatePatientNo(x.target.value)}
                onSubmit={() => alert('hi')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updatePatientId(parseInt(patientNo))
                    setRefresh(!refresh)
                  }
                }}
              />
              <button
                onClick={() => {
                  updatePatientId(parseInt(patientNo))
                  setRefresh(!refresh)
                }}
              >
                {' '}
                Update{' '}
              </button>
            </div>

            {bold('Form Summary')}
            {bold('Please make sure that the information is correct.')}

            <br></br>
            {bold('1. Personal Particulars')}
            {underlined('Salutation')}
            {registration ? blueText(registration.registrationQ1) : '-'}
            <br></br>
            {underlined('Initials')}
            {patients ? blueText(patients.initials) : '-'}
            <br></br>
            {underlined('Gender')}
            {patients ? blueText(patients.gender) : '-'}
            <br></br>

            {bold('2. Blood Pressure')}
            {underlined('Average Blood Pressure (Systolic)')}
            {triage
              ? parseInt(triage.triageQ7) >= 130
                ? redText(
                    triage.triageQ7 +
                      '\nBlood pressure is high, please see a GP if you have not been diagnosed with hypertension',
                  )
                : blueText(triage.triageQ7)
              : '-'}
            <br></br>
            {underlined('Average Blood Pressure (Diastolic)')}
            {triage
              ? parseInt(triage.triageQ8) >= 85
                ? redText(
                    triage.triageQ8 +
                      '\nBlood pressure is high, please see a GP if you have not been diagnosed with hypertension',
                  )
                : blueText(triage.traigeQ8)
              : '-'}
            <br></br>

            <br></br>
            {bold('3. BMI')}
            {underlined('Height (in cm)')}
            {triage ? blueText(triage.triageQ9) : '-'}
            <br></br>
            {underlined('Weight (in kg)')}
            {triage ? blueText(triage.triageQ10) : '-'}
            <br></br>
            {underlined('Waist Circumference (in cm)')}
            {triage
              ? Number(triage.triageQ14) >= 90 && patients.gender == 'Male'
                ? redText(
                    triage.triageQ14 +
                      '\nYour waist circumference is above the normal range. The normal range is less than 90 cm for males.',
                  )
                : Number(triage.triageQ14) >= 80 && patients.gender == 'Female'
                ? redText(
                    triage.triageQ14 +
                      '\nYour waist circumference is above the normal range. The normal range is less than 80 cm for females.',
                  )
                : blueText(triage.triageQ14)
              : '-'}
            <br></br>
            {underlined('Body Mass Index (BMI)')}
            {triage ? calculateBMI(Number(triage.triageQ9), Number(triage.triageQ10)) : '-'}
            <br></br>

            <br></br>
            {bold('4. Phlebotomy')}
            {underlined('Eligible for phlebotomy:')}
            {registration ? (registration.registrationQ12 ? blueText('Yes') : blueText('No')) : '-'}
            <br></br>
            {underlined('Completed phlebotomy:')}
            {phlebotomy
              ? phlebotomy.phlebotomyQ1
                ? blueRedText(
                    'Yes',
                    'Kindly remind him that PHS will follow-up with them via mailing the results directly' +
                      ' to them or to their preferred GP clinics. These instructions are subjected to changes and hence, verify with the updated' +
                      ' protocols.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Preferred clinic (for phlebotomy):')}
            {registration ? blueText(registration.registrationQ10) : '-'}
            <br></br>

            <br></br>
            {bold('5. History Taking')}
            {underlined('Referrals')}
            {cancer ? blueText(cancer.hxCancerQ25) : '-'}
            <br></br>

            <br></br>
            {bold('6. Health Concerns')}
            {underlined(
              "Participant's presenting complaints/concerns requires scrutiny by doctor: (if any)",
            )}
            {hcsr.hxHcsrQ11 == 'Yes'
              ? blueRedText(
                  hcsr.hxHcsrQ11,
                  "Please check if participant has visited the Doctor's Consult Station.",
                )
              : blueText(hcsr.hxHcsrQ11)}
            <br></br>
            {underlined("Participant's presenting complaints/concerns (if any)")}
            {hcsr ? blueText(hcsr.hxHcsrQ2) : '-'}
            <br></br>

            <br></br>
            {bold('7. Systems Review')}
            {underlined("Participant's systems review requires scrutiny by doctor:")}
            {hcsr.hxHcsrQ12 == 'Yes'
              ? blueRedText(
                  hcsr.hxHcsrQ12,
                  "Please check if participant has visited the Doctor's Consult Station.",
                )
              : blueText(hcsr.hxHcsrQ12)}
            <br></br>
            {underlined("Participant's system review")}
            {hcsr ? blueText(hcsr.hxHcsrQ3) : '-'}
            <br></br>

            <br></br>
            {bold('8. Past Medical History')}
            {underlined("Participant's past medical history requires scrutiny by doctor:")}
            {nss.hxNssQ11 == 'Yes'
              ? blueRedText(
                  nss.hxNssQ11,
                  "Please check if participant has visited the Doctor's Consult Station.",
                )
              : blueText(nss.hxNssQ11)}
            <br></br>
            {underlined("Summary of participants's past medical history")}
            {nss ? blueText(nss.hxNssQ12) : '-'}
            <br></br>

            <br></br>
            {bold('9. Family History')}
            {underlined("Participant's past medical history requires scrutiny by doctor:")}
            {cancer.hxCancerQ9 == 'Yes'
              ? blueRedText(
                  cancer.hxCancerQ9,
                  "Please check if participant has visited the Doctor's Consult Station.",
                )
              : blueText(cancer.hxCancerQ9)}
            <br></br>
            {underlined("Summary of participant's past medical history:")}
            {cancer ? blueText(cancer.hxCancerQ10) : '-'}
            <br></br>

            <br></br>

            <br></br>
            {bold('10. Incontinence')}
            {underlined('Do you have any problem passing urine or motion? Please specify if yes.')}
            {hcsr
              ? hcsr.hxHcsrQ4 == 'Yes, (Please specify):'
                ? blueRedText(
                    hcsr.hxHcsrQ4,
                    "Check if participant is referred to Doctor's Consult AND Society for Continence Singapore (SFCS) booth at Exhibition." +
                      ' If no, tick on PHS Passport and indicate.',
                  )
                : blueText(hcsr.hxHcsrQ4)
              : '-'}
            {hcsr ? blueText(hcsr.hxHcsrQ5) : '-'}
            <br></br>

            <br></br>
            {bold('11. Vision')}
            {underlined('Do you have any vision problems? Please specify if yes')}
            {hcsr
              ? hcsr.hxHcsrQ6 == 'Yes, (Please specify):'
                ? blueRedText(
                    hcsr.hxHcsrQ6,
                    "If participant is below 60 years, please check if the participant is referred to Doctor's Consult. If participant" +
                      ' is at least 60 years, please check if the participant is referred to Geriatrics' +
                      ' for further screening/referral.',
                  )
                : blueText(hcsr.hxHcsrQ6)
              : blueText(hcsr.hxHcsrQ6)}
            <br></br>
            {underlined('Please specify:')}
            {hcsr ? blueText(hcsr.hxHcsrQ7) : '-'}
            <br></br>

            <br></br>
            {bold('12. Hearing')}
            {underlined('Do you have any hearing problems? Please specify if yes.')}
            {hcsr
              ? hcsr.hxHcsrQ8 == 'No' || typeof hcsr.hxHcsrQ8 == 'undefined'
                ? blueText(hcsr.hxHcsrQ8)
                : blueRedText(
                    hcsr.hxHcsrQ6,
                    "If participant is below 60 years, please check if the participant is referred to Doctor's Consult. If participant" +
                      ' is at least 60 years, please check if the participant is referred to Geriatrics' +
                      ' for further screening/referral.',
                  )
              : '-'}
            <br></br>
            {underlined('Please specify:')}
            {hcsr ? blueText(hcsr.hxHcsrQ9) : '-'}
            <br></br>

            <br></br>
            {bold('13. Social History')}
            {underlined('Does participant smoke?')}
            {nss
              ? nss.hxNssQ14 == 'No'
                ? blueText(nss.hxNssQ14)
                : blueRedText(
                    nss.hxNssQ14,
                    "Kindly advise participant to consider smoking cessation. If participant is interested, refer him/her to HPB's I Quit Programme",
                  )
              : '-'}
            <br></br>
            {underlined(
              'Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor, a can or bottle of beer, or a glass of wine.)',
            )}
            {nss ? blueText(nss.hxNssQ15) : '-'}
            <br></br>

            <br></br>
            {bold('14. FIT kits')}
            {underlined('Was the participant issued 2 FIT kits')}
            {fit
              ? fit.fitQ2 == 'Yes'
                ? blueRedText(
                    fit.fitQ2,
                    'Kindly remind the participant to adhere to the instructions regarding FIT kit application and sending. Teach the participant how to use the kit if' +
                      'he/she is unsure or has forgotten.',
                  )
                : redText(fit.fitQ2)
              : '-'}
            <br></br>

            <br></br>
            {bold('15. WCE Station')}
            {underlined('Completed Breast Self Examination station?')}
            {formatWceStation(patients.gender, 2, wce.wceQ2)}
            <br></br>
            {underlined('Completed Cervical Education station?')}
            {formatWceStation(patients.gender, 3, wce.wceQ3)}
            <br></br>
            {underlined('Indicated interest for HPV Test under SCS?')}
            {formatWceStation(patients.gender, 4, wce.wceQ4)}
            <br></br>
            {underlined('Indicated interest for Mammogram under SCS?')}
            {formatWceStation(patients.gender, 5, wce.wceQ5)}
            <br></br>

            <br></br>
            {bold('16. Geriatrics')}
            <br></br>
            {bold('a. Geriatrics - AMT')}
            {underlined('Did participant fail AMT?')}
            {geriAmt ? blueText(geriAmt.geriAmtQ12) : '-'}
            <br></br>
            {underlined('Referred to G-RACE for MMSE on-site?')}
            {geriAmt ? blueText(geriAmt.geriAmtQ13) : '-'}
            <br></br>
            {bold('b. Geriatrics - MMSE')}
            {underlined('Need referral to G-RACE associated polyclinics/ partners?')}
            {geriMmse ? blueText(geriMmse.geriMMSEQ2) : '-'}
            <br></br>
            {underlined('Referral made to G-RACE associated polyclinics/ partners?')}
            {geriMmse
              ? geriMmse.geriMMSEQ3 == 'Yes'
                ? blueRedText(
                    geriMmse.geriMMSEQ3,
                    'Please advise the participant to follow through' +
                      'with G-RACE and affiliated polyclinics/ partners.',
                  )
                : blueText(geriMmse.geriMMSEQ3)
              : '-'}
            <br></br>
            {bold('c. Geriatrics - EBAS')}
            {underlined(
              'Referred to SACS (failed EBAS-DEP) - from Geriatrics EBAS, probable present of a depressive order?',
            )}
            {geriEbasDep
              ? geriEbasDep.geriEbasDepQ10 == 'Yes'
                ? blueRedText(
                    geriEbasDep.geriEbasDepQ10,
                    'Please check if participant has visited the Social Service Station.',
                  )
                : blueText(geriEbasDep.geriEbasDepQ10)
              : '-'}
            <br></br>
            {underlined('Reasons for referral to SACS - from Geriatrics EBAS & AMT:')}
            {geriEbasDep ? blueRedText(geriEbasDep.geriEbasDepQ12) : '-'}
            <br></br>
            {bold('d. Geriatrics - PT consult')}
            {underlined('Memo from PT:')}
            {geriPtConsult ? blueRedText(geriPtConsult.geriPtConsultQ1) : '-'}
            <br></br>
            {underlined("Was participant referred for Doctor's Consult?")}
            {geriPtConsult
              ? geriPtConsult.geriPtConsultQ2 == 'Yes'
                ? blueRedText(
                    geriPtConsult.geriPtConsultQ2,
                    "Please check if participant has visited the Doctor's Consult Station.",
                  )
                : blueText(geriPtConsult.geriPtConsultQ12)
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ3) : '-'}
            <br></br>
            {underlined('Was the participant referred for Social Service?')}
            {geriPtConsult
              ? geriPtConsult.geriPtConsultQ4 == 'Yes'
                ? blueRedText(
                    geriPtConsult.geriPtConsultQ4,
                    'Please check if participant has visited the Social Service Station.',
                  )
                : blueText(geriPtConsult.geriPtConsultQ4)
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ5) : '-'}
            <br></br>
            {bold('e. Geriatrics - OT consult')}
            {underlined('Memo from OT:')}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ1) : '-'}
            <br></br>
            {underlined("Was participant referred for Doctor's Consult?")}
            {geriOtConsult
              ? geriOtConsult.geriOtConsultQ2 == 'Yes'
                ? blueRedText(
                    geriOtConsult.geriOtConsultQ2,
                    "Please check if participant has visited the Doctor's Consult Station.",
                  )
                : blueText(geriOtConsult.geriOtConsultQ2)
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ3) : '-'}
            <br></br>
            {underlined('Was the participant referred for Social Service?:')}
            {geriOtConsult
              ? geriOtConsult.geriOtConsultQ4 == 'Yes'
                ? blueRedText(
                    geriOtConsult.geriOtConsultQ4,
                    'Please check if participant has visited the Social Service Station.',
                  )
                : blueText(geriOtConsult.geriOtConsultQ4)
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ5) : '-'}
            <br></br>
            {underlined(
              'Which of the programmes did the OT recommend for the participant to go? (if applicable)',
            )}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ6) : '-'}
            <br></br>
            {underlined('Eligible for HDB EASE??')}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ7) : '-'}
            <br></br>
            {underlined('Interest in signing up?')}
            {geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ8) : '-'}
            <br></br>

            {bold('f. Geriatrics - Vision')}
            {underlined('Visual acuity (VA) scores')}
            {formatGeriVision(vision.geriVisionQ3, 3)}
            <br></br>
            {formatGeriVision(vision.geriVisionQ4, 4)}
            <br></br>
            {formatGeriVision(vision.geriVisionQ5, 5)}
            <br></br>
            {formatGeriVision(vision.geriVisionQ6, 6)}
            <br></br>
            {underlined("Participant referred to Doctor's Consult?")}
            {geriVision
              ? typeof geriVision.geriVisionQ9 != 'undefined' &&
                geriVision.geriVisionQ9 == "Referred to Doctor's Consult"
                ? blueRedText(
                    geriVision.geriVisionQ9,
                    "Please check if participant has visited the Doctor's Consult Station.",
                  )
                : blueText(geriVision.geriVisionQ9)
              : '-'}
            <br></br>

            {bold('g. Geriatrics - Audiometry')}
            {underlined('Did participant visit Audiometry Station by NUS Audiology team?')}
            {geriOtConsult ? blueText(geriAudiometry.geriAudiometryQ1) : '-'}
            <br></br>
            {underlined("Participant referred to Doctor's Consult?")}
            {geriAudiometry.geriAudiometryQ11 == 'Yes'
              ? blueRedText(
                  geriAudiometry.geriAudiometryQ11,
                  "Please check if participant has visited the Doctor's Consult Station.",
                )
              : blueText(geriAudiometry.geriAudiometryQ11)}
            <br></br>

            {bold('17. SACS')}
            {underlined('Notes from SACS Consultation')}
            {sacs ? blueText(sacs.sacsQ1) : '-'}
            {underlined('Is the patient okay to continue with screening?')}
            {sacs ? blueText(sacs.sacsQ2) : '-'}
            {underlined('Has this person been referred to a SACS CREST programme for follow-up?')}
            {sacs ? blueText(sacs.sacsQ3) : '-'}
            <br></br>

            <br></br>
            {bold("18. Doctor's Consult")}
            {underlined('Did this patient consult an on-site doctor today?')}
            {doctorSConsult
              ? doctorSConsult.doctorSConsultQ11
                ? blueRedText(
                    'Yes',
                    'Please check with participant if they have received a memo from the on-site Doctor.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined("Doctor's name:")}
            {doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ1) : '-'}
            <br></br>
            {underlined("Doctor's memo (if applicable):")}
            {doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ3) : '-'}
            <br></br>
            {underlined('Does this patient require urgent follow-up?')}
            {doctorSConsult
              ? doctorSConsult.doctorSConsultQ10
                ? blueRedText(
                    'Yes',
                    'If the on-site doctor has advised that you need urgent follow-up or you need to visit a GP/polyclinic/hospital, please do as instructed.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined("Was the participant referred for Dietitian's Consult?")}
            {doctorSConsult
              ? doctorSConsult.doctorSConsultQ4
                ? blueRedText(
                    'Yes',
                    "Please check if participant visited the Dietitian's Consult Station.",
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ5) : '-'}
            <br></br>
            {underlined('Was participant referred for Social Service?')}
            {doctorSConsult
              ? blueText(doctorSConsult.doctorSConsultQ6)
                ? blueRedText(
                    'Yes',
                    'Please check if participant visited the Social Service Station.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ7) : '-'}
            <br></br>
            {underlined('Was participant referred for Oral Health Station?')}
            {doctorSConsult
              ? blueText(doctorSConsult.doctorSConsultQ8)
                ? blueRedText('Yes', 'Please check if participant visited the Oral Health Station.')
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Reasons for referral:')}
            {doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ9) : '-'}
            <br></br>
            {underlined('Was participant referred to Polyclinic for depression?')}
            {doctorSConsult
              ? doctorSConsult.doctorSConsultQ11
                ? blueRedText(
                    'Yes',
                    'Please check with participant if they have received a memo from the on-site Doctor.',
                  )
                : blueText('No')
              : '-'}
            <br></br>

            {bold("19. Dietitian's Consult")}
            {underlined("Did this participant visit the Dietitian's Consult Station today?")}
            {dietitiansConsult
              ? dietitiansConsult.dietitiansConsultQ7 == 'No'
                ? blueRedText(
                    dietitiansConsult.dietitiansConsultQ7,
                    'Please check form A and above sections if the participant is' +
                      " flagged for Dietitian's Consult Station.",
                  )
                : blueText(dietitiansConsult.dietitiansConsultQ7)
              : '-'}
            <br></br>
            {underlined("Dietitian's name:")}
            {dietitiansConsult ? blueText(dietitiansConsult.dietitiansConsultQ1) : '-'}
            <br></br>
            {underlined('Notes for participant (if applicable):')}
            {dietitiansConsult
              ? typeof dietitiansConsult.dietitiansConsultQ4 != 'undefined'
                ? blueText(dietitiansConsult.dietitiansConsultQ4)
                : '-'
              : '-'}

            <br></br>
            {underlined('Does participant require urgent follow-up?')}
            {dietitiansConsult
              ? dietitiansConsult.dietitiansConsultQ5
                ? blueText('Yes')
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Reasons for urgent follow-up:')}
            {dietitiansConsult ? blueText(dietitiansConsult.dietitiansConsultQ6) : '-'}
            <br></br>
            {socialService
              ? socialService.socialServiceQ1 == 'Yes'
                ? redText(
                    'Kindly encourage the participant to follow through with recommendations from the Dietitian.',
                  )
                : ''
              : ''}
            <br></br>

            {bold('20. Social Service')}
            {underlined('Did this participant visit the social service station today?')}
            {socialService
              ? socialService.socialServiceQ1 == 'No'
                ? blueRedText(
                    socialService.socialServiceQ1,
                    'Please check form A and above sections if the participant is flagged for Social Service Station.',
                  )
                : blueText(socialService.socialServiceQ1)
              : '-'}
            <br></br>
            {underlined('What will be done for the participant?')}
            {socialService ? blueText(socialService.socialServiceQ3) : '-'}
            <br></br>
            {underlined('Is follow-up required?')}
            {socialService
              ? socialService.socialServiceQ4
                ? blueText('Yes')
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Brief summary of follow-up for the participant:')}
            {socialService ? blueText(socialService.socialServiceQ5) : '-'}
            <br></br>
            {socialService
              ? socialService.socialServiceQ1 == 'Yes'
                ? redText(
                    'Kindly encourage the participant to follow through with recommendations from AIC.',
                  )
                : ''
              : ''}
            <br></br>
            {underlined('Completed HDB EASE application?')}
            {socialService
              ? socialService.socialServiceQ7
                ? blueRedText(
                    'Yes',
                    'Please advice upon receipt of the application and the relevant documents (if required),' +
                      ' the HDB Branch managing your estate will reply to you within 7 working days.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Completed CHAS application?')}
            {socialService
              ? socialService.socialServiceQ8
                ? blueRedText(
                    'Yes',
                    'Inform participant that application takes 15 working days from the' +
                      ' date of receipt of the completed application to process. Successful applicants' +
                      ' and their household members will receive a CHAS card that indicates the subsidy' +
                      ' tier they are eligible for, as well as a welcome pack with information on the' +
                      ' use of the card.',
                  )
                : blueText('No')
              : '-'}
            <br></br>
            {underlined('Reasons for not completing above (if any):')}
            {socialService ? blueText(socialService.socialServiceQ9) : '-'}
            <br></br>

            {bold('21. Oral Health')}
            {underlined('Did this participant visit the Oral Health station today?')}
            {oralHealth ? (oralHealth.oralHealthQ2 ? blueText('Yes') : blueText('No')) : '-'}
            <br></br>
            {underlined('Will participant undergo follow-up by NUS Dentistry ')}
            {oralHealth
              ? oralHealth.oralHealthQ1
                ? blueRedText(
                    'Yes',
                    'Kindly remind participants that NUS Dentistry will contact you regarding your future oral health appointments.',
                  )
                : blueText('No.')
              : '-'}
            <br></br>

            <br></br>
            {bold('22. Mailing Details')}
            {underlined('Preferred language for health report:')}
            {registration ? blueText(registration.registrationQ11) : '-'}
            <br></br>
            {oralHealth ? blueText(oralHealth.oralHealthQ2) : '-'}
            <br></br>
            {redText(
              'Participants who preferred Chinese/ Tamily/ Malay will receive the final translated report from PHS within 4-6 weeks of the screening. \n',
            )}
            {redText(
              'If participant has gone for phlebotomy, he/she will receive the blood test results from NUHS/PHS. \n\n\n\n',
            )}
          </div>
          <div>
            <Button
              onClick={() =>
                generate_pdf(
                  // TOOD: add triage here
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
}
