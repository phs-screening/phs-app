import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { SelectField, RadioField, LongTextField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import PopupText from '../utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

// Formerly NSS, renamed to PMHX as of PHS 2022. Forms not renamed, only tabe name
const schema = new SimpleSchema({
  hxNssQ1: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'None'],
    optional: false,
  },
  hxNssQ2: {
    type: String,
    optional: true,
  },
  hxNssQ4: {
    type: Array,
    optional: true,
  },
  'hxNssQ4.$': {
    type: String,
    allowedValues: [
      'Do not see the need for tests',
      'Challenging to make time to go for appointments',
      'Difficulties gtting to the clinics',
      'Financial issues',
      'Scared of doctor',
      'Others: (please specify reason)',
    ],
  },
  hxNssQ5: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  hxNssQ6: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  hxNssQ7: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  hxNssQ8: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  hxNssQ9: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'None'],
    optional: false,
  },
  hxNssQ10: {
    type: String,
    optional: true,
  },
  hxNssQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxNssQ12: {
    type: String,
    optional: true,
  },
  hxNssQ13: {
    type: Array,
    optional: true,
  },
  'hxNssQ13.$': {
    type: String,
    allowedValues: [
      'Cancer',
      'Coronary Heart disease (caused by narrowed blood vessels supplying the heart muscle) or Heart attack, (Please specify):',
      'Diabetes',
      'Hypertension',
      'High Cholesterol',
      'Stroke (including transient ischaemic attack)',
      'No, they do not have any of the above.',
    ],
  },
  hxNssQ22: {
    type: String,
    optional: true,
  },
  hxNssQ23: {
    type: String,
    optional: true,
  },
  hxNssQ24: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'hxNssForm'
