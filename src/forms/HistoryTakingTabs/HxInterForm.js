import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB.js'
import '../fieldPadding.css'
import PopupText from 'src/utils/popupText.js'

const responses = [
  '1 - Hardly ever',
  '2 - Some of the time',
  '3 - Often',
]

const responsesValue = [
  { label: '1 - Hardly ever', value: '1 - Hardly ever' },
  { label: '2 - Some of the time', value: '2 - Some of the time' },
  { label: '3 - Often', value: '3 - Often' },
]

const schema = new SimpleSchema({
  InterQ1: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
  InterQ2: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
  InterQ3: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
})

const formName = 'hxInterForm'

const hxInterForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props
  const navigate = useNavigate()

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const formOptions = {
    InterQ1: responsesValue,
    InterQ2: responsesValue,
    InterQ3: responsesValue,
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
        <h1>INTERACTION</h1>
        <h3>How often do you feel that you lack companionship?</h3>
        <RadioField name='InterQ1' label='InterQ1' options={formOptions.InterQ1} />
        <h3>How often do you feel left out?</h3>
        <RadioField name='InterQ2' label='InterQ2' options={formOptions.InterQ2} />
        <h3>How often do you feel isolated from others? </h3>
        <RadioField name='InterQ3' label='InterQ3' options={formOptions.InterQ3} />
      </div>
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

hxInterForm.contextType = FormContext

export default hxInterForm
