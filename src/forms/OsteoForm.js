import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import allForms from './forms.json'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { SelectField, TextField, RadioField, LongTextField } from 'uniforms-mui'
import { useField } from 'uniforms'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import { useNavigate } from 'react-router'

const schema = new SimpleSchema({
  BONE1: {
    type: String,
    allowedValues: ['High', 'Moderate', 'Low'],
    optional: false,
  },
  BONE2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'osteoForm'

const OsteoForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const navigate = useNavigate()
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
      isLoadingSidePanel(false)
    }

    fetchData()
  }, [patientId])

  const formOptions = {
    BONE1: [
      { label: 'High', value: 'High' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'Low', value: 'Low' },
    ],
    BONE2: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        setLoading(true)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          setLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h1>Osteoporosis</h1>
        <h3>OSTA: Based on the picture below, patients osteoporosis risk is: </h3>
        <RadioField name='BONE1' label='BONE1' options={formOptions.BONE1} />
        <br />
        <h3>Patient requires a follow up</h3>
        <RadioField name='BONE2' label='BONE2' options={formOptions.BONE2} />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid container direction='row'>
        <Grid item xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {newForm()}
          </Paper>
        </Grid>
        <Grid item p={1} width='30%' display='flex' flexDirection='column' alignItems={loadingSidePanel ? 'center' : 'left'}>
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Regi, tri, social</h2>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

OsteoForm.contextType = FormContext

export default OsteoForm
