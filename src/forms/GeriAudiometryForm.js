import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField, SelectField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@mui/material/Grid'
import { blueText, title, underlined } from '../theme/commonComponents'
import allForms from './forms.json'
import { useNavigate } from 'react-router-dom'

const schema = new SimpleSchema({
  geriAudiometryQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriAudiometryQ2: {
    type: String,
    allowedValues: ['Pass', 'Refer'],
    optional: true,
  },
  geriAudiometryQ3: {
    type: String,
    allowedValues: ['Pass', 'Refer'],
    optional: true,
  },
  geriAudiometryQ4: {
    type: String,
    allowedValues: ['Pass', 'Refer'],
    optional: true,
  },
  geriAudiometryQ5: {
    type: Array,
    optional: true,
  },
  'geriAudiometryQ5.$': {
    type: String,
    allowedValues: ['500Hz', '1000Hz', '2000Hz', '4000Hz'],
  },
  geriAudiometryQ6: {
    type: Array,
    optional: true,
  },
  'geriAudiometryQ6.$': {
    type: String,
    allowedValues: ['500Hz', '1000Hz', '2000Hz', '4000Hz'],
  },
  geriAudiometryQ7: {
    type: Array,
    optional: true,
  },
  'geriAudiometryQ7.$': {
    type: String,
    allowedValues: ['500Hz', '1000Hz', '2000Hz', '4000Hz'],
  },
  geriAudiometryQ8: {
    type: Array,
    optional: true,
  },
  'geriAudiometryQ8.$': {
    type: String,
    allowedValues: ['500Hz', '1000Hz', '2000Hz', '4000Hz'],
  },
  geriAudiometryQ9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriAudiometryQ10: {
    type: String,
    optional: true,
  },
  geriAudiometryQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriAudiometryQ12: {
    type: String,
    optional: true,
  },
  geriAudiometryQ13: {
    type: String,
    allowedValues: [
      'There is some hearing loss detected. This test is not diagnostic, and the patient needs to undergo a more comprehensive hearing assessment.',
      "There is no hearing loss detected, the patient's hearing is normal.",
    ],
    optional: false,
  },
})

