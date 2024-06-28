import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { SelectField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
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
      'Refer to SACS if patient sounds depressed',
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

  const formOptions = {
    hxCancerQ1: [
      {
        label:
          'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
        value:
          'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
      },
      {
        label: 'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis): (Free text)',
        value: 'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis): (Free text)',
      },
      {
        label: 'Breast Cancer 乳癌, (Please specify age of diagnosis): (Free text)',
        value: 'Breast Cancer 乳癌, (Please specify age of diagnosis): (Free text)',
      },
      {
        label: 'Colorectal Cancer 大肠癌, (Please specify age of diagnosis): (Free text)',
        value: 'Colorectal Cancer 大肠癌, (Please specify age of diagnosis): (Free text)',
      },
      {
        label: 'Others, (Please Specify condition and age of diagnosis): (Free text)',
        value: 'Others, (Please Specify condition and age of diagnosis): (Free text)',
      },
      { label: "No, I don't have any of the above", value: 'No, I don\t have any of the above' },
    ],
    hxCancerQ2: [
      {
        label: 'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis):',
        value: 'Cervical Cancer 子宫颈癌, (Please specify age of diagnosis):',
      },
      {
        label: 'Breast Cancer 乳癌, (Please specify age of diagnosis):',
        value: 'Breast Cancer 乳癌, (Please specify age of diagnosis):',
      },
      {
        label: 'Colorectal Cancer 大肠癌, (Please specify age of diagnosis):',
        value: 'Colorectal Cancer 大肠癌, (Please specify age of diagnosis):',
      },
      {
        label: 'Others, (Please Specify condition and age of diagnosis):',
        value: 'Others, (Please Specify condition and age of diagnosis):',
      },
      { label: 'No', value: 'No' },
    ],
    hxCancerQ5: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    hxCancerQ6: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    hxCancerQ7: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    hxCancerQ8: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    hxCancerQ25: [
      {
        label:
          'FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)',
        value:
          'FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)',
      },
      {
        label: 'WCE (40 and above, females only)',
        value: 'WCE (40 and above, females only)',
      },
      { label: 'Geriatrics (60 and above)', value: 'Geriatrics (60 and above)' },
      {
        label:
          "Doctor's Consultation - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)",
        value:
          "Doctor's Consultation - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)",
      },
      {
        label: "Dietitian's Consultation - As recommended by hx taker, underweight or obese BMI",
        value: "Dietitian's Consultation - As recommended by hx taker, underweight or obese BMI",
      },
      {
        label:
          'Social Service - As recommended by hx-taker (CHAS Application, Financial Support required)',
        value:
          'Social Service - As recommended by hx-taker (CHAS Application, Financial Support required)',
      },
      {
        label: 'Oral Health Education - Refer to eligibility criteria for Oral Health',
        value: 'Oral Health Education - Refer to eligibility criteria for Oral Health',
      },
      {
        label: 'Exhibition - recommended as per necessary',
        value: 'Exhibition - recommended as per necessary',
      },
      {
        label: 'Refer to SACS if patient sounds depressed',
        value: 'Refer to SACS if patient sounds depressed',
      },
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
        <h1>HISTORY TAKING PART 5: CANCER SCREENING</h1>
        <h2>HISTORY OF CANCER & FAMILY HISTORY</h2>
        <h3 className='blue'>
          1. Has a doctor ever told you that you have the following conditions?
        </h3>
        Do be sensitive when asking for personal history of cancer. (please select all that apply)
        <SelectField
          name='hxCancerQ1'
          checkboxes='true'
          label='Hx Cancer Q1'
          options={formOptions.hxCancerQ1}
        />
        <h4>Please specify:</h4>
        <LongTextField name='hxCancerQ26' label='Hx Cancer Q26' />
        <h3 className='blue'>
          2. Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following
          cancers?
        </h3>
        <SelectField
          name='hxCancerQ2'
          checkboxes='true'
          label='Hx Cancer Q2'
          options={formOptions.hxCancerQ2}
        />
        <h4>Please specify:</h4>
        <LongTextField name='hxCancerQ3' label='Hx Cancer Q3' />
        <h3 className='blue'>3. Any other significant family history?</h3>
        Indicate &apos;NIL&apos; if none.
        <LongTextField name='hxCancerQ4' label='Hx Cancer Q4' />
        <h2>
          Counsel for screening if positive family history of cancer or chronic disease. <br />
        </h2>
        Based on participant family hx, please recommend FIT/WCE and Doctor&apos;s Consultation (if
        applicable)
        <ol>
          <li>
            Tick eligibility, Circle interested &apos;Y&apos; on Page 1 of Form A <br />
          </li>
          <li>
            Write reasons on Page 2 of Form A Doctor&apos;s Consultation - Reasons for
            Recommendation
          </li>
          <li>
            Recommend relevant exhibition booths on Page 2 of Form A Exhibition - Recommendation
          </li>
        </ol>
        <h3>
          <span className='red'>1. For respondent aged 50 and above only, </span>
          unless positive family history for colorectal cancer.
        </h3>
        <h3>When was the last time you had a blood stool test?</h3>
        (A blood stool test is a test to determine whether the stool contains blood.)
        <RadioField name='hxCancerQ5' label='Hx Cancer Q5' options={formOptions.hxCancerQ5} />
        <h3>
          <span className='red'>2. For respondent aged 50 and above only,</span> unless positive
          family history for colorectal cancer.
        </h3>
        <h3>When was the last time you had a colonoscopy?</h3> (A colonoscopy is an examination in
        which a tube is inserted in the rectum to view the colon for signs of cancer or other health
        problems.)
        <RadioField name='hxCancerQ6' label='Hx Cancer Q6' options={formOptions.hxCancerQ6} />
        <h4 className='red'>
          Please encourage participants to go for FIT every year if participant is above 50,
          asymptomatic and no positive family history of colorectal cancer in first degree relatives
          and does not have any bleeding disorders.
          <br />
          If deemed to be in high risk (positive family history of colorectal cancer in first degree
          relatives, counsel for colonoscopy every 3 years), refer to risk categorization given.
        </h4>
        <h3>
          <span className='red'>
            3. For <u>female</u> respondent aged 40 and above only.
          </span>
        </h3>
        <h3>When was the last time you had your last mammogram?</h3>
        (A mammogram is an x-ray of each breast to look for breast cancer.)
        <RadioField name='hxCancerQ7' label='Hx Cancer Q7' options={formOptions.hxCancerQ7} />
        <h3>
          <span className='red'>
            4. For <u>female</u> respondent aged 25 and above, who have/had a husband/boyfriend and
            not had their womb completely surgically removed only.
          </span>
        </h3>
        <h3>When was the last time you had a PAP smear test?</h3>
        (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the
        womb, to check for changes in the cells of your cervix, which may develop into cancer
        later.)
        <RadioField name='hxCancerQ8' label='Hx Cancer Q8' options={formOptions.hxCancerQ8} />
        <h4 className='red'>
          For women:
          <ul>
            <li>40-49, advise yearly mammogram.</li>
            <li>50-69, advise mammogram every 2 years.</li>
            <li>70 and above and if interested, refer to WCE.</li>
          </ul>
          Please encourage participants to go for HPV test every 5 years. <br />
          Refer to WCE:
          <ol>
            <li>Tick eligibility,</li>
            <li>Circle interested &apos;Y&apos; on Page 1 of Form A</li>
          </ol>
        </h4>
        <h1>HISTORY TAKING PART 5: REFERRALS/MEGA SORTING STATION </h1>
        <h2>1. REFERRALS</h2>
        <h3>Please reference page 1 of form A for various criteria.</h3>
        <SelectField
          name='hxCancerQ25'
          checkboxes='true'
          label='Hx Cancer Q25'
          options={formOptions.hxCancerQ25}
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
      {newForm()}
    </Paper>
  )
}

HxCancerForm.contextType = FormContext

export default function HxCancerform(props) {
  const navigate = useNavigate()

  return <HxCancerForm {...props} navigate={navigate} />
}
