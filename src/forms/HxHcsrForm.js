import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { BoolField, RadioField, LongTextField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import PopupText from '../utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import './forms.css'

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
    optional: false,
  },
  hxHcsrQ4: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'No'],
    optional: false,
  },
  hxHcsrQ5: {
    type: String,
    optional: true,
  },
  hxHcsrQ6: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'No'],
    optional: false,
  },
  hxHcsrQ7: {
    type: String,
    optional: true,
  },
  hxHcsrQ8: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'No'],
    optional: false,
  },
  hxHcsrQ9: {
    type: String,
    optional: true,
  },
  hxHcsrQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrQ12: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrQ13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  hxHcsrQ14: {
    type: String,
    optional: true,
  },
  hxHcsrQ15: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  hxHcsrQ16: {
    type: String,
    optional: true,
  },
  hxHcsrQ17: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxHcsrQ18: {
    type: Boolean,
    label: 'Yes',
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
    hxHcsrQ4: [
      { label: 'Yes, (Please specify):', value: 'Yes, (Please specify):' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ6: [
      { label: 'Yes, (Please specify):', value: 'Yes, (Please specify):' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ8: [
      { label: 'Yes, (Please specify):', value: 'Yes, (Please specify):' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ11: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ12: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ13: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ15: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],

    hxHcsrQ17: [
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
        <h3>TAKE 1ST BP READING NOW & RECORD ON FORM A.</h3>
        <p>
          Ensure participant is comfortable at rest before measuring their BP.
          <u>They should not have taken caffeine or smoked in the past 30 minutes either.</u>
        </p>
        <p className='red'>
          <b>
            • IF SYSTOLIC ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg, please take a second reading and ask
            for symptoms of malignant hypertension (severe headache, giddiness, numbness in
            extremities,blurred vision etc.)
          </b>
        </p>
        <h2>1. HEALTH CONCERNS</h2>
        <h3>Has a doctor ever told you that you are overweight or obese before?</h3>
        <RadioField name='hxHcsrQ17' label='Hx HCSR Q17' options={formOptions.hxHcsrQ17} />
        <h4>
          Please tick to highlight if you feel BMI requires closer scrutiny by doctors and
          dietitians later.
        </h4>
        <BoolField name='hxHcsrQ18' />
        <PopupText qnNo='hxHcsrQ18' triggerValue={true}>
          <p>
            <b>
              REFER TO <span className='red'>DIETICIAN&apos;S CONSULT</span> at:
            </b>
            <p>
              1) <font color='red'>Dietitian&apos;s Consultation station</font>, tick eligibility,
              Circle interested &apos;Y&apos; on Page 1 of Form A
            </p>
            IF BMI IS:
            <br /> &gt; 27.5 as obese, write reasons under dietitian referral on Page 2 of Form A
            Dietitian&apos;s Consultation - Reasons for Recommendation
            <br />
          </p>
        </PopupText>
        <h4>
          If the participant has any <u>presenting complaints or concern(s)</u>, please take a brief
          history. (Please write NIL if otherwise).
        </h4>
        <p>
          &quot;Do you have any health issues that you are currently concerned about?&quot;
          &quot;最近有没有哪里不舒服&quot;
        </p>
        <LongTextField name='hxHcsrQ2' label='Hx HCSR Q2' />
        <p>
          <span className='red'>
            <b>
              <u>
                Please advise that there will be no diagnosis or prescription made at our screening.
              </u>
            </b>
          </span>{' '}
          Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting
          treatment for their problems.
        </p>
        <h3>
          Please tick to highlight if you feel <u>HEALTH CONCERNS</u> require closer scrutiny by
          doctors later or if <u>participant strongly insists.</u>
        </h3>
        <RadioField name='hxHcsrQ11' label='Hx HCSR Q11' options={formOptions.hxHcsrQ11} />
        <PopupText qnNo='hxHcsrQ11' triggerValue='Yes'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span>
            </b>{' '}
            under Form A if
            <b>
              {' '}
              worrying problems / participant strongly insists or if you feel &apos;Health
              Concerns&apos; requires closer scrutiny by doctors later.
            </b>
          </p>
          Indicate for Doctor&apos;s Consultation station under:
          <ol>
            <li>
              Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A<br />
            </li>
            <li>
              Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
              Recommendation
            </li>
            <li>
              Please write relevant medical/social history of participant under history taking box
            </li>
          </ol>
        </PopupText>
        <h2>2. SYSTEMS REVIEW</h2>
        <br />
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
        <h3>
          <b>
            Based on{' '}
            <span style={{ color: 'red' }}>
              <u>participants&apos;s health concerns,</u>
            </span>{' '}
          </b>
          please rule out red flags <b>(Please write NIL if otherwise)</b>
        </h3>
        <LongTextField name='hxHcsrQ3' label='Hx HCSR Q3' />
        <h3>
          Please tick to highlight if you feel <u>SYSTEMS REVIEW</u> require closer scrutiny by
          doctors later or if <u>participant strongly insists.</u>
        </h3>
        <RadioField name='hxHcsrQ12' label='Hx HCSR Q12' options={formOptions.hxHcsrQ12} />
        <PopupText qnNo='hxHcsrQ12' triggerValue='Yes'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span>
            </b>{' '}
            under Form A if
            <b>
              {' '}
              worrying problems / participant strongly insists or if you feel &apos;Systems
              Review&apos; requires closer scrutiny by doctors later.
            </b>
          </p>
          Indicate for Doctor&apos;s Consultation station under: <br />
          <ol>
            <li>
              Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
            </li>
            <li>
              Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
              Recommendation Reasons for recommendation
            </li>
            <li>
              Please write relevant medical/social history of participant under history taking box
            </li>
          </ol>
        </PopupText>
        <h3>2a. Do you have any problems passing urine or motion? Please specify if yes.</h3>
        <RadioField name='hxHcsrQ4' label='Hx HCSR Q4' options={formOptions.hxHcsrQ4} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrQ5' label='Hx HCSR Q5' />
        <PopupText qnNo='hxHcsrQ4' triggerValue='Yes, (Please specify):'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span> and
              <span className='red'> EXHIBITION SFCS </span>booth under Form A
            </b>
            <ol>
              <li>Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A</li>
              <li>
                Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
                Recommendation
              </li>
              <li>
                Please write relevant medical/social history of participant under history taking box
              </li>
              <li>
                Page 2 of Form A, under Exhibition - Recommendation, tick renal health, write down
                SFCS booth
              </li>
            </ol>
          </p>
        </PopupText>
        <h3>
          2b. Do you have any vision problems? Please specify if yes. Exclude complaints like
          unspecific itchy eyes etc
        </h3>
        <RadioField name='hxHcsrQ6' label='Hx HCSR Q6' options={formOptions.hxHcsrQ6} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrQ7' label='Hx HCSR Q7' />
        <PopupText qnNo='hxHcsrQ6' triggerValue='Yes, (Please specify):'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span> if have vision problems for 40-59.
              For 60 and above, indicate for Geriatrics Indicate on:
            </b>
            <ol>
              <li>Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A</li>
              <li>
                Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
                Recommendation
              </li>
            </ol>
          </p>
        </PopupText>
        <h3>2c. Do you have any hearing problems? Please specify if yes.</h3>
        <RadioField name='hxHcsrQ8' label='Hx HCSR Q8' options={formOptions.hxHcsrQ8} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrQ9' label='Hx HCSR Q9' />
        <PopupText qnNo='hxHcsrQ8' triggerValue='Yes, (Please specify):'>
          <p>
            <b>
              REFER TO <span className='red'>DR CONSULT</span> if have hearing problem for
              <span className='red'> 40-59</span>. For 60 and above, indicate for Geriatrics -
              Geriatrics Functional Screening includes audiometry screening.
            </b>
            <ol>
              <li>
                Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
              </li>
              <li>
                Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
                Recommendation
              </li>
              <li>
                Please write relevant medical/social history of participant under history taking box
              </li>
            </ol>
          </p>
        </PopupText>
        <h3>2d. For geriatric participants, has the senior seen an ENT specialist before?</h3>
        <RadioField name='hxHcsrQ13' label='Hx HCSR Q13' options={formOptions.hxHcsrQ13} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrQ14' label='Hx HCSR Q14' />
        <h3>
          2e. For geriatric participants, did he/she answer yes to any of the following questions?
        </h3>
        <ol type='a'>
          <li>Have you had your hearing aids for more than 5 years?</li>
          <li>
            Has it been 3 years or more since you used your hearing aids (i.e. did not use the
            hearing aids for more than 3 years)?
            <li>Are your hearing aids spoilt/not working?</li>
          </li>
        </ol>
        <RadioField name='hxHcsrQ15' label='Hx HCSR Q15' options={formOptions.hxHcsrQ15} />
        <h4>Please specify:</h4>
        <LongTextField name='hxHcsrQ16' label='Hx HCSR Q16' />
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
