import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField } from 'uniforms-material'
import { RadioField, NumField } from 'uniforms-material'
import { submitForm, calculateSppbScore } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { useField } from 'uniforms'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriSppbQ1: {
    type: Number,
    optional: true,
  },
  geriSppbQ13: {
    type: Number,
    optional: true,
  },
  geriSppbQ2: {
    type: String,
    allowedValues: [
      '0       (If not able to complete 5 chair stands)',
      '1       (> 16.7s )',
      '2       (16.6 – 13.7s )',
      '3       (13.6 – 11.2s )',
      '4       (< 11.1s )',
    ],
    optional: false,
  },
  geriSppbQ3: {
    type: Number,
    optional: true,
  },
  geriSppbQ4: {
    type: Number,
    optional: true,
  },
  geriSppbQ5: {
    type: Number,
    optional: true,
  },
  geriSppbQ6: {
    type: String,
    allowedValues: [
      '0        (Side by side < 10s or unable)',
      '1       (Side by side 10s AND < 10s semi tandem)',
      '2       (Semi tandem 10s AND tandem < 3s)',
      '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
      '4       (Tandem >= 10s)',
      'Refused to do',
    ],
    optional: false,
  },
  geriSppbQ7: {
    type: Number,
    optional: true,
  },
  geriSppbQ8: {
    type: String,
    allowedValues: [
      '0       (Could not do)',
      '1       (> 6.52s )',
      '2       (4.66 – 6.52s )',
      '3       (3.62 – 4.65s )',
      '4       (< 3.62s )',
    ],
    optional: false,
    // There is no Q9???
    // }, geriSppbQ9: {
    //   type: String, optional: false
  },
  geriSppbQ10: {
    type: String,
    allowedValues: ['High Fall Risk (0-3)', 'Moderate Fall Risk (4-9)', 'Low Fall Risk (10-12)'],
    optional: false,
  },
  geriSppbQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriSppbQ12: {
    type: String,
    optional: true,
  },
})

function GetSppbScore() {
  const [{ value: q2 }] = useField('geriSppbQ2', {})
  const [{ value: q6 }] = useField('geriSppbQ6', {})
  const [{ value: q8 }] = useField('geriSppbQ8', {})
  return calculateSppbScore(q2, q6, q8)
}

const formName = 'geriSppbForm'
const GeriSppbForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const formOptions = {
    geriSppbQ2: [
      {
        label: '0       (If not able to complete 5 chair stands)',
        value: '0       (If not able to complete 5 chair stands)',
      },
      { label: '1       (> 16.7s )', value: '1       (> 16.7s )' },
      { label: '2       (16.6 – 13.7s )', value: '2       (16.6 – 13.7s )' },
      { label: '3       (13.6 – 11.2s )', value: '3       (13.6 – 11.2s )' },
      { label: '4       (< 11.1s )', value: '4       (< 11.1s )' },
    ],
    geriSppbQ6: [
      {
        label: '0        (Side by side < 10s or unable)',
        value: '0        (Side by side < 10s or unable)',
      },
      {
        label: '1       (Side by side 10s AND < 10s semi tandem)',
        value: '1       (Side by side 10s AND < 10s semi tandem)',
      },
      {
        label: '2       (Semi tandem 10s AND tandem < 3s)',
        value: '2       (Semi tandem 10s AND tandem < 3s)',
      },
      {
        label: '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
        value: '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
      },
      { label: '4       (Tandem >= 10s)', value: '4       (Tandem >= 10s)' },
      { label: 'Refused to do', value: 'Refused to do' },
    ],
    geriSppbQ8: [
      {
        label: '0       (Could not do)',
        value: '0       (Could not do)',
      },
      { label: '1       (> 6.52s )', value: '1       (> 6.52s )' },
      { label: '2       (4.66 – 6.52s )', value: '2       (4.66 – 6.52s )' },
      { label: '3       (3.62 – 4.65s )', value: '3       (3.62 – 4.65s )' },
      { label: '4       (< 3.62s )', value: '4       (< 3.62s )' },
    ],
    geriSppbQ10: [
      {
        label: 'High Fall Risk (0-3)',
        value: 'High Fall Risk (0-3)',
      },
      { label: 'Moderate Fall Risk (4-9)', value: 'Moderate Fall Risk (4-9)' },
      { label: 'Low Fall Risk (10-12)', value: 'Low Fall Risk (10-12)' },
    ],
    geriSppbQ11: [
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
        <h1>SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)</h1>
        <h3>1) REPEATED CHAIR STANDS</h3>
        <h4>Time taken in seconds (only if 5 chair stands were completed):</h4>
        <NumField name='geriSppbQ1' label='Geri - SPPB Q1' />
        <h4>Number of chairs completed:</h4>
        <NumField name='geriSppbQ13' label='Geri - SPPB Q13' />
        <h4 className='blue'>
          Score for REPEATED CHAIR STANDS (out of 4):
          <RadioField name='geriSppbQ2' label='Geri - SPPB Q2' options={formOptions.geriSppbQ2} />
        </h4>
        <h3>2a) BALANCE Side-by-side Stand Time held for in seconds:</h3>
        <NumField name='geriSppbQ3' label='Geri - SPPB Q3' />
        <h3>2b) BALANCE Semi-tandem Stand</h3>
        <h4>Time held for in seconds:</h4>
        <NumField name='geriSppbQ4' label='Geri - SPPB Q4' />
        <h3>2c) BALANCE Tandem Stand</h3>
        <h4>Time held for in seconds:</h4>
        <NumField name='geriSppbQ5' label='Geri - SPPB Q5' />
        <h4 className='blue'>
          Score for BALANCE (out of 4):
          <RadioField name='geriSppbQ6' label='Geri - SPPB Q6' options={formOptions.geriSppbQ6} />
        </h4>
        <h3>3) 3m WALK </h3>
        <h4>Time taken in seconds:</h4>
        <NumField name='geriSppbQ7' label='Geri - SPPB Q7' />
        <h4 className='blue'>
          Score for 3m WALK (out of 4):
          <RadioField name='geriSppbQ8' label='Geri - SPPB Q8' options={formOptions.geriSppbQ8} />
        </h4>
        <h3 className='blue'>
          Total score (Max Score: 12):
          <GetSppbScore />
        </h3>
        <h3>Fall Risk Level:</h3>
        <RadioField name='geriSppbQ10' label='Geri - SPPB Q10' options={formOptions.geriSppbQ10} />
        <h3 className='red'>Referral to Physiotherapist and Occupational Therapist Consult</h3>
        <RadioField name='geriSppbQ11' label='Geri - SPPB Q11' options={formOptions.geriSppbQ11} />
        <h3>Notes:</h3>
        <LongTextField name='geriSppbQ12' label='Geri - SPPB Q12' />
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

GeriSppbForm.contextType = FormContext

export default function GeriSppbform(props) {
  return <GeriSppbForm {...props} />
}
