import React, { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField } from 'uniforms-mui'
import { RadioField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import '../forms.css'

const schema = new SimpleSchema({
  GRACE1: {
    type: String,
    optional: true,
  },
  GRACE2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  GRACE3: {
    type: String,
    optional: true,
  },
  GRACE4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  GRACE5: {
    type: String,
    optional: true,
  },
})

const formName = 'geriGraceForm'

const GeriGraceForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [])

  const formOptions = {
    GRACE2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GRACE4: [
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
          const event = null // not interested in this value
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            changeTab(event, nextTab)
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
        <h1>G-RACE</h1>
        <h3>MMSE score (_/_):</h3>
        <LongTextField name='GRACE1' label='GRACE1' />
        <h3>Need referral to G-RACE associated polyclinics/partners?</h3>
        <RadioField name='GRACE2' label='GRACE2' options={formOptions.GRACE2} />
        <h3>Polyclinic:</h3>
        <LongTextField name='GRACE3' label='GRACE3' />
        <h3>Referral to Doctor&apos;s Consult?</h3>
        <p>For geri patients who may be depressed</p>
        <RadioField name='GRACE4' label='GRACE4' options={formOptions.GRACE4} />
        <h3>Reason for referral: </h3>
        <LongTextField name='GRACE5' label='GRACE5' />
        <br />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => { }} />}</div>

      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

GeriGraceForm.contextType = FormContext

export default GeriGraceForm
