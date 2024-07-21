import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import {
  SubmitField,
  ErrorsField,
  TextField,
  SelectField,
  RadioField,
  LongTextField,
} from 'uniforms-mui'
import { BoolField } from 'uniforms-mui'
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  DENT1: {
    type: Array,
    optional: false,
  },
  'DENT1.$': {
    type: String,
    allowedValues: ['I have been informed and understand.'],
  },
  DENT2: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  DENTShortAns2: {
    type: String,
    optional: true,
  },
  DENT3: {
    type: Array,
    optional: false,
  },
  'DENT3.$': {
    type: String,
    allowedValues: ['Yes'],
    optional: false,
  },
  DENT4: {
    type: String,
    allowedValues: ['Yes', 'No, (specify why)'],
    optional: false,
  },
  DENTShortAns4: {
    type: String,
    optional: true,
  },
})

const formName = 'oralHealthForm'
const OralHealthForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])
  const formOptions = {
    DENT1: [
      {
        label: 'I have been informed and understand.',
        value: 'I have been informed and understand.',
      },
    ],
    DENT2: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    DENT3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
    ],
    DENT4: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No, (specify why)', value: 'No, (specify why)' },
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
        <h1>Oral Health</h1>
        <h3>I have been informed and understand that: </h3>
        <p>
          <ol type='a'>
            <li>
              The oral health screening may be provided by clinical instructors <br />
              AND/OR postgraduate dental students who are qualified dentists <br />
              AND/OR undergraduate dental students who are not qualified dentists
              <ul>
                <li>
                  ALL undergraduate dental students will be supervised by a clinical instructor
                  and/or postgraduate dental student.
                </li>
              </ul>
            </li>
            <li>
              The Oral Health Screening only provides a basic assessment of my/my ward&apos;s oral
              health condition and that it does not take the place of a thorough oral health
              examination.
            </li>
            <li>
              I/My ward will be advised on the type(s) of follow-up dental treatment required for
              my/my ward&apos;s oral health condition after the Oral Health Screening.
              <ul>
                <li>
                  I/My ward will be responsible to seek such follow-up dental treatment as advised
                  at my/myward&apos; own cost.
                </li>
              </ul>
            </li>
            <li>
              My decision to participate/let my ward participate in this Oral Health Screening is
              voluntary.
            </li>
          </ol>
        </p>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='DENT1'
          label='DENT1'
          options={formOptions.DENT1}
        />
        <h3>Are you on any blood thinners or have any bleeding disorders?</h3>
        <RadioField name='DENT2' label='DENT2' options={formOptions.DENT2} />
        <h4>Please specify:</h4>
        <LongTextField name='DENTShortAns2' label='DENT2' />
        <h3>Patient has completed Oral Health station.</h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='DENT3'
          label='DENT3'
          options={formOptions.DENT3}
        />
        <h3>Patient has registered with NUS Dentistry for follow-up. If no, why not.</h3>
        <RadioField name='DENT4' label='DENT4' options={formOptions.DENT4} />
        <h4>Please specify:</h4>
        <LongTextField name='DENTShortAns4' label='DENT4' />
        <br />
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

OralHealthForm.contextType = FormContext

export default function OralHealthform(props) {
  const navigate = useNavigate()

  return <OralHealthForm {...props} navigate={navigate} />
}
