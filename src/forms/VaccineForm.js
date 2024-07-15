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
  },
  VAX2: {
    type: Array,
    optional: false,
  },
  'VAX2.$': {
    type: String,
    allowedValues: [
      '1. Healthway Medical (Jurong West)',
      '2. Healthway Medical (Jurong West Central)',
      '3. Healthway Medical (Bukit Batok)',
      '4. Healthway Medical (Clementi West) (formerly West Coast Clinic and Surgery)',
      '5. Healthway Medical (Bukit Panjang Plaza)',
      '6. Medico Clinic & Surgery',
      '7. Silver Cross Medical (Jurong West)',
      '8. Healthway Medical (Bukit Batok West)',
      '9. Silver Cross Medical (Bukit Timah)',
      '10. Healthway Medical (Limbang)',
    ],
  },
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
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)

    const pmhxData = getSavedData(patientId, allForms.hxNssForm)
    Promise.all([
      pmhxData,
    ]).then((result) => {
      setPMHXData(result[0])
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
    ],
    VAX2: [
      { label: '1. Healthway Medical (Jurong West)',
        value: '1. Healthway Medical (Jurong West)' },
      { label: '2. Healthway Medical (Jurong West Central)', 
        value: '2. Healthway Medical (Jurong West Central)' },
      { label: '3. Healthway Medical (Bukit Batok)', 
        value: '3. Healthway Medical (Bukit Batok)' },
      { label: '4. Healthway Medical (Clementi West) (formerly West Coast Clinic and Surgery)', 
        value: '4. Healthway Medical (Clementi West) (formerly West Coast Clinic and Surgery)' },
      { label: '5. Healthway Medical (Bukit Panjang Plaza)',
        value: '5. Healthway Medical (Bukit Panjang Plaza)' },
      { label: '6. Medico Clinic & Surgery',
        value: '6. Medico Clinic & Surgery' },
      { label: '7. Silver Cross Medical (Jurong West)',
        value: '7. Silver Cross Medical (Jurong West)' },
      { label: '8. Healthway Medical (Bukit Batok West)',
        value: '8. Healthway Medical (Bukit Batok West)' },
      { label: '9. Silver Cross Medical (Bukit Timah)',
        value: '9. Silver Cross Medical (Bukit Timah)' },
      { label: '10. Healthway Medical (Limbang)',
        value: '10. Healthway Medical (Limbang)' },
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
        <h1>Vaccination</h1>
        <h3>You have signed up for your complimentary influenza vaccination.</h3>
        <RadioField name='VAX1' label='VAX1' options={formOptions.VAX1} />
        <br />
        <h3>Please indicate which clinic you would like to take it at:</h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='VAX2'
          label='VAX2'
          options={formOptions.VAX2}
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
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Influenza Vaccination</h2>
              <p className='underlined'>Has taken influenza vaccination in the past 1 year:</p>
              {pmhx && pmhx.PMHX16 ? (
                <p className='blue'>{pmhx.PMHX16}</p>
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

VaccineForm.contextType = FormContext

export default VaccineForm
