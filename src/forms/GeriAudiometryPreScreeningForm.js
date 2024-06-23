import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@mui/material/Grid'

const schema = new SimpleSchema({
  geriPreAudiometryQ1: {
    type: String,
    allowedValues: ['Yes (go to Q2)', 'No (skip Q2, go to Q3)'],
    optional: false,
  },
  geriPreAudiometryQ2: {
    type: String,
    allowedValues: [
      'Yes (To skip hearing test & refer to polyclinic or specialist if any)',
      'No (To skip hearing test)',
    ],
    optional: true,
  },
  geriPreAudiometryQ3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
})

const formName = 'geriAudiometryPreScreeningForm'
const GeriAudiometryPreScreeningForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  useEffect(() => {
    const loadForms = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    loadForms()
  }, [])

  const formOptions = {
    geriPreAudiometryQ1: [
      { label: 'Yes (go to Q2)', value: 'Yes (go to Q2)' },
      { label: 'No (skip Q2, go to Q3)', value: 'No (skip Q2, go to Q3)' },
    ],
    geriPreAudiometryQ2: [
      {
        label: 'Yes (To skip hearing test & refer to polyclinic or specialist if any)',
        value: 'Yes (To skip hearing test & refer to polyclinic or specialist if any)',
      },
      { label: 'No (To skip hearing test)', value: 'No (To skip hearing test)' },
    ],
    geriPreAudiometryQ3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
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
      <div className='form--div'>
        <h1>AUDIOMETRY PRE-SCREENING</h1>
        <h3>1. Are you currently wearing hearing aid(s)?</h3>
        <RadioField
          name='geriPreAudiometryQ1'
          label='geriPreAudiometry - Q1'
          options={formOptions.geriPreAudiometryQ1}
        />
        <h3>2. Please answer the following</h3>
        <ol type='a' style={{ listStylePosition: 'inside' }}>
          <li>Have you had your hearing aids for more than 5 years?</li>
          <li>Has it been 3 years or more since you last used your hearing aids?</li>
          <li>Are your hearing aids spoilt/not working?</li>
        </ol>
        <h4>If participant answered yes to any of of the questions, tick yes below.</h4>
        If no to all question, tick no below.
        <RadioField
          name='geriPreAudiometryQ2'
          label='geriPreAudiometry - Q2'
          options={formOptions.geriPreAudiometryQ2}
        />
        <h3>3. Do you think you have a hearing problem?</h3>
        <RadioField
          name='geriPreAudiometryQ3'
          label='geriPreAudiometry - Q3'
          options={formOptions.geriPreAudiometryQ3}
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
      </Grid>
    </Paper>
  )
}

GeriAudiometryPreScreeningForm.contextType = FormContext

export default function GeriAudiometryPreScreeningform(props) {
  return <GeriAudiometryPreScreeningForm {...props} />
}