const formName = 'geriAudiometryForm'
const GeriAudiometryForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  const [hcsr, setHcsr] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const loadForms = async () => {
      const savedData = getSavedData(patientId, formName)
      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)

      Promise.all([savedData, hcsrData]).then((result) => {
        setSaveData(result[0])
        setHcsr(result[1])
        isLoadingSidePanel(false)
      })
    }
    loadForms()
  }, [])

  const formOptions = {
    geriAudiometryQ1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriAudiometryQ2: [
      {
        label: 'Pass',
        value: 'Pass',
      },
      { label: 'Refer', value: 'Refer' },
    ],
    geriAudiometryQ3: [
      {
        label: 'Pass',
        value: 'Pass',
      },
      { label: 'Refer', value: 'Refer' },
    ],
    geriAudiometryQ4: [
      {
        label: 'Pass',
        value: 'Pass',
      },
      { label: 'Refer', value: 'Refer' },
    ],
    geriAudiometryQ5: [
      {
        label: '500Hz',
        value: '500Hz',
      },
      { label: '1000Hz', value: '1000Hz' },
      { label: '2000Hz', value: '2000Hz' },
      { label: '4000Hz', value: '4000Hz' },
    ],
    geriAudiometryQ6: [
      {
        label: '500Hz',
        value: '500Hz',
      },
      { label: '1000Hz', value: '1000Hz' },
      { label: '2000Hz', value: '2000Hz' },
      { label: '4000Hz', value: '4000Hz' },
    ],
    geriAudiometryQ7: [
      {
        label: '500Hz',
        value: '500Hz',
      },
      { label: '1000Hz', value: '1000Hz' },
      { label: '2000Hz', value: '2000Hz' },
      { label: '4000Hz', value: '4000Hz' },
    ],
    geriAudiometryQ8: [
      {
        label: '500Hz',
        value: '500Hz',
      },
      { label: '1000Hz', value: '1000Hz' },
      { label: '2000Hz', value: '2000Hz' },
      { label: '4000Hz', value: '4000Hz' },
    ],
    geriAudiometryQ9: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriAudiometryQ11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    geriAudiometryQ13: [
      {
        label:
          'There is some hearing loss detected. This test is not diagnostic, and the patient needs to undergo a more comprehensive hearing assessment.',
        value:
          'There is some hearing loss detected. This test is not diagnostic, and the patient needs to undergo a more comprehensive hearing assessment.',
      },
      {
        label: "There is no hearing loss detected, the patient's hearing is normal.",
        value: "There is no hearing loss detected, the patient's hearing is normal.",
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
        <h1>AUDIOMETRY</h1>
        <h3>Did participant visit Audiometry Booth by NUS audiology team?</h3>
        <RadioField
          name='geriAudiometryQ1'
          label='geriAudiometry - Q1'
          options={formOptions.geriAudiometryQ1}
        />
        <h2>External Ear Examination</h2>
        <h3>Visual Ear Examination (Left Ear):</h3>
        <RadioField
          name='geriAudiometryQ2'
          label='geriAudiometry - Q2'
          options={formOptions.geriAudiometryQ2}
        />
        <h3>Visual Ear Examination (Right Ear)</h3>
        <RadioField
          name='geriAudiometryQ3'
          label='geriAudiometry - Q3'
          options={formOptions.geriAudiometryQ3}
        />
        <h2>Hearing Test</h2>
        <h3>Practice Tone (500Hz at 60dB in “better” ear):</h3>
        <RadioField
          name='geriAudiometryQ4'
          label='geriAudiometry - Q4'
          options={formOptions.geriAudiometryQ4}
        />
        <h3>Pure Tone Screening at 25dB for Left Ear: </h3>
        <p>(Tick checkbox for Response, DO NOT tick checkbox if NO response):</p>
        <SelectField
          name='geriAudiometryQ5'
          checkboxes='true'
          label='geriAudiometry - Q5'
          options={formOptions.geriAudiometryQ5}
        />
        <h3>Pure Tone Screening at 25dB for Right Ear:</h3>
        <p>(Tick checkbox for Response, DO NOT tick checkbox if NO response):</p>
        <SelectField
          name='geriAudiometryQ6'
          checkboxes='true'
          label='geriAudiometry - Q6'
          options={formOptions.geriAudiometryQ6}
        />
        <h3>Pure Tone Screening at 40dB for Left Ear:</h3>
        <p>(Tick checkbox for Response, DO NOT tick checkbox if NO response):</p>
        <SelectField
          name='geriAudiometryQ7'
          checkboxes='true'
          label='geriAudiometry - Q7'
          options={formOptions.geriAudiometryQ7}
        />
        <h3>Pure Tone Screening at 40dB for Right Ear:</h3>{' '}
        <p>(Tick checkbox for Response, DO NOT tick checkbox if NO response):</p>
        <SelectField
          name='geriAudiometryQ8'
          checkboxes='true'
          label='geriAudiometry - Q8'
          options={formOptions.geriAudiometryQ8}
        />
        <h4>
          When senior is found to have abnormal hearing results, please ask the following questions:
        </h4>
        <h3>Do you have an upcoming appointment with your ear specialist or audiologist?</h3>
        <RadioField
          name='geriAudiometryQ9'
          label='geriAudiometry - Q9'
          options={formOptions.geriAudiometryQ9}
        />
        <h4>If yes, please specify:</h4>
        <LongTextField name='geriAudiometryQ10' label='geriAudiometry - Q10' />
        <h3>Referred to Doctor&apos;s Consult?</h3>
        <RadioField
          name='geriAudiometryQ11'
          label='geriAudiometry - Q11'
          options={formOptions.geriAudiometryQ11}
        />
        <h4>
          Please document significant findings from audiometry test and recommended course of action
          for participant:
        </h4>
        <LongTextField name='geriAudiometryQ12' label='geriAudiometry - Q12' />
        <RadioField
          name='geriAudiometryQ13'
          label='geriAudiometry - Q13'
          options={formOptions.geriAudiometryQ13}
        />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>
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
          width='50%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Hearing Issues</h2>
              <p className='underlined'>Hearing problems</p>
              {hcsr && hcsr.hxHcsrQ8 ? (
                <p className='blue'>{hcsr.hxHcsrQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hcsr && hcsr.hxHcsrQ9 ? (
                <p className='blue'>{hcsr.hxHcsrQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {<p className='underlined'>Has participant seen an ENT Specialist before?</p>}
              {hcsr && hcsr.hxHcsrQ13 ? (
                <p className='blue'>{hcsr.hxHcsrQ13}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hcsr && hcsr.hxHcsrQ14 ? (
                <p className='blue'>{hcsr.hxHcsrQ14}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {<p className='underlined'>Does participant use any hearing aids?</p>}
              {hcsr && hcsr.hxHcsrQ15 ? (
                <p className='blue'>{hcsr.hxHcsrQ15}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hcsr && hcsr.hxHcsrQ16 ? (
                <p className='blue'>{hcsr.hxHcsrQ16}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

GeriAudiometryForm.contextType = FormContext

export default function GeriAudiometryform(props) {
  return <GeriAudiometryForm {...props} />
}