const HxNssForm = (props) => {
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
    hxNssQ1: [
      {
        label: 'Yes, (Please specify)',
        value: 'Yes, (Please specify)',
      },
      { label: 'None', value: 'None' },
    ],
    hxNssQ4: [
      {
        label: 'Do not see the need for tests',
        value: 'Do not see the need for tests',
      },
      {
        label: 'Challenging to make time to go for appointments',
        value: 'Challenging to make time to go for appointments',
      },
      { label: 'Difficulties gtting to the clinics', value: 'Difficulties gtting to the clinics' },
      { label: 'Financial issues', value: 'Financial issues' },
      { label: 'Scared of doctor', value: 'Scared of doctor' },
      { label: 'Others: (please specify reason)', value: 'Others: (please specify reason)' },
    ],
    hxNssQ5: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    hxNssQ6: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    hxNssQ7: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    hxNssQ8: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    hxNssQ9: [
      {
        label: 'Yes, (Please specify)',
        value: 'Yes, (Please specify)',
      },
      { label: 'None', value: 'None' },
    ],
    hxNssQ11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    hxNssQ13: [
      {
        label: 'Cancer',
        value: 'Cancer',
      },
      {
        label:
          'Coronary Heart disease (caused by narrowed blood vessels supplying the heart muscle) or Heart attack, (Please specify):',
        value:
          'Coronary Heart disease (caused by narrowed blood vessels supplying the heart muscle) or Heart attack, (Please specify):',
      },
      { label: 'Diabetes', value: 'Diabetes' },
      {
        label: 'Hypertension',
        value: 'Hypertension',
      },
      { label: 'High Cholesterol', value: 'High Cholesterol' },
      {
        label: 'Stroke (including transient ischaemic attack)',
        value: 'Stroke (including transient ischaemic attack)',
      },
      {
        label: 'No, they do not have any of the above.',
        value: 'No, they do not have any of the above.',
      },
    ],
    hxNssQ24: [
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
        <h1>HISTORY TAKING PART 2: PAST MEDICAL HISTORY</h1>
        <h2>1. Past Medical History</h2>
        <h3>PLEASE TAKE 2ND BP READING NOW AND RECORD ON FORM A.</h3>
        <p>
          Hypertension criteria:
          <ol>
            <li>Younger participants: &gt; 140/90</li>
            <li>Participants &gt; 80 years old: &gt; 150/90</li>
            <li>CKD w proteinuria (mod to severe albuminuria): &gt; 130/80</li>
            <li>DM: &gt; 130/80</li>
          </ol>
        </p>
        <h3>
          Please tick to highlight if you feel <u>BLOOD PRESSURE</u> requires closer scrutiny by
          doctors later
        </h3>
        <RadioField name='hxNssQ24' label='Hx NSS Q24' options={formOptions.hxNssQ24} />
        <PopupText qnNo='hxNssQ24' triggerValue='Yes'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span>: (FOR THE FOLLOWING SCENARIOS)
            </b>
            <ul>
              <li>Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A</li>
              <li>
                Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
                Recommendation
              </li>
            </ul>
            <span className='red'>
              <h4 className='underlined'>HYPERTENSIVE EMERGENCY</h4>
              <ul>
                <li>
                  SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND{' '}
                  <mark>
                    <u>SYMPTOMATIC</u>
                  </mark>{' '}
                  (make sure pt has rested and 2nd reading was taken)
                  <ul>
                    <li>
                      <mark>ASK THE DOCTOR TO COME AND REVIEW!</mark>
                    </li>
                  </ul>
                </li>
              </ul>
              <h4 className='underlined'>HYPERTENSIVE URGENCY</h4>
              <ul>
                <li>
                  SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND{' '}
                  <mark>ASYMPTOMATIC</mark> (make sure pt has rested and 2nd reading was taken)
                  <ul>
                    <li>ESCORT TO DC DIRECTLY!</li>
                    <li>
                      Follow the patient, continue clerking the patient afterward if doctor
                      acknowledges patient is well enough to continue the screening
                    </li>
                  </ul>
                </li>
              </ul>
              <h4 className='underlined'>RISK OF HYPERTENSIVE CRISIS</h4>
              <ul>
                <li>
                  IF SYSTOLIC between <mark>160 - 180 mmHg</mark>
                </li>
                <li>
                  IF <mark>ASYMPTOMATIC</mark>, continue clerking.
                </li>
                <li>
                  IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!
                </li>
              </ul>
            </span>
            <h4 className='underlined'>If systolic between 140 - 160 mmHg: </h4>
            <ul>
              <li>Ask for:</li>
              <ul>
                <li>
                  Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN
                  diagnosis)
                </li>
                <li>
                  If diagnosed before, ask about compliance and whether he/she goes for regular
                  follow up?
                </li>
              </ul>
            </ul>
          </p>
        </PopupText>
        <h3>Do you have any drug allergies?</h3>
        <RadioField name='hxNssQ1' label='Hx NSS Q1' options={formOptions.hxNssQ1} />
        <h4>Please specify:</h4>
        <LongTextField name='hxNssQ2' label='Hx NSS Q2' />
        <h3>
          Are you on any alternative medicine including traditional chinese medications, homeopathy
          etc?
        </h3>
        <RadioField name='hxNssQ9' label='Hx NSS Q9' options={formOptions.hxNssQ9} />
        <h4>Please specify:</h4>
        <LongTextField name='hxNssQ10' label='Hx NSS Q10' />
        <p className='blue'>
          <b>
            Please summarise his/her <mark>RELEVANT</mark> Past Medical History briefly for the
            doctors to refer to during doctors consultation.
            <ol>
              <li>Conditions</li>
              <li>Duration</li>
              <li>Control</li>
              <li>Compliance</li>
              <li>Complications</li>
              <li>Follow up route (specifiy whether GP/Polyclinic/FMC/SOC)</li>
            </ol>
          </b>
        </p>
        <h3>
          If participant is not engaged with any follow-up, ask &quot;what is the reason that
          you&apos;re not following up with your doctor for your existing conditions?&quot;
        </h3>
        e.g. do not see the purpose for tests, busy/ no time, lack of access e.g. mobility issues,
        financial issues, fear of doctors/ clinics/ hospitals etc
        <h3>
          If a participant is not compliant to medications, do probe further on his/her reasons for
          not consuming medications as prescribed.
        </h3>
        Medication not effective? Can be managed without medication? Forget to take? Lost/Ran out of
        medication?
        <h3>
          If a participant does not elicit any Past Medical History, ask if they regularly go for
          screenings/blood tests etc.
        </h3>
        <LongTextField name='hxNssQ12' label='Hx NSS Q12' />
        <h3>
          Please tick to highlight if you feel &apos;Past Medical History&apos; requires closer
          scrutiny by doctors later
        </h3>
        <RadioField name='hxNssQ11' label='Hx NSS Q11' options={formOptions.hxNssQ11} />
        <h4>Based on participant medical hx, please recommend relevant stations:</h4>
        <ol>
          <li>
            Doctor&apos;s Consultation station, tick eligibility, Circle interested &apos;Y&apos; on
            Page 1 of Form A
          </li>
          <li>
            Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
            Recommendation
          </li>
          <li>
            Relevant exhibition booths on page 2 of form A. Indicate accordingly for past history of
            DM / CVS Disease (including HTN, HLD, IHD) / CVA.
          </li>
        </ol>
        <h4>For participant with DM, refer to DC if:</h4>
        <ul>
          <li>Symptomatic, and non-compliant</li>
          <li>Asymptomatic, but non-compliant</li>
        </ul>
        <p className='red'>
          Also, refer to DC if participant has not been diagnosed with DM, but has signs of DM
          (polyuria, polydipsia, periphery neuropathy, blurring of vision etc)
        </p>
        <h3>PLEASE TAKE 3RD BP READING (IF MORE THAN 5MMHG) AND RECORD ON FORM A.</h3>
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

HxNssForm.contextType = FormContext

export default function HxNssform(props) {
  return <HxNssForm {...props} />
}
