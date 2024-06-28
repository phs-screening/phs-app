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
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  NKF1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  NKF2: {
    type: String,
    optional: false,
  },
  //q1 short ans
  NKF3: {
    type: String,
    optional: true,
  },
})

const formName = 'nkfForm'
const NkfForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)

    setSaveData(savedData)
  }, [])

  const formOptions = {
    NKF1: [
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
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
        isLoading(false)
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h1>NKF</h1>
        <h3>Patient has booked an appointment for kidney screen on NKF website.</h3>
        <RadioField name='NKF1' label='NKF1' options={formOptions.NKF1} />
        <h3>Details of Kidney Screen (Date, Time)</h3>
        <p>
          Write in this format: 16th January, 2024 at 3PM
          <LongTextField name='NKF2' label='NKF2' />
        </p>
      </div>
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

NkfForm.contextType = FormContext

export default NkfForm
