import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, TextField } from 'uniforms-material'
import { BoolField } from 'uniforms-material'
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { title, underlined, blueText } from '../theme/commonComponents'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  oralHealthQ1: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  oralHealthQ2: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  oralHealthQ3: {
    type: String,
    optional: true,
  },
})

const formName = 'oralHealthForm'
const OralHealthForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  // forms to retrieve for side panel
  const [doctorConsult, setDoctorConsult] = useState({})
  const [hxSocial, sethxSocial] = useState({})
  const [hxHcsr, setHxHcsr] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [hxNss, setHxNss] = useState({})
  const [hxCancer, setHxCancer] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    const loadPastForms = async () => {
      const doctorsConsultData = getSavedData(patientId, allForms.doctorConsultForm)
      const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
      const hxHcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const geriOtData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
      const hxNssData = getSavedData(patientId, allForms.hxNssForm)
      const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)

      Promise.all([
        doctorsConsultData,
        hxSocialData,
        hxHcsrData,
        geriOtData,
        hxNssData,
        hxCancerData,
      ]).then((result) => {
        setDoctorConsult(result[0])
        sethxSocial(result[1])
        setHxHcsr(result[2])
        setGeriOt(result[3])
        setHxNss(result[4])
        setHxCancer(result[5])
      })

      isLoadingSidePanel(false)
    }
    setSaveData(savedData)
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
        <h1>Oral Health</h1>
        <h3>Will participant undergo follow-up by NUS Dentistry?</h3>
        <BoolField name='oralHealthQ1' />
        <h3>Completed Oral Health station. Please check that Form A is filled.</h3>
        <BoolField name='oralHealthQ2' />
        <h3>Notes:</h3>
        <TextField name='oralHealthQ3' />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
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
          width='50%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Referral from Docto&apos;s Consult </h2>
              <p className='underlined'>Reasons for referral:</p>
              {doctorConsult && doctorConsult.doctorSConsultQ8 ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ8.toString()}</p>
              ) : null}
              {doctorConsult ? <p className='blue'>{doctorConsult.doctorSConsultQ9}</p> : null}
              <Divider />
              <h2>Referral from History Taking </h2>
              <p className='underlined'>Participant&apos;s Oral Health Brief Assessment:</p>
              {hxSocial ? <p className='blue'>{hxSocial.hxSocialQ13}</p> : null}
              {hxSocial ? <p className='blue'>{hxSocial.hxSocialQ15}</p> : null}
              <p className='underlined'>Interest in Oral Health Screening: </p>
              {hxSocial ? <p className='blue'>{hxSocial.hxSocialQ14}</p> : null}
              <Divider />
              <h2>Health Concerns</h2>
              <p className='underlined'>Requires scrutiny by doctor? </p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ11}</p> : null}
              <p className='underlined'>Summarised reasons for referral to Doctor Consultation</p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ2}</p> : null}
              <Divider />
              <h2>Systems Review</h2>
              <p className='underlined'>Requires scrutiny by doctor? </p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ12}</p> : null}
              <p className='underlined'>Summarised systems review</p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ3}</p> : null}
              <Divider />
              <h2>Urinary/Faecal incontinence</h2>
              <p className='underlined'>Urinary/Faecal incontinence</p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ4}</p> : null}
              {hxHcsr && hxHcsr.hxHcsrQ5 ? <p className='blue'>{hxHcsr.hxHcsrQ5}</p> : null}
              <p className='underlined'>
                Urinary Incontinence or nocturia (at least 3 or more times at night)?
              </p>
              {geriOt ? <p className='blue'>{geriOt.geriOtQuestionnaireQ6}</p> : null}
              <Divider />
              <h2>Vision problems</h2>
              <p className='underlined'>Vision Problems</p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ6}</p> : null}
              {hxHcsr && hxHcsr.hxHcsrQ7 ? <p className='blue'>{hxHcsr.hxHcsrQ7}</p> : null}
              <Divider />
              <h2>Hearing problems</h2>
              <p className='underlined'>Hearing Problems</p>
              {hxHcsr ? <p className='blue'>{hxHcsr.hxHcsrQ8}</p> : null}
              {hxHcsr && hxHcsr.hxHcsrQ9 ? blueText(hxHcsr.hxHcsrQ9) : null}
              <Divider />
              <h2>Past Medical History</h2>
              <p className='underlined'>Summary of Relevant Past Medical History</p>
              {hxNss && hxNss.hxNssQ12 ? (
                <p className='blue'>{hxNss.hxNssQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Drug allergies?</p>
              {hxNss && hxNss.hxNssQ1 ? (
                <p className='blue'>{hxNss.hxNssQ1.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxNss && hxNss.hxNssQ2 ? (
                <p className='blue'>{hxNss.hxNssQ2.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Currently on any alternative medicine?</p>
              {hxNss && hxNss.hxNssQ9 ? (
                <p className='blue'>{hxNss.hxNssQ9.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxNss && hxNss.hxNssQ10 ? (
                <p className='blue'>{hxNss.hxNssQ10.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Smoking History</h2>
              <p className='underlined'>Smoking frequency</p>
              {hxNss ? <p className='blue'>{hxNss.hxNssQ14}</p> : null}
              <p className='underlined'>Pack years:</p>
              {hxNss ? <p className='blue'>{hxNss.hxNssQ3}</p> : null}
              <Divider />
              <h2>Alcohol history</h2>
              <p className='underlined'>Alcohol consumption</p>
              {hxNss ? <p className='blue'>{hxNss.hxNssQ15}</p> : null}
              <Divider />
              <h2>Family History</h2>
              {hxCancer && hxCancer.hxCancerQ10 ? (
                <p className='blue'>{hxCancer.hxCancerQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Blood Pressure</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {hxCancer && hxCancer.hxCancerQ27 ? (
                <p className='blue'>{hxCancer.hxCancerQ27}</p>
              ) : null}
              <p className='underlined'>
                Dizziness on standing up from a seated or laid down position?
              </p>
              {geriOt && geriOt.geriOtQuestionnaireQ5 ? (
                <p className='blue'>{geriOt.geriOtQuestionnaireQ5}</p>
              ) : null}
              <p className='underlined'>Average Blood Pressure</p>
              {hxCancer && hxCancer.hxCancerQ17 ? (
                <p className='blue'>Average Reading Systolic: {hxCancer.hxCancerQ17}</p>
              ) : null}
              {hxCancer && hxCancer.hxCancerQ18 ? (
                <p className='blue'>Average Reading Diastolic: {hxCancer.hxCancerQ18}</p>
              ) : null}
              <Divider />
              <h2>BMI</h2>
              <p className='underlined'>Requires scrutiny by doctor?</p>
              {hxCancer && hxCancer.hxCancerQ23 ? (
                <p className='blue'>{hxCancer.hxCancerQ23.toString()}</p>
              ) : (
                <p className='blue'>no</p>
              )}
              <p className='underlined'>BMI</p>
              {hxCancer && hxCancer.hxCancerQ19 ? (
                <p className='blue'>Height: {hxCancer.hxCancerQ19} cm</p>
              ) : null}
              {hxCancer && hxCancer.hxCancerQ20 ? (
                <p className='blue'>Weight: {hxCancer.hxCancerQ20} kg</p>
              ) : null}
              {hxCancer && hxCancer.hxCancerQ19 && hxCancer.hxCancerQ20 ? (
                <p className='blue'>BMI: {formatBmi(hxCancer.hxCancerQ19, hxCancer.hxCancerQ20)}</p>
              ) : null}
              <p className='underlined'>Waist circumference (cm)</p>
              {hxCancer ? <p className='blue'>{hxCancer.hxCancerQ24}</p> : null}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

OralHealthForm.contextType = FormContext

export default function OralHealthform(props) {
  const navigate = useNavigate()

  return <OralHealthForm {...props} navigate={navigate} />
}
