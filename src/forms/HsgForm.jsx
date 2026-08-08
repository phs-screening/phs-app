import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, Button, Typography, Box } from '@mui/material'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getPatientFormDataStrict } from '../services/patientData'
import DataLoadError from '../components/DataLoadError'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import ErrorNotification from '../components/form-components/ErrorNotification'
import PopupText from '../utils/popupText'
import './fieldPadding.css'
import { useNavigate } from 'react-router-dom'
import { hsgFormQuestionText } from './questions/HsgFormQuestions'
import { toLoadErrorMessage } from '../utils/retryRequest'

const validationSchema = Yup.object({
  HSG1: Yup.string()
    .oneOf([
      'Yes, I signed up for HSG today',
      'No, I did not sign up for HSG',
      'No, I am already on HSG',
    ])
    .required('This field is required'),
  HSG2: Yup.string().when('HSG1', {
    is: 'No, I did not sign up for HSG',
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
})

const formName = 'hsgForm'

const initialValues = {
  HSG1: '',
  HSG2: '',
}

const HsgForm = () => {
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
        if (isCurrent) setSaveData({ ...initialValues, ...(savedData || {}) })
      } catch (error) {
        console.error('Failed to load Healthier SG form:', error)
        if (isCurrent) {
          setLoadError(
            toLoadErrorMessage(error, 'Unable to load Healthier SG data. Refresh or try again.'),
          )
        }
      } finally {
        if (isCurrent) setInitializing(false)
      }
    }
    fetchData()

    return () => {
      isCurrent = false
    }
  }, [patientId, loadAttempt])

  // Form options
  const formOptions = {
    HSG1: [
      {
        label: 'Yes, I signed up for HSG today',
        value: 'Yes, I signed up for HSG today',
      },
      { label: 'No, I did not sign up for HSG', value: 'No, I did not sign up for HSG' },
      { label: 'No, I am already on HSG', value: 'No, I am already on HSG' },
    ],
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    isLoading(true)
    setSubmitting(true)

    try {
      const response = await submitForm(values, patientId, formName)

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
        {({ isSubmitting, submitCount, errors }) => (
          <Form className='fieldPadding'>
            <div className='form--div'>
              <Typography variant='h4' component='h1' gutterBottom>
                HealthierSG
              </Typography>

              <Typography variant='h6' component='h3' gutterBottom>
                {hsgFormQuestionText.HSG1}
              </Typography>

              <FastField
                name='HSG1'
                label='HSG1'
                component={CustomRadioGroup}
                options={formOptions.HSG1}
              />

              <PopupText qnNo='HSG1' triggerValue='No, I did not sign up for HSG'>
                <Typography variant='h6' component='h4' gutterBottom sx={{ mt: 2 }}>
                  {hsgFormQuestionText.HSG2}
                </Typography>
                <FastField
                  name='HSG2'
                  label='HSG2'
                  component={CustomTextField}
                  multiline
                  rows={4}
                />
              </PopupText>
            </div>

            <ErrorNotification
              show={Object.keys(errors).length > 0 && submitCount > 0}
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

export default HsgForm
