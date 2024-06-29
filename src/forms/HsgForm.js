import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { SelectField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import { useNavigate } from 'react-router'

const schema = new SimpleSchema({
  HSG1: {
    type: String,
    allowedValues: [
      'Yes, I signed up for HSG today',
      'No, I did not sign up for HSG',
      'No, I am already on HSG',
    ],
    optional: false,
  },
  HSG2: {
    type: String,
    optional: true,
  },
})

const formName = 'hsgForm'
const HsgForm = (props) => {
  const [loading, isLoading] = useState(false)
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const formOptions = {
    HSG1: [
      {
        label: 'Yes, I signed up for HSG today',
        value: 'Yes, I signed up for HSG today',
      },
      { label: 'No, I did not sign up for HSG', value: 'No, I did not sign up for HSG' },
      { label: 'No, I am already on HSG', value: 'No, I am already on HSG' },
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
        <h1>HealthierSG</h1>
        <h3>Previously not signed up for HealthierSG and sign-up for HealthierSG today.</h3>
        <RadioField name='HSG1' label='HSG1' options={formOptions.HSG1} />
        <PopupText qnNo='HSG1' triggerValue='No, I did not sign up for HSG'>
          <p>
            <h4>If no, why?</h4>
            <LongTextField name='HSG2' label='HSG2' />
          </p>
        </PopupText>
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

HsgForm.contextType = FormContext

export default function Hsgform(props) {
  return <HsgForm {...props} />
}
