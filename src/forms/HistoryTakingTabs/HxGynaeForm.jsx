import React, { useContext, useEffect, useState } from 'react'
import { Paper, Divider, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, Field, FastField } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import PopupText from 'src/utils/popupText.jsx'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import '../fieldPadding.css'
import '../forms.css'
import { hxGynaeFormQuestionText } from '../questions/HxGynaeFormQuestions'

const formName = 'gynaeForm'

const initialValues = {
  GYNAE12: '',
  GYNAE13: '',
  GYNAE14: '',
  GYNAE15: '',
  GYNAE16: '',
  GYNAE17: '',
  GYNAE18: '',
}

// GYNAE17 gates the rest of the form: the remaining questions are only asked
// when the participant has indicated interest in the HPV test under SCS.
const requiredWhenInterested = () =>
  Yup.string().when('GYNAE17', {
    is: 'Yes',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  })

const validationSchema = Yup.object({
  GYNAE17: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  GYNAE12: requiredWhenInterested(),
  GYNAE13: requiredWhenInterested(),
  GYNAE14: requiredWhenInterested(),
  GYNAE15: requiredWhenInterested(),
  GYNAE16: requiredWhenInterested(),
  GYNAE18: requiredWhenInterested(),
})

const formOptions = {
  YESNO: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  GYNAE12: [
    { label: 'Never before', value: 'Never before' },
    { label: 'Less than 5 years ago', value: 'Less than 5 years ago' },
    { label: '5 years or longer', value: '5 years or longer' },
  ],
  GYNAE13: [
    { label: 'Never before', value: 'Never before' },
    { label: 'Within the last 3 years', value: 'Within the last 3 years' },
    { label: '3 years or longer', value: '3 years or longer' },
  ],
}

export default function HxGynaeForm({ changeTab, nextTab }) {
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
    // Only GYNAE17 is asked when the participant is not interested; clear the rest
    // so a changed answer never leaves stale values behind.
    const submittedValues =
      values.GYNAE17 === 'Yes'
        ? values
        : {
            ...values,
            GYNAE12: '',
            GYNAE13: '',
            GYNAE14: '',
            GYNAE15: '',
            GYNAE16: '',
            GYNAE18: '',
          }

    setLoading(true)
    const response = await submitForm(submittedValues, patientId, formName)
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
      {({ isSubmitting, submitCount, errors }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4'>
            <strong>GYNECOLOGY</strong>
          </Typography>
          <Typography fontWeight='bold' color='error' sx={{ mb: 2 }}>
            This form should only be submitted for female participants
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxGynaeFormQuestionText.GYNAE17}
          </Typography>
          <FastField
            name='GYNAE17'
            label='GYNAE17'
            component={CustomRadioGroup}
            options={formOptions.YESNO}
            row
          />

          {/* The rest of the gynae history is only asked when GYNAE17 is Yes. */}
          <PopupText qnNo='GYNAE17' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE12}
            </Typography>
            <FastField
              name='GYNAE12'
              label='GYNAE12'
              component={CustomRadioGroup}
              options={formOptions.GYNAE12}
              row
            />

            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE13}
            </Typography>
            <FastField
              name='GYNAE13'
              label='GYNAE13'
              component={CustomRadioGroup}
              options={formOptions.GYNAE13}
              row
            />

            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE14}
            </Typography>
            <FastField
              name='GYNAE14'
              label='GYNAE14'
              component={CustomRadioGroup}
              options={formOptions.YESNO}
              row
            />

            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE15}
            </Typography>
            <FastField
              name='GYNAE15'
              label='GYNAE15'
              component={CustomRadioGroup}
              options={formOptions.YESNO}
              row
            />

            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE16}
            </Typography>
            <FastField
              name='GYNAE16'
              label='GYNAE16'
              component={CustomRadioGroup}
              options={formOptions.YESNO}
              row
            />

            <Typography variant='subtitle1' fontWeight='bold'>
              {hxGynaeFormQuestionText.GYNAE18}
            </Typography>
            <FastField
              name='GYNAE18'
              label='GYNAE18'
              component={CustomRadioGroup}
              options={formOptions.YESNO}
              row
            />
          </PopupText>

          <ErrorNotification
            show={Object.keys(errors).length > 0 && submitCount > 0}
            message='Please correct the errors above before submitting.'
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
