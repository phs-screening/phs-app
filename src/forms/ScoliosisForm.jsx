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
import CustomTextField from '../components/form-components/CustomTextField.jsx'
import ErrorNotification from '../components/form-components/ErrorNotification.jsx'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'
import { scoliosisFormQuestionText } from './ScoliosisFormQuestions'

const formName = 'scoliosisForm'

const initialValues = {
  scoliosisQ1: '',
  scoliosisQ2: '',
}

const completionOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const validationSchema = Yup.object({
  scoliosisQ1: Yup.string().required('Required'),
  scoliosisQ2: Yup.string(),
})

const ScoliosisForm = () => {
  const { patientId } = useContext(FormContext)
  const [saveData, setSaveData] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData({ ...initialValues, ...savedData })
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
        initialValues={saveData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting, submitCount }) => (
          <Form className='fieldPadding'>
            <Typography variant='h4' fontWeight='bold'>
              Scoliosis
            </Typography>

            <Typography fontWeight='bold'>{scoliosisFormQuestionText.scoliosisQ1}</Typography>
            <FastField
              name='scoliosisQ1'
              label='scoliosisQ1'
              component={CustomRadioGroup}
              options={completionOptions}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {scoliosisFormQuestionText.scoliosisQ2}
            </Typography>
            <FastField
              name='scoliosisQ2'
              label='scoliosisQ2'
              component={CustomTextField}
              fullWidth
              multiline
              minRows={6}
            />

            <ErrorNotification
              show={submitCount > 0 && Object.keys(errors).length > 0}
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

export default ScoliosisForm
