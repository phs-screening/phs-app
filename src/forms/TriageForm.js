import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { NumField, RadioField } from 'uniforms-mui'
import { useField } from 'uniforms'
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

let calSyst
let calDias

const sys1 = 1
const sys2 = 2

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
    optional: true,
  },
  triageQ8: {
    type: Number,
    optional: true,
  },
  triageQ9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  triageQ10: {
    type: Number,
    optional: false,
  },
  triageQ11: {
    type: Number,
    optional: false,
  },
  triageQ12: {
    type: Number,
    optional: true,
  },
  triageQ13: {
    type: Number,
    optional: false,
  }
})

function CalcBMI() {
  const [{ value: height_cm }] = useField('triageQ10', {})
  const [{ value: weight }] = useField('triageQ11', {})
  if (height_cm && weight) {
    return formatBmi(height_cm, weight)
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

function compareNumbers(a, b) {
  return a - b;
}

function CalcAvg(props) {
  const [{ value: sys1 }] = useField(props.reading1, {})
  const [{ value: sys2 }] = useField(props.reading2, {})
  const [{ value: sys3 }] = useField(props.reading3, {})
  let name = props.label

  let ans

  if (sys3 == null) {
    ans = Math.round((sys1+sys2)/2)
    if (name == 1) {
      calSyst = ans
    } else {
      calDias = ans
    }
    return ans
  } else {
    let diff1 = Math.abs(sys1-sys2)
    let diff2 = Math.abs(sys1-sys3)
    let diff3 = Math.abs(sys3-sys2)

    const diffArray = [diff1, diff2, diff3]

    diffArray.sort(compareNumbers);

    if (diffArray[0] == diff1) {
      ans = Math.round((sys1+sys2)/2)
      if (name == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    } else if (diffArray[0] == diff2) {
      ans = Math.round((sys1+sys3)/2)
      if (name == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    } else {
      ans = Math.round((sys2+sys3)/2)
      if (name == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    }
    return ans
  }
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

  const formOptions = {
    triageQ9: [
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
        model.triageQ7 = calSyst
        model.triageQ8 = calDias
        model.triageQ12 = parseFloat(formatBmi(model.triageQ10, model.triageQ11).props.children)
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
        <h1>Triage</h1>
        <h2>VITALS</h2>
        <h4>
          Please fill in the participant&apos;s BP and BMI based on what you earlier recorded on
          Form A and copy to <font color='red'>NUHS form too.</font>
        </h4>
        <h2>1) BLOOD PRESSURE</h2>
        <p>
          (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last 30
          minutes.)
        </p>
        <h3>1st Reading Systolic (units in mmHg)</h3>
        <NumField name='triageQ1' label='Triage Q1' />
        <h3>1st Reading Diastolic (units in mmHg)</h3>
        <NumField name='triageQ2' label='Triage Q2' />
        <IsHighBP systolic_qn='triageQ1' diastolic_qn='triageQ2' />
        <h3>2nd Reading Systolic (units in mmHg)</h3>
        <NumField name='triageQ3' label='Triage Q3' />
        <h3>2nd Reading Diastolic (units in mmHg)</h3>
        <NumField name='triageQ4' label='Triage Q4' />
        <IsHighBP systolic_qn='triageQ3' diastolic_qn='triageQ4' />
        <h4>
          3rd Reading Systolic (ONLY if 1st and 2nd systolic reading differ by <b>&gt;5mmHg</b>)
        </h4>
        <NumField name='triageQ5' label='Triage Q5' />
        <h4>3rd Reading Diastolic (ONLY if 1st and 2nd systolic reading differ by &gt;5mmHg)</h4>
        <NumField name='triageQ6' label='Triage Q6' />
        <IsHighBP systolic_qn='triageQ5' diastolic_qn='triageQ6' />

        <h3>Average Reading Systolic (average of closest 2 readings):</h3>
        <RadioField name='triageQ7'/>
        <h3>
          Calculated Average:
          <CalcAvg label={sys1} reading1='triageQ1' reading2='triageQ3' reading3='triageQ5'/>
        </h3>
        <br />
        <h3>Average Reading Diastolic (average of closest 2 readings):</h3>
        <RadioField name='triageQ8'/>
        <h3>
          Calculated Average:
          <CalcAvg label={sys2} reading1='triageQ2' reading2='triageQ4' reading3='triageQ6'/>
        </h3>
        <br />
        <h3>Hypertension criteria:</h3>
        <ul>
          <li>Younger participants: &gt; 140/90</li>
          <li>
            Participants &gt; 80 years old: &gt; 150/90
            <ul>
              <li>CKD w proteinuria (mod to severe albuminuria): &gt; 130/80</li>
            </ul>
          </li>
          <li>DM: &gt; 130/80</li>
        </ul>
        <p>
          Please tick to highlight if you feel <b>BLOOD PRESSURE</b> require closer scrutiny by
          doctors later.
        </p>
        <RadioField name='triageQ9' label='Triage Q9' options={formOptions.triageQ9} />
        <PopupText qnNo='triageQ9' triggerValue='Yes'>
          <b>
            <h4 className='underlined'>REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)</h4>
            <ol>
              <li>Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A</li>
              <li>
                Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
                Recommendation
              </li>
            </ol>
            <div className='red'>
              <h4 className='underlined'>HYPERTENSIVE EMERGENCY</h4>
              <ul>
                <li>
                  SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND
                  <mark>
                    <u> SYMPTOMATIC</u>
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
                  SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC <mark>≥ 110 mmHg</mark> AND
                  <mark>
                    <u> ASYMPTOMATIC</u>
                  </mark>{' '}
                  (make sure pt has rested and 2nd reading was taken)
                  <ul>
                    <li>ESCORT TO DC DIRECTLY!</li>
                  </ul>
                </li>
              </ul>
              <li className='left-margin'>
                Follow the patient, continue clerking the patient afterward if doctor acknowledges
                patient is well enough to continue the screening
              </li>
            </div>
            <h4 className='underlined'>RISK OF HYPERTENSIVE CRISIS</h4>
            <ul>
              <li>
                IF SYSTOLIC between <mark>160 - 180 mmHg:</mark>
              </li>
              <ul>
                <li>
                  IF <mark>ASYMPTOMATIC</mark>, continue clerking.
                </li>
                <li>
                  IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!
                </li>
              </ul>
              <li>
                IF SYSTOLIC between <mark>140 - 160 mmHg:</mark>
                <ul>
                  <li>
                    Ask for:
                    <ul>
                      <li>
                        Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN
                        diagnosis)
                      </li>
                      <li>
                        If diagnosed before, ask about compliance and whether he/she goes for
                        regular follow up? If non-compliant or not on regular follow-up, refer to DC
                        (chronic HTN, uncontrolled).
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <br />
          </b>
        </PopupText>
        <h2>2) BMI</h2>
        <h3>Height (in cm)</h3>
        <NumField name='triageQ10' label='Triage Q10' /> <br />
        <h3>Weight (in kg)</h3>
        <NumField name='triageQ11' label='Triage Q11' /> <br />
        <h3>
          BMI: <CalcBMI />
        </h3>
        <h2>3) Waist Circumference (all participants)</h2>
        <h3>Waist Circumference (in cm)</h3>
        <NumField name='triageQ13' label='Triage Q13' /> <br />
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

TriageForm.contextType = FormContext

// Note the capitalisation
export default TriageForm
