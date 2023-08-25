import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField, LongTextField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import PopupText from '../utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

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
        <h2>PARTICIPANT IDENTIFICATION</h2>
        <h3 style={{ color: 'red' }}>
          Please verify participant&apos;s identity using his/her
          <br />
          A. APP ID on wristband AND
          <br />
          B. INITIALS{' '}
        </h3>
        <br />
        <br />
        <b>Booth number and History-taker&apos;s Surname followed by Initials</b>
        <LongTextField name='hxHcsrQ1' label='Hx HCSR Q1' />
        <p style={{ color: 'red' }}>
          **On Page 2 of Form A, under Doctor&apos;s Consultation (Hx-taking column, 1st row),
          please write down booth number and history taker&apos;s name. **
        </p>
        <p>(Eg. Booth 18 David Choo Ah Beng = 18 David Choo A B)</p>
        <br />
        <br />
        <h2>HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW</h2>
        <b>TAKE 1ST BP READING NOW & RECORD ON FORM A.</b> Ensure participant is comfortable at rest
        before measuring their BP.{' '}
        <u>They should not have taken caffeine or smoked in the past 30 minutes either.</u>
        <p style={{ color: 'red' }}>
          <b>
            • IF SYSTOLIC ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg, please take a second reading and ask
            for symptoms of malignant hypertension (severe headache, giddiness, numbness in
            extremities,blurred vision etc.)
          </b>
        </p>
        <br />
        <br />
        <h2>1. HEALTH CONCERNS</h2>
        <p>
          If the participant has any <b>presenting complaints or concern(s)</b>, please take a{' '}
          <b>
            brief history. (Please write NIL if otherwise).
            <br />
            &quot;Do you have any health issues that you are currently concerned about?&quot;
          </b>{' '}
          &quot;最近有没有哪里不舒服&quot;{' '}
        </p>
        <br />
        <LongTextField name='hxHcsrQ2' label='Hx HCSR Q2' />
        <p>
          <span style={{ color: 'red' }}>
            <b>
              <u>
                Please advise that there will be no diagnosis or prescription made at our screening.
              </u>
            </b>
          </span>{' '}
          Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting
          treatment for their problems.
        </p>
        <br />
        <p>
          Please tick to highlight if you feel <b>HEALTH CONCERNS</b> require closer scrutiny by
          doctors later or if <b>participant strongly insists.</b>
        </p>
        <br />
        <br />
        <RadioField name='hxHcsrQ11' label='Hx HCSR Q11' />
        <PopupText qnNo='hxHcsrQ11' triggerValue='Yes'>
          <br />
          <p>
            <b>REFER TO DR CONSULT</b> under Form A if{' '}
            <b>
              worrying problems / participant strongly insists or if you feel &apos;Health
              Concerns&apos; requires closer scrutiny by doctors later.{' '}
            </b>{' '}
          </p>
          <br />
          Indicate for Doctor&apos;s Consultation station under: <br />
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A<br />
          2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
          Recommendation
          <br />
          3) Please write relevant medical/social history of participant under history taking box
        </PopupText>
        <br />
        <br /> <br />
        <h2>2. SYSTEMS REVIEW</h2>
        <b>Below is a non-exhaustive list of possible red flags:</b>
        - Constitutional Symptoms: LOA, LOW, Fever
        <br />- CVS: Chest pain, Palpitations
        <br />- Respi: SOB, Haemoptysis, Night Sweat, Cough
        <br />- GI: change in BO habits, PR bleed, Haematemesis
        <br /> - Frequent falls
        <br />
        <br />
        <p>
          <b>
            Based on{' '}
            <span style={{ color: 'red' }}>
              <u>participants&apos;s health concerns,</u>
            </span>
          </b>{' '}
          please rule out red flags <b>(Please write NIL if otherwise)</b>
        </p>
        <LongTextField name='hxHcsrQ3' label='Hx HCSR Q3' />
        <br />
        <br />
        <p>
          Please tick to highlight if you feel <b>SYSTEMS REVIEW</b> require closer scrutiny by
          doctors later or if <b>participant strongly insists.</b>
        </p>
        <RadioField name='hxHcsrQ12' label='Hx HCSR Q12' />
        <PopupText qnNo='hxHcsrQ12' triggerValue='Yes'>
          <p>
            <b>REFER TO DR CONSULT</b> under Form A if{' '}
            <b>
              worrying problems / participant strongly insists or if you feel &apos;Systems
              Review&apos; requires closer scrutiny by doctors later.
            </b>
          </p>
          <br />
          Indicate for Doctor&apos;s Consultation station under: <br />
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
          2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
          Recommendation Reasons for recommendation
          <br />
          3) Please write relevant medical/social history of participant under history taking box
          <br />
          <br />
        </PopupText>
        <br />
        2a. Do you have any problems passing urine or motion? Please specify if yes.
        <RadioField name='hxHcsrQ4' label='Hx HCSR Q4' />
        Please specify:
        <LongTextField name='hxHcsrQ5' label='Hx HCSR Q5' />
        <PopupText qnNo='hxHcsrQ4' triggerValue='Yes, (Please specify):'>
          <br />
          <b>
            REFER TO <span style={{ color: 'red' }}>DR CONSULT</span> and{' '}
            <span style={{ color: 'red' }}>EXHIBITION SFCS</span> booth under Form A
          </b>
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
          2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
          Recommendation <br />
          3) Please write relevant medical/social history of participant under history taking box{' '}
          <br /> 4) Page 2 of Form A, under Exhibition - Recommendation, tick renal health, write down SFCS booth
          <br />
          <br />
        </PopupText>
        <br />
        2b. Do you have any vision problems? Please specify if yes. Exclude complaints like
        unspecific itchy eyes etc
        <br />
        <RadioField name='hxHcsrQ6' label='Hx HCSR Q6' />
        Please specify:
        <LongTextField name='hxHcsrQ7' label='Hx HCSR Q7' />
        <br />
        <PopupText qnNo='hxHcsrQ6' triggerValue='Yes, (Please specify):'>
          <b>
            REFER TO <span style={{ color: 'red' }}>DR CONSULT</span> if have vision problems for
            40-59. For 60 and above, indicate for Geriatrics Indicate on:
          </b>
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A
          <br />
          2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
          Recommendation
        </PopupText>
        <br />
        <br />
        <br />
        2c. Do you have any hearing problems? Please specify if yes. <br />
        <RadioField name='hxHcsrQ8' label='Hx HCSR Q8' />
        Please specify:
        <LongTextField name='hxHcsrQ9' label='Hx HCSR Q9' />
        <br />
        <PopupText qnNo='hxHcsrQ8' triggerValue='Yes, (Please specify):'>
          <b>
            REFER TO <span style={{ color: 'red' }}>DR CONSULT</span> if have hearing problem for{' '}
            <span style={{ color: 'red' }}>40-59</span>. For 60 and above, indicate for Geriatrics -
            Geriatrics Functional Screening includes audiometry screening.
          </b>
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
          2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
          Recommendation
          <br />
          3) Please write relevant medical/social history of participant under history taking box
          <br />
          <br />
        </PopupText>
        <br />
        2d. For geriatric participants, has the senior seen an ENT specialist before?
        <RadioField name='hxHcsrQ13' label='Hx HCSR Q13' />
        Please specify:
        <LongTextField name='hxHcsrQ14' label='Hx HCSR Q14' />
        <br />
        2e. For geriatric participants, did he/she answer yes to any of the following questions?
        <br />
        a. Have you had your hearing aids for more than 5 years?
        <br />
        b. Has it been 3 years or more since you used your hearing aids (i.e. did not use the
        hearing aids for more than 3 years)?
        <br />
        c. Are your hearing aids spoilt/not working?
        <RadioField name='hxHcsrQ15' label='Hx HCSR Q15' />
        Please specify:
        <LongTextField name='hxHcsrQ16' label='Hx HCSR Q16' />
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

HxHcsrForm.contextType = FormContext

export default HxHcsrForm
