import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField, SelectField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@material-ui/core/Grid'
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
      <Fragment>
        <br />
        <h2>AUDIOMETRY</h2>
        Did participant visit Audiometry Booth by NUS audiology team?
        <RadioField name='geriAudiometryQ1' label='geriAudiometry - Q1' />
        <br />
        Visual Ear Examination (Left Ear):
        <RadioField name='geriAudiometryQ2' label='geriAudiometry - Q2' />
        Visual Ear Examination (Right Ear)
        <RadioField name='geriAudiometryQ3' label='geriAudiometry - Q3' />
        <br />
        Practice Tone (500Hz at 60dB in “better” ear):
        <RadioField name='geriAudiometryQ4' label='geriAudiometry - Q4' />
        <br />
        Pure Tone Screening at 25dB for Left Ear: (Tick checkbox for Response, DO NOT tick checkbox
        if NO response):
        <SelectField name='geriAudiometryQ5' checkboxes='true' label='geriAudiometry - Q5' />
        Pure Tone Screening at 25dB for Right Ear: (Tick checkbox for Response, DO NOT tick checkbox
        if NO response):
        <SelectField name='geriAudiometryQ6' checkboxes='true' label='geriAudiometry - Q6' />
        <br />
        Pure Tone Screening at 40dB for Left Ear: (Tick checkbox for Response, DO NOT tick checkbox
        if NO response):
        <SelectField name='geriAudiometryQ7' checkboxes='true' label='geriAudiometry - Q7' />
        Pure Tone Screening at 40dB for Right Ear: (Tick checkbox for Response, DO NOT tick checkbox
        if NO response):
        <SelectField name='geriAudiometryQ8' checkboxes='true' label='geriAudiometry - Q8' />
        <br />
        When senior is found to have abnormal hearing results, please ask the following questions:
        <br />
        Do you have an upcoming appointment with your ear specialist or audiologist?
        <RadioField name='geriAudiometryQ9' label='geriAudiometry - Q9' />
        If yes, please specify:
        <LongTextField name='geriAudiometryQ10' label='geriAudiometry - Q10' />
        Referred to Doctor&apos;s Consult?
        <RadioField name='geriAudiometryQ11' label='geriAudiometry - Q11' />
        Please document significant findings from audiometry test and recommended course of action
        for participant:
        <LongTextField name='geriAudiometryQ12' label='geriAudiometry - Q12' />
        <RadioField name='geriAudiometryQ13' label='geriAudiometry - Q13' />
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
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {newForm()}
          </Paper>
        </Grid>
        <Grid
          p={1}
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div>
              {title('Hearing Issues ')}
              {underlined('Hearing problems')}
              {hcsr && hcsr.hxHcsrQ8 ? blueText(hcsr.hxHcsrQ8) : blueText('nil')}
              {hcsr && hcsr.hxHcsrQ9 ? blueText(hcsr.hxHcsrQ9) : blueText('nil')}
              {underlined('Has participant seen an ENT Specialist before?')}
              {hcsr && hcsr.hxHcsrQ13 ? blueText(hcsr.hxHcsrQ13) : blueText('nil')}
              {hcsr && hcsr.hxHcsrQ14 ? blueText(hcsr.hxHcsrQ14) : blueText('nil')}
              {underlined('Does participant use any hearing aids?')}
              {hcsr && hcsr.hxHcsrQ15 ? blueText(hcsr.hxHcsrQ15) : blueText('nil')}
              {hcsr && hcsr.hxHcsrQ16 ? blueText(hcsr.hxHcsrQ16) : blueText('nil')}
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
