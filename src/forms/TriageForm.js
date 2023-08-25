import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { NumField, RadioField, BoolField } from 'uniforms-material'
import { useField } from 'uniforms'
import { submitForm, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  triageQ1: {
    type: Number,
    optional: false,
  },
  triageQ2: {
    type: Number,
    optional: false,
  },
  triageQ3: {
    type: Number,
    optional: false,
  },
  triageQ4: {
    type: Number,
    optional: false,
  },
  triageQ5: {
    type: Number,
    optional: true,
  },
  triageQ6: {
    type: Number,
    optional: true,
  },
  triageQ7: {
    type: Number,
    optional: false,
  },
  triageQ8: {
    type: Number,
    optional: false,
  },
  triageQ9: {
    type: Number,
    optional: false,
  },
  triageQ10: {
    type: Number,
    optional: false,
  },
  triageQ11: {
    type: Number,
    optional: true,
  },
  triageQ14: {
    type: Number,
    optional: true,
  },
  triageQ16: {
    type: String,
    optional: true,
  },
  triageQ17: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

function CalcBMI() {
  const [{ value: height_cm }] = useField('triageQ9', {})
  const [{ value: weight }] = useField('triageQ10', {})
  if (height_cm && weight) {
    return calculateBMI(height_cm, weight)
  }
  return null
}

function IsHighBP(props) {
  const [{ value: sys }] = useField(props.systolic_qn, {})
  const [{ value: dias }] = useField(props.diastolic_qn, {})
  if (sys > 140 && dias > 90) {
    return (
      <Fragment>
        <font color='red'>
          <b>BP HIGH!</b>
        </font>{' '}
        <br />
      </Fragment>
    )
  }
  return null
}

const formName = 'triageForm'
const TriageForm = () => {
  const [loading, isLoading] = useState(false)
  const { patientId, updatePatientId } = useContext(FormContext)
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
      <Fragment>
        <h1>Triage</h1>
        <br />
        <h2>VITALS</h2>
        <h3>
          Please fill in the participant&apos;s BP and BMI based on what you earlier recorded on
          Form A and copy to <font color='red'>NUHS form too.</font>
        </h3>
        <b>
          <u>1) BLOOD PRESSURE</u>
        </b>{' '}
        (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last 30
        minutes.)
        <br />
        1st Reading Systolic (units in mmHg) <br />
        <NumField name='triageQ1' label='Triage Q1' /> <br />
        1st Reading Diastolic (units in mmHg) <br />
        <NumField name='triageQ2' label='Triage Q2' /> <br />
        <IsHighBP systolic_qn='triageQ1' diastolic_qn='triageQ2' />
        <br />
        2nd Reading Systolic (units in mmHg) <br />
        <NumField name='triageQ3' label='Triage Q3' /> <br />
        2nd Reading Diastolic (units in mmHg) <br />
        <NumField name='triageQ4' label='Triage Q4' /> <br />
        <IsHighBP systolic_qn='triageQ3' diastolic_qn='triageQ4' />
        <br />
        <p>
          3rd Reading Systolic (ONLY if 1st and 2nd systolic reading differ by <b>&gt;5mmHg</b>)
        </p>
        <NumField name='triageQ5' label='Triage Q5' /> <br />
        3rd Reading Diastolic (ONLY if 1st and 2nd systolic reading differ by &gt;5mmHg) <br />
        <NumField name='triageQ6' label='Triage Q6' /> <br />
        <IsHighBP systolic_qn='triageQ5' diastolic_qn='triageQ6' />
        <br />
        Average Reading Systolic (average of closest 2 readings): <br />
        <NumField name='triageQ7' label='Triage Q7' /> <br />
        Average Reading Diastolic (average of closest 2 readings): <br />
        <NumField name='triageQ8' label='Triage Q8' /> <br />
        Hypertension criteria:
        <br />○ Younger participants: &gt; 140/90
        <br />○ Participants &gt; 80 years old: &gt; 150/90 <br />○ CKD w proteinuria (mod to severe
        albuminuria): &gt; 130/80
        <br />○ DM: &gt; 130/80
        <br /> <br />
        <p>
          Please tick to highlight if you feel <b>BLOOD PRESSURE</b> require closer scrutiny by
          docors later.
          <br />
        </p>
        <RadioField name='triageQ17' label='Triage Q17' />
        <PopupText qnNo='triageQ17' triggerValue='Yes'>
          <b>
            REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)
            <br />
            1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A
            <br />
            2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
            Recommendation
            <br />
            <br />
            <font color='red'>
              <u>HYPERTENSIVE EMERGENCY</u>
              <br />• SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND{' '}
              <mark>
                <u>SYMPTOMATIC</u>
              </mark>{' '}
              (make sure pt has rested and 2nd reading was taken)
              <br />o <mark>ASK THE DOCTOR TO COME AND REVIEW!</mark>
              <br />
              <br />
              <u>HYPERTENSIVE URGENCY</u>
              <br />• SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC <mark>≥ 110 mmHg</mark> AND{' '}
              <mark>ASYMPTOMATIC</mark> (make sure pt has rested and 2nd reading was taken)
              <br />o ESCORT TO DC DIRECTLY!
              <br />o Follow the patient, continue clerking the patient afterward if doctor
              acknowledges patient is well enough to continue the screening
              <br />
              <br />
              <u>RISK OF HYPERTENSIVE CRISIS</u>
              <br />• IF SYSTOLIC between <mark>160 - 180 mmHg</mark>
              <br />• IF <mark>ASYMPTOMATIC</mark>, continue clerking.
              <br />• IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!
              <br />
              <br />
              <u>If systolic between 140 - 160 mmHg:</u>
            </font>
            <br />o Ask for:
            <br />- Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN
            diagnosis)
            <br />- If diagnosed before, ask about compliance and whether he/she goes for regular
            follow up? If non-compliant or not on regular follow-up, refer to DC (chronic HTN,
            uncontrolled).
            <br />
          </b>
        </PopupText>
        <br />
        <br />
        <b>
          <u>2) BMI</u>
        </b>
        Height (in cm) <br />
        <NumField name='triageQ9' label='Triage Q9' /> <br />
        Weight (in kg) <br />
        <NumField name='triageQ10' label='Triage Q10' /> <br />
        <h3>
          BMI: <CalcBMI />
        </h3>
        <br />
        <br />
        <h3>
          <u>3) Waist Circumference</u> (taken only if cannot measure BMI e.g. wheelchair,
          prosthetic legs)
        </h3>
        Waist Circumference (in cm) <br />
        <NumField name='triageQ14' label='Triage Q14' /> <br />
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

TriageForm.contextType = FormContext

// Note the capitalisation
export default function Triageform(props) {
  const navigate = useNavigate()

  return <TriageForm {...props} navigate={navigate} />
}
