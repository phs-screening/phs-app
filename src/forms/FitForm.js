import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema from 'simpl-schema'

import { AutoForm } from 'uniforms'
import { RadioField } from 'uniforms-material'
import { SubmitField, ErrorsField } from 'uniforms-material'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import { blueText } from '../theme/commonComponents'

const schema = new SimpleSchema({
  fitQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'fitForm'
const FitForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const navigate = useNavigate()
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const [hxCancer, setHxCancer] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)

    Promise.all([savedData, hxCancerData]).then((result) => {
      setSaveData(result[0])
      setHxCancer(result[1])
    })
  }, [])

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
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
      <Fragment>
        <h1>FIT</h1>
        <br />
        <h2>PARTICIPANT IDENTIFICATION</h2>
        <h3>
          <span style={{ color: 'red' }}>
            Please verify participant&apos;s identity using his/her
            <br />
            A. APP ID on wristband AND
            <br />
            B. INITIALS{' '}
          </span>
        </h3>{' '}
        <br />
        <h2>CANCER SCREENING </h2> <br />
        <p>
          <span style={{ color: 'red' }}>
            <b>For respondent aged 50 and above only,</b>
          </span>{' '}
          unless positive family history for colorectal cancer.
          <br />
          When was the last time you had a blood stool test? (A blood stool test is a test to
          determine whether the stool contains blood.)
        </p>
        {hxCancer && hxCancer.hxCancerQ5 ? blueText(hxCancer.hxCancerQ5) : blueText('nil')}
        <br />
        <span style={{ color: 'red' }}>
          <b>For respondent aged 50 and above only,</b>
        </span>{' '}
        unless positive family history for colorectal cancer.
        <br />
        When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a
        tube is inserted in the rectum to view the colon for signs of cancer or other health
        problems.)
        {hxCancer && hxCancer.hxCancerQ6 ? blueText(hxCancer.hxCancerQ6) : blueText('nil')}
        <br />
        <h3>
          <span style={{ color: 'red' }}>
            Please encourage participants to go for FIT every year if participant is above 50,
            asymptomatic and no positive family history of colorectal cancer in first degree
            relatives and does not have any bleeding disorders.
          </span>{' '}
        </h3>
        <br />
        <br />
        Was participant issued 2 FIT kits?
        <RadioField name='fitQ2' label='FIT Q2' />
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

FitForm.contextType = FormContext

export default function Fitform(props) {
  const navigate = useNavigate()

  return <FitForm {...props} navigate={navigate} />
}
