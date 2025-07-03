import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, FormControl, FormLabel, 
  FormControlLabel, RadioGroup, Radio, TextField, Button } from '@mui/material'

import { submitForm, calculateSppbScore } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const formName = 'geriSppbForm'

const formOptions = {
  geriSppbQ2: [
    {
      label: '0       (If not able to complete 5 chair stands)',
      value: '0       (If not able to complete 5 chair stands)',
    },
    { label: '1       (> 16.7s )', value: '1       (> 16.7s )' },
    { label: '2       (16.6 – 13.7s )', value: '2       (16.6 – 13.7s )' },
    { label: '3       (13.6 – 11.2s )', value: '3       (13.6 – 11.2s )' },
    { label: '4       (< 11.1s )', value: '4       (< 11.1s )' },
  ],
  geriSppbQ6: [
    {
      label: '0        (Side by side < 10s or unable)',
      value: '0        (Side by side < 10s or unable)',
    },
    {
      label: '1       (Side by side 10s AND < 10s semi tandem)',
      value: '1       (Side by side 10s AND < 10s semi tandem)',
    },
    {
      label: '2       (Semi tandem 10s AND tandem < 3s)',
      value: '2       (Semi tandem 10s AND tandem < 3s)',
    },
    {
      label: '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
      value: '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
    },
    { label: '4       (Tandem >= 10s)', value: '4       (Tandem >= 10s)' },
    { label: 'Refused to do', value: 'Refused to do' },
  ],
  geriSppbQ8: [
    {
      label: '0       (Could not do)',
      value: '0       (Could not do)',
    },
    { label: '1       (> 6.52s )', value: '1       (> 6.52s )' },
    { label: '2       (4.66 – 6.52s )', value: '2       (4.66 – 6.52s )' },
    { label: '3       (3.62 – 4.65s )', value: '3       (3.62 – 4.65s )' },
    { label: '4       (< 3.62s )', value: '4       (< 3.62s )' },
  ],
  geriSppbQ10: [
    {
      label: 'High Fall Risk (0-3)',
      value: 'High Fall Risk (0-3)',
    },
    { label: 'Moderate Fall Risk (4-9)', value: 'Moderate Fall Risk (4-9)' },
    { label: 'Low Fall Risk (10-12)', value: 'Low Fall Risk (10-12)' },
  ],
  geriSppbQ11: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  geriSppbQ1: Yup.number().nullable(),
  geriSppbQ13: Yup.number().nullable(),
  geriSppbQ2: Yup.string().oneOf(formOptions.geriSppbQ2.map(opt => opt.value)).required(),
  geriSppbQ3: Yup.number().nullable(),
  geriSppbQ4: Yup.number().nullable(),
  geriSppbQ5: Yup.number().nullable(),
  geriSppbQ6: Yup.string().oneOf(formOptions.geriSppbQ6.map(opt => opt.value)).required(),
  geriSppbQ7: Yup.number().nullable(),
  geriSppbQ8: Yup.string().oneOf(formOptions.geriSppbQ8.map(opt => opt.value)).required(),
  geriSppbQ10: Yup.string().oneOf(formOptions.geriSppbQ10.map(opt => opt.value)).required(),
  geriSppbQ11: Yup.string().oneOf(formOptions.geriSppbQ11.map(opt => opt.value)).required(),
  geriSppbQ12: Yup.string(),
})

const isRequiredField = (schema, fieldName) => {
  try {
    const tests = schema.fields[fieldName]?.tests || []
    return tests.some((test) => test.OPTIONS?.name === 'required')
  } catch {
    return false
  }
}

const formatLabel = (name, schema) => {
  const match = name.match(/geriSppbQ(\d+)/i)
  const label = match ? `Geri - SPPB Q${match[1]}` : name
  return `${label}${isRequiredField(schema, name) ? ' *' : ''}`
}

const GeriSppbForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    geriSppbQ1: '',
    geriSppbQ13: '',
    geriSppbQ2: '',
    geriSppbQ3: '',
    geriSppbQ4: '',
    geriSppbQ5: '',
    geriSppbQ6: '',
    geriSppbQ7: '',
    geriSppbQ8: '',
    geriSppbQ10: '',
    geriSppbQ11: '',
    geriSppbQ12: '',
  })

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      isLoading(true)
      const response = await submitForm(values, patientId, formName)
      setTimeout(() => {
        isLoading(false)
        if (response.result) {
          alert('Successfully submitted form')
          changeTab(null, nextTab)
        } else {
          alert(`Unsuccessful. ${response.error}`)
        }
      }, 80)
    }
  })
  
  function GetSppbScore() {
    const { geriSppbQ2, geriSppbQ6, geriSppbQ8 } = formik.values
    return calculateSppbScore(geriSppbQ2, geriSppbQ6, geriSppbQ8)
  }

  useEffect(() => {
    const fetchData = async () => {
      const saved = await getSavedData(patientId, formName)
      setInitialValues(saved)
    }
    fetchData()
  }, [])

  const renderRadioGroup = (formik, name, options = formOptions[name]) => (
    <FormControl sx = {{ mt: 1 }}>
      <FormLabel sx={{ color: 'text.secondary' }}>{formatLabel(name, validationSchema)}</FormLabel>
      <RadioGroup value={formik.values[name]} onChange={formik.handleChange} name={name}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={`${opt.label}${isRequiredField(validationSchema, name) ? ' *' : ''}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )

  const renderTextField = (formik, name) => {
    const numberFields = [
      'geriSppbQ1',
      'geriSppbQ3',
      'geriSppbQ4',
      'geriSppbQ5',
      'geriSppbQ7',
      'geriSppbQ13',
    ]
  
    const isNumber = numberFields.includes(name)

    return (
      <TextField
        name={name}
        label={formatLabel(name, validationSchema)}
        value={formik.values[name] || ''}
        onChange={formik.handleChange}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        fullWidth
        multiline={!isNumber}
        type={numberFields.includes(name) ? 'number' : 'text'}
        inputProps={isNumber ? { step: 0.01 } : {}}
        sx={{ mt: 1 }}
      />
    )
  }

  return (
    <Paper elevation={2} p={0} m={0}>
      <form onSubmit={formik.handleSubmit} className='fieldPadding'>
        <div className="form--div">
          <h1>SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)</h1>
          <h3>1) REPEATED CHAIR STANDS</h3>
          <h4>Time taken in seconds (only if 5 chair stands were completed):</h4>
          {renderTextField(formik, 'geriSppbQ1')}

          <h4>Number of chairs completed:</h4>
          {renderTextField(formik, 'geriSppbQ13')}

          <h4 className="blue">
            Score for REPEATED CHAIR STANDS (out of 4):
            <br />
            {renderRadioGroup(formik, 'geriSppbQ2')}
          </h4>

          <h3>2a) BALANCE Side-by-side Stand Time held for in seconds:</h3>
          {renderTextField(formik, 'geriSppbQ3')}

          <h3>2b) BALANCE Semi-tandem Stand</h3>
          <h4>Time held for in seconds:</h4>
          {renderTextField(formik, 'geriSppbQ4')}

          <h3>2c) BALANCE Tandem Stand</h3>
          <h4>Time held for in seconds:</h4>
          {renderTextField(formik, 'geriSppbQ5')}

          <h4 className="blue">
            Score for BALANCE (out of 4):
            <br />
            {renderRadioGroup(formik, 'geriSppbQ6')}
          </h4>

          <h3>3) 3m WALK </h3>
          <h4>Time taken in seconds:</h4>
          {renderTextField(formik, 'geriSppbQ7')}

          <h4 className="blue">
            Score for 3m WALK (out of 4):
            <br />
            {renderRadioGroup(formik, 'geriSppbQ8')}
          </h4>

          <div className="blue">
            <h3>Total score (Max Score: 12):</h3>
            <GetSppbScore />
          </div>

          <h3>Fall Risk Level:</h3>
          {renderRadioGroup(formik, 'geriSppbQ10')}

          <h3 className="red">Referral to Physiotherapist and Occupational Therapist Consult</h3>
          {renderRadioGroup(formik, 'geriSppbQ11')}

          <h3>Notes:</h3>
          {renderTextField(formik, 'geriSppbQ12')}
        </div>

        <br />
        <div> 
          {loading ? <CircularProgress /> : <Button type='submit' variant='contained' color='primary'>Submit</Button>}
        </div>

        <br />
        <Divider />
      </form>
    </Paper>
  )}

export default GeriSppbForm