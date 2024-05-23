import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { LongTextField, SelectField, RadioField, NumField } from 'uniforms-material'
import PopupText from 'src/utils/popupText'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriVisionQ1: {
    type: String,
    allowedValues: ['Yes (Specify in textbox )', 'No'],
    optional: false,
  },
  geriVisionQ2: {
    type: String,
    optional: true,
  },
  geriVisionQ3: {
    type: String,
    optional: false,
  },
  geriVisionQ4: {
    type: String,
    optional: false,
  },
  geriVisionQ5: {
    type: String,
    optional: true,
  },
  geriVisionQ6: {
    type: String,
    optional: true,
  },
  geriVisionQ7: {
    type: String,
    allowedValues: ['CF2M', 'CF1M', 'HM', 'LP', 'NLP', 'NIL'],
    optional: true,
  },
  geriVisionQ8: {
    type: Array,
    optional: false,
  },
  'geriVisionQ8.$': {
    type: String,
    allowedValues: ['Refractive', 'Non-refractive', 'None'],
  },
  geriVisionQ9: {
    type: Array,
    optional: true,
  },
  'geriVisionQ9.$': {
    type: String,
    allowedValues: ["Referred to Doctor's Consult"],
  },
  geriVisionQ10: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriVisionQ11: {
    type: String,
    optional: true,
  },
  geriVisionQ12: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriVisionQ13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'geriVisionForm'
const GeriVisionForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])
  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          const event = null // not interested in this value
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            changeTab(event, nextTab)
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
        <h2>VISION SCREENING</h2>
        <br />
        <h3>Non-Refractive Error</h3>
        <br />
        1. Previous eye condition or surgery
        <RadioField name='geriVisionQ1' label='Geri - Vision Q1' />
        <PopupText qnNo='geriVisionQ1' triggerValue='Yes (Specify in textbox )'>
          <Fragment>
            Explanation
            <LongTextField name='geriVisionQ2' label='Geri - Vision Q2' />
          </Fragment>
        </PopupText>
        <br />
        2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__ <br />
        <NumField name='geriVisionQ3' label='Geri - Vision Q3' /> <br />
        3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__ <br />
        <NumField name='geriVisionQ4' label='Geri - Vision Q4' /> <br />
        4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__ <br />
        <NumField name='geriVisionQ5' label='Geri - Vision Q5' /> <br />
        5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__ <br />
        <NumField name='geriVisionQ6' label='Geri - Vision Q6' /> <br />
        6. Is participant currently on any eye review/ consulting any eye specialist?
        <RadioField name='geriVisionQ10' label='Geri - Vision Q10' />
        Please specify:
        <LongTextField name='geriVisionQ11' label='Geri - Vision Q11' />
        <br /> <p>7. Type of vision error?</p>
        <RadioField name='geriVisionQ8' label='Geri - Vision Q8' />
        <br />{' '}
        <p>
          Please <b>refer to Doctor’s Consult if pinhole</b> visual acuity is{' '}
          <b>
            <u>worse than 6/12</u>
          </b>
        </p>
        <br />
        <SelectField name='geriVisionQ9' checkboxes='true' label='Geri - Vision Q9' />
        <br />
        <br />
        <h3>Refractive Error</h3>
        Senior Citizens are eligible to receiving subsidy for spectacles under the Senior Mobility
        Fund (SMF) provided they qualify for the following:
        <br />
        <ul>
          <li>
            Have a household monthly income per person of $2,000 and below OR Annual Value (AV) of
            residence reflected on NRIC of $13,000 and below for households with no income
          </li>
          <li>Be living in the community (not residing in a nursing home or sheltered home).</li>
          <li>First time SMF applicant</li>
          <li>
            Be assessed by a qualified assessor on the type of device required when applicable.
          </li>
          <li>
            Not concurrently receive (or apply for) any other public or private grants, or
            subsidies.
          </li>
        </ul>
        <br />
        1. Does the participant wish to apply for the Senior Mobility Fund?
        <RadioField name='geriVisionQ12' label='Geri - Vision Q12' />
        2. Referred to Social Services?
        <RadioField name='geriVisionQ13' label='Geri - Vision Q13' />
      </Fragment>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

GeriVisionForm.contextType = FormContext

export default function GeriVisionform(props) {
  return <GeriVisionForm {...props} />
}
