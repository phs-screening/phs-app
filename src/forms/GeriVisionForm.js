import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'
import { useNavigate } from 'react-router-dom'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import allForms from '../forms/forms.json'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { LongTextField, SelectField, RadioField, NumField } from 'uniforms-mui'
import PopupText from 'src/utils/popupText'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'


const schema = new SimpleSchema({
  geriVisionQ1: {
    type: String,
    allowedValues: ['Yes (Specify in textbox )', 'No'],
    optional: false,
  },
  geriVisionQ2: {
    type: String,
    optional: true,
  },
  geriVisionQ3: {
    type: String,
    optional: false,
  },
  geriVisionQ4: {
    type: String,
    optional: false,
  },
  geriVisionQ5: {
    type: String,
    optional: true,
  },
  geriVisionQ6: {
    type: String,
    optional: true,
  },
  geriVisionQ7: {
    type: String,
    allowedValues: ['CF2M', 'CF1M', 'HM', 'LP', 'NLP', 'NIL'],
    optional: true,
  },
  geriVisionQ8: {
    type: Array,
    optional: false,
  },
  'geriVisionQ8.$': {
    type: String,
    allowedValues: ['Refractive', 'Non-refractive', 'None'],
  },
  geriVisionQ9: {
    type: Array,
    optional: true,
  },
  'geriVisionQ9.$': {
    type: String,
    allowedValues: ["Referred to Doctor's Consult"],
  },
  geriVisionQ10: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriVisionQ11: {
    type: String,
    optional: true,
  },
  geriVisionQ12: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriVisionQ13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'geriVisionForm'
const GeriVisionForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()
  const [hxHCSR, sethxHCSR] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)

    const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)

    Promise.all([hcsrData]).then((result) => {
        sethxHCSR(result[0])
        isLoadingSidePanel(false)
      }
    )
  }, [])

  const formOptions = {
    geriVisionQ1: [
      {
        label: 'Yes (Specify in textbox )',
        value: 'Yes (Specify in textbox )',
      },
      { label: 'No', value: 'No' },
    ],
    geriVisionQ7: [
      {
        label: 'CF2M',
        value: 'CF2M',
      },
      { label: 'CF1M', value: 'CF1M' },
      { label: 'HM', value: 'HM' },
      { label: 'LP', value: 'LP' },
      { label: 'NLP', value: 'NLP' },
      { label: 'NIL', value: 'NIL' },
    ],
    geriVisionQ8: [
      {
        label: 'Refractive',
        value: 'Refractive',
      },
      { label: 'Non-refractive', value: 'Non-refractive' },
      { label: 'None', value: 'None' },
    ],
    geriVisionQ9: [
      {
        label: "Referred to Doctor's Consult",
        value: "Referred to Doctor's Consult",
      },
    ],
    geriVisionQ10: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriVisionQ12: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriVisionQ13: [
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
        <h1>VISION SCREENING</h1>
        <h2>Non-Refractive Error</h2>
        <h3>1. Previous eye condition or surgery</h3>
        <RadioField
          name='geriVisionQ1'
          label='Geri - Vision Q1'
          options={formOptions.geriVisionQ1}
        />
        <PopupText qnNo='geriVisionQ1' triggerValue='Yes (Specify in textbox )'>
          <h4>Explanation</h4>
          <LongTextField name='geriVisionQ2' label='Geri - Vision Q2' />
        </PopupText>
        <h3>
          2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__ <br />
        </h3>
        <NumField name='geriVisionQ3' label='Geri - Vision Q3' /> <br />
        <h3>
          3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__ <br />
        </h3>
        <NumField name='geriVisionQ4' label='Geri - Vision Q4' /> <br />
        <h3>
          4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__ <br />
        </h3>
        <NumField name='geriVisionQ5' label='Geri - Vision Q5' /> <br />
        <h3>
          5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__ <br />
        </h3>
        <NumField name='geriVisionQ6' label='Geri - Vision Q6' /> <br />
        <h3>6. Is participant currently on any eye review/ consulting any eye specialist?</h3>
        <RadioField
          name='geriVisionQ10'
          label='Geri - Vision Q10'
          options={formOptions.geriVisionQ10}
        />
        <h4>Please specify:</h4>
        <LongTextField name='geriVisionQ11' label='Geri - Vision Q11' />
        <h3>7. Type of vision error?</h3>
        <RadioField
          name='geriVisionQ8'
          label='Geri - Vision Q8'
          options={formOptions.geriVisionQ8}
        />
        <h4>
          Please <u>refer to Doctor’s Consult</u> if pinhole visual acuity is <u>worse than 6/12</u>
        </h4>
        <SelectField
          name='geriVisionQ9'
          checkboxes='true'
          label='Geri - Vision Q9'
          options={formOptions.geriVisionQ9}
        />
        <h2>Refractive Error</h2>
        Senior Citizens are eligible to receiving subsidy for spectacles under the Senior Mobility
        Fund (SMF) provided they qualify for the following:
        <ul>
          <li>
            Have a household monthly income per person of $2,000 and below OR Annual Value (AV) of
            residence reflected on NRIC of $13,000 and below for households with no income
          </li>
          <li>Be living in the community (not residing in a nursing home or sheltered home).</li>
          <li>First time SMF applicant</li>
          <li>
            Be assessed by a qualified assessor on the type of device required when applicable.
          </li>
          <li>
            Not concurrently receive (or apply for) any other public or private grants, or
            subsidies.
          </li>
        </ul>
        <h3>1. Does the participant wish to apply for the Senior Mobility Fund?</h3>
        <RadioField
          name='geriVisionQ12'
          label='Geri - Vision Q12'
          options={formOptions.geriVisionQ12}
        />
        <h3>2. Referred to Social Services?</h3>
        <RadioField
          name='geriVisionQ13'
          label='Geri - Vision Q13'
          options={formOptions.geriVisionQ13}
        />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {newForm()}
          </Paper>
        </Grid>
        <Grid
          p={1}
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Patient History</h2>
              {hxHCSR ? (
                <>
                  <p>Does participant complain of any vision problems: {hxHCSR.hxHcsrQ6}</p>
                  <p>participant specified: {hxHCSR.hxHcsrShortAnsQ6}</p>
                </>
              ) : (
                <p className='red'>nil hxHCSR data</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

GeriVisionForm.contextType = FormContext

export default GeriVisionForm
