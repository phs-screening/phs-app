import React, { useContext, useEffect, useState } from 'react'
import { Paper, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, FastField, ErrorMessage, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import '../fieldPadding.css'
import PopupText from 'src/utils/popupText'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup.jsx'
import CustomTextField from '../../components/form-components/CustomTextField.jsx'
import { geriPhqFormQuestionText } from '../questions/GeriPhqFormQuestions'

const formName = 'geriPhqForm'

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
]

const yesNo = ['Yes', 'No']

const DisabledWrapper = ({ children }) => (
  <div style={{ pointerEvents: 'none', opacity: 0.6 }}>{children}</div>
)

const GetScore = () => {
  const { values } = useFormikContext()
  const [score, setScore] = useState(0)

  useEffect(() => {
    const pointsMap = {
      '0 - Not at all': 0,
      '1 - Several days': 1,
      '2 - More than half the days': 2,
      '3 - Nearly everyday': 3,
    }
    const qns = ['PHQ1', 'PHQ2', 'PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8', 'PHQ9']
    const total = qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)
    setScore(total)
  }, [values])

  return (
    <Typography variant='subtitle1' sx={{ color: score >= 10 ? 'red' : 'blue' }}>
      Score: {score} / 27{score >= 10 ? ' - Patient fails PHQ, score is 10 and above' : ''}
    </Typography>
  )
}

const pointsMap = {
  '0 - Not at all': 0,
  '1 - Several days': 1,
  '2 - More than half the days': 2,
  '3 - Nearly everyday': 3,
}

export default function GeriPhqForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(null)
  const [loading, setLoading] = useState(false)

  const initialValues = {
    PHQ1: '',
    PHQ2: '',
    PHQ3: '',
    PHQ4: '',
    PHQ5: '',
    PHQ6: '',
    PHQ7: '',
    PHQ8: '',
    PHQ9: '',
    PHQExtra9: '',
    PHQ11: '',
    PHQShortAns11: '',
  }

  // PHQ9 is the only field entered here. Everything else is History Taking data
  // shown for reference, and PHQ3-PHQ8 are no longer collected at all — requiring
  // them would make this form permanently unsubmittable.
  const validationSchema = Yup.object({
    PHQ9: Yup.string().oneOf(dayRange).required('Required'),
    PHQExtra9: Yup.string().when('PHQ9', {
      is: (phq9) => Boolean(phq9) && phq9 !== '0 - Not at all',
      then: (schema) => schema.oneOf(yesNo).required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  })

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSavedData(patientId, formName)
      if (data) {
        setSavedData({
          ...initialValues,
          ...data,
        })
      } else {
        setSavedData(initialValues)
      }
    }
    fetchData()
  }, [patientId])

  if (!savedData) {
    return <CircularProgress />
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    // Only PHQ9 and its follow-up are entered here; the rest is reference data
    // from History Taking and must not be written back.
    const submittedValues = {
      PHQ9: values.PHQ9,
      PHQExtra9: values.PHQ9 === '0 - Not at all' ? '' : values.PHQExtra9,
      // Keep the running PHQ total in step with the answer just recorded.
      PHQ10:
        (pointsMap[values.PHQ1] || 0) +
        (pointsMap[values.PHQ2] || 0) +
        (pointsMap[values.PHQ9] || 0),
    }

    setLoading(true)
    const response = await submitForm(submittedValues, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      await showFormSubmitSuccess()
      if (changeTab) changeTab(null, nextTab)
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
            <Typography variant='h6' color='error' fontWeight='bold'>
              **PHQ1-PHQ8 are from History Taking. Please complete PHQ9 below.**
            </Typography>
            <Typography variant='subtitle1' fontWeight='bold'>
              Over the last 2 weeks, how often have you been bothered by any of the following
              problems?
            </Typography>

            {submitCount > 0 && Object.keys(errors || {}).length > 0 && (
              <Typography color='error' variant='body2' sx={{ mb: 1 }}>
                Please fill in all required fields correctly.
              </Typography>
            )}

            {/* PHQ1-PHQ8 are recorded at History Taking and shown here for reference only. */}
            <DisabledWrapper>
              {['PHQ1', 'PHQ2', 'PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8'].map((name, i) => (
                <FastField
                  key={name}
                  name={name}
                  label={`${i + 1}. ${geriPhqFormQuestionText[name]}`}
                  component={CustomRadioGroup}
                  options={dayRange.map((val) => ({ label: val, value: val }))}
                  row
                />
              ))}
            </DisabledWrapper>

            {/* PHQ9 is entered at this station. */}
            <Typography variant='subtitle1' fontWeight='bold' sx={{ mt: 2 }}>
              Please complete the following:
            </Typography>
            <FastField
              name='PHQ9'
              label={`9. ${geriPhqFormQuestionText.PHQ9}`}
              component={CustomRadioGroup}
              options={dayRange.map((val) => ({ label: val, value: val }))}
              row
            />

            {/* Follow-up to PHQ9, so it is entered here too. */}
            <PopupText
              qnNo='PHQ9'
              triggerValue={['1 - Several days', '2 - More than half the days', '3 - Nearly everyday']}
            >
              <FastField
                name='PHQExtra9'
                label={geriPhqFormQuestionText.PHQExtra9}
                component={CustomRadioGroup}
                options={yesNo.map((v) => ({ label: v, value: v }))}
                row
              />
            </PopupText>
            <PopupText qnNo='PHQExtra9' triggerValue='Yes'>
              <Typography variant='subtitle1' sx={{ color: 'red' }}>
                <b>
                  *Patient requires urgent attention, please escalate to supervisor of the station to
                  bring to Doctor&apos;s station*
                </b>
              </Typography>
            </PopupText>

            <DisabledWrapper>
              <Typography variant='subtitle1' fontWeight='bold'>
                Score:
              </Typography>
              <GetScore />

              <FastField
                name='PHQ11'
                label={geriPhqFormQuestionText.PHQ11}
                component={CustomRadioGroup}
                options={yesNo.map((v) => ({ label: v, value: v }))}
                row
              />
              <Typography variant='subtitle2'>{geriPhqFormQuestionText.PHQShortAns11}</Typography>
              <FastField
                name='PHQShortAns11'
                component={CustomTextField}
                fullWidth
                multiline
                sx={{ mb: 3, mt: 1 }}
              />
              <ErrorMessage name='PHQShortAns11' component='div' style={{ color: 'red' }} />

            </DisabledWrapper>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
              Greyed-out answers were recorded at History Taking and cannot be edited here.
            </Typography>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button type='submit' variant='contained' color='primary'>
                  Submit
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
