import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { SelectField, NumField, RadioField, LongTextField, BoolField } from 'uniforms-material'
import { useField } from 'uniforms'
import { submitForm, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  hxCancerQ1: {
    type: Array,
    optional: false,
  },
  'hxCancerQ1.$': {
    type: String,
    allowedValues: [
      'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
      'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis): (Free text)',
      'Breast Cancer 乳癌, (Please specify age of diagnosis): (Free text)',
      'Colorectal Cancer 大肠癌, (Please specify age of diagnosis): (Free text)',
      'Others, (Please Specify condition and age of diagnosis): (Free text)',
      'No, I don\t have any of the above',
    ],
  },
  hxCancerQ2: {
    type: Array,
    optional: false,
  },
  'hxCancerQ2.$': {
    type: String,
    allowedValues: [
      'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis):',
      'Breast Cancer 乳癌, (Please specify age of diagnosis):',
      'Colorectal Cancer 大肠癌, (Please specify age of diagnosis):',
      'Others, (Please Specify condition and age of diagnosis):',
      'No',
    ],
  },
  hxCancerQ3: {
    type: String,
    optional: true,
  },
  hxCancerQ4: {
    type: String,
    optional: false,
  },
  hxCancerQ5: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: true,
  },
  hxCancerQ6: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: true,
  },
  hxCancerQ7: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: true,
  },
  hxCancerQ8: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: true,
  },
  hxCancerQ25: {
    type: Array,
    optional: false,
  },
  'hxCancerQ25.$': {
    type: String,
    allowedValues: [
      'FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)',
      'WCE (40 and above, females only)',
      'Geriatrics (60 and above)',
      "Doctor's Consultation - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)",
      "Dietitian's Consultation - As recommended by hx taker, underweight or obese BMI",
      'Social Service - As recommended by hx-taker (CHAS Application, Financial Support required)',
      'Oral Health Education - Refer to eligibility criteria for Oral Health',
      'Exhibition - recommended as per necessary',
      'Refer to SACS if patient sounds depressed'
    ],
  },
  hxCancerQ26: {
    type: String,
    optional: true,
  },
})

const formName = 'hxCancerForm'
const HxCancerForm = () => {
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
        <h2>HISTORY TAKING PART 5: CANCER SCREENING</h2>
        <br />
        <h2>HISTORY OF CANCER & FAMILY HISTORY</h2>
        <b>
          <font color='blue'>
            1. Has a doctor ever told you that you have the following conditions?
          </font>{' '}
          Do be sensitive when asking for personal history of cancer. (please select all that apply)
        </b>
        <SelectField name='hxCancerQ1' checkboxes='true' label='Hx Cancer Q1' />
        <br />
        Please specify:
        <LongTextField name='hxCancerQ26' label='Hx Cancer Q26' />
        <br />
        <br />
        <b>
          <font color='blue'>
            2. Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following
            cancers?
          </font>
        </b>
        <SelectField name='hxCancerQ2' checkboxes='true' label='Hx Cancer Q2' />
        <br />
        Please specify:
        <LongTextField name='hxCancerQ3' label='Hx Cancer Q3' />
        <br />
        <br />
        <b>
          <font color='blue'>3. Any other significant family history?</font>
        </b>{' '}
        Indicate &apos;NIL&apos; if none.
        <LongTextField name='hxCancerQ4' label='Hx Cancer Q4' />
        <br />
        <br />
        <b>
          Counsel for screening if positive family history of cancer or chronic disease. <br />
          <br />
          Based on participant family hx, please recommend FIT/WCE and Doctor&apos;s Consultation
          (if applicable)
        </b>{' '}
        <br />
        1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
        2) Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for Recommendation{' '}
        <br />
        3) Recommend relevant exhibition booths on Page 2 of Form A Exhibition - Recommendation
        <br />
        <br />
        <br />
        <font color='red'>
          <b>1. For respondent aged 50 and above only,</b>
        </font>{' '}
        unless positive family history for colorectal cancer.
        <br />
        When was the last time you had a blood stool test? (A blood stool test is a test to
        determine whether the stool contains blood.)
        <RadioField name='hxCancerQ5' label='Hx Cancer Q5' />
        <br />
        <br />
        <font color='red'>
          <b>2. For respondent aged 50 and above only,</b>
        </font>{' '}
        unless positive family history for colorectal cancer.
        <br />
        When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a
        tube is inserted in the rectum to view the colon for signs of cancer or other health
        problems.)
        <RadioField name='hxCancerQ6' label='Hx Cancer Q6' />
        <br />
        <font color='red'>
          <b>
            Please encourage participants to go for FIT every year if participant is above 50,
            asymptomatic and no positive family history of colorectal cancer in first degree
            relatives and does not have any bleeding disorders. <br />
            If deemed to be in high risk (positive family history of colorectal cancer in first
            degree relatives, counsel for colonoscopy every 3 years), refer to risk categorization
            given.
          </b>
        </font>
        <br />
        <br />
        <br />
        <br />
        <font color='red'>
          <b>
            3. For <u>female</u> respondent aged 40 and above only.
          </b>
        </font>
        <br />
        When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast
        to look for breast cancer.)
        <RadioField name='hxCancerQ7' label='Hx Cancer Q7' />
        <br />
        <br />
        <font color='red'>
          <b>
            4. For <u>female</u> respondent aged 25 and above, who have/had a husband/boyfriend and
            not had their womb completely surgically removed only.
          </b>
        </font>
        <br />
        When was the last time you had a PAP smear test? (A PAP smear test is a simple test
        involving the scrapping of cells fom the mouth of the womb, to check for changes in the
        cells of your cervix, which may develop into cancer later.)
        <RadioField name='hxCancerQ8' label='Hx Cancer Q8' />
        <br />
        <b>
          <font color='red'>
            For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and
            above and if interested, refer to WCE.
            <br />
            Please encourage participants to go for HPV test every 5 years. <br />
            Refer to WCE:{' '}
          </font>
          <br />
          1) Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A
        </b>
        <br />
        <br />
        <h2>HISTORY TAKING PART 5: REFERRALS/MEGA SORTING STATION </h2>
        1. REFERRALS
        <br />
        Please reference page 1 of form A for various criteria.
        <SelectField name='hxCancerQ25' checkboxes='true' label='Hx Cancer Q25' />
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

HxCancerForm.contextType = FormContext

export default function HxCancerform(props) {
  const navigate = useNavigate()

  return <HxCancerForm {...props} navigate={navigate} />
}
