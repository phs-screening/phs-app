import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { LongTextField, BoolField } from 'uniforms-mui'
import { submitForm, formatBmi, calculateSppbScore } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  doctorSConsultQ1: {
    type: String,
    optional: false,
  },
  doctorSConsultQ2: {
    type: String,
    optional: true,
  },
  doctorSConsultQ3: {
    type: String,
    optional: false,
  },
  doctorSConsultQ4: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ5: {
    type: String,
    optional: true,
  },
  doctorSConsultQ6: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ7: {
    type: String,
    optional: true,
  },
  doctorSConsultQ13: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ8: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ9: {
    type: String,
    optional: true,
  },
  doctorSConsultQ10: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ11: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
})

const formName = 'doctorConsultForm'
const DoctorSConsultForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  // forms to retrieve for side panel
  const [hcsr, setHcsr] = useState({})
  const [nss, setNss] = useState({})
  const [cancer, setCancer] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [geriPt, setGeriPt] = useState({})
  const [geriVision, setGeriVision] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriPhysical, setGeriPhysical] = useState({})
  const [geriAudio, setGeriAudio] = useState({})
  const [geriPHQ, setPHQ] = useState({})
  const [lung, setLung] = useState({})
  const [triage, setTriage] = useState({})
  useEffect(async () => {
    const loadPastForms = async () => {
      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const nssData = getSavedData(patientId, allForms.hxNssForm)
      const cancerData = getSavedData(patientId, allForms.hxCancerForm)
      const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
      const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)
      const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
      const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
      const geriPhysicalData = getSavedData(patientId, allForms.geriPhysicalActivityLevelForm)
      const geriAudioData = getSavedData(patientId, allForms.geriAudiometryForm)
      const savedData = getSavedData(patientId, formName)
      const lungData = getSavedData(patientId, allForms.lungForm)
      const PHQDATA = getSavedData(patientId, allForms.geriPhqForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      Promise.all([
        hcsrData,
        nssData,
        cancerData,
        geriOtData,
        geriPtData,
        savedData,
        geriVisionData,
        geriSppbData,
        geriPhysicalData,
        geriAudioData,
        lungData,
        PHQDATA,
        triageData,
      ]).then((result) => {
        setHcsr(result[0])
        setNss(result[1])
        setCancer(result[2])
        setGeriOt(result[3])
        setGeriPt(result[4])
        setSaveData(result[5])
        setGeriVision(result[6])
        setGeriSppb(result[7])
        setGeriPhysical(result[8])
        setGeriAudio(result[9]),
        setLung(result[10])
        setPHQ(result[11])
        setTriage(result[12]),
        isLoadingSidePanel(false)
      })
    }

    loadPastForms()
  }, [])
  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          isLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h1>Doctor&apos;s Consult</h1>
        <h3>Doctor&apos;s Name:</h3>
        <LongTextField name='doctorSConsultQ1' label="Doctor's Consult Q1" />
        <h3>Clinical findings:</h3>
        <LongTextField name='doctorSConsultQ2' label="Doctor's Consult Q2" />
        <h3>Doctor&apos;s Memo:</h3>
        <LongTextField name='doctorSConsultQ3' label="Doctor's Consult Q3" />
        <h3>Refer to dietitian?</h3>
        <BoolField name='doctorSConsultQ4' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ5' label="Doctor's Consult Q5" />
        <h3>Refer to Social Support?</h3>
        <BoolField name='doctorSConsultQ6' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ7' label="Doctor's Consult Q7" />
        <h3>Refer to SACS? (and indicated on Form A)</h3>
        <BoolField name='doctorSConsultQ13' />
        <h3>Refer to Dental?</h3>
        <BoolField name='doctorSConsultQ8' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ9' label="Doctor's Consult Q9" />
        <h3>Does patient require urgent follow up</h3>
        <BoolField name='doctorSConsultQ10' />
        <h3>Completed Doctor&apos;s Consult station. Please check that Form A is filled.</h3>
        <BoolField name='doctorSConsultQ11' />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {newForm()}
          </Paper>
        </Grid>
        <Grid
          p={1}
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Patient Requires Referrals For: </h2>
              <ul>
                {lung && lung.LUNG7 == 'Yes' ? 
                <li>
                  <p>Patient scores <strong>{lung.LUNG5}</strong> in his lung function test</p>
                </li> : null}

                <li>{geriPHQ && geriPHQ.PHQ10 ? (
                  <p>Patient scores <strong>{geriPHQ.PHQ10}</strong> in the PHQ.</p>
                ) : (
                  <p className='red'>nil PHQ10 data!</p>
                )}
                  <ul>
                    <li>{geriPHQ && geriPHQ.PHQ9 ? (
                      <p>The patient answered: <strong>{geriPHQ.PHQ9}</strong> to ‘Thoughts that you would be better off dead or hurting yourself in some way’.</p>
                    ) : (
                      <p className='red'>nil PHQ9 data!</p>
                    )}
                    </li>

                    <li>{geriPHQ && geriPHQ.PHQextra9 ? (
                      <p>When asked ‘Do you want to take your life now’, patient said <strong>{geriPHQ.PHQextra9}</strong></p>
                    ) : (
                      <p className='red'>nil PHQextra9 data!</p>
                    )}
                    </li>
                  </ul>
                </li>

                
                {triage.triageQ9 ? (
                  <li>
                  <p>Patient was flagged for review for blood pressure of <strong>{triage.triageQ7}/{triage.triageQ8}</strong></p>
                  </li>
                ) : null}

                {geriVision.geriVisionQ9 ? (
                  <li>
                  <p>Patient was flagged for review for vision.</p>

                  <ul>
                    <li>
                      <p>Visual Acuity</p>
                      <table style={{border: "1px solid black", width: "100%", borderCollapse: "collapse"}}>
                        <tr style={{border: "1px solid black"}}>
                          <th style={{border: "1px solid black"}}></th>
                          <th style={{border: "1px solid black"}}>Right Eye</th>
                          <th style={{border: "1px solid black"}}>Left Eye</th>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <th style={{border: "1px solid black"}}>Without Pinhole Occluder</th>
                          <th style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ3}</th>
                          <th style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ4}</th>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <th style={{border: "1px solid black"}}>With Pinhole Occluder</th>
                          <th style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ5}</th>
                          <th style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ6}</th>
                        </tr>
                      </table>                        
                    </li>
                    <li>
                      <p>Type of vision error, if any: <strong>{geriVision.geriVisionQ8}</strong></p>
                    </li>
                  </ul>
                  </li>
                ) : null
              }

              {geriAudio ? (
                <li>
                <p>Patient was flagged for review for audiometry.</p>
                <ul>
                  <li>
                    <p><strong>{geriAudio.geriAudiometryQ12}</strong></p>
                  </li>
                </ul>
                </li>
              ) : null
              }

              </ul>

              <Divider />
              <h2>Health Concerns</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {hcsr && hcsr.hxHcsrQ11 ? (
                <p className='blue'>{hcsr.hxHcsrQ11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Summarised reasons for referral to Doctor Consultation</p>
              {hcsr && hcsr.hxHcsrQ2 ? (
                <p className='blue'>{hcsr.hxHcsrQ2}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Systems Review</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {hcsr && hcsr.hxHcsrQ12 ? (
                <p className='blue'>{hcsr.hxHcsrQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Summarised systems review</p>
              {hcsr && hcsr.hxHcsrQ3 ? (
                <p className='blue'>{hcsr.hxHcsrQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Urinary/Faecal incontinence</h2>
              <p className='underlined'>Urinary/Faecal incontinence</p>
              {hcsr && hcsr.hxHcsrQ4 ? (
                <p className='blue'>{hcsr.hxHcsrQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hcsr && hcsr.hxHcsrQ5 ? (
                <p className='blue'>{hcsr.hxHcsrQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Vision problems</h2>
              <p className='underlined'>Vision Problems (From history taking)</p>
              {hcsr && hcsr.hxHcsrQ6 ? (
                <p className='blue'>{hcsr.hxHcsrQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hcsr && hcsr.hxHcsrQ7 ? (
                <p className='blue'>{hcsr.hxHcsrQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Referred from Geriatric Vision Screening (if VA with pinhole ≥ 6/12)
              </p>
              {geriVision && geriVision.geriVisionQ9 ? (
                geriVision.geriVisionQ9.length === 0 ? (
                  <p className='blue'>nil</p>
                ) : (
                  <p className='blue'>{geriVision.geriVisionQ9}</p>
                )
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Previous eye condition or surgery:</p>
              {geriVision && geriVision.geriVisionQ1 ? (
                <p className='blue'>{geriVision.geriVisionQ1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {geriVision && geriVision.geriVisionQ2 ? (
                <p className='blue'>{geriVision.geriVisionQ2}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Is participant currently on any eye review/ consulting an eye specialist?
              </p>
              {geriVision && geriVision.geriVisionQ10 ? (
                <p className='blue'>{geriVision.geriVisionQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {geriVision && geriVision.geriVisionQ11 ? (
                <p className='blue'>{geriVision.geriVisionQ11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Visual acuity (w/o pinhole occluder) - Right Eye 6/__</p>
              {geriVision && geriVision.geriVisionQ3 ? (
                <p className='blue'>{geriVision.geriVisionQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Visual acuity (w/o pinhole occluder) - Left Eye 6/__</p>
              {geriVision && geriVision.geriVisionQ4 ? (
                <p className='blue'>{geriVision.geriVisionQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__
              </p>
              {geriVision && geriVision.geriVisionQ5 ? (
                <p className='blue'>{geriVision.geriVisionQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__
              </p>
              {geriVision && geriVision.geriVisionQ6 ? (
                <p className='blue'>{geriVision.geriVisionQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Hearing problems</h2>
              <p className='underlined'>Hearing Problems</p>
              {hcsr ? <p className='blue'>{hcsr.hxHcsrQ8}</p> : <p className='blue'>nil</p>}
              {hcsr && hcsr.hxHcsrQ9 ? (
                <p className='blue'>{hcsr.hxHcsrQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Audiometry</h2>
              <p className='underlined'>Referred from Geriatric Audiometry Screening?</p>
              {geriAudio && geriAudio.geriAudiometryQ11 ? (
                <p className='blue'>{geriAudio.geriAudiometryQ11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Significant findings and recommended course of action?</p>
              {geriAudio && geriAudio.geriAudiometryQ12 ? (
                <p className='blue'>{geriAudio.geriAudiometryQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {geriAudio && geriAudio.geriAudiometryQ13 ? (
                <p className='blue'>{geriAudio.geriAudiometryQ13}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Past Medical History</h2>
              <p className='underlined'>Summary of Relevant Past Medical History</p>
              {nss && nss.hxNssQ12 ? (
                <p className='blue'>{nss.hxNssQ12.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Drug allergies?</p>
              {nss && nss.hxNssQ1 ? (
                <p className='blue'>{nss.hxNssQ1.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {nss && nss.hxNssQ2 ? (
                <p className='blue'>{nss.hxNssQ2.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Currently on any alternative medicine?</p>
              {nss && nss.hxNssQ9 ? (
                <p className='blue'>{nss.hxNssQ9.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {nss && nss.hxNssQ10 ? (
                <p className='blue'>{nss.hxNssQ10.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Smoking History</h2>
              <p className='underlined'>Smoking frequency</p>
              {nss && nss.hxNssQ14 ? (
                <p className='blue'>{nss.hxNssQ14}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Pack years:</p>
              {nss && nss.hxNssQ3 ? (
                <p className='blue'>{nss.hxNssQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Alcohol history</h2>
              <p className='underlined'>Alcohol consumption</p>
              {nss && nss.hxNssQ15 ? (
                <p className='blue'>{nss.hxNssQ15}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Family History</h2>
              <p className='underlined'>Summary of Relevant Family History</p>
              {cancer && cancer.hxCancerQ10 ? (
                <p className='blue'>{cancer.hxCancerQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Blood Pressure</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {cancer && cancer.hxCancerQ27 ? (
                <p className='blue'>{cancer.hxCancerQ27}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Average Blood Pressure</p>
              {cancer && cancer.hxCancerQ17 ? (
                <p className='blue'>Average Reading Systolic: {cancer.hxCancerQ17}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {cancer && cancer.hxCancerQ18 ? (
                <p className='blue'>Average Reading Diastolic: {cancer.hxCancerQ18}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>BMI</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {cancer && cancer.hxCancerQ23 ? (
                <p className='blue'>{cancer.hxCancerQ23.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>BMI</p>
              {cancer && cancer.hxCancerQ19 ? (
                <p className='blue'>Height: {cancer.hxCancerQ19} cm</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {cancer && cancer.hxCancerQ20 ? (
                <p className='blue'>Weight: {cancer.hxCancerQ20} kg</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {cancer && cancer.hxCancerQ19 && cancer.hxCancerQ20 ? (
                formatBmi(cancer.hxCancerQ19, cancer.hxCancerQ20)
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Waist circumference (cm)</p>
              {cancer && cancer.hxCancerQ24 ? (
                <p className='blue'>{cancer.hxCancerQ24}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>OT consult</h2>
              <p className='underlined'>Reasons for referral</p>
              {geriOt && geriOt.geriOtConsultQ3 ? (
                <p className='blue'>{geriOt.geriOtConsultQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>PT consult</h2>
              <p className='underlined'>Reasons for referral</p>
              {geriPt && geriPt.geriPtConsultQ3 ? (
                <p className='blue'>{geriPt.geriPtConsultQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Short Physical Performance Battery Score (out of 12):</p>
              {geriSppb && geriSppb.geriSppbQ2 && geriSppb.geriSppbQ6 && geriSppb.geriSppbQ8 ? (
                <p className='blue'>
                  {calculateSppbScore(
                    geriSppb.geriSppbQ2,
                    geriSppb.geriSppbQ6,
                    geriSppb.geriSppbQ8,
                  )}
                </p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Gait speed Score (out of 4):</p>
              {geriSppb && geriSppb.geriSppbQ8 ? (
                <p className='blue'>{geriSppb.geriSppbQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>5 Chair rise Score (out of 4):</p>
              {geriSppb && geriSppb.geriSppbQ2 ? (
                <p className='blue'>{geriSppb.geriSppbQ2}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Balance score (out of 4):</p>
              {geriSppb && geriSppb.geriSppbQ6 ? (
                <p className='blue'>{geriSppb.geriSppbQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Number of falls in past 1 year:</p>
              {geriPhysical && geriPhysical.geriPhysicalActivityLevelQ8 ? (
                <p className='blue'>{geriPhysical.geriPhysicalActivityLevelQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Were any of the falls injurious?</p>
              {geriPhysical && geriPhysical.geriPhysicalActivityLevelQ9 ? (
                <p className='blue'>{geriPhysical.geriPhysicalActivityLevelQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {geriPhysical && geriPhysical.geriPhysicalActivityLevelQ10 ? (
                <p className='blue'>{geriPhysical.geriPhysicalActivityLevelQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Eligible for HDB EASE?</p>
              {geriOt && geriOt.geriOtConsultQ7 ? (
                <p className='blue'>{geriOt.geriOtConsultQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Interested in signing up?</p>
              {geriOt && geriOt.geriOtConsultQ8 ? (
                <p className='blue'>{geriOt.geriOtConsultQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

DoctorSConsultForm.contextType = FormContext

export default function DoctorSConsultform(props) {
  const navigate = useNavigate()

  return <DoctorSConsultForm {...props} navigate={navigate} />
}
