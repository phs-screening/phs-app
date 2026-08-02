import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'

import { submitForm } from '../../api/formHelpers.jsx'
import { FormContext } from '../../api/utils.js'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup.jsx'
import ErrorNotification from '../../components/form-components/ErrorNotification.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../../components/form-components/FormSubmitStatusHost.jsx'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'
import { hxOsaFormQuestionText } from './HxOsaFormQuestions'

const formName = 'hxOsaForm'

const initialValues = {
  OSA1: '',
  OSA2: '',
  OSA3: '',
  OSA4: '',
}

const validationSchema = Yup.object({
  OSA1: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  OSA2: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  OSA3: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  OSA4: Yup.string().oneOf(['Yes', 'No']).required('Required'),
})

const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

export default function HxOsaForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...data })
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
      changeTab(null, nextTab)
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
            <Typography variant='h4' gutterBottom>
              <strong>Obstructive Sleep Apnea (for research)</strong>
            </Typography>

            <FastField
              name='OSA1'
              label={hxOsaFormQuestionText.OSA1}
              component={CustomRadioGroup}
              options={yesNoOptions}
              row
            />
            <FastField
              name='OSA2'
              label={hxOsaFormQuestionText.OSA2}
              component={CustomRadioGroup}
              options={yesNoOptions}
              row
            />
            <FastField
              name='OSA3'
              label={hxOsaFormQuestionText.OSA3}
              component={CustomRadioGroup}
              options={yesNoOptions}
              row
            />
            <FastField
              name='OSA4'
              label={hxOsaFormQuestionText.OSA4}
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
    </Paper>
  )
}
