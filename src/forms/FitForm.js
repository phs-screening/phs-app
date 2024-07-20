import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema from 'simpl-schema'

import { AutoForm } from 'uniforms'
import { LongTextField, RadioField } from 'uniforms-mui'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import PopupText from 'src/utils/popupText.js'

const schema = new SimpleSchema({
  /* fitQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  fitShortAnsQ1: {
    type: String,
    optional: true,
  }, */
  fitQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  fitShortAnsQ2: {
    type: String,
    optional: true,
  },
})

const formName = 'fitForm'
const FitForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const navigate = useNavigate()
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})

  const [regi, setRegi] = useState({})
  const [pmhx, setPMHX] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regiData = getSavedData(patientId, allForms.registrationForm)
    const pmhxData = getSavedData(patientId, allForms.hxNssForm)
    setSaveData(savedData)

    Promise.all([
      regiData,
      pmhxData,
    ]).then((result) => {
      setRegi(result[0])
      setPMHX(result[1])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    /* fitQ1: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ], */
    fitQ2: [
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
        <h1>FIT</h1>
        {/* <h3>Does the patient have any gastrointestinal symptoms?</h3>
        <RadioField name='fitQ1' label='fitQ1' options={formOptions.fitQ1} />
        <h4>Please specify:</h4>
        <LongTextField name='fitShortAnsQ1' label='fitQ1' /> */}
        <h3>Sign-up for FIT home delivery</h3>
        <RadioField name='fitQ2' label='fitQ2' options={formOptions.fitQ2} />
        <PopupText qnNo='fitQ2' triggerValue='No'>
          <p>
            <h4>If no, why?</h4>
            <LongTextField name='fitShortAnsQ2' label='fitQ2' />
          </p>
        </PopupText>
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
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Patient Info</h2>
              <p className='underlined'>Patient Age:</p>
              {regi && regi.registrationQ4 ? (
                <p className='blue'>{regi.registrationQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <h2>History</h2>
              <p className='underlined'>Has patient done a FIT test in the last 1 year:</p>
              {pmhx && pmhx.PMHX10 ? (
                <p className='blue'>{pmhx.PMHX10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Has patient done a colonoscopy in the last 10 years or otherwise advised by their doctor:</p>
              {pmhx && pmhx.PMHX11 ? (
                <p className='blue'>{pmhx.PMHX11}</p>
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

FitForm.contextType = FormContext

export default FitForm
