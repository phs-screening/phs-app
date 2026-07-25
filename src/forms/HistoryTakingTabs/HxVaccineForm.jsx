import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'

const formName = 'hxVaccineForm'

const initialValues = {
  VAXHX1: '',
  VAXHX2: '',
  VAXHX3: '',
  VAXHX4: '',
}

const validationSchema = Yup.object({
  VAXHX1: Yup.string().required('Required'),
  VAXHX2: Yup.string().required('Required'),
  VAXHX3: Yup.string().required('Required'),
  VAXHX4: Yup.string().required('Required'),
})

const yesNoUnsure = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Unsure', value: 'Unsure' },
]

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  VAXHX1: yesNoUnsure,
  VAXHX2: yesNoUnsure,
  VAXHX3: yesNoUnsure,
  VAXHX4: yesNo,
}

export default function HxVaccineForm({ changeTab, nextTab }) {
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
          <Typography variant='h4' gutterBottom>
            <strong>VACCINATION SCREENING</strong>
          </Typography>
          <Typography gutterBottom>
            For vaccine history, if the participant is unsure, select <strong>Unsure</strong> (treated
            as not received). Note: the pneumococcal vaccine applies to those above 65, and the
            shingles vaccine to those above 50 &mdash; the age check is handled automatically.
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            Have you received an influenza (flu) vaccine in the last year?
          </Typography>
          <FastField
            name='VAXHX1'
            label='VAXHX1'
            component={CustomRadioGroup}
            options={formOptions.VAXHX1}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Have you received a pneumococcal vaccine?
          </Typography>
          <FastField
            name='VAXHX2'
            label='VAXHX2'
            component={CustomRadioGroup}
            options={formOptions.VAXHX2}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Have you received a shingles vaccine?
          </Typography>
          <FastField
            name='VAXHX3'
            label='VAXHX3'
            component={CustomRadioGroup}
            options={formOptions.VAXHX3}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you interested in receiving vaccination?
          </Typography>
          <FastField
            name='VAXHX4'
            label='VAXHX4'
            component={CustomRadioGroup}
            options={formOptions.VAXHX4}
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

  return <Paper elevation={2}>{renderForm()}</Paper>
}
