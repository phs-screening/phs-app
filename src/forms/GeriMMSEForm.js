import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriMMSEQ1: {
    type: String,
    optional: false,
  },
  geriMMSEQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriMMSEQ3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriMMSEQ4: {
    type: String,
    optional: true,
  },
  geriMMSEQ5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'geriMMSEForm'
const GeriMMSEForm = (props) => {
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
        <h2>MINI-MENTAL STATE EXAMINATION (MMSE)</h2>
        <br />
        MMSE score (_/_):
        <LongTextField name='geriMMSEQ1' label='geriMMSE - Q1' />
        <br />
        Need referral to G-RACE associated polyclinics/ partners?
        <RadioField name='geriMMSEQ2' label='geriMMSE - Q2' />
        Polyclinic:
        <LongTextField name='geriMMSEQ4' label='geriMMSE - Q4' />
        <br />
        Need referral to SACS?
        <RadioField name='geriMMSEQ3' label='geriMMSE - Q3' />
        <br />
        Referral to Doctor&apos;s Consult?
        <br />
        For geri patients who may be depressed
        <RadioField name='geriMMSEQ5' label='geriMMSE - Q5' />
        <br />
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

GeriMMSEForm.contextType = FormContext

export default function GeriMMSEform(props) {
  return <GeriMMSEForm {...props} />
}
