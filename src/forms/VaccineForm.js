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
  VAX1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  }
})

const formName = 'vaccineForm'

const VaccineForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const navigate = useNavigate()
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})

  const [pmhx, setPMHXData] = useState({})
  const [regi, setRegi] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)

    const pmhxData = getSavedData(patientId, allForms.hxNssForm)
    const regiData = getSavedData(patientId, allForms.registrationForm)
    Promise.all([
      pmhxData,
      regiData,
    ]).then((result) => {
      setPMHXData(result[0])
      setRegi(result[1])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    VAX1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ]
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
        <h1>Vaccination</h1>
        <h3>You have signed up for your complimentary influenza vaccination.</h3>
        <RadioField name='VAX1' label='VAX1' options={formOptions.VAX1} />
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
              {regi ? (
                <>
                  <p className='blue'>Age: {regi.registrationQ4}</p>
                  <p className='blue'>Citizenship: {regi.registrationQ7}</p>
                </>
              ) : (
                <p className='red'>NO REGI DATA</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

VaccineForm.contextType = FormContext

export default VaccineForm
