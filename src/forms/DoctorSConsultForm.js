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
  const [geriVision, setGeriVision] = useState({})
  const [geriAudio, setGeriAudio] = useState({})
  const [geriPHQ, setPHQ] = useState({})
  const [lung, setLung] = useState({})
  const [triage, setTriage] = useState({})
  const [osteo, setOsteo] = useState({})
  const [pmhx, setPMHX] = useState({})
  const [social, setSocial] = useState({})
  const [family, setFamily] = useState({})
  useEffect(async () => {
    const loadPastForms = async () => {
      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
      const geriAudioData = getSavedData(patientId, allForms.geriAudiometryForm)
      const savedData = getSavedData(patientId, formName)
      const lungData = getSavedData(patientId, allForms.lungForm)
      const PHQDATA = getSavedData(patientId, allForms.geriPhqForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      const osteoData = getSavedData(patientId, allForms.osteoForm)
      const pmhxData = getSavedData(patientId, allForms.hxNssForm)
      const socialData = getSavedData(patientId, allForms.hxSocialForm)
      const familyData = getSavedData(patientId, allForms.hxFamilyForm)
      Promise.all([
        hcsrData,
        savedData,
        geriVisionData,
        geriAudioData,
        lungData,
        PHQDATA,
        triageData,
        osteoData,
        pmhxData,
        socialData,
        familyData,
      ]).then((result) => {
        setHcsr(result[0])
        setSaveData(result[1])
        setGeriVision(result[2])
        setGeriAudio(result[3]),
        setLung(result[4])
        setPHQ(result[5])
        setTriage(result[6]),
        setOsteo(result[7]),
        setPMHX(result[8])
        setSocial(result[9])
        setFamily(result[10])
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
        <h1>Doctor&apos;s Station</h1>
        <h3>Doctor&apos;s Name:</h3>
        <LongTextField name='doctorSConsultQ1' label="Doctor's Station Q1" />
        <h3>Clinical findings:</h3>
        <LongTextField name='doctorSConsultQ2' label="Doctor's Station Q2" />
        <h3>Doctor&apos;s Memo:</h3>
        <LongTextField name='doctorSConsultQ3' label="Doctor's Station Q3" />
        <h3>Refer to dietitian?</h3>
        <BoolField name='doctorSConsultQ4' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ5' label="Doctor's Station Q5" />
        <h3>Refer to Social Support?</h3>
        <BoolField name='doctorSConsultQ6' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ7' label="Doctor's Station Q7" />
        <h3>Refer to Mental Health? (and indicated on Form A)</h3>
        <BoolField name='doctorSConsultQ13' />
        <h3>Refer to Dental?</h3>
        <BoolField name='doctorSConsultQ8' />
        <h4>Reason for referral</h4>
        <LongTextField name='doctorSConsultQ9' label="Doctor's Station Q9" />
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
                {!lung ? <p className='red'>nil lung data!</p> : <></>}
                {lung && lung.LUNG14 == 'Yes' ? 
                <li>
                  <p>Patient has <strong>{lung.LUNG13}</strong></p>
                  <p>Lung Function Results</p>
                      <table style={{border: "1px solid black", borderCollapse: "collapse"}}>
                        <tr style={{border: "1px solid black"}}>
                          <td colSpan={2} style={{border: "1px solid black"}}>Pre-Bronchodilator</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>FVC (L)</td>
                          <td style={{border: "1px solid black"}}>{lung.LUNG3}</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>FEV1 (L)</td>
                          <td style={{border: "1px solid black"}}>{lung.LUNG4}</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>FVC (%pred)</td>
                          <td style={{border: "1px solid black"}}>{lung.LUNG5}</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>FEV1 (%pred)</td>
                          <td style={{border: "1px solid black"}}>{lung.LUNG6}</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>FEV1/FVC (%)</td>
                          <td style={{border: "1px solid black"}}>{lung.LUNG7}</td>
                        </tr>
                      </table>    
                </li> : null}

                {!geriPHQ ? <p className='red'>nil geriPHQ data!</p> : <></>}
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

                {!triage ? <p className='red'>nil triage data!</p> : <></>}
                {triage.triageQ9 ? (
                  <li>
                  <p>Patient had blood pressure of <strong>{triage.triageQ7}/{triage.triageQ8}</strong></p>
                  </li>
                ) : null}

                {!geriVision ? <p className='red'>nil geriVision data!</p> : <></>}
                {geriVision.geriVisionQ9 ? (
                  <li>
                  <p>Visual Check Results.</p>

                  <ul>
                    <li>
                      <p>Visual Acuity</p>
                      <table style={{border: "1px solid black", width: "100%", borderCollapse: "collapse", minWidth:"60%"}}>
                        <tr style={{border: "1px solid black"}}>
                          <th style={{border: "1px solid black"}}></th>
                          <th style={{border: "1px solid black"}}>Right Eye</th>
                          <th style={{border: "1px solid black"}}>Left Eye</th>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>Without Pinhole Occluder</td>
                          <td style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ3}</td>
                          <td style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ4}</td>
                        </tr>
                        <tr style={{border: "1px solid black"}}>
                          <td style={{border: "1px solid black"}}>With Pinhole Occluder</td>
                          <td style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ5}</td>
                          <td style={{border: "1px solid black"}}>6/{geriVision.geriVisionQ6}</td>
                        </tr>
                      </table>                        
                    </li>
                    <li>
                      <p>Type of vision error, if any: <strong>{geriVision.geriVisionQ8}</strong></p>
                      <p>Previous eye surgery or condition: <strong>{geriVision.geriVisionQ1}</strong></p>
                      <p>Is currently on any eye review/ consulting any eye specialist: <strong>{geriVision.geriVisionQ10}</strong></p>
                      <p><strong>{geriVision.geriVisionQ11}</strong></p>
                      { hcsr ? (
                          <p>Patient&apos;s history indicated: <strong>{hcsr.hxHcsrQ6}</strong></p>
                        ) : <p className='red'>nil hcsr data!</p>
                      }
                    </li>
                  </ul>
                  </li>
                ) : null
              }

              {!geriAudio ? <p className='red'>nil geriAudio data!</p> : <></>}
              {geriAudio ? (
                <li>
                <p>Patient&apos;s audiometry results, if any:</p>
                <ul>
                  <li>
                    <p><strong>{geriAudio.geriAudiometryQ13}</strong></p>
                    <p>Details: <strong>{geriAudio.geriAudiometryQ12}</strong></p>
                    { hcsr ? (
                        <p>Patient&apos;s history indicated: <strong>{hcsr.hxHcsrQ7}</strong></p>
                      ) : <p className='red'>nil hcsr data!</p>
                    }
                  </li>
                </ul>
                </li>
              ) : null
              }
              
              {!osteo ? <p className='red'>nil osteo data!</p> : <></>}
              {osteo ? (
                <li>
                <p>Patient&apos;s OSTA risk is <strong>{osteo.BONE1}</strong></p>
                <ul>
                  <li><p>FRAX Hip Fracture Score is <strong>{osteo.BONE3}</strong></p></li>
                  <li><p>Patient requires a follow up: <strong>{osteo.BONE2}</strong></p></li>
                </ul>
                </li>
              ) : null
              }

              <h2>Patient&apos;s Relevant History: </h2>
              {triage ? (
                <li>
                  <p>Biodata</p>
                  <ul>
                    <li><p>BMI: <strong>{triage.triageQ12}</strong></p></li>
                    <li><p>Waist Circumference: <strong>{triage.triageQ13}</strong></p></li>
                  </ul>
                </li>
                ) : <p className='red'>nil triage data!</p>
              }

              {hcsr ? (
                <li>
                  <p>Presenting Complaints</p>
                  <ul>
                    <li>
                      <p>Health Concerns: <strong>{hcsr.hxHcsrQ3}</strong><br></br><strong>{hcsr.hxHcsrShortAnsQ3}</strong></p>
                      </li>
                    <li><p>Red Flags: <strong>{hcsr.hxHcsrQ4}</strong></p></li>
                    <li>
                      <p>Problems passing urine: <strong>{hcsr.hxHcsrQ5}</strong><br></br><strong>{hcsr.hxHcsrShortAnsQ5}</strong></p>
                      </li>
                  </ul>
                </li>
                ) : <p className='red'>nil hcsr data!</p>
              }

              {pmhx ? (
                <li>
                  <p>Past Medical History</p>
                  <ul>
                    <li><p>Chronic conditions: <strong>{pmhx.PMHX1}</strong></p></li>
                    <li><p>Long term medications and compliance: <strong>{pmhx.PMHX2}</strong></p></li>
                    <li>
                      <p>Drug allergies: <strong>{pmhx.PMHX5}</strong><br></br><strong>{pmhx.PMHXShortAns5}</strong></p>
                    </li>
                    <li>
                      <p>Alternative medicine: <strong>{pmhx.PMHX6}</strong><br></br><strong>{pmhx.PMHXShortAns6}</strong></p>
                    </li>
                    <li><p>Regular screening: <strong>{pmhx.PMHX8}</strong></p></li>
                    <li><p>Reason for referral: <strong>{pmhx.PMHXShortAns12}</strong></p></li>
                  </ul>
                </li>
                ) : <p className='red'>nil pmhx data!</p>
              }

              {social ? (
                <li>
                  <p>Social History</p>
                  <ul>
                    <li>
                      <p>Smoking: <strong>{social.SOCIAL10}</strong><br></br><strong>{social.SOCIALShortAns10}</strong></p>
                      <p>Past Smoking: <strong>{social.SOCIAL11}</strong><br></br><strong>{social.SOCIALShortAns11}</strong></p>
                    </li>
                    <li><p>Alcohol: <strong>{social.SOCIAL12}</strong></p></li>
                    <li><p>Exercise: <strong>{social.SOCIAL14}</strong></p></li>
                  </ul>
                </li>
                ) : <p className='red'>nil social data!</p>
              }

              {family && family.FAMILY1 ? (
                <li>
                  <p>Family History</p>
                  <ul>
                    <li>
                      <p>Cancers:</p>
                      <ul>{family.FAMILY1.map(c => <li key = {c}>{c}</li>)}</ul>
                    </li>
                    <li>
                      <p>Others: <strong>{family.FAMILY2}</strong></p>
                    </li>
                  </ul>
                </li>
                ) : <p className='red'>nil family data!</p>
              }
              </ul>
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
