import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from 'src/utils/popupText'
import allForms from '../forms.json'
import { hxHcsrFormQuestionText } from '../questions/HxHcsrFormQuestions'

const formName = 'hxHcsrReviewForm'

const initialValues = {
  hxHcsrQ7: '',
  hxHcsrShortAnsQ7: '',
}

const MAYBE_M4M5 = 'Maybe(Refer to M4/M5)'

// "Yes" refers to the Doctor's Station via the backend eligibility rule; "Maybe"
// defers that decision to the M4/M5 Review tab instead. Both ask for a reason.
const REASON_REQUIRED_ANSWERS = ['Yes', MAYBE_M4M5]

const validationSchema = Yup.object({
  hxHcsrQ7: Yup.string().oneOf(['Yes', 'No', MAYBE_M4M5]).required('Required'),
})

const formOptions = {
  hxHcsrQ7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: MAYBE_M4M5, value: MAYBE_M4M5 },
  ],
}

export default function HxHcsrReviewForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [reviewData, legacyHcsrData] = await Promise.all([
        getSavedData(patientId, formName),
        getSavedData(patientId, allForms.hxHcsrForm),
      ])
      const source = Object.prototype.hasOwnProperty.call(reviewData || {}, 'hxHcsrQ7')
        ? reviewData
        : legacyHcsrData
      setSavedData({
        hxHcsrQ7: source?.hxHcsrQ7 || '',
        hxHcsrShortAnsQ7: source?.hxHcsrShortAnsQ7 || '',
      })
    }

    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    const submittedValues = {
      ...values,
      hxHcsrShortAnsQ7: REASON_REQUIRED_ANSWERS.includes(values.hxHcsrQ7)
        ? values.hxHcsrShortAnsQ7
        : '',
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
              <strong>HEALTH CONCERNS REVIEW</strong>
            </Typography>
            <Typography variant='h4' fontWeight='bold'>
              {hxHcsrFormQuestionText.hxHcsrQ7}
            </Typography>
            <FastField
              name='hxHcsrQ7'
              label='hxHcsrQ7'
              component={CustomRadioGroup}
              options={formOptions.hxHcsrQ7}
              row
            />

            <PopupText qnNo='hxHcsrQ7' triggerValue={REASON_REQUIRED_ANSWERS}>
              <Typography variant='subtitle1' fontWeight='bold'>
                {hxHcsrFormQuestionText.hxHcsrShortAnsQ7}
              </Typography>
              <FastField
                name='hxHcsrShortAnsQ7'
                label='hxHcsrShortAnsQ7'
                component={CustomTextField}
                fullWidth
                multiline
                sx={{ mb: 3, mt: 1 }}
              />
            </PopupText>

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
