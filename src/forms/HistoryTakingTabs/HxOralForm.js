import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import PopupText from 'src/utils/popupText.js'

const schema = new SimpleSchema({
  ORAL1: {
    type: String,
    allowedValues: ['Healthy', 'Moderate', 'Poor, (please specify)'],
    optional: false,
  },
  ORALShortAns1: {
    type: String,
    optional: true,
  },
  ORAL2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  ORAL3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  ORAL4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  ORAL5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  ORALShortAns5: {
    type: String,
    optional: true,
  },
})

const formName = 'hxOralForm'

const HxOralForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props
  const navigate = useNavigate()

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const formOptions = {
    ORAL1: [
      {
        label: 'Healthy',
        value: 'Healthy',
      },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'Poor, (please specify)', value: 'Poor, (please specify)' },
    ],
    ORAL2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    ORAL3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    ORAL4: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    ORAL5: [
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
            changeTab(event, nextTab)
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
        <h1>4. ORAL ISSUES</h1>
        <h4 className='red'>
          Please do a quick inspection of participant&apos;s oral health status:
          <ol>
            <li>Lips, Tongue, Gums & Tissues (Healthy - pink and moist)</li>
            <li>
              Natural Teeth, Oral Cleanliness & Dentures (Tooth/Root decay, no cracked/broken
              dentures, no food particles/tartar in mouth)
            </li>
            <li>Saliva status (free-flowing) and any dental pain</li>
          </ol>
        </h4>
        <h3>How is the participan&apos;s Oral Health?</h3>
        <RadioField name='ORAL1' label='ORAL1' options={formOptions.ORAL1} />
        <PopupText qnNo='ORAL1' triggerValue='Poor, (please specify)'>
          <h4>Please specify:</h4>
          <LongTextField name='ORALShortAns1' label='ORAL1' />
        </PopupText>
        <h3>Do you wear dentures?</h3>
        <RadioField name='ORAL2' label='ORAL2' options={formOptions.ORAL2} />
        <h3>Are you currently experiencing any pain in your mouth area?</h3>
        <RadioField name='ORAL3' label='ORAL3' options={formOptions.ORAL3} />
        <h3>Have you visited a dentist in the past 1 year?</h3>{' '}
        <RadioField name='ORAL4' label='ORAL4' options={formOptions.ORAL4} />
        <h3>
          Would you like to go through free Oral Health Education by NUS Dentistry dentists and
          students?
        </h3>
        <p>
          If the patient has any queries regarding dental health, or if you think that the patient
          would benefit from a Oral Health Consult.
        </p>
        <RadioField name='ORAL5' label='ORAL5' options={formOptions.ORAL5} />
        <h4>Please specify:</h4>
        <LongTextField name='ORALShortAns5' label='ORAL5' />
        <h4>
          The dental examination booth will only provide <u>simple dental screening</u>, there will
          be no treatment provided on site (e.g. scaling and polishing)
        </h4>
        <h4>
          <span className='red'>Please help to emphasise that: </span>screening DOES NOT take the
          place of a thorough oral health examination with a dentist.
        </h4>
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

HxOralForm.contextType = FormContext

export default HxOralForm
