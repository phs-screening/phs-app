import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, TextField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import '../Snippet.css'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import { blueText } from '../theme/commonComponents'

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
      <Fragment>
        <h1>SACS</h1>
        <br />
        Notes from SACS Consultation
        <TextField name='sacsQ1' label='SACS Q1' />
        <br />
        Is the patient okay to continue with screening?
        <RadioField name='sacsQ2' label='SACS Q2' />
        <br />
        Has this person been referred to a SACS CREST programme for follow-up?
        <RadioField name='sacsQ3' label='SACS Q3' />
        <br />
      </Fragment>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

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
