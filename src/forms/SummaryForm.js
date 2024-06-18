import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { formatBmi, formatGeriVision, parseWceStation, generate_pdf } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData, getSavedPatientData } from '../services/mongoDB'
import allForms from './forms.json'
import { bold, underlined, blueText, redText, blueRedText } from 'src/theme/commonComponents.js'
import { Button } from '@mui/material'

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
                style={{ marginLeft: '5px', marginRight: '2px' }}
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

            <h1>Form Summary</h1>

            <h3 className='question--text'>Please make sure that the information is correct.</h3>
            <div className='summary--question-div'>
              <h2>1. Personal Particulars</h2>
              <p className='underlined'>Salutation</p>
              <p className='blue'>{registration ? registration.registrationQ1 : '-'}</p>
              <p className='underlined'>Initials</p>
              <p className='blue'>{patients ? patients.initials : '-'}</p>
              <p className='underlined'>Gender</p>
              <p className='blue'>{patients ? patients.gender : '-'}</p>
            </div>

            <div className='summary--question-div'>
              <h2>2. Blood Pressure</h2>
              <p className='underlined'>Average Blood Pressure (Systolic)</p>
              {triage ? (
                parseInt(triage.triageQ7) >= 130 ? (
                  <p className='red'>
                    {triage.triageQ7}
                    <br />
                    Blood pressure is high, please see a GP if you have not been diagnosed with
                    hypertension
                  </p>
                ) : (
                  <p className='blue'>{triage.triageQ7}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Average Blood Pressure (Diastolic)</p>
              {triage ? (
                parseInt(triage.triageQ8) >= 85 ? (
                  <p className='red'>
                    {triage.triageQ8}
                    <br />
                    Blood pressure is high, please see a GP if you have not been diagnosed with
                    hypertension
                  </p>
                ) : (
                  <p className='blue'>{triage.triageQ8}</p>
                )
              ) : (
                '-'
              )}
            </div>

            <div className='summary--question-div'>
              <h2>3. BMI</h2>
              <p className='underlined'>Height (in cm)</p>
              <p className='blue'>{triage ? triage.triageQ9 : '-'}</p>
              <p className='underlined'>Weight (in kg)</p>
              <p className='blue'>{triage ? triage.triageQ10 : '-'}</p>
              <p className='underlined'>Waist Circumference (in cm)</p>
              {triage ? (
                parseInt(triage.triageQ14) >= 90 && patients.gender == 'Male' ? (
                  <p className='red'>
                    {triage.triageQ14}
                    <br />
                    Your waist circumference is above the normal range. The normal range is less
                    than 90 cm for males.
                  </p>
                ) : parseInt(triage.triageQ14) >= 80 && patients.gender == 'Female' ? (
                  <p className='red'>
                    {triage.triageQ14}
                    <br />
                    Your waist circumference is above the normal range. The normal range is less
                    than 80 cm for females.
                  </p>
                ) : (
                  <p className='blue'>{triage.triageQ14}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Body Mass Index (BMI)</p>
              {triage ? formatBmi(triage.triageQ9, triage.triageQ10) : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>4. Phlebotomy</h2>
              <p className='underlined'>Eligible for phlebotomy:</p>
              {registration ? (
                registration.registrationQ12 ? (
                  <p className='blue'>Yes</p>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Completed phlebotomy:</p>
              {phlebotomy ? (
                phlebotomy.phlebotomyQ1 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Kindly remind him that PHS will follow-up with them via mailing the results
                      directly to them or to their preferred GP clinics. These instructions are
                      subjected to changes and hence, verify with the updated protocols.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Preferred clinic (for phlebotomy):</p>
              {registration ? <p className='blue'>{registration.registrationQ10}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>5. History Taking</h2>
              <p className='underlined'>Referrals</p>
              {cancer ? <p className='blue'>{cancer.hxCancerQ25}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>6. Health Concerns</h2>
              <p className='underlined'>
                Participant&apos;s presenting complaints/concerns requires scrutiny by doctor: (if
                any)
              </p>
              {hcsr.hxHcsrQ11 == 'Yes' ? (
                <div>
                  <p className='blue'>{hcsr.hxHcsrQ11}</p>
                  <p className='red'>
                    Please check if participant has visited the Doctor&apos;s Consult Station.{' '}
                  </p>
                </div>
              ) : (
                <p className='blue'>{hcsr.hxHcsrQ11}</p>
              )}
              <p className='underlined'>
                Participant&apos;s presenting complaints/concerns (if any)
              </p>
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ2}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>7. Systems Review</h2>
              <p className='underlined'>
                Participant&apos;s systems review requires scrutiny by doctor:
              </p>
              {hcsr.hxHcsrQ12 == 'Yes' ? (
                <div>
                  <p className='blue'>{hcsr.hxHcsrQ12}</p>
                  <p className='red'>
                    Please check if participant has visited the Doctor&apos;s Consult Station.
                  </p>
                </div>
              ) : (
                <p className='blue'>{hcsr.hxHcsrQ12}</p>
              )}
              <p className='underlined'>Participant&apos;s system review</p>
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ3}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>8. Past Medical History</h2>
              <p className='underlined'>
                Participant&apos;s past medical history requires scrutiny by doctor:
              </p>
              {nss.hxNssQ11 == 'Yes' ? (
                <div>
                  <p className='blue'>{nss.hxNssQ11}</p>
                  <p className='red'>
                    Please check if participant has visited the Doctor&apos;s Consult Station.
                  </p>
                </div>
              ) : (
                <p className='blue'>{nss.hxNssQ11}</p>
              )}
              <p className='underlined'>Summary of participants&apos;s past medical history</p>
              {nss ? <p className='blue'>{nss.hxNssQ12}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>9. Family History</h2>
              <p className='summary--underlined'>
                Participant&apos;s past medical history requires scrutiny by doctor:
              </p>
              {cancer.hxCancerQ9 == 'Yes' ? (
                <div>
                  <p className='red'>{cancer.hxCancerQ9}</p>
                  <p className='red'>
                    Please check if participant has visited the Doctor&apos;s Consult Station.
                  </p>
                </div>
              ) : (
                <p className='blue'>{cancer.hxCancerQ9}</p>
              )}
              <p className='underlined'>Summary of participant&apos;s past medical history:</p>
              {cancer ? <p className='blue'>{cancer.hxCancerQ10}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>10. Incontinence</h2>
              <p className='underlined'>
                Do you have any problem passing urine or motion? Please specify if yes.
              </p>
              {hcsr ? (
                hcsr.hxHcsrQ4 == 'Yes, (Please specify):' ? (
                  <div>
                    <p className='blue'>{hcsr.hxHcsrQ4}</p>
                    <p className='red'>
                      Check if participant is referred to Doctor&apos;s Consult AND Society for
                      Continence Singapore (SFCS) booth at Exhibition. If no, tick on PHS Passport
                      and indicate.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{hcsr.hxHcsrQ4}</p>
                )
              ) : (
                '-'
              )}
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ5}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>11. Vision</h2>
              <p className='underlined'>Do you have any vision problems? Please specify if yes</p>
              {hcsr ? (
                hcsr.hxHcsrQ6 == 'Yes, (Please specify):' ? (
                  <div>
                    <p className='blue'>{hcsr.hxHcsrQ6}</p>
                    <p className='red'>
                      If participant is below 60 years, please check if the participant is referred
                      to Doctor&apos;s Consult. If participant is at least 60 years, please check if
                      the participant is referred to Geriatrics for further screening/referral.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{hcsr.hxHcsrQ6}</p>
                )
              ) : (
                <p className='blue'>{hcsr.hxHcsrQ6}</p>
              )}
              <p className='underlined'>Please specify:</p>
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ7}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>12. Hearing</h2>
              <p className='underlined'>Do you have any hearing problems? Please specify if yes.</p>
              {hcsr ? (
                hcsr.hxHcsrQ8 == 'No' || typeof hcsr.hxHcsrQ8 == 'undefined' ? (
                  <p className='blue'>{hcsr.hxHcsrQ8}</p>
                ) : (
                  <div>
                    <p className='blue'>{hcsr.hxHcsrQ6}</p>
                    <p className='red'>
                      If participant is below 60 years, please check if the participant is referred
                      to Doctor&apos;s Consult. If participant is at least 60 years, please check if
                      the participant is referred to Geriatrics for further screening/referral.
                    </p>
                  </div>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Please specify:</p>
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ9}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>13. Social History</h2>
              <p className='underlined'>Does participant smoke?</p>
              {nss ? (
                nss.hxNssQ14 == 'No' ? (
                  <p className='blue'>{nss.hxNssQ14}</p>
                ) : (
                  <div>
                    <p className='blue'>{nss.hxNssQ14}</p>
                    <p className='red'>
                      Kindly advise participant to consider smoking cessation. If participant is
                      interested, refer him/her to HPB&apos;s I Quit Programme
                    </p>
                  </div>
                )
              ) : (
                '-'
              )}

              <p className='underlined'>
                Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor,
                a can or bottle of beer, or a glass of wine.)
              </p>
              {nss ? <p className='blue'>{nss.hxNssQ15}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>14. FIT kits</h2>
              <p className='underlined'>Was the participant issued 2 FIT kits</p>
              {fit ? (
                fit.fitQ2 == 'Yes' ? (
                  <div>
                    <p className='blue'>{fit.fitQ2}</p>
                    <p className='red'>
                      Kindly remind the participant to adhere to the instructions regarding FIT kit
                      application and sending. Teach the participant how to use the kit if he/she is
                      unsure or has forgotten.
                    </p>
                  </div>
                ) : (
                  <p className='red'>{fit.fitQ2}</p>
                )
              ) : (
                '-'
              )}
            </div>

            <div className='summary--question-div'>
              <h2>15. WCE Station</h2>
              <p className='underlined'>Completed Breast Self Examination station?</p>
              <p className='blue'>{wce.wceQ2}</p>
              <p className='red'>
                {patients.gender === 'Male' || patients.gender === 'Not Applicable'
                  ? '-'
                  : parseWceStation(2, wce.wceQ2)}
              </p>
              <p className='underlined'>Completed Cervical Education station?</p>
              <p className='blue'>{wce.wceQ3}</p>
              <p className='red'>
                {patients.gender === 'Male' || patients.gender === 'Not Applicable'
                  ? '-'
                  : parseWceStation(3, wce.wceQ3)}
              </p>
              <p className='underlined'>Indicated interest for HPV Test under SCS?</p>
              <p className='blue'>{wce.wceQ4}</p>
              <p className='red'>
                {patients.gender === 'Male' || patients.gender === 'Not Applicable'
                  ? '-'
                  : parseWceStation(4, wce.wceQ4)}
              </p>
              <p className='underlined'>Indicated interest for Mammogram under SCS?</p>
              <p className='blue'>{wce.wceQ5}</p>
              <p className='red'>
                {patients.gender === 'Male' || patients.gender === 'Not Applicable'
                  ? '-'
                  : parseWceStation(5, wce.wceQ5)}
              </p>
            </div>

            <div className='summary--question-div'>
              <h2>16. Geriatrics</h2>
              <h3>a. Geriatrics - AMT</h3>
              <p className='underlined'>Did participant fail AMT?</p>
              {geriAmt ? <p className='blue'>{geriAmt.geriAmtQ12}</p> : '-'}
              <p className='underlined'>Referred to G-RACE for MMSE on-site?</p>
              {geriAmt ? <p className='blue'>{geriAmt.geriAmtQ13}</p> : '-'}
              <h3>b. Geriatrics - MMSE</h3>
              <p className='underlined'>
                Need referral to G-RACE associated polyclinics/ partners?
              </p>
              {geriMmse ? <p className='blue'>{geriMmse.geriMMSEQ2}</p> : '-'}
              <p className='underlined'>
                Referral made to G-RACE associated polyclinics/ partners?
              </p>
              {geriMmse ? (
                geriMmse.geriMMSEQ3 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriMmse.geriMMSEQ3}</p>
                    <p className='red'>
                      Please advise the participant to follow through with G-RACE and affiliated
                      polyclinics/ partners.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriMmse.geriMMSEQ3}</p>
                )
              ) : (
                '-'
              )}

              <h3 className='question--text'>c. Geriatrics - EBAS</h3>
              <p className='underlined'>
                Referred to SACS (failed EBAS-DEP) - from Geriatrics EBAS, probable present of a
                depressive order?
              </p>
              {geriEbasDep ? (
                geriEbasDep.geriEbasDepQ10 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriEbasDep.geriEbasDepQ10}</p>
                    <p className='red'>
                      Please check if participant has visited the Social Service Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriEbasDep.geriEbasDepQ10}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>
                Reasons for referral to SACS - from Geriatrics EBAS & AMT:
              </p>
              {geriEbasDep ? <p className='blue'>{geriEbasDep.geriEbasDepQ12}</p> : '-'}

              <h3>d. Geriatrics - PT consult</h3>
              <p className='underlined'>Memo from PT:</p>
              {geriPtConsult ? <p className='blue'>{geriPtConsult.geriPtConsultQ1}</p> : '-'}
              <p className='underlined'>Was participant referred for Doctor&apos;s Consult?</p>
              {geriPtConsult ? (
                geriPtConsult.geriPtConsultQ2 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriPtConsult.geriPtConsultQ2}</p>
                    <p className='red'>
                      Please check if participant has visited the Doctor&apos;s Consult Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriPtConsult.geriPtConsultQ12}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {geriPtConsult ? <p className='blue'>{geriPtConsult.geriPtConsultQ3}</p> : '-'}
              <p className='underlined'>Was the participant referred for Social Service?</p>
              {geriPtConsult ? (
                geriPtConsult.geriPtConsultQ4 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriPtConsult.geriPtConsultQ4}</p>
                    <p className='red'>
                      Please check if participant has visited the Social Service Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriPtConsult.geriPtConsultQ4}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {geriPtConsult ? <p className='blue'>{geriPtConsult.geriPtConsultQ5}</p> : '-'}

              <h3>e. Geriatrics - OT consult</h3>
              <p className='underlined'>Memo from OT:</p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ1}</p> : '-'}
              <br></br>
              <p className='underlined'>Was participant referred for Doctor&apos;s Consult?</p>
              {geriOtConsult ? (
                geriOtConsult.geriOtConsultQ2 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriOtConsult.geriOtConsultQ2}</p>
                    <p className='red'>
                      Please check if participant has visited the Doctor&apos;s Consult Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriOtConsult.geriOtConsultQ2}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ3}</p> : '-'}
              <p className='underlined'>Was the participant referred for Social Service?:</p>
              {geriOtConsult ? (
                geriOtConsult.geriOtConsultQ4 == 'Yes' ? (
                  <div>
                    <p className='blue'>{geriOtConsult.geriOtConsultQ4}</p>
                    <p className='red'>
                      Please check if participant has visited the Social Service Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriOtConsult.geriOtConsultQ4}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ5}</p> : '-'}
              <p className='underlined'>
                Which of the programmes did the OT recommend for the participant to go? (if
                applicable)
              </p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ6}</p> : '-'}
              <p className='underlined'>Eligible for HDB EASE??</p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ7}</p> : '-'}
              <p className='underlined'>Interest in signing up?</p>
              {geriOtConsult ? <p className='blue'>{geriOtConsult.geriOtConsultQ8}</p> : '-'}

              <h3>f. Geriatrics - Vision</h3>
              <p className='underlined'>Visual acuity (VA) scores</p>
              {formatGeriVision(vision.geriVisionQ3, 3)}
              {formatGeriVision(vision.geriVisionQ4, 4)}
              {formatGeriVision(vision.geriVisionQ5, 5)}
              {formatGeriVision(vision.geriVisionQ6, 6)}
              <p className='underlined'>Participant referred to Doctor&apos;s Consult?</p>
              {geriVision ? (
                typeof geriVision.geriVisionQ9 != 'undefined' &&
                geriVision.geriVisionQ9 == "Referred to Doctor's Consult" ? (
                  <div>
                    <p className='blue'>{geriVision.geriVisionQ9}</p>
                    <p className='red'>
                      Please check if participant has visited the Doctor&apos;s Consult Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{geriVision.geriVisionQ9}</p>
                )
              ) : (
                '-'
              )}

              <h3>g. Geriatrics - Audiometry</h3>
              <p className='underlined'>
                Did participant visit Audiometry Station by NUS Audiology team?
              </p>
              {geriOtConsult ? <p className='blue'>{geriAudiometry.geriAudiometryQ1}</p> : '-'}
              <p className='underlined'>Participant referred to Doctor&apos;s Consult?</p>
              {geriAudiometry.geriAudiometryQ11 == 'Yes' ? (
                <div>
                  <p className='blue'>{geriAudiometry.geriAudiometryQ11}</p>
                  <p className='red'>
                    Please check if participant has visited the Doctor&apos;s Consult Station.
                  </p>
                </div>
              ) : (
                <p className='blue'>{geriAudiometry.geriAudiometryQ11}</p>
              )}
            </div>

            <div className='summary--question-div'>
              <h2>17. SACS</h2>
              <p className='underlined'>Notes from SACS Consultation</p>
              {sacs ? <p className='blue'>{sacs.sacsQ1}</p> : '-'}
              <p className='underlined'>Is the patient okay to continue with screening?</p>
              {sacs ? <p className='blue'>{sacs.sacsQ2}</p> : '-'}
              <p className='underlined'>
                Has this person been referred to a SACS CREST programme for follow-up?
              </p>
              {sacs ? <p className='blue'>{sacs.sacsQ3}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>18. Doctor&apos;s Consult</h2>
              <p className='underlined'>Did this patient consult an on-site doctor today?</p>
              {doctorSConsult ? (
                doctorSConsult.doctorSConsultQ11 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Please check with participant if they have received a memo from the on-site
                      Doctor.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Doctor&apos;s name:</p>
              {doctorSConsult ? <p className='blue'>{doctorSConsult.doctorSConsultQ1}</p> : '-'}
              <p className='underlined'>Doctor&apos;s memo (if applicable):</p>
              {doctorSConsult ? <p className='blue'>{doctorSConsult.doctorSConsultQ3}</p> : '-'}
              <p className='underlined'>Does this patient require urgent follow-up?</p>
              {doctorSConsult ? (
                doctorSConsult.doctorSConsultQ10 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      If the on-site doctor has advised that you need urgent follow-up or you need
                      to visit a GP/polyclinic/hospital, please do as instructed.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>
                Was the participant referred for Dietitian&apos;s Consult?
              </p>
              {doctorSConsult ? (
                doctorSConsult.doctorSConsultQ4 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Please check if participant visited the Dietitian&apos;s Consult Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {doctorSConsult ? <p className='blue'>{doctorSConsult.doctorSConsultQ5}</p> : '-'}
              <p className='underlined'>Was participant referred for Social Service?</p>
              {doctorSConsult ? (
                doctorSConsult.doctorSConsultQ6 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Please check if participant visited the Social Service Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {doctorSConsult ? <p className='blue'>{doctorSConsult.doctorSConsultQ7}</p> : '-'}
              <p className='underlined'>Was participant referred for Oral Health Station?</p>
              {doctorSConsult ? (
                doctorSConsult.doctorSConsultQ8 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Please check if participant visited the Oral Health Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for referral:</p>
              {doctorSConsult ? <p className='blue'>{doctorSConsult.doctorSConsultQ9}</p> : '-'}
            </div>

            <div className='question-div'>
              <h2>19. Dietitian&apos;s Consult</h2>
              <p className='underlined'>
                Did this participant visit the Dietitian&apos;s Consult Station today?
              </p>
              {dietitiansConsult ? (
                dietitiansConsult.dietitiansConsultQ7 == 'No' ? (
                  <div>
                    <p className='blue'>{dietitiansConsult.dietitiansConsultQ7}</p>
                    <p className='red'>
                      Please check form A and above sections if the participant is flagged for
                      Dietitian&apos;s Consult Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{dietitiansConsult.dietitiansConsultQ7}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Dietitian&apos;s name:</p>
              {dietitiansConsult ? (
                <p className='blue'>{dietitiansConsult.dietitiansConsultQ1}</p>
              ) : (
                '-'
              )}
              <p className='underlined'>Notes for participant (if applicable):</p>
              {dietitiansConsult ? (
                typeof dietitiansConsult.dietitiansConsultQ4 != 'undefined' ? (
                  <p className='blue'>{dietitiansConsult.dietitiansConsultQ4}</p>
                ) : (
                  '-'
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Does participant require urgent follow-up?</p>
              {dietitiansConsult ? (
                dietitiansConsult.dietitiansConsultQ5 ? (
                  <p className='blue'>Yes</p>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for urgent follow-up:</p>
              {dietitiansConsult ? (
                <p className='blue'>{dietitiansConsult.dietitiansConsultQ6}</p>
              ) : (
                '-'
              )}
              {socialService ? (
                socialService.socialServiceQ1 == 'Yes' ? (
                  <p className='red'>
                    Kindly encourage the participant to follow through with recommendations from the
                    Dietitian.
                  </p>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
            </div>

            <div className='summary--question-div'>
              <h2>20. Social Service</h2>
              <p className='underlined'>
                Did this participant visit the social service station today?
              </p>
              {socialService ? (
                socialService.socialServiceQ1 == 'No' ? (
                  <div>
                    <p className='blue'>{socialService.socialServiceQ1}</p>
                    <p className='red'>
                      Please check form A and above sections if the participant is flagged for
                      Social Service Station.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>{socialService.socialServiceQ1}</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>What will be done for the participant?</p>
              {socialService ? <p className='blue'>{socialService.socialServiceQ3}</p> : '-'}
              <p className='underlined'>Is follow-up required?</p>
              {socialService ? (
                socialService.socialServiceQ4 ? (
                  <p className='blue'>Yes</p>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Brief summary of follow-up for the participant:</p>
              {socialService ? <p className='blue'>{socialService.socialServiceQ5}</p> : '-'}
              {socialService ? (
                socialService.socialServiceQ1 == 'Yes' ? (
                  <p className='red'>
                    Kindly encourage the participant to follow through with recommendations from
                    AIC.
                  </p>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
              <p className='underlined'>Completed HDB EASE application?</p>
              {socialService ? (
                socialService.socialServiceQ7 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Please advice upon receipt of the application and the relevant documents (if
                      required), the HDB Branch managing your estate will reply to you within 7
                      working days.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Completed CHAS application?</p>
              {socialService ? (
                socialService.socialServiceQ8 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Inform participant that application takes 15 working days from the date of
                      receipt of the completed application to process. Successful applicants tier
                      they are eligible for, as well as a welcome pack with information on the and
                      their household members will receive a CHAS card that indicates the subsidy
                      use of the card.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Reasons for not completing above (if any):</p>
              {socialService ? <p className='blue'>{socialService.socialServiceQ9}</p> : '-'}
            </div>

            <div className='summary--question-div'>
              <h2>21. Oral Health</h2>
              <p className='underlined'>
                Did this participant visit the Oral Health station today?
              </p>
              {oralHealth ? (
                oralHealth.oralHealthQ2 ? (
                  <p className='blue'>Yes</p>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
              <p className='underlined'>Will participant undergo follow-up by NUS Dentistry </p>
              {oralHealth ? (
                oralHealth.oralHealthQ1 ? (
                  <div>
                    <p className='blue'>Yes</p>
                    <p className='red'>
                      Kindly remind participants that NUS Dentistry will contact you regarding your
                      future oral health appointments.
                    </p>
                  </div>
                ) : (
                  <p className='blue'>No</p>
                )
              ) : (
                '-'
              )}
            </div>

            <div className='summary--question-div'>
              <h2>22. Mailing Details</h2>
              <p className='underlined'>Preferred language for health report:</p>
              {registration ? <p className='blue'>{registration.registrationQ11}</p> : '-'}
              {oralHealth ? <p className='blue'>{oralHealth.oralHealthQ2}</p> : '-'}
              <p className='red'>
                Participants who preferred Chinese/ Tamily/ Malay will receive the final translated
                report from PHS within 4-6 weeks of the screening.
                <br />
                If participant has gone for phlebotomy, he/she will receive the blood test results
                from NUHS/PHS.
              </p>
              <br />
            </div>
          </div>
          <div>
            <Button
              onClick={() =>
                generate_pdf(
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
