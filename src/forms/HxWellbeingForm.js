import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'

const oneToFiveSchema = {
  type: String,
  allowedValues: ['0', '1', '2', '3', '4', '5'],
}

const oneToSixSchema = {
  type: String,
  allowedValues: ['1', '2', '3', '4', '5', '6'],
}

const schema = new SimpleSchema({
  hxWellbeingQ1: oneToFiveSchema,
  hxWellbeingQ2: oneToFiveSchema,
  hxWellbeingQ3: oneToFiveSchema,
  hxWellbeingQ4: oneToFiveSchema,
  hxWellbeingQ5: oneToFiveSchema,

  hxWellbeingQ6: oneToSixSchema,
  hxWellbeingQ7: oneToSixSchema,
  hxWellbeingQ8: oneToSixSchema,
  hxWellbeingQ9: oneToSixSchema,
  hxWellbeingQ10: oneToSixSchema,

  hxWellbeingQ11: {
    type: String,
    allowedValues: [
      '1 (Never or very rarely)',
      '2 (Rarely)',
      '3 (Sometimes)',
      '4 (Often)',
      '5 (Very often or always)',
    ],
  },
})

const formName = 'hxWellbeingForm'
const HxWellbeingForm = (props) => {
  const [loading, isLoading] = useState(false)
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})
  const [regForm, setRegForm] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regFormData = getSavedData(patientId, allForms.registrationForm)
    Promise.all([savedData, regFormData]).then((result) => {
      setSaveData(result[0])
      setRegForm(result[1])
    })
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
        <h2>HISTORY TAKING PART 4: Wellbeing</h2>
        <h3>
          From a scale of 0 to 5, 0 being &apos;no all the time&apos; and 5 being &apos;all of the
          time&apos;, please give a number for each of the following statements.
        </h3>
        <span>
          1. <q>I have felt cheerful and in good spirits.</q>
        </span>
        <RadioField name='hxWellbeingQ1' label='Hx Wellbeing Q1' />
        <span>
          2. <q>I have felt calm and relaxed.</q>
        </span>
        <RadioField name='hxWellbeingQ2' label='Hx Wellbeing Q2' />
        <span>
          3. <q>I have felt active and vigorous.</q>
        </span>
        <RadioField name='hxWellbeingQ3' label='Hx Wellbeing Q3' />
        <span>
          4. <q>I woke up feeling refreshed and rested.</q>
        </span>
        <RadioField name='hxWellbeingQ4' label='Hx Wellbeing Q4' />
        <span>
          5. <q>My daily life has been filled with things that interest me.</q>
        </span>
        <RadioField name='hxWellbeingQ5' label='Hx Wellbeing Q5' />
        <h3>
          Rapid Positive Mental Health Instrument
          <br />
          Thinking over the last 4 weeks, please select a number showing how much the statements
          describe you.
        </h3>
        1 - Not at all like me
        <br />
        2 - Very slightly like me
        <br />
        3 - Slightly like me
        <br />
        4 - Moderately like me
        <br />
        5 - Very much like me
        <br />
        6 - Exactly like me
        <br />
        <hr />
        <span>
          6. <q>I spent time with people I like</q>
        </span>
        <RadioField name='hxWellbeingQ6' label='Hx Wellbeing Q6' />
        <br />
        <span>
          7. <q>I make friends easily</q>
        </span>
        <RadioField name='hxWellbeingQ7' label='Hx Wellbeing Q7' />
        <br />
        <span>
          8. <q>I try to be patient with others</q>
        </span>
        <RadioField name='hxWellbeingQ8' label='Hx Wellbeing Q8' />
        <br />
        <span>
          9. <q>I am willing to share my time with others</q>
        </span>
        <RadioField name='hxWellbeingQ9' label='Hx Wellbeing Q9' />
        <br />
        <span>
          10. <q>I have freedom to make choices that concern my future.</q>
        </span>
        <RadioField name='hxWellbeingQ10' label='Hx Wellbeing Q10' />
        <br />
        <span>11. How often in the past 4 weeks have you felt calm?</span>
        <RadioField name='hxWellbeingQ11' label='Hx Wellbeing Q11' />
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

HxWellbeingForm.contextType = FormContext

export default function HxWellbeingform(props) {
  return <HxWellbeingForm {...props} />
}
