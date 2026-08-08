import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Alert, Typography } from '@mui/material'

import { Divider, Paper, CircularProgress, Button, Box, Grid } from '@mui/material'

import { submitForm, formatBmi } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getPatientFormDataStrict } from '../services/patientData'
import { toLoadErrorMessage } from '../utils/retryRequest'
import './fieldPadding.css'
import './forms.css'
import CustomNumberField from '../components/form-components/CustomNumberField'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import ErrorNotification from 'src/components/form-components/ErrorNotification'
import DataLoadError from 'src/components/DataLoadError'
import { triageFormQuestionText } from './questions/TriageFormQuestions'

const validationSchema = Yup.object({
  triageQ1: Yup.number()
    .required('First reading systolic is required')
    .min(0, 'Value must be positive'),
  triageQ2: Yup.number()
    .required('First reading diastolic is required')
    .min(0, 'Value must be positive'),
  triageQHR1: Yup.number()
    .required('First reading heart rate is required')
    .min(0, 'Value must be positive'),
  triageQ3: Yup.number()
    .required('Second reading systolic is required')
    .min(0, 'Value must be positive'),
  triageQ4: Yup.number()
    .required('Second reading diastolic is required')
    .min(0, 'Value must be positive'),
  triageQHR2: Yup.number()
    .required('Second reading heart rate is required')
    .min(0, 'Value must be positive'),
  triageQ5: Yup.number().min(0, 'Value must be positive').nullable(),
  triageQ6: Yup.number().min(0, 'Value must be positive').nullable(),
  triageQHR3: Yup.number().min(0, 'Value must be positive').nullable(),
  triageQ7: Yup.number().nullable(),
  triageQ8: Yup.number().nullable(),
  triageQHRAvg: Yup.number().nullable(),
  triageQ9: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('This field is required'),
  triageQ10: Yup.number().required('Height is required').min(0, 'Value must be positive'),
  triageQ11: Yup.number().required('Weight is required').min(0, 'Value must be positive'),
  triageQ12: Yup.number().nullable(),
  triageQ13: Yup.number()
    .required('Waist circumference is required')
    .min(0, 'Value must be positive'),
  triageQ14: Yup.number().required('Temperature is required').min(0, 'Value must be positive'),
  triageQ15: Yup.number()
    .required('Neck circumference is required')
    .min(0, 'Value must be positive'),
  triageQ16: Yup.number().required('SpO2 is required').min(0, 'Value must be positive'),
})

const initialValues = {
  triageQ1: '',
  triageQ2: '',
  triageQHR1: '',
  triageQ3: '',
  triageQ4: '',
  triageQHR2: '',
  triageQ5: '',
  triageQ6: '',
  triageQHR3: '',
  triageQ7: '',
  triageQ8: '',
  triageQHRAvg: '',
  triageQ9: '',
  triageQ10: '',
  triageQ11: '',
  triageQ12: '',
  triageQ13: '',
  triageQ14: '',
  triageQ15: '',
  triageQ16: '',
}

function CalcBMI({ values }) {
  const { triageQ10: height_cm, triageQ11: weight } = values
  if (height_cm && weight) {
    return formatBmi(height_cm, weight)
  }
  return null
}

function IsHighBP({ systolic, diastolic }) {
  let message = ''
  if (systolic > 140) message = 'High systolic BP'
  if (diastolic > 90) message = 'High diastolic BP'
  if (message === '') return null
  return (
    <Fragment>
      <font color='red'>
        <b>{message}</b>
      </font>{' '}
      <br />
    </Fragment>
  )
}

function calculateAverage(reading1, reading2, reading3) {
  const num1 = parseFloat(reading1) || 0
  const num2 = parseFloat(reading2) || 0
  const num3 = parseFloat(reading3)

  if (reading3 == null || reading3 === '') {
    return Math.round((num1 + num2) / 2)
  }

  const diffs = [
    { diff: Math.abs(num1 - num2), pair: [num1, num2] },
    { diff: Math.abs(num1 - num3), pair: [num1, num3] },
    { diff: Math.abs(num2 - num3), pair: [num2, num3] },
  ]

  diffs.sort((a, b) => a.diff - b.diff)
  return Math.round((diffs[0].pair[0] + diffs[0].pair[1]) / 2)
}

