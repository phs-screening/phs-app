import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import {
  SubmitField,
  ErrorsField,
  TextField,
  SelectField,
  RadioField,
  LongTextField,
} from 'uniforms-mui'
import { BoolField } from 'uniforms-mui'
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'
import { get } from 'react-hook-form'

const schema = new SimpleSchema({
  DENT1: {
    type: Array,
    optional: false,
  },
  'DENT1.$': {
    type: String,
    allowedValues: ['I have been informed and understand.'],
  },
  DENT2: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  DENTShortAns2: {
    type: String,
    optional: true,
  },
  DENT3: {
    type: Array,
    optional: false,
  },
  'DENT3.$': {
    type: String,
    allowedValues: ['Yes'],
    optional: false,
  },
  DENT4: {
    type: String,
    allowedValues: ['Yes', 'No, (specify why)'],
    optional: false,
  },
  DENTShortAns4: {
    type: String,
    optional: true,
  },
})

const formName = 'oralHealthForm'
const OralHealthForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})

  const [doctorConsult, setDoctorConsult] = useState({})
  const [regi, setRegi] = useState({})
  const [hxOral, setHxOral] = useState({})
  const [social, setSocial] = useState({})
  const [pmhx, setPMHX] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)

    const dcData = getSavedData(patientId, allForms.doctorConsultForm)
    const regiData = getSavedData(patientId, allForms.registrationForm)
    const hxOralData = getSavedData(patientId, allForms.hxOralForm)
    const socialData = getSavedData(patientId, allForms.hxSocialForm)
    const pmhxData = getSavedData(patientId, allForms.hxNssForm)

    Promise.all([dcData, regiData, hxOralData, socialData, pmhxData]).then((result) => {
      setDoctorConsult(result[0])
      setRegi(result[1])
      setHxOral(result[2])
      setSocial(result[3])
      setPMHX(result[4])
      isLoadingSidePanel(false)
    })
  }, [])
  const formOptions = {
    DENT1: [
      {
        label: 'I have been informed and understand.',
        value: 'I have been informed and understand.',
      },
    ],
    DENT2: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    DENT3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
    ],
    DENT4: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No, (specify why)', value: 'No, (specify why)' },
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
        <h1>Oral Health</h1>
        <h3>I have been informed and understand that: </h3>
        <p>
          <ol type='a'>
            <li>
              The oral health screening may be provided by clinical instructors <br />
              AND/OR postgraduate dental students who are qualified dentists <br />
              AND/OR undergraduate dental students who are not qualified dentists
              <ul>
                <li>
                  ALL undergraduate dental students will be supervised by a clinical instructor
                  and/or postgraduate dental student.
                </li>
              </ul>
            </li>
            <li>
              The Oral Health Screening only provides a basic assessment of my/my ward&apos;s oral
              health condition and that it does not take the place of a thorough oral health
              examination.
            </li>
            <li>
              I/My ward will be advised on the type(s) of follow-up dental treatment required for
              my/my ward&apos;s oral health condition after the Oral Health Screening.
              <ul>
                <li>
                  I/My ward will be responsible to seek such follow-up dental treatment as advised
                  at my/myward&apos; own cost.
                </li>
              </ul>
            </li>
            <li>
              My decision to participate/let my ward participate in this Oral Health Screening is
              voluntary.
            </li>
          </ol>
        </p>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='DENT1'
          label='DENT1'
          options={formOptions.DENT1}
        />
        <h3>Are you on any blood thinners or have any bleeding disorders?</h3>
        <RadioField name='DENT2' label='DENT2' options={formOptions.DENT2} />
        <h4>Please specify:</h4>
        <LongTextField name='DENTShortAns2' label='DENT2' />
        <h3>Patient has completed Oral Health station.</h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='DENT3'
          label='DENT3'
          options={formOptions.DENT3}
        />
        <h3>Patient has registered with NUS Dentistry for follow-up. If no, why not.</h3>
        <RadioField name='DENT4' label='DENT4' options={formOptions.DENT4} />
        <h4>Please specify:</h4>
        <LongTextField name='DENTShortAns4' label='DENT4' />
        <br />
      </div>

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
            <div className='summary--question-div'>
              <h2>Referral:</h2>
              {doctorConsult ? (
                <>
                  <p className='underlined'>Is patient refered to Dental:</p>
                  <p>{doctorConsult.doctorSConsultQ8 ? "Yes" : "No"}</p>
                  <p className='underlined'>Reason for referral: </p>
                  <p>{doctorConsult.doctorSConsultQ9}</p>
                </>
              ) : (
                <p className='red'>nil doctorConsult data!</p>
              )}

              <h2>Patient Info:</h2>
              {regi ? (
                <p>Age: {regi.registrationQ4}</p>
              ) : (
                <p className='red'>nil registration data!</p>
              )}

              <h2>Patient History:</h2>
              {hxOral ? (
                <>
                  <p className='underlined'>Patient&apos;s Oral Health:</p>
                  <p>{hxOral.ORAL1}</p>
                  <p>{hxOral.ORALShortAns1}</p>

                  <p className='underlined'>Does patient wear dentures?: </p>
                  <p>{hxOral.ORAL2}</p>
                  <p className='underlined'>Is patient currently experiencing any pain in their mouth area?: </p>
                  <p>{hxOral.ORAL3}</p>

                  <p className='underlined'>Has patient visited a dentist in the past 1 year?: </p>
                  <p>{hxOral.ORAL4}</p>
                  <p className='underlined'>Is patient going from a Oral Health Consult?: </p>
                  <p>{hxOral.ORAL5}</p>
                  <p>{hxOral.ORALShortAns5}</p>
                </>
              ) : (
                <p className='red'>nil hxOral data!</p>
              )}

              {
                social ? (
                  <>
                    <p className='underlined'>Does patient currently smoke: </p>
                    <p>{social.SOCIAL10}</p>
                    <p className='underlined'>How many pack-years?: </p>
                    <p>{social.SOCIALShortAns10}</p>

                    <p className='underlined'>Has patient smoked before? For how long and when did they stop?: </p>
                    <p>{social.SOCIAL11}</p>
                    <p>{social.SOCIALShortAns11}</p>
                  </>
                ) : <p className='red'>nil social data!</p>
              }

              {
                pmhx && pmhx.PMHX7 ? (
                  <>
                    <p className='underlined'>Patient has the following conditions: </p>
                    <ul>{pmhx.PMHX7.map(person => <li key={person}>{person}</li>)}</ul>
                  </>
                ) : <p className='red'>nil pmhx7 data!</p>
              }
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

OralHealthForm.contextType = FormContext

export default function OralHealthform(props) {
  const navigate = useNavigate()

  return <OralHealthForm {...props} navigate={navigate} />
}
