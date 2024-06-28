import React, { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { BoolField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import '../forms.css'

const schema = new SimpleSchema({
  hxHcsrQ1: {
    type: String,
    optional: false,
  },
  hxHcsrQ2: {
    type: String,
    optional: false,
  },
  hxHcsrQ3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrQ4: {
    type: String,
    optional: true,
  },
  hxHcsrQ5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  hxHcsrQ6: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrQ7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  hxHcsrQ8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrShortAnsQ3: {
    type: String,
    optional: true,
  },
  hxHcsrShortAnsQ5: {
    type: String,
    optional: true,
  },
  hxHcsrShortAnsQ6: {
    type: String,
    optional: true,
  },
  hxHcsrShortAnsQ7: {
    type: String,
    optional: true,
  },
})

const formName = 'hxHcsrForm'
const HxHcsrForm = (props) => {
  const [loading, isLoading] = useState(false)
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const formOptions = {
    hxHcsrQ3: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    hxHcsrQ5: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    hxHcsrQ6: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    hxHcsrQ7: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    hxHcsrQ8: [
      { label: 'Yes', value: 'Yes' },
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
        <h1>PARTICIPANT IDENTIFICATION</h1>
        <h4 className='red'>
          Please verify participant&apos;s identity using his/her
          <ol type='A'>
            <li>APP ID on wristband, AND</li>
            <li>INITIALS</li>
          </ol>
        </h4>
        <h3>Booth number and History-taker&apos;s Surname followed by Initials</h3>
        <LongTextField name='hxHcsrQ1' label='Hx HCSR Q1' />
        <p className='red'>
          **On Page 2 of Form A, under Doctor&apos;s Consultation (Hx-taking column, 1st row),
          please write down booth number and history taker&apos;s name. **
        </p>
        <p>(Eg. Booth 18 David Choo Ah Beng = 18 David Choo A B)</p>
        <h2>HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW</h2>
        <h2>1. HEALTH CONCERNS</h2>
        <h3>
          If the participant has any <u>presenting complaints or concern(s)</u>, please take a brief
          history. (Please write NIL if otherwise).
        </h3>
        <p>
          &quot;Do you have any health issues that you are currently concerned about?&quot;
          <br />
          &quot;最近有没有哪里不舒服&quot;
        </p>
        <LongTextField name='hxHcsrQ2' label='Hx HCSR Q2' />
        <p>
          <h4 className='red underlined'>
            Please advise that there will be no diagnosis or prescription made at our screening.
          </h4>
          Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting
          treatment for their problems.
        </p>
        <h3>
          Please tick to highlight if you feel HEALTH CONCERS require closer scrutiny by doctors
          later or if participant strongly insists.
        </h3>
        <RadioField name='hxHcsrQ3' label='hxHcsrQ3' options={formOptions.hxHcsrQ3} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrShortAnsQ3' label='hx HCSR Q3' />
        <p>
          Below is a non-exhaustive list of possible red flags:
          <ul>
            <li>
              <u>Constitutional Symptoms:</u> LOA, LOW, Fever
            </li>
            <li>
              <u>CVS</u>: Chest pain, Palpitations
            </li>
            <li>
              <u>Respi</u>: SOB, Haemoptysis, Night Sweat, Cough
            </li>
            <li>
              <u>GI</u>: change in BO habits, PR bleed, Haematemesis
            </li>
            <li>Frequent falls</li>
          </ul>
        </p>
        <h3>
          Based on <span className='red underlined'>participants&apos;s health concerns,</span>{' '}
          please rule out red flags <b>(Please write NIL if otherwise)</b>
        </h3>
        <LongTextField name='hxHcsrQ4' label='Hx HCSR Q4' />
        <h3>Do you have any problems passing urine or motion? Please specify if yes.</h3>
        <RadioField name='hxHcsrQ5' label='Hx HCSR Q5' options={formOptions.hxHcsrQ5} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrShortAnsQ5' label='Hx HCSR Q5' />
        <h3>
          Do you have any vision problems? Please specify if yes. Exclude complaints like unspecific
          itchy eyes etc
        </h3>
        <RadioField name='hxHcsrQ6' label='Hx HCSR Q6' options={formOptions.hxHcsrQ6} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrShortAnsQ6' label='Hx HCSR Q6' />
        <h3>Do you have any hearing problems? Please specify if yes.</h3>
        <RadioField name='hxHcsrQ7' label='Hx HCSR Q7' options={formOptions.hxHcsrQ7} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrShortAnsQ7' label='Hx HCSR Q7' />
        <h3>
          Please tick to highlight if you feel SYSTEMS REVIEW require closer scrutiny by doctors
          later of if participant strongly insists.
        </h3>
        <RadioField name='hxHcsrQ8' label='hxHcsrQ8' options={formOptions.hxHcsrQ8} />
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

HxHcsrForm.contextType = FormContext

export default HxHcsrForm
