import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField } from 'uniforms-mui'
import { TextField, SelectField, RadioField, NumField } from 'uniforms-mui'
import { useField } from 'uniforms'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriTugQ1: {
    type: Array,
    optional: true,
  },
  'geriTugQ1.$': {
    type: String,
    allowedValues: [
      'Walking frame',
      'Walking frame with wheels',
      'Crutches/ Elbow crutches',
      'Quadstick (Narrow/ Broad)',
      'Walking stick',
      'Umbrella',
      'Others (Please specify in textbox )',
    ],
  },
  geriTugQ2: {
    type: String,
    optional: true,
  },
  geriTugQ3: {
    type: Number,
    optional: false,
  },
  geriTugQ4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriTugQ5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriTugQ6: {
    type: String,
    optional: true,
  },
})

function PopupText(props) {
  const [{ value: qnValue }] = useField(props.qnNo, {})
  if (qnValue.includes(props.triggerValue)) {
    return <Fragment>{props.children}</Fragment>
  }
  return null
}

const formName = 'geriTugForm'
const GeriTugForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props
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
        <h2>Single Leg Balance Test (SLBT)</h2>
        <br />
        Walking aid (if any):
        <br />
        <SelectField name='geriTugQ1' checkboxes='true' label='Geri - TUG Q1' />
        <br />
        <PopupText qnNo='geriTugQ1' triggerValue='Others (Please specify in textbox )'>
          Please Specify Walking Aid
          <TextField name='geriTugQ2' label='Geri - TUG Q2' />
        </PopupText>
        Time taken (in seconds):
        <NumField sx={{"& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":{display: "none",},"& input[type=number]": {MozAppearance: "textfield",},}}
            type="number" name='geriTugQ3' label='Geri - TUG Q3' />
        <br />
        Failed SLBT?
        <RadioField name='geriTugQ4' label='Geri - TUG Q4' />
        <br />
        Notes:
        <LongTextField name='geriTugQ6' label='Geri - TUG Q6' />
        <br />
        *Referral to Physiotherapist and Occupational Therapist Consult
        <RadioField name='geriTugQ5' label='Geri - TUG Q5' />
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

GeriTugForm.contextType = FormContext

export default function GeriTugform(props) {
  return <GeriTugForm {...props} />
}
