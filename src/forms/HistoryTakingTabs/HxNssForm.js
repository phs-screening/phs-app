import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { SelectField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

// Formerly NSS, renamed to PMHX as of PHS 2022. Forms not renamed, only tabe name
const schema = new SimpleSchema({
  PMHX1: {
    type: String,
    optional: false,
  },
  PMHX2: {
    type: String,
    optional: false,
  },/* 
  PMHX3: {
    type: Array,
    optional: false,
  },
  'PMHX3.$': {
    type: String,
    allowedValues: [
      'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
    ],
  },
  PMHX4: {
    type: Array,
    optional: false,
  },
  'PMHX4.$': {
    type: String,
    allowedValues: [
      'Cervical Cancer 子宫颈癌',
      'Breast Cancer 乳癌',
      'Colorectal Cancer 大肠癌',
      'Others',
      'No, I have never been told I have any of these conditions before',
    ],
  },
  PMHXShortAns4: {
    type: String,
    optional: true,
  }, */
  PMHX5: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  PMHXShortAns5: {
    type: String,
    optional: true,
  },
  PMHX6: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  PMHXShortAns6: {
    type: String,
    optional: true,
  },
  PMHX7: {
    type: Array,
    optional: false,
  },
  'PMHX7.$': {
    type: String,
    allowedValues: [
      'Kidney Disease',
      'Hypertension',
      'Hyperlipidemia',
      'Diabetes',
      'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)',
    ],
  },
  PMHX8: {
    type: String,
    optional: false,
  },
  PMHX9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHX10: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHX11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHX12: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHXShortAns12: {
    type: String,
    optional: true,
  },
  PMHX13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHX14: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHXShortAns14: {
    type: String,
    optional: true,
  },
  PMHX15: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PMHXShortAns15: {
    type: String,
    optional: true,
  },
  PMHX16: {
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
    /* PMHX3: [
      {
        label:
          'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
        value:
          'Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)',
      },
    ],
    PMHX4: [
      { label: 'Cervical Cancer 子宫颈癌', value: 'Cervical Cancer 子宫颈癌' },
      { label: 'Breast Cancer 乳癌', value: 'Breast Cancer 乳癌' },
      { label: 'Colorectal Cancer 大肠癌', value: 'Colorectal Cancer 大肠癌' },
      { label: 'Others', value: 'Others' },
      {
        label: 'No, I have never been told I have any of these conditions before',
        value: 'No, I have never been told I have any of these conditions before',
      },
    ], */
    PMHX5: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX6: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX7: [
      {
        label: 'Kidney Disease',
        value: 'Kidney Disease',
      },
      { label: 'Hypertension', value: 'Hypertension' },
      { label: 'Hyperlipidemia', value: 'Hyperlipidemia' },
      { label: 'Diabetes', value: 'Diabetes' },
      {
        label:
          'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)',
        value:
          'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)',
      },
    ],
    PMHX9: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX10: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX12: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX13: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX14: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX15: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    PMHX16: [
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
        <h1>PAST MEDICAL HISTORY</h1>
        <h3>Do you have any chronic conditions? Take a short chronic history summarizing:</h3>
        <h4>
          <ol>
            <li>Conditions</li>
            <li>Duration</li>
            <li>Control</li>
            <li>Compliance</li>
            <li>Complications</li>
            <li>Follow up route (specify whether GP/Polyclinic/FMC/SOC)</li>
          </ol>
        </h4>
        <LongTextField name='PMHX1' label='PMHX1' />
        <h4 className='red'>If participant is not engaged with any follow-up, ask: </h4>
        <p>
          &quot;what is the reason that you&apos;re not following up with your doctor for your
          existing conditions?&quot;
          <br />
          e.g. do not see the purpose for tests, busy/no time, lack of access
          <br />
          e.g. mobility issues, financial issues, fear of doctors/clinics/hospitals etc
        </p>
        <h3>Are you on any long term medications? Are you compliant to your medications?</h3>
        <LongTextField name='PMHX2' label='PMHX2' />
        <h4 className='red'>
          If a participant is not compliant to medications, do probe further on his/her reasons for
          not consuming medications as prescribed.
        </h4>
        <p>
          e.g. Medication not effective? CAn be managed without medication? Forget to take? Lost/Ran
          out of medication?
        </p>
        <h3>
          Has a doctor ever told you that you have the following conditions? Please select all that
          apply.
        </h3>
        {/* <SelectField
          appearance='checkbox'
          checkboxes
          name='PMHX3'
          label='PMHX3'
          options={formOptions.PMHX3}
        />
        <h3>
          Has a doctor ever told you that you have the following conditions? Do be sensitive when
          asking for personal history of cancer. (Please select all that apply and specify age of
          diagnosis)
        </h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='PMHX4'
          label='PMHX4'
          options={formOptions.PMHX3}
        />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns4' label='PMHX4' /> */}
        <h3>Do you have any drug allergies? If yes, please specify.</h3>
        <RadioField name='PMHX5' label='PMHX5' options={formOptions.PMHX5} />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns5' label='PMHX5' />
        <h3>
          Are you on any alernative medicine including traditional chinese medications, homepathy
          etc?
        </h3>
        <RadioField name='PMHX6' label='PMHX6' options={formOptions.PMHX6} />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns6' label='PMHX6' />
        <h3>Tick if you have these conditions:</h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='PMHX7'
          label='PMHX7'
          options={formOptions.PMHX7}
        />
        <h3>
          If a participant does not elicit any Past Medical History, ask if they regularly go for
          screening/blood tests etc. If no, ask why.
        </h3>
        <LongTextField name='PMHX8' label='PMHX8' />
        <h3>Have you had a kidney screening in the past 1 year?</h3>
        <RadioField name='PMHX9' label='PMHX9' options={formOptions.PMHX9} />
        <h3>Have you done a FIT test in the last 1 year?</h3>
        <RadioField name='PMHX10' label='PMHX10' options={formOptions.PMHX10} />
        <h3>
          Have you done a colonoscopy in the last 10 years or otherwise advised by your doctor?
        </h3>
        <RadioField name='PMHX11' label='PMHX11' options={formOptions.PMHX11} />
        <h3>
          Please tick to highlight if you feel Past Medical History requires closer scrutiny by
          doctors later. Explains reasons for recommendation.
        </h3>
        <p>
          <h4>For participant with DM, refer to DS if:</h4>
          <ul>
            <li>Symptomatic, and non-compliant</li>
            <li>Asymptomatic, and non-compliant</li>
          </ul>
          Also, refer to DS if participant has not been diagnosed with DM, but has signs of DM
          (polyuria, polydipsia, periphery neuropathy, blurring of vision etc)
        </p>
        <RadioField name='PMHX12' label='PMHX12' options={formOptions.PMHX12} />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns12' label='PMHX12' />
        <h3>
          <span className='red'>If you are 60 and above, </span>
          do you currently use hearing aids/have been detected to require hearing aids?
        </h3>
        <RadioField name='PMHX13' label='PMHX13' options={formOptions.PMHX13} />
        <h3>
          <span className='red'>For geriatric participants,</span> has the senior seen an ENT
          specialist before?
        </h3>
        <RadioField name='PMHX14' label='PMHX14' options={formOptions.PMHX14} />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns14' label='PMHX14' />
        <h3>
          <span className='red'>For geriatric participants,</span> did he/she answer yes to any of
          the following questions?
        </h3>
        <ol type='a'>
          <li>Have you had your hearing aids for more than 5 years?</li>
          <li>
            Has it been 3 years or more since you used your hearing aids (i.e. did not use the
            hearing aids for more than 3 years)?
          </li>
          <li>Are your hearing aids spoilt/not working?</li>
        </ol>
        <RadioField name='PMHX15' label='PMHX15' options={formOptions.PMHX15} />
        <h4>Please specify:</h4>
        <LongTextField name='PMHXShortAns15' label='PMHX15' />
        <h3>Have you taken a influenza vaccination in the past 1 year?</h3>
        <RadioField name='PMHX16' label='PMHX16' options={formOptions.PMHX16} />
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

export default HxNssForm
