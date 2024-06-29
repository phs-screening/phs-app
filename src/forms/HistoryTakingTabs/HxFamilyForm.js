import React, { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField, LongTextField, SelectField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const schema = new SimpleSchema({
  FAMILY1: {
    type: Array,
    optional: false,
  },
  'FAMILY1.$': {
    type: String,
    allowedValues: [
      'Cervical Cancer 子宫颈癌',
      'Breast Cancer 乳癌',
      'Colorectal Cancer 大肠癌',
      'Others',
      'No, I have never been told I have any of these conditions before',
    ],
    optional: false,
  },
  FAMILYShortAns1: {
    type: String,
    optional: true,
  },
  FAMILY2: {
    type: String,
    optional: true,
  },
  FAMILY3: {
    type: Array,
    optional: true,
  },
  'FAMILY3.$': {
    type: String,
    allowedValues: ['Kidney Disease', 'Diabetes', 'Hypertension'],
    optional: true,
  },
})

const formName = 'hxFamilyForm'

const HxFamilyForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)

    setSaveData(savedData)
  }, [])

  const formOptions = {
    FAMILY1: [
      {
        label: 'Cervical Cancer 子宫颈癌',
        value: 'Cervical Cancer 子宫颈癌',
      },
      { label: 'Breast Cancer 乳癌', value: 'Breast Cancer 乳癌' },
      { label: 'Colorectal Cancer 大肠癌', value: 'Colorectal Cancer 大肠癌' },
      { label: 'Others', value: 'Others' },
      {
        label: 'No, I have never been told I have any of these conditions before',
        value: 'No, I have never been told I have any of these conditions before',
      },
    ],
    FAMILY3: [
      {
        label: 'Kidney Disease',
        value: 'Kidney Disease',
      },
      { label: 'Diabetes', value: 'Diabetes' },
      { label: 'Hypertension', value: 'Hypertension' },
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
        <h3>
          Is there positive family history{' '}
          <span className='red'>(AMONG FIRST DEGREE RELATIVES)</span> for the following cancers?
          Please specify age of diagnosis.
        </h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='FAMILY1'
          label='FAMILY1'
          options={formOptions.FAMILY1}
        />
        <h4>Please specify:</h4>
        <LongTextField name='FAMILYShortAns1' label='FAMILY1' />
        <h3>
          Does the patient have any relevant family history they would like the doctor to know
          about?
        </h3>
        <LongTextField name='FAMILY2' label='FAMILY2' />
        <h3>Any positive family history for these conditions?</h3>
        <SelectField
          appearance='checkbox'
          checkboxes
          name='FAMILY3'
          label='FAMILY3'
          options={formOptions.FAMILY3}
        />
        <br />
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

HxFamilyForm.contextType = FormContext

export default HxFamilyForm
