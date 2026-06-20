import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, CircularProgress, Divider, Button, Typography } from '@mui/material'

import { submitForm } from '../api/formHelpers.jsx'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'

import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import ErrorNotification from '../components/form-components/ErrorNotification'

const initialValues = {
  HPV1: '',
}

const validationSchema = Yup.object().shape({
  HPV1: Yup.string().required('This field is required'),
})

const formOptions = {
  HPV1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const formName = 'hpvForm'

const HpvForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const [savedData, setSavedData] = useState(initialValues)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      const reg = await getSavedData(patientId, 'registrationForm')
      if (reg?.registrationQ5 === 'Male') {
        alert('This patient is not female. Are you sure you want to proceed with the HPV form?')
      }
      setSavedData({ ...initialValues, ...res })
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    try {
      const response = await submitForm(values, patientId, formName)
      if (response.result) {
        setTimeout(() => {
          alert('Successfully submitted form')
          navigate('/app/dashboard')
        }, 80)
      } else {
        setTimeout(() => {
          alert(`Unsuccessful. ${response.error}`)
        }, 80)
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, submitCount, errors }) => (
        <Form className='fieldPadding'>
          <div className='form--div'>
            <h1>On-Site HPV Testing</h1>
            <h3>Registration & Testing</h3>

            <Typography variant='h6'>
              Has the patient completed the registration forms and finished the on-site testing?
            </Typography>
            <FastField
              name='HPV1'
              label='HPV1'
              component={CustomRadioGroup}
              options={formOptions.HPV1}
              row
            />
          </div>

          <ErrorNotification 
            show={Object.keys(errors).length > 0 && submitCount > 0}
            message="Please correct the errors above before submitting."
          />

          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
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
    <Paper elevation={2} p={0} m={0}>
      {renderForm()}
    </Paper>
  )
}

export default HpvForm