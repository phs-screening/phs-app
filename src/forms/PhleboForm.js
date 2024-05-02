import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-material'
import { submitForm, submitRegClinics } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { BoolField } from 'uniforms-material'
import { getClinicSlotsCollection, getSavedData } from '../services/mongoDB'
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

const formName = 'phlebotomyForm'

const PhleboForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)

    setSaveData(savedData)
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
      model={saveData}
    >
      <Fragment>
        Blood sample collected?
        <BoolField name='phlebotomyQ1' />
        Circled &apos;Completed&apos; under Phlebotomy on Form A?
        <BoolField name='phlebotomyQ2' />
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
      {newForm()}
    </Paper>
  )
}

PhleboForm.contextType = FormContext

export default function Phleboform(props) {
  const navigate = useNavigate()

  return <PhleboForm {...props} navigate={navigate} />
}
