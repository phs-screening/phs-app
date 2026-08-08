import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../api/formHelpers.jsx'
import { FormContext } from '../api/utils.js'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup.jsx'
import DataLoadError from '../components/DataLoadError.jsx'
import ErrorNotification from '../components/form-components/ErrorNotification.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../components/form-components/FormSubmitStatusHost.jsx'
import { getPatientFormDataStrict } from '../services/patientData'
import { toLoadErrorMessage } from '../utils/retryRequest.js'
import { arthritisFormQuestionText } from './questions/ArthritisFormQuestions.js'
import './fieldPadding.css'
import './forms.css'

const formName = 'arthritisForm'

const initialValues = {
  NAF1: '',
}

const validationSchema = Yup.object({
  NAF1: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('NAF screening attendance is required'),
})

const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const ArthritisForm = () => {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let isCurrent = true

    const fetchData = async () => {
      try {
        setInitializing(true)
        setLoadError('')
        const data = await getPatientFormDataStrict(patientId, formName)
        if (isCurrent) setSavedData({ ...initialValues, ...(data || {}) })
      } catch (error) {
        console.error('Failed to load arthritis form:', error)
        if (isCurrent) {
          setLoadError(
            toLoadErrorMessage(error, 'Unable to load arthritis data. Refresh or try again.'),
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    try {
      const response = await submitForm(values, patientId, formName)

      if (response.result) {
        await showFormSubmitSuccess()
        navigate('/app/dashboard', { replace: true })
      } else {
        showFormSubmitError(`Unsuccessful. ${response.error}`)
      }
    } catch (error) {
      showFormSubmitError(`Unsuccessful. ${error?.message || String(error)}`)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <Paper elevation={2}>
      {initializing ? (
        <CircularProgress />
      ) : loadError ? (
        <DataLoadError
          message={loadError}
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      ) : (
        <Formik
        initialValues={savedData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, submitCount }) => (
          <Form className='fieldPadding'>
            <Typography variant='h4'>
              <strong>Arthritis</strong>
            </Typography>
            <Typography fontWeight='bold'>{arthritisFormQuestionText.NAF1}</Typography>
            <FastField
              name='NAF1'
              label=''
              component={CustomRadioGroup}
              options={yesNoOptions}
              row
            />

            <ErrorNotification
              show={submitCount > 0 && Object.keys(errors || {}).length > 0}
              message='Please fill in all required fields correctly.'
            />

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button type='submit' variant='contained' color='primary'>
                  Submit
                </Button>
              )}
            </div>
            <br />
            <Divider />
          </Form>
        )}
        </Formik>
      )}
    </Paper>
  )
}

export default ArthritisForm
