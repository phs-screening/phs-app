import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { LongTextField, RadioField, SelectField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

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
        <h2>PHYSICAL ACTIVITY SECTION</h2>
        <h2>PHYSICAL ACTIVITY LEVELS</h2>
        <br />
        1. How often do you exercise in a week?
        <br />
        *If &lt; 3x/week and would like to start exercising more, suggest physiotherapist
        consultation
        <RadioField name='geriPhysicalActivityLevelQ1' label='Geri - Physical Activity Level Q1' />
        <br />
        2. How long do you exercise each time?
        <br />
        *If &lt; 30minutes per session and would like to increase, suggest physiotherapist
        consultation.
        <RadioField name='geriPhysicalActivityLevelQ2' label='Geri - Physical Activity Level Q2' />
        <br />
        3. What do you do for exercise?
        <br />
        *Take down salient points. <br />
        *Dangerous/ inappropriate exercises are defined to the participants as exercises that cause
        pain or difficulty to to the participant in performing.
        <br />
        *If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST
        CONSULATION.
        <LongTextField
          name='geriPhysicalActivityLevelQ3'
          label='Geri - Physical Activity Level Q3'
        />
        <br />
        4. Using the following scale, can you rate the level of exertion when you exercise?
        <br />
        <p>
          <b>PT to note:</b> if participant:
        </p>
        1) Achieves less than 150 min moderate intensity per week OR
        <br />
        2) Unsure about any of the 4 questions above. <br />
        <img src='/images/geri-physical-activity-level/intensity.jpg' alt='Intensity' /> <br />
        <RadioField name='geriPhysicalActivityLevelQ4' label='Geri - Physical Activity Level Q4' />
        <br />
        5. Do you have significant difficulties going about your regular exercise regime? Or do you
        not know how to start exercising?
        <br />
        <b>*If yes, to REFER FOR PHYSIOTHERAPIST CONSULATION</b>
        <RadioField name='geriPhysicalActivityLevelQ5' label='Geri - Physical Activity Level Q5' />
        <br />
        6. Do you have any history of falls in the past 1 year? If yes, how many falls?
        <br />
        <RadioField name='geriPhysicalActivityLevelQ8' label='Geri - Physical Activity Level Q8' />
        <br />
        7. If yes, were any of the falls injurious?
        <br />
        <p>
          If participant had 2 or more falls, or 1 fall with injury,{' '}
          <b>REFER TO DOCTOR&apos;S CONSULTATION</b>
        </p>
        <RadioField name='geriPhysicalActivityLevelQ9' label='Geri - Physical Activity Level Q9' />
        <br />
        Please elaborate below on the injuries and whether there was medical treatment e.g. seeing
        Dr/ED dept.
        <br />
        <LongTextField
          name='geriPhysicalActivityLevelQ10'
          label='Geri - Physical Activity Level Q10'
        />
        <br />
        Notes:
        <LongTextField
          name='geriPhysicalActivityLevelQ7'
          label='Geri - Physical Activity Level Q7'
        />
        <br />
        <font color='red'>
          <span>*Referral to Physiotherapist Consult</span>
          <br />
          <SelectField
            name='geriPhysicalActivityLevelQ6'
            checkboxes='true'
            label='Geri - Physical Activity Level Q6'
          />
        </font>
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

GeriPhysicalActivityLevelForm.contextType = FormContext

export default function GeriPhysicalActivityLevelform(props) {
  return <GeriPhysicalActivityLevelForm {...props} />
}
