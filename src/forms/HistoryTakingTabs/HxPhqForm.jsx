import React, { useContext, useEffect, useState } from 'react'
import { Paper, Divider, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, useFormikContext, FastField } from 'formik'
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
import CustomTextField from 'src/components/form-components/CustomTextField.jsx'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import '../fieldPadding.css'
import { hxPhqFormQuestionText } from '../questions/HxPhqFormQuestions'

const formName = 'geriPhqForm'

const pointsMap = {
  '0 - Not at all': 0,
  '1 - Several days': 1,
  '2 - More than half the days': 2,
  '3 - Nearly everyday': 3,
}

// Referral cutoff for the Mental Health station. PHQ-2 (PHQ1 + PHQ2) and GAD-2
// (GAD1 + GAD2) are each scored out of 6; either reaching 3 refers the patient.
// Must stay in step with the `mentalHealth` rule in the backend stationEligibility.
export const REFERRAL_CUTOFF = 3

const sumScore = (values, qns) => qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)

// PHQ-4 = PHQ-2 (depression) + GAD-2 (anxiety), each scored out of 6 and each
// evaluated independently: whichever sub-scale reaches the cutoff decides what
// the patient is referred to the Mental Health station for.
export const referralReason = (phq2, gad2) => {
  const depression = phq2 >= REFERRAL_CUTOFF
  const anxiety = gad2 >= REFERRAL_CUTOFF
  if (depression && anxiety) return 'depression and anxiety'
  if (depression) return 'depression'
  if (anxiety) return 'anxiety'
  return null
}

const GetScore = () => {
  const { values } = useFormikContext()
  const phq2 = sumScore(values, ['PHQ1', 'PHQ2'])
  const gad2 = sumScore(values, ['GAD1', 'GAD2'])
  const reason = referralReason(phq2, gad2)

  return (
    <Typography variant='subtitle1' sx={{ color: reason ? 'red' : 'blue' }}>
      PHQ-2 score: {phq2} / 6 (depression)
      <br />
      GAD-2 score: {gad2} / 6 (anxiety)
      {reason ? (
        <>
          <br />
          <b>Refer to Mental Health for {reason}.</b>
        </>
      ) : (
        ''
      )}
    </Typography>
  )
}

const initialValues = {
  PHQ1: '',
  PHQ2: '',
  PHQ9: '',
  PHQExtra9: '',
  GAD1: '',
  GAD2: '',
  PHQ10: 0,
  PHQ11: '',
  PHQShortAns11: '',
}

const validationSchema = Yup.object({
  PHQ1: Yup.string().required('Required'),
  PHQ2: Yup.string().required('Required'),
  // PHQ9 is only asked once PHQ-2 reaches the referral cutoff.
  PHQ9: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) =>
      (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0) >= REFERRAL_CUTOFF,
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  // Asked whenever PHQ9 is anything other than "Not at all".
  PHQExtra9: Yup.string().when(['PHQ9'], {
    is: (phq9) => (pointsMap[phq9] || 0) >= 1,
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  GAD1: Yup.string().required('Required'),
  GAD2: Yup.string().required('Required'),
  PHQ11: Yup.string().required('Required'),
})

const formOptions = {
  DAYRANGE: [
    { label: '0 - Not at all', value: '0 - Not at all' },
    { label: '1 - Several days', value: '1 - Several days' },
    { label: '2 - More than half the days', value: '2 - More than half the days' },
    { label: '3 - Nearly everyday', value: '3 - Nearly everyday' },
  ],
  PHQExtra9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PHQ11: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

export default function HxPhqForm({ changeTab, nextTab }) {
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
    // PHQ10 is the running PHQ total. History taking only contributes PHQ1, PHQ2
    // and PHQ9; PHQ3-PHQ8 are added when the Mental Health station completes them.
    const submittedValues = {
      ...values,
      PHQ10: sumScore(values, ['PHQ1', 'PHQ2', 'PHQ9']),
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
      {({
        isSubmitting,
        values,
        setFieldValue,
        setFieldTouched,
        submitCount,
        errors,
        ...formikProps
      }) => {
        const score = sumScore(values, ['PHQ1', 'PHQ2'])

        // Clear PHQ9 and its follow-up if PHQ-2 drops back below the cutoff.
        useEffect(() => {
          if (score < REFERRAL_CUTOFF) {
            ;['PHQ9', 'PHQExtra9'].forEach((qn) => {
              setFieldValue(qn, '', false)
              setFieldTouched(qn, false, false)
            })
          }
        }, [score, setFieldValue, setFieldTouched])

        return (
          <Form className='fieldPadding'>
            <Typography variant='h4'>
              <strong>PHQ</strong>
            </Typography>
            <Typography variant='subtitle1' fontWeight='bold' color='red'>
              **When asking these questions, please let patient know that it can be sensitive**
            </Typography>
            <Typography variant='subtitle1' fontWeight='bold'>
              {hxPhqFormQuestionText.PHQ1}
            </Typography>

            <FastField
              name='PHQ1'
              label={hxPhqFormQuestionText.PHQ1Label}
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />
            <FastField
              name='PHQ2'
              label={hxPhqFormQuestionText.PHQ2}
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />

            {/* PHQ9 is only asked once PHQ-2 reaches the referral cutoff.
                PHQ3 - PHQ8 are asked at the Mental Health station. */}
            {score >= REFERRAL_CUTOFF && (
              <>
                <FastField
                  name='PHQ9'
                  label={hxPhqFormQuestionText.PHQ9}
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />

                <PopupText
                  qnNo='PHQ9'
                  triggerValue={[
                    '1 - Several days',
                    '2 - More than half the days',
                    '3 - Nearly everyday',
                  ]}
                >
                  <FastField
                    name='PHQExtra9'
                    label={hxPhqFormQuestionText.PHQExtra9}
                    component={CustomRadioGroup}
                    options={formOptions.PHQExtra9}
                    row
                  />
                </PopupText>
                <PopupText qnNo='PHQExtra9' triggerValue='Yes'>
                  <Typography variant='subtitle1' sx={{ color: 'red' }}>
                    <b>
                      *Patient requires urgent attention, please escalate to supervisor of the
                      station to bring to Doctor station*
                    </b>
                  </Typography>
                </PopupText>
              </>
            )}

            <Typography variant='subtitle1' fontWeight='bold' sx={{ mt: 2 }}>
              {hxPhqFormQuestionText.GAD1}
            </Typography>
            <FastField
              name='GAD1'
              label={hxPhqFormQuestionText.GAD1Label}
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />
            <FastField
              name='GAD2'
              label={hxPhqFormQuestionText.GAD2}
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />

            {/* Shown after both sub-scales are asked so the referral reflects them. */}
            <GetScore />

            <FastField
              name='PHQ11'
              label={hxPhqFormQuestionText.PHQ11}
              component={CustomRadioGroup}
              options={formOptions.PHQ11}
              row
            />

            <PopupText qnNo='PHQ11' triggerValue='Yes'>
              <Typography variant='subtitle2'>{hxPhqFormQuestionText.PHQShortAns11}</Typography>
              <FastField
                name='PHQShortAns11'
                label='PHQShortAns11'
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
        )
      }}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
