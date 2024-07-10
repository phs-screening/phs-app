import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-mui'
import { LongTextField, BoolField } from 'uniforms-mui'
import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  NKF1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  NKF2: {
    type: String,
    optional: false,
  },
  //q1 short ans
  NKF3: {
    type: String,
    optional: true,
  },
})

const formName = 'nkfForm'
const NkfForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()

  const [reg, setReg] = useState({})
  const [triage, setTriage] = useState({})
  const [hxfamily, setHxFamily] = useState({})
  const [pmhx, setPMHXData] = useState({})

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)

    const regData = getSavedData(patientId, allForms.registrationForm)
    const triageData = getSavedData(patientId, allForms.triageForm)
    const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
    const pmhxData = getSavedData(patientId, allForms.hxNssForm)

    Promise.all([regData,triageData,hxFamilyData,pmhxData]).then((result) => {
      setReg(result[0])
      setTriage(result[1])
      setHxFamily(result[2])
      setPMHXData(result[3])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    NKF1: [
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
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
        isLoading(false)
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h1>NKF</h1>
        <h3>Patient has booked an appointment for kidney screen on NKF website.</h3>
        <RadioField name='NKF1' label='NKF1' options={formOptions.NKF1} />
        <h3>Details of Kidney Screen (Date, Time)</h3>
        <p>
          Write in this format: 16th January, 2024 at 3PM
          <LongTextField name='NKF2' label='NKF2' />
        </p>
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
              <h2>Patient Info</h2>
              {reg && reg.registrationQ4 ? (
                <p className='blue'>Age: {reg.registrationQ4}</p>
              ) : (
                <p className='blue'>Age: nil</p>
              )}

              {triage && triage.triageQ9 && triage.triageQ10 ? (
                <p className='blue'>BMI: {formatBmi(triage.triageQ9, triage.triageQ10)}</p>
              ) : (
                <p className='blue'>BMI: nil</p>
              )}

              <p className='underlined'>Patient has these conditions: </p>
              {pmhx && pmhx.PMHX7 ? (
                <p className='blue'>{pmhx.PMHX7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Patient has positive family of these conditions: </p>
              {hxfamily && hxfamily.FAMILY3 ? (
                <p className='blue'>{hxfamily.FAMILY3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Has patient has done a kidney screening in the past 1 year: </p>
              {pmhx && pmhx.PMHX9 ? (
                <p className='blue'>{pmhx.PMHX9}</p>
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

NkfForm.contextType = FormContext

export default NkfForm
