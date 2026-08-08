import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import DataLoadError from '../../components/DataLoadError.jsx'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup.jsx'
import ErrorNotification from '../../components/form-components/ErrorNotification.jsx'
import { getPatientFormDataStrict } from '../../services/patientData'
import { toLoadErrorMessage } from '../../utils/retryRequest.js'
import '../fieldPadding.css'
import '../forms.css'
import { hxM4M5ReviewFormQuestionText } from '../questions/HxM4M5ReviewFormQuestions'
//import allForms from '../forms.json'

const formName = 'hxM4M5ReviewForm'

const initialValues = {
  hxM4M5Q1: '',
}

const validationSchema = Yup.object({
  hxM4M5Q1: Yup.string().required('Required'),
})

const formOptions = {
  hxM4M5Q1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const HxM4M5ReviewForm = () => {
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
        const savedData = await getPatientFormDataStrict(patientId, formName)
        if (isCurrent) setSavedData({ ...initialValues, ...(savedData || {}) })
      } catch (error) {
        console.error('Failed to load M4/M5 review form:', error)
        if (isCurrent) {
          setLoadError(
            toLoadErrorMessage(error, 'Unable to load M4/M5 review data. Refresh or try again.'),
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
        navigate('/app/dashboard')
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

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4'>
            <strong>M4/M5 Review</strong>
          </Typography>
          <Typography fontWeight='bold'>{hxM4M5ReviewFormQuestionText.hxM4M5Q1}</Typography>
          <FastField
            name='hxM4M5Q1'
            label='hxM4M5Q1'
            component={CustomRadioGroup}
            options={formOptions.hxM4M5Q1}
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
  )

  return (
    <Paper elevation={2}>
      {initializing ? (
        <CircularProgress aria-label='Loading M4/M5 review data' />
      ) : loadError ? (
        <DataLoadError
          message={loadError}
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      ) : (
        renderForm()
      )}
    </Paper>
  )
}

export default HxM4M5ReviewForm
