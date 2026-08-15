import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup.jsx'
import ErrorNotification from '../components/form-components/ErrorNotification.jsx'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'
import './forms.css'
import { cancer365FormQuestionText } from './questions/Cancer365FormQuestions'

const formName = 'cancer365Form'

const initialValues = {
  cancer365Q1: '',
}

const validationSchema = Yup.object({
  cancer365Q1: Yup.string().required('Required'),
})

const formOptions = {
  cancer365Q1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const Cancer365Form = () => {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...savedData })
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)

    if (response.result) {
      await showFormSubmitSuccess()
      navigate('/app/dashboard', { replace: true })
    } else {
      showFormSubmitError(`Unsuccessful. ${response.error}`)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, submitCount }) => (
          <Form className='fieldPadding'>
            <Typography variant='h4'>
              <strong>365 Cancer Screening</strong>
            </Typography>
            <Typography fontWeight='bold'>{cancer365FormQuestionText.cancer365Q1}</Typography>
            <FastField
              name='cancer365Q1'
              label='cancer365Q1'
              component={CustomRadioGroup}
              options={formOptions.cancer365Q1}
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
    </Paper>
  )
}

export default Cancer365Form