const formName = 'triageForm'

const TriageForm = () => {
  const [loading, isLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const { patientId } = useContext(FormContext)
  const [saveData, setSaveData] = useState(initialValues)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let isCurrent = true

    const fetchData = async () => {
      try {
        setInitializing(true)
        setLoadError('')
        const savedData = await getPatientFormDataStrict(patientId, formName)
        if (isCurrent) {
          setSaveData({ ...initialValues, ...(savedData || {}) })
        }
      } catch (error) {
        console.error('Failed to load triage form:', error)
        if (isCurrent) {
          setLoadError(
            toLoadErrorMessage(error, 'Unable to load triage data. Refresh or try again.'),
          )
        }
      } finally {
        if (isCurrent) {
          setInitializing(false)
        }
      }
    }
    fetchData()

    return () => {
      isCurrent = false
    }
  }, [patientId, loadAttempt])

  const formOptions = {
    triageQ9: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const handleSubmit = async (model, { setSubmitting }) => {
    isLoading(true)
    setSubmitting(true)

    //calculated values
    model.triageQ7 = calculateAverage(model.triageQ1, model.triageQ3, model.triageQ5)
    model.triageQ8 = calculateAverage(model.triageQ2, model.triageQ4, model.triageQ6)
    model.triageQHRAvg = calculateAverage(model.triageQHR1, model.triageQHR2, model.triageQHR3)

    try {
      const response = await submitForm(model, patientId, formName)

      if (response.result) {
        await showFormSubmitSuccess()
        navigate('/app/dashboard')
      } else {
        showFormSubmitError(`Unsuccessful. ${response.error}`)
      }
    } catch (error) {
      showFormSubmitError(`Unsuccessful. ${error?.message || String(error)}`)
    } finally {
      isLoading(false)
      setSubmitting(false)
    }
  }
  return (
    <Paper elevation={2} p={0} m={0}>
      {initializing ? (
        <CircularProgress />
      ) : loadError ? (
        <DataLoadError
          message={loadError}
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      ) : (
        <Formik
          initialValues={saveData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, isSubmitting, submitCount, ...formikProps }) => (
            <Form>
              <div className='form--div'>
                <h1>Triage</h1>
                <h2>VITALS</h2>
                <h2>1) BLOOD PRESSURE</h2>
                <p>
                  (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last
                  30 minutes.)
                </p>

                <Grid container spacing={1}>
                  {/* First readings in the first row */}
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ1}
                    </Typography>
                    <Field
                      name='triageQ1'
                      component={CustomNumberField}
                      label='Triage Q1'
                      min={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ2}
                    </Typography>
                    <Field
                      name='triageQ2'
                      component={CustomNumberField}
                      label='Triage Q2'
                      min={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQHR1}
                    </Typography>
                    <Field
                      name='triageQHR1'
                      component={CustomNumberField}
                      label='TriageQHR1'
                      min={0}
                    />
                  </Grid>

                  {/* First row warnings for high BP */}
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP systolic={values.triageQ1} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP diastolic={values.triageQ2} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}></Grid>

                  {/* Second readings in the second row */}
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ3}
                    </Typography>
                    <Field
                      name='triageQ3'
                      component={CustomNumberField}
                      label='Triage Q3'
                      min={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ4}
                    </Typography>
                    <Field
                      name='triageQ4'
                      component={CustomNumberField}
                      label='Triage Q4'
                      min={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQHR2}
                    </Typography>
                    <Field
                      name='triageQHR2'
                      component={CustomNumberField}
                      label='TriageQHR2'
                      min={0}
                    />
                  </Grid>
                  {/* Second row warnings for high BP */}
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP systolic={values.triageQ3} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP diastolic={values.triageQ4} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}></Grid>

                  {/* Optional third readings in the third row */}
                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ5}
                    </Typography>
                    <Field
                      name='triageQ5'
                      component={CustomNumberField}
                      label='Triage Q5'
                      min={0}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQ6}
                    </Typography>
                    <Field
                      name='triageQ6'
                      component={CustomNumberField}
                      label='Triage Q6'
                      min={0}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant='h6' component='h3' sx={{ fontWeight: 'bold' }}>
                      {triageFormQuestionText.triageQHR3}
                    </Typography>
                    <Field
                      name='triageQHR3'
                      component={CustomNumberField}
                      label='TriageQHR3'
                      min={0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP systolic={values.triageQ5} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}>
                    <IsHighBP diastolic={values.triageQ6} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ mt: -2 }}></Grid>
                </Grid>

                <h3>Average Reading Systolic (average of closest 2 readings):</h3>
                <h3>
                  Calculated Average: &nbsp;
                  {calculateAverage(values.triageQ1, values.triageQ3, values.triageQ5)}
                </h3>
                <br />

                <h3>Average Reading Diastolic (average of closest 2 readings):</h3>
                <h3>
                  Calculated Average: &nbsp;
                  {calculateAverage(values.triageQ2, values.triageQ4, values.triageQ6)}
                </h3>
                <br />

                <h3>Average Reading Heart Rate (average of closest 2 readings):</h3>
                <h3>
                  Calculated Average: &nbsp;
                  {calculateAverage(values.triageQHR1, values.triageQHR2, values.triageQHR3)}
                </h3>
                <br />

                <h3>Hypertension criteria:</h3>
                <ul>
                  <li>Younger participants: BP &gt; 140/90</li>
                  <li>Participants &gt; 80 years old: BP &gt; 150/90</li>
                  <li>CKD w proteinuria (mod to severe albuminuria): &gt; 130/80</li>
                  <li>DM: &gt; 130/80</li>
                </ul>

                <h3>Malignant criteria:</h3>
                <ul>
                  <li>BP &gt; 180/120</li>
                </ul>
                <Typography fontWeight='bold' variant='h4'>
                  {triageFormQuestionText.triageQ9}
                </Typography>

                <Field
                  name='triageQ9'
                  component={CustomRadioGroup}
                  label='Triage Q9'
                  options={formOptions.triageQ9}
                  row
                />
                {values.triageQ9 === 'Yes' && (
                  <Alert severity='error' sx={{ mb: 2, fontWeight: 'bold' }}>
                    Please inform a Comm member immediately.
                  </Alert>
                )}

                <h2>2) BMI</h2>
                <h3>{triageFormQuestionText.triageQ10}</h3>
                <Field name='triageQ10' component={CustomNumberField} label='Triage Q10' min={0} />

                <h3>{triageFormQuestionText.triageQ11}</h3>
                <Field name='triageQ11' component={CustomNumberField} label='Triage Q11' min={0} />

                <h3>BMI:</h3>
                <CalcBMI values={values} />

                <h2>3) Waist Circumference</h2>
                <h3>{triageFormQuestionText.triageQ13}</h3>
                <Field name='triageQ13' component={CustomNumberField} label='Triage Q13' min={0} />

                <h2>4) Neck Circumference</h2>
                <h3>{triageFormQuestionText.triageQ15}</h3>
                <Field name='triageQ15' component={CustomNumberField} label='Triage Q15' min={0} />

                <h2>5) Ear Temperature Taking</h2>
                <h3>{triageFormQuestionText.triageQ14}</h3>
                <Field
                  name='triageQ14'
                  component={CustomNumberField}
                  label='Triage Q14'
                  min={0}
                  step={0.1}
                />

                <h2>6) Oxygen Saturation</h2>
                <h3>{triageFormQuestionText.triageQ16}</h3>
                <Field name='triageQ16' component={CustomNumberField} label='Triage Q16' min={0} />
              </div>

              {/* Display form errors */}
              <ErrorNotification
                show={submitCount > 0 && Object.keys(formikProps.errors || {}).length > 0}
                message='Please fill in all required fields correctly.'
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                {loading || isSubmitting ? (
                  <CircularProgress />
                ) : (
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    size='large'
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                )}
              </Box>

              <br />
              <Divider />
            </Form>
          )}
        </Formik>
      )}
    </Paper>
  )
}

export default TriageForm
