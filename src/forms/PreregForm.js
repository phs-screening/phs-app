import React, { Component, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'

import { schema, layout } from './prereg.js'

import { preRegister, submitPreRegForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import './fieldPadding.css'
import { getPreRegData, isAdmin } from '../services/mongoDB'

const formName = 'patients'
const PreregForm = (props) => {
  const { patientId, updatePatientInfo } = useContext(FormContext)
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const form_layout = layout
  const [saveData, setSaveData] = useState({})

  useEffect(async () => {
    const savedData = await getPreRegData(patientId, formName)
    if (!(await isAdmin())) {
      if ('initials' in savedData) {
        alert('You are not an admin!')
        navigate('/app/dashboard', { replace: true })
      }
    }
    setSaveData(savedData)
  }, [])

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        if ('initials' in saveData) {
          // updating reg
          isLoading(true)
          const response = await submitPreRegForm(model, patientId, formName)
          if (response.result) {
            isLoading(false)
            setTimeout(() => {
              alert('Successfully submitted form')
              updatePatientInfo(response.data)
              navigate('/app/dashboard', { replace: true })
            }, 80)
          } else {
            isLoading(false)
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`)
            }, 80)
          }
        } else {
          // initial reg
          isLoading(true)
          const response = await preRegister(model)
          if (response.result) {
            isLoading(false)
            setTimeout(() => {
              alert(
                `Successfully pre-registered patient with queue number ${response.data.patientId}.`,
              )
              updatePatientInfo(response.data)
              navigate('/app/dashboard', { replace: true })
            }, 80)
          } else {
            isLoading(false)
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`)
            }, 80)
          }
        }
      }}
      model={saveData}
    >
      {form_layout}
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
PreregForm.contextType = FormContext

export default function Preregform(props) {
  const navigate = useNavigate()

  return <PreregForm {...props} navigate={navigate} />
}
