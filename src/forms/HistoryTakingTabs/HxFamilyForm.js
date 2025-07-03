import React, { useContext, useEffect, useState } from 'react'
import {
  Paper, Divider, Typography, CircularProgress,
  FormControl, FormLabel, FormGroup, FormControlLabel,
  Checkbox, TextField, Button
} from '@mui/material'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'

const formName = 'hxFamilyForm'

const initialValues = {
  FAMILY1: [],
  FAMILYShortAns1: '',
  FAMILY2: '',
  FAMILY3: []
}

const validationSchema = Yup.object({
  FAMILY1: Yup.array().min(1, 'At least one option must be selected'),
})

const checkboxOptions1 = [
  'Cervical Cancer 子宫颈癌',
  'Breast Cancer 乳癌',
  'Colorectal Cancer 大肠癌',
  'Others',
  'No, I have never been told I have any of these conditions before',
]

const checkboxOptions3 = [
  'Kidney Disease',
  'Diabetes',
  'Hypertension'
]

const CheckboxGroupField = ({ name, label, options }) => (
  <FormControl fullWidth sx={{ mb: 3 }} component="fieldset">
    <FormLabel component="legend">
      <Typography variant="subtitle1" fontWeight="bold">{label}</Typography>
    </FormLabel>
    <Field name={name}>
      {({ field, form }) => (
        <FormGroup>
          {options.map(option => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={field.value.includes(option)}
                  onChange={() => {
                    const set = new Set(field.value)
                    set.has(option) ? set.delete(option) : set.add(option)
                    form.setFieldValue(name, Array.from(set))
                  }}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      )}
    </Field>
    <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
  </FormControl>
)

export default function HxFamilyForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSavedData(patientId, formName).then((res) => {
      setSavedValues({ ...initialValues, ...res })
    })
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      alert('Successfully submitted form')
      changeTab(null, nextTab)
    } else {
      alert(`Unsuccessful. ${response.error}`)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="fieldPadding">
            <Typography variant="h6" gutterBottom>
              Is there positive family history <span style={{ color: 'red' }}>(AMONG FIRST DEGREE RELATIVES)</span> for the following cancers?
              Please specify age of diagnosis.
            </Typography>

            <CheckboxGroupField name="FAMILY1" label="FAMILY1" options={checkboxOptions1} />

            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="FAMILYShortAns1" as={TextField} label="FAMILYShortAns1" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="h6">Does the patient have any relevant family history they would like the doctor to know about?</Typography>
            <Field name="FAMILY2" as={TextField} label="FAMILY2" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="h6">Any positive family history for these conditions?</Typography>
            <CheckboxGroupField name="FAMILY3" label="FAMILY3" options={checkboxOptions3} />

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? <CircularProgress /> : (
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
            <br />
            <Divider />
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
