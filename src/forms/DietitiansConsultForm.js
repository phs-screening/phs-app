import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-mui'
import { LongTextField, BoolField } from 'uniforms-mui'
import { submitForm, formatBmi, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  dietitiansConsultQ1: {
    type: String,
    optional: false,
  },
  dietitiansConsultQ2: {
    type: String,
    optional: true,
  },
  dietitiansConsultQ3: {
    type: String,
    optional: true,
  },
  dietitiansConsultQ4: {
    type: String,
    optional: true,
  },
  dietitiansConsultQ5: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  dietitiansConsultQ6: {
    type: String,
    optional: true,
  },
  dietitiansConsultQ7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  dietitiansConsultQ8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'dietitiansConsultForm'
const DietitiansConsultForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  // forms to retrieve for side panel
  const [doctorConsult, setDoctorConsult] = useState({})
  const [triage, setTriage] = useState({})
  const [hxSocial, setSocial] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    const loadPastForms = async () => {
      const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      const socialData = getSavedData(patientId, allForms.hxSocialForm)

      Promise.all([doctorConsultData, triageData, socialData]).then((result) => {
        setDoctorConsult(result[0])
        setTriage(result[1])
        setSocial(result[2])
      })
      isLoadingSidePanel(false)
    }
    setSaveData(savedData)
    loadPastForms()
  }, [])

  const formOptions = {
    dietitiansConsultQ7: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],

    dietitiansConsultQ8: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
  }
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
        <h1>Dietitian&apos;s Consultation</h1>
        <h3>Has the participant visited the Dietitian&apos;s Consult station?</h3>
        <RadioField
          name='dietitiansConsultQ7'
          label="Dietitian's Consult Q7"
          options={formOptions.dietitiansConsultQ7}
        />
        <h3>Dietitian&apos;s Name:</h3>
        <LongTextField name='dietitiansConsultQ1' label="Dietitian's Consult Q1" />
        <h3>Dietitian&apos;s Notes:</h3>
        <LongTextField name='dietitiansConsultQ3' label="Dietitian's Consult Q3" />
        <h3>Notes for participant (if applicable):</h3>
        <LongTextField name='dietitiansConsultQ4' label="Dietitian's Consult Q4" />
        <h3>Does the participant require urgent follow up?</h3>
        <BoolField name='dietitiansConsultQ5' />
        <h3>Reasons for urgent follow up:</h3>
        <LongTextField name='dietitiansConsultQ6' label="Dietitian's Consult Q6" />
        <h3>Referred to Polyclinic for follow-up?</h3>
        <RadioField
          name='dietitiansConsultQ8'
          label="Dietitian's Consult Q8"
          options={formOptions.dietitiansConsultQ8}
        />
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
              <h2>Doctor&apos;s Consult</h2>
              <p className='underlined'>Reasons for referral from Doctor&apos;s Consult</p>
              {doctorConsult ? <p className='blue'>{doctorConsult.doctorSConsultQ5}</p> : null}

              {// DOC6???
              }

              <Divider />
              <h2>Blood Pressure</h2>
              <p className='underlined'>Average Reading Systolic (average of closest 2 readings)</p>
              Systolic BP:
              {triage ? <p className='blue'>{triage.triageQ7}</p> : null}
              <p className='underlined'>
                Average Reading Diastolic (average of closest 2 readings)
              </p>
              Diastolic BP:
              {triage ? <p className='blue'>{triage.triageQ8}</p> : null}
              <Divider />

              <h2>BMI</h2>
              <p className='underlined'>BMI</p>
              {triage ? <p className='blue'>{triage.triageQ12}</p> : null}
              <p className='underlined'>Waist Circumference (in cm)</p>
              {triage ? <p className='blue'>{triage.triageQ13}</p> : null}
              <Divider />

              <h2>Smoking History</h2>
              <p className='underlined'>participant Currently smokes?</p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIAL10}</p> : null}
              <p className='underlined'>Pack years:</p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIALShortAns10}</p> : null}
              <p className='underlined'>participant has smoked before? For how long and when did they stop?</p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIAL11}</p> : null}
              <p className='underlined'>participant specifies:</p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIALShortAns11}</p> : null}
              <Divider />

              <h2>Alcohol history</h2>
              <p className='underlined'>Alcohol consumption</p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIAL12}</p> : null}
              <Divider />

              <h2>Diet</h2>
              <p className='underlined'>
                Does participant consciously try to the more fruits, vegetables, whole grain &
                cereals?
              </p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIAL13}</p> : null}
              {hxSocial ? <p className='blue'>Fruits: {hxSocial.SOCIALExtension13A}</p> : null}
              {hxSocial ? <p className='blue'>Vegetables: {hxSocial.SOCIALExtension13B}</p> : null}
              {hxSocial ? <p className='blue'>Whole grain and cereals: {hxSocial.SOCIALExtension13C}</p> : null}
              <p className='underlined'>
                Does the participant exercise in any form of moderate physical activity for at least
                150 minutes OR intense physical activity at least 75 minutes throuhgout the week?
              </p>
              {hxSocial ? <p className='blue'>{hxSocial.SOCIAL14}</p> : null}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

DietitiansConsultForm.contextType = FormContext

export default DietitiansConsultForm
