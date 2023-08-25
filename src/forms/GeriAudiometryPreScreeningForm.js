import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@material-ui/core/Grid'

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
    allowedValues: ['Yes (continue with hearing test)', 'No (skip hearing test)'],
    optional: false,
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
        <br />
        <h2>AUDIOMETRY PRE-SCREENING</h2>
        1. Are you currently wearing hearing aid(s)?
        <RadioField name='geriPreAudiometryQ1' label='geriPreAudiometry - Q1' />
        <br />
        2. Please answer the following
        <ol type='a' style={{ listStylePosition: 'inside' }}>
          <li>Have you had your hearing aids for more than 5 years?</li>
          <li>Has it been 3 years or more since you last used your hearing aids?</li>
          <li>Are your hearing aids spoilt/not working?</li>
        </ol>
        <br />
        If participant answered yes to any of of the questions, tick yes below.
        <br />
        If no to all question, tick no below.
        <RadioField name='geriPreAudiometryQ2' label='geriPreAudiometry - Q2' />
        <br />
        3. Do you think you have a hearing problem?
        <RadioField name='geriPreAudiometryQ3' label='geriPreAudiometry - Q3' />
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
      </Grid>
    </Paper>
  )
}

GeriAudiometryPreScreeningForm.contextType = FormContext

export default function GeriAudiometryPreScreeningform(props) {
  return <GeriAudiometryPreScreeningForm {...props} />
}
