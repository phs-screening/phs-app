import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-material'
import { LongTextField, BoolField } from 'uniforms-material'
import { submitForm, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { title, underlined, blueText } from '../theme/commonComponents'
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
  const [hxCancer, setHxCancer] = useState({})
  const [hxNss, setHxNss] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    const loadPastForms = async () => {
      const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
      const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)
      const hxNssData = getSavedData(patientId, allForms.hxNssForm)

      Promise.all([doctorConsultData, hxCancerData, hxNssData]).then((result) => {
        setDoctorConsult(result[0])
        setHxCancer(result[1])
        setHxNss(result[2])
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
      <Fragment>
        <h1>Dietitian's Consultation</h1>
        <br />
        Has the participant visited the Dietitian&apos;s Consult station?
        <RadioField name='dietitiansConsultQ7' label="Dietitian's Consult Q7" />
        Dietitian&apos;s Name:
        <LongTextField name='dietitiansConsultQ1' label="Dietitian's Consult Q1" />
        Dietitian&apos;s Notes:
        <LongTextField name='dietitiansConsultQ3' label="Dietitian's Consult Q3" />
        Notes for participant (if applicable):
        <LongTextField name='dietitiansConsultQ4' label="Dietitian's Consult Q4" />
        Does the patient require urgent follow up?
        <BoolField name='dietitiansConsultQ5' />
        Reasons for urgent follow up:
        <LongTextField name='dietitiansConsultQ6' label="Dietitian's Consult Q6" />
        Referred to Polyclinic for follow-up?
        <RadioField name='dietitiansConsultQ8' label="Dietitian's Consult Q8" />
      </Fragment>

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
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div>
              {title("Doctor's Consult ")}
              {underlined("Reasons for referral from Doctor's Consult")}
              {doctorConsult ? blueText(doctorConsult.doctorSConsultQ5) : null}
              {title('Blood Pressure ')}
              {underlined('Average Reading Systolic (average of closest 2 readings)')}
              Systolic BP:
              {hxCancer ? blueText(hxCancer.hxCancerQ17) : null}
              {underlined('Average Reading Diastolic (average of closest 2 readings)')}
              Diastolic BP:
              {hxCancer ? blueText(hxCancer.hxCancerQ18) : null}
              {title('BMI')}
              {underlined('Requires scrutiny by doctor?')}
              {hxCancer
                ? hxCancer.hxCancerQ23
                  ? blueText(hxCancer.hxCancerQ23.toString())
                  : 'false'
                : null}
              {underlined('Height (in cm)')}
              {hxCancer ? blueText(hxCancer.hxCancerQ19) : null}
              {underlined('Weight (in kg)')}
              {hxCancer ? blueText(hxCancer.hxCancerQ20) : null}
              {underlined('BMI')}
              {hxCancer ? blueText(calculateBMI(hxCancer.hxCancerQ19, hxCancer.hxCancerQ20)) : null}
              {title('Waist circumference (cm)')}
              {underlined('Waist Circumference (in cm)')}
              {hxCancer ? blueText(hxCancer.hxCancerQ24) : null}
              {title('Smoking History ')}
              {underlined('Smoking frequency')}
              {hxNss ? blueText(hxNss.hxNssQ14) : null}
              {underlined('Pack years:')}
              {hxNss ? blueText(hxNss.hxNssQ3) : null}
              {title('Alcohol history ')}
              {underlined('Alcohol consumption')}
              {hxNss ? blueText(hxNss.hxNssQ15) : null}
              {title('Diet')}
              {underlined(
                'Does participant consciously try to the more fruits, vegetables, whole grain & cereals?',
              )}
              {hxNss ? blueText(hxNss.hxNssQ16) : null}
              {underlined(
                'Does the participant exercise in any form of moderate physical activity for at least 150 minutes OR intense physical activity at least 75 minutes throuhgout the week?',
              )}
              {hxNss ? blueText(hxNss.hxNssQ17) : null}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

DietitiansConsultForm.contextType = FormContext

export default function DietitiansConsultform(props) {
  const navigate = useNavigate()

  return <DietitiansConsultForm {...props} navigate={navigate} />
}
