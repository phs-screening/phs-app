import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { RadioField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'

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

  const formOptions = {
    oneToFiveSchema: [
      {
        label: '0',
        value: '0',
      },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
    ],
    oneToSixSchema: [
      {
        label: '0',
        value: '0',
      },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
    ],
    hxWellbeingQ11: [
      {
        label: '1 (Never or very rarely)',
        value: '1 (Never or very rarely)',
      },
      { label: '2 (Rarely)', value: '2 (Rarely)' },
      { label: '3 (Sometimes)', value: '3 (Sometimes)' },
      { label: '4 (Often)', value: '4 (Often)' },
      { label: '5 (Very often or always)', value: '5 (Very often or always)' },
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
        <h3>
          From a scale of 0 to 5, 0 being &apos;no all the time&apos; and 5 being &apos;all of the
          time&apos;, please give a number for each of the following statements.
        </h3>
        <h4>
          1. <q>I have felt cheerful and in good spirits.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ1'
          label='Hx Wellbeing Q1'
          options={formOptions.oneToFiveSchema}
        />
        <h4>
          2. <q>I have felt calm and relaxed.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ2'
          label='Hx Wellbeing Q2'
          options={formOptions.oneToFiveSchema}
        />
        <h4>
          3. <q>I have felt active and vigorous.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ3'
          label='Hx Wellbeing Q3'
          options={formOptions.oneToFiveSchema}
        />
        <h4>
          4. <q>I woke up feeling freshed and rested.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ4'
          label='Hx Wellbeing Q4'
          options={formOptions.oneToFiveSchema}
        />
        <h4>
          5. <q>My daily life has been filled with things that interest me.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ5'
          label='Hx Wellbeing Q5'
          options={formOptions.oneToFiveSchema}
        />
        <h2>Rapid Positive Mental Health Instrument</h2>
        <h3>
          Thinking over the last 4 weeks, please select a number showing how much the statements
          describe you.
        </h3>
        <p>
          1 - Not at all like me
          <br />
          2 - Very slightly like me
          <br />
          3 - Slightly like me
          <br />
          4 - Moderately like me
          <br />
          5 - Very much like me
          <br />6 - Exactly like me
        </p>
        <Divider />
        <h4>
          6. <q>I spend time with people I like</q>
        </h4>
        <RadioField
          name='hxWellbeingQ6'
          label='Hx Wellbeing Q6'
          options={formOptions.oneToSixSchema}
        />
        <h4>
          7. <q>I make friends easily</q>
        </h4>
        <RadioField
          name='hxWellbeingQ7'
          label='Hx Wellbeing Q7'
          options={formOptions.oneToSixSchema}
        />
        <h4>
          8. <q>I try to be patient with others</q>
        </h4>
        <RadioField
          name='hxWellbeingQ8'
          label='Hx Wellbeing Q8'
          options={formOptions.oneToSixSchema}
        />
        <h4>
          9. <q>I am willing to share my time with others</q>
        </h4>
        <RadioField
          name='hxWellbeingQ9'
          label='Hx Wellbeing Q9'
          options={formOptions.oneToSixSchema}
        />
        <h4>
          10. <q>I have freedom to make choices that concern my future.</q>
        </h4>
        <RadioField
          name='hxWellbeingQ10'
          label='Hx Wellbeing Q10'
          options={formOptions.oneToSixSchema}
        />
        <h4>11. How often in the past 4 weeks have you felt calm?</h4>
        <RadioField
          name='hxWellbeingQ11'
          label='Hx Wellbeing Q11'
          options={formOptions.hxWellbeingQ11}
        />
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

HxWellbeingForm.contextType = FormContext

export default HxWellbeingForm
