import React, { useContext, useEffect, useState } from 'react'
import { Paper, Divider, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import CustomCheckboxGroup from '../../components/form-components/CustomCheckboxGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from '../../utils/popupText'

const formName = 'hxFamilyForm'

const initialValues = {
  FAMILY1: '',
  FAMILYShortAns1: '',
  FAMILY2: [],
}

const validationSchema = Yup.object({
  FAMILY1: Yup.string().required('This field is required'),
})

const formOptions = {
  FAMILY1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  FAMILY2: [
    { label: 'Kidney Disease', value: 'Kidney Disease' },
    { label: 'Diabetes', value: 'Diabetes' },
    { label: 'Hypertension', value: 'Hypertension' },
  ],
}

export default function HxFamilyForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...res })
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
          <Typography variant='h4'>
            <strong>FAMILY HISTORY</strong>
          </Typography>
          <Typography variant='h6'>
            Does the patient have any relevant family history they would like the doctor to know
            about?
          </Typography>
          <FastField
            name='FAMILY1'
            label='FAMILY1'
            component={CustomRadioGroup}
            options={formOptions.FAMILY1}
            row
          />
          <PopupText qnNo='FAMILY1' triggerValue='Yes'>
            <Typography fontWeight='bold'>Please specify:</Typography>
            <FastField
              name='FAMILYShortAns1'
              label='FAMILYShortAns1'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='h6'>Any positive family history for these conditions?</Typography>
          <FastField
            name='FAMILY2'
            label='FAMILY2'
            component={CustomCheckboxGroup}
            options={formOptions.FAMILY2}
          />

          <ErrorNotification 
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message="Please fill in all required fields correctly."
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
      {renderForm()}
    </Paper>
  )
}
