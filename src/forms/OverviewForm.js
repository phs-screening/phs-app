import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { LongTextField, BoolField } from 'uniforms-material'
import { submitForm, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { title, underlined, blueText } from '../theme/commonComponents'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'

const schema = new SimpleSchema({
  socialServiceQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  socialServiceQ2: {
    type: String,
    optional: false,
  },
  socialServiceQ3: {
    type: String,
    optional: false,
  },
})

const formName = 'overviewForm'
const OverviewForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingPrevData, isLoadingPrevData] = useState(true)
  const [saveData, setSaveData] = useState({})
  // forms to retrieve for side panel
  const [hcsr, setHcsr] = useState({})
  const [nss, setNss] = useState({})
  const [social, setSocial] = useState({})
  const [cancer, setCancer] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    const loadPastForms = async () => {
      const hcsrData = await getSavedData(patientId, allForms.hxHcsrForm)
      const nssData = await getSavedData(patientId, allForms.hxNssForm)
      const socialData = await getSavedData(patientId, allForms.hxSocialForm)
      const cancerData = await getSavedData(patientId, allForms.hxCancerForm)
      setHcsr(hcsrData)
      setNss(nssData)
      setSocial(socialData)
      setCancer(cancerData)
      isLoadingPrevData(false)
    }
    setSaveData(savedData)
    loadPastForms()
  }, [])

  const newForm = () => (
    <AutoForm
      schema={form_schema}
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
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {loadingPrevData ? (
        <CircularProgress />
      ) : (
        <div>
          {title('Health Concerns')}
          {underlined('Summarised reasons for referral to Doctor Consultation')}
          {hcsr ? hcsr.hxHcsrQ2 : null}
        </div>
      )}
    </Paper>
  )
}

OverviewForm.contextType = FormContext

export default function Overviewform(props) {
  const navigate = useNavigate()
  return <OverviewForm {...props} navigate={navigate} />
}
