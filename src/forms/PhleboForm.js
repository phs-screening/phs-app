import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { BoolField } from 'uniforms-mui'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  phlebotomyQ1: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  phlebotomyQ2: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
})

const form_schema = new SimpleSchema2Bridge(schema)

const formName = 'phlebotomyForm'

const PhleboForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [])

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
      model={saveData || {}}
    >
      <div className='form--div'>
        <h1>Phlebotomy</h1>
        <h3>Blood sample collected?</h3>
        <BoolField name='phlebotomyQ1' />
        <h3>Circled &apos;Completed&apos; under Phlebotomy on Form A?</h3>
        <BoolField name='phlebotomyQ2' />
        <br />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => { }} />}</div>
      <br />
      <Divider />
    </AutoForm>
  )

  if (!form_schema) return <CircularProgress />

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

PhleboForm.contextType = FormContext

export default PhleboForm
