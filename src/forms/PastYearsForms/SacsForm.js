import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, TextField } from 'uniforms-mui'
import { RadioField } from 'uniforms-mui'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import '../Snippet.css'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import './forms.css'

const schema = new SimpleSchema({
  sacsQ1: {
    type: String,
  },
  sacsQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
  },
  sacsQ3: {
    type: String,
    allowedValues: ['Yes', 'No'],
  },
  wceQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  wceQ2: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ3: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ4: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ5: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
})

const formName = 'sacsForm'
const SacsForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [])

  const formOptions = {
    sacsQ2: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    sacsQ3: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    wceQ1: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    wceQ2: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],

    wceQ3: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],

    wceQ4: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],

    wceQ5: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
  }
  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitFormSpecial(model, patientId, formName)
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
        <h1>SACS</h1>
        <h3>Notes from SACS Consultation</h3>
        <TextField name='sacsQ1' label='SACS Q1' />
        <h3>Is the patient okay to continue with screening?</h3>
        <RadioField name='sacsQ2' label='SACS Q2' options={formOptions.sacsQ2} />
        <h3>Has this person been referred to a SACS CREST programme for follow-up?</h3>
        <RadioField name='sacsQ3' label='SACS Q3' options={formOptions.sacsQ3} />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => { }} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <snippet-container>
      <Paper className='snippet-item' elevation={2} p={0} m={0}>
        {newForm()}
      </Paper>

      {/*<Paper className="snippet-item" elevation={2} p={0} m={0}>*/}
      {/*  <h2>Snippets appear here</h2>*/}
      {/*</Paper>*/}
    </snippet-container>
  )
}

SacsForm.contextType = FormContext

export default function Sacsform(props) {
  const navigate = useNavigate()

  return <SacsForm {...props} navigate={navigate} />
}
