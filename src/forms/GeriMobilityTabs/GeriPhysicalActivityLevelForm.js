import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { LongTextField, RadioField, SelectField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const schema = new SimpleSchema({
  geriPhysicalActivityLevelQ1: {
    type: String,
    allowedValues: ['Nil', '1-2x/ week', '3-4x/ week', '5x/ week or more'],
    optional: false,
  },
  geriPhysicalActivityLevelQ2: {
    type: String,
    allowedValues: ['Nil', '<15 min', '< 15-30 min', '30 min or more'],
    optional: false,
  },
  geriPhysicalActivityLevelQ3: {
    type: String,
    optional: false,
  },
  geriPhysicalActivityLevelQ4: {
    type: String,
    allowedValues: ['Light Intensity', 'Moderate Intensity', 'Vigorous Intensity', 'Unsure'],
    optional: false,
  },
  geriPhysicalActivityLevelQ5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriPhysicalActivityLevelQ8: {
    type: String,
    allowedValues: ['No fall', '1 fall', '2 or more falls'],
    optional: false,
  },
  geriPhysicalActivityLevelQ9: {
    type: String,
    allowedValues: ['No', 'Yes'],
    optional: false,
  },
  geriPhysicalActivityLevelQ10: {
    type: String,
    optional: true,
  },
  geriPhysicalActivityLevelQ7: {
    type: String,
    optional: true,
  },
  geriPhysicalActivityLevelQ6: {
    type: Array,
    optional: false,
  },
  'geriPhysicalActivityLevelQ6.$': {
    type: String,
    allowedValues: [
      '< 150min of mod intensity per week',
      'unsure about qns 1-4',
      'yes to qn 5',
      'nil - regular advice',
    ],
    optional: false,
  },
})

const formName = 'geriPhysicalActivityLevelForm'
const GeriPhysicalActivityLevelForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [])

  const formOptions = {
    geriPhysicalActivityLevelQ1: [
      {
        label: 'Nil',
        value: 'Nil',
      },
      { label: '1-2x/ week', value: '1-2x/ week' },
      { label: '3-4x/ week', value: '3-4x/ week' },
      { label: '5x/ week or more', value: '5x/ week or more' },
    ],
    geriPhysicalActivityLevelQ2: [
      {
        label: 'Nil',
        value: 'Nil',
      },
      { label: '<15 min', value: '<15 min' },
      { label: '< 15-30 min', value: '< 15-30 min' },
      { label: '30 min or more', value: '30 min or more' },
    ],
    geriPhysicalActivityLevelQ4: [
      {
        label: 'Light Intensity',
        value: 'Light Intensity',
      },
      { label: 'Moderate Intensity', value: 'Moderate Intensity' },
      { label: 'Vigorous Intensity', value: 'Vigorous Intensity' },
      { label: 'Unsure', value: 'Unsure' },
    ],
    geriPhysicalActivityLevelQ5: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriPhysicalActivityLevelQ6: [
      {
        label: '< 150min of mod intensity per week',
        value: '< 150min of mod intensity per week',
      },
      { label: 'unsure about qns 1-4', value: 'unsure about qns 1-4' },
      { label: 'yes to qn 5', value: 'yes to qn 5' },
      { label: 'nil - regular advice', value: 'nil - regular advice' },
    ],
    geriPhysicalActivityLevelQ8: [
      {
        label: 'No fall',
        value: 'No fall',
      },
      { label: '1 fall', value: '1 fall' },
      { label: '2 or more falls', value: '2 or more falls' },
    ],
    geriPhysicalActivityLevelQ9: [
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
        <h1>PHYSICAL ACTIVITY SECTION</h1>
        <h2>PHYSICAL ACTIVITY LEVELS</h2>
        <h3>1. How often do you exercise in a week?</h3>
        If &lt; 3x/week and would like to start exercising more, suggest physiotherapist
        consultation
        <RadioField
          name='geriPhysicalActivityLevelQ1'
          label='Geri - Physical Activity Level Q1'
          options={formOptions.geriPhysicalActivityLevelQ1}
        />
        <h3>2. How long do you exercise each time?</h3>
        If &lt; 30minutes per session and would like to increase, suggest physiotherapist
        consultation.
        <RadioField
          name='geriPhysicalActivityLevelQ2'
          label='Geri - Physical Activity Level Q2'
          options={formOptions.geriPhysicalActivityLevelQ2}
        />
        <h3>3. What do you do for exercise?</h3>
        <ul className='decrease-left-margin'>
          <li>Take down salient points. </li>
          <li>
            Dangerous/ inappropriate exercises are defined to the participants as exercises that
            cause pain or difficulty to to the participant in performing.
          </li>
          <li>
            If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST
            CONSULATION.
          </li>
        </ul>
        <LongTextField
          name='geriPhysicalActivityLevelQ3'
          label='Geri - Physical Activity Level Q3'
        />
        <h3>4. Using the following scale, can you rate the level of exertion when you exercise?</h3>
        <p>
          <b>PT to note:</b>
          <br />
          if participant:
          <ol>
            <li>Achieves less than 150 min moderate intensity per week OR</li>
            <li>
              Unsure about any of the 4 questions above. <br />
            </li>
          </ol>
        </p>
        <img src='/images/geri-physical-activity-level/intensity.jpg' alt='Intensity' /> <br />
        <RadioField
          name='geriPhysicalActivityLevelQ4'
          label='Geri - Physical Activity Level Q4'
          options={formOptions.geriPhysicalActivityLevelQ4}
        />
        <h3>
          5. Do you have significant difficulties going about your regular exercise regime? Or do
          you not know how to start exercising?
        </h3>
        If yes, to{' '}
        <b>
          REFER FOR <span className='red'>PHYSIOTHERAPIST CONSULATION</span>
        </b>
        <RadioField
          name='geriPhysicalActivityLevelQ5'
          label='Geri - Physical Activity Level Q5'
          options={formOptions.geriPhysicalActivityLevelQ5}
        />
        <h3>6. Do you have any history of falls in the past 1 year? If yes, how many falls?</h3>
        <RadioField
          name='geriPhysicalActivityLevelQ8'
          label='Geri - Physical Activity Level Q8'
          options={formOptions.geriPhysicalActivityLevelQ8}
        />
        <h3>7. If yes, were any of the falls injurious?</h3>
        If participant had 2 or more falls, or 1 fall with injury,{' '}
        <b>
          REFER TO <span className='red'>DOCTOR&apos;S CONSULTATION</span>
        </b>
        <RadioField
          name='geriPhysicalActivityLevelQ9'
          label='Geri - Physical Activity Level Q9'
          options={formOptions.geriPhysicalActivityLevelQ9}
        />
        <h4>
          Please elaborate below on the injuries and whether there was medical treatment e.g. seeing
          Dr/ED dept.
        </h4>
        <LongTextField
          name='geriPhysicalActivityLevelQ10'
          label='Geri - Physical Activity Level Q10'
        />
        <h4>Notes:</h4>
        <LongTextField
          name='geriPhysicalActivityLevelQ7'
          label='Geri - Physical Activity Level Q7'
        />
        <h3 className='red'>Referral to Physiotherapist Consult</h3>
        <SelectField
          name='geriPhysicalActivityLevelQ6'
          checkboxes='true'
          label='Geri - Physical Activity Level Q6'
          options={formOptions.geriPhysicalActivityLevelQ6}
        />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => { }} />}</div>

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

GeriPhysicalActivityLevelForm.contextType = FormContext

export default GeriPhysicalActivityLevelForm
