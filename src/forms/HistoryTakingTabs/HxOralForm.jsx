import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import { hxOralFormQuestionText } from '../questions/HxOralFormQuestions'

const formName = 'hxOralForm'

const initialValues = {
  ORAL1: '',
  ORAL3: '',
}

const validationSchema = Yup.object({
  ORAL1: Yup.string().oneOf(['Healthy', 'Poor']).required('Required'),
  ORAL3: Yup.string().required('Required'),
})

const formOptions = {
  ORAL1: [
    { label: 'Healthy', value: 'Healthy' },
    { label: 'Poor', value: 'Poor' },
  ],
  ORAL3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

export default function HxOralForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      const formData = { ...initialValues, ...res }
      delete formData.ORAL2
      delete formData.ORAL4
      delete formData.ORAL5
      delete formData.ORALShortAns5
      setSavedData(formData)
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

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>ORAL ISSUES</strong>
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL1}
          </Typography>
          <FastField
            name='ORAL1'
            label='ORAL1'
            component={CustomRadioGroup}
            options={formOptions.ORAL1}
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL3}
          </Typography>
          <img
            src='/images/dentistry_check.png'
            alt='Reference list of dental concerns'
            style={{ maxWidth: '100%' }}
          />
          <FastField
            name='ORAL3'
            label='ORAL3'
            component={CustomRadioGroup}
            options={formOptions.ORAL3}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            The dental examination booth will only provide <u>simple dental screening</u>, there
            will be no treatment provided on site (e.g. scaling and polishing)
          </Typography>
          <Typography variant='subtitle1' fontWeight='bold'>
            <span style={{ color: 'red' }}>Please help to emphasise that: </span>
            screening DOES NOT take the place of a thorough oral health examination with a dentist.
          </Typography>

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

  return <Paper elevation={2}>{renderForm()}</Paper>
}
