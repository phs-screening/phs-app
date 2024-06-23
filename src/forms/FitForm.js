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

  const formOptions = {
    fitQ2: [
      { label: 'Yes', value: 'Yes' },
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
        <h1>FIT</h1>
        <h2>PARTICIPANT IDENTIFICATION</h2>
        <h3>
          <p className='red'>
            Please verify participant&apos;s identity using his/her
            <ol type='A'>
              <li>APP ID on wristband AND</li>
              <li>INITIALS</li>
            </ol>
          </p>
        </h3>
        <h2>CANCER SCREENING </h2>
        <h3>
          <span className='red'>For respondent aged 50 and above only, </span>
          unless positive family history for colorectal cancer.
        </h3>
        <h3>When was the last time you had a blood stool test?</h3>
        <p>(A blood stool test is a test to determine whether the stool contains blood.)</p>
        {hxCancer && hxCancer.hxCancerQ5 ? (
          <p className='blue'>{hxCancer.hxCancerQ5}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h3>
          <span className='red'>For respondent aged 50 and above only, </span>
          unless positive family history for colorectal cancer.
        </h3>
        <h3>When was the last time you had a colonoscopy? </h3>
        <p>
          (A colonoscopy is an examination in which a tube is inserted in the rectum to view the
          colon for signs of cancer or other health problems.)
        </p>
        {hxCancer && hxCancer.hxCancerQ6 ? (
          <p className='blue'>{hxCancer.hxCancerQ6}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h4 className='red'>
          Please encourage participants to go for FIT every year if participant is above 50,
          asymptomatic and no positive family history of colorectal cancer in first degree relatives
          and does not have any bleeding disorders.
        </h4>
        <h3>Was participant issued 2 FIT kits?</h3>
        <RadioField name='fitQ2' label='FIT Q2' options={formOptions.fitQ2} />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

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
