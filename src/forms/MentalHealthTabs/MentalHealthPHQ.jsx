import React, { useContext, useEffect, useState } from 'react'
import { Paper, Divider, Typography, CircularProgress, Button, Box } from '@mui/material'
import { Formik, Form, FastField, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import PopupText from 'src/utils/popupText.jsx'
import '../fieldPadding.css'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import { mentalHealthPHQQuestionText, gad7QuestionText } from '../questions/MentalHealthPHQQuestions'

// Shares the history-taking PHQ document, so GAD3-GAD7 answered here land on the
// same record as the PHQ-2 / GAD-2 screen taken during history taking.
const formName = 'geriPhqForm'

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
]

const dayRangeOptions = dayRange.map((value) => ({ label: value, value }))

// Referral cutoff on each sub-scale. Kept in step with REFERRAL_CUTOFF in
// HxPhqForm and the `mentalHealth` rule in the backend stationEligibility.
const REFERRAL_CUTOFF = 3

const pointsMap = {
  '0 - Not at all': 0,
  '1 - Several days': 1,
  '2 - More than half the days': 2,
  '3 - Nearly everyday': 3,
}

const sumScore = (values, qns) => qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)

const GAD_EXTRA = ['GAD3', 'GAD4', 'GAD5', 'GAD6', 'GAD7']
const GAD_ALL = ['GAD1', 'GAD2', ...GAD_EXTRA]

const ReadOnly = ({ children }) => (
  <div style={{ pointerEvents: 'none', opacity: 0.6 }}>{children}</div>
)

// GAD-7 severity bands, per the standard instrument.
const gad7Severity = (score) => {
  if (score >= 15) return 'severe anxiety'
  if (score >= 10) return 'moderate anxiety'
  if (score >= 5) return 'mild anxiety'
  return 'minimal anxiety'
}

const Gad7Score = () => {
  const { values } = useFormikContext()
  const total = sumScore(values, GAD_ALL)
  const answered = GAD_ALL.every((qn) => values[qn])

  return (
    <Typography variant='subtitle1' sx={{ color: total >= 10 ? 'red' : 'blue', mt: 1 }}>
      <b>
        GAD-7 score: {total} / 21{answered ? ` — ${gad7Severity(total)}` : ' (incomplete)'}
      </b>
    </Typography>
  )
}

export default function MentalHealthPHQ() {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = (await getSavedData(patientId, formName)) || {}
      setSavedData({
        PHQ1: data.PHQ1 || '',
        PHQ2: data.PHQ2 || '',
        PHQ9: data.PHQ9 || '',
        PHQExtra9: data.PHQExtra9 || '',
        PHQ11: data.PHQ11 || '',
        PHQShortAns11: data.PHQShortAns11 || '',
        GAD1: data.GAD1 || '',
        GAD2: data.GAD2 || '',
        GAD3: data.GAD3 || '',
        GAD4: data.GAD4 || '',
        GAD5: data.GAD5 || '',
        GAD6: data.GAD6 || '',
        GAD7: data.GAD7 || '',
      })
    }
    fetchData()
  }, [patientId])

  if (!savedData) {
    return <CircularProgress />
  }

  const phq2 = sumScore(savedData, ['PHQ1', 'PHQ2'])
  const gad2 = sumScore(savedData, ['GAD1', 'GAD2'])
  const referredForDepression = phq2 >= REFERRAL_CUTOFF
  const referredForAnxiety = gad2 >= REFERRAL_CUTOFF

  // GAD3-GAD7 are only asked when the anxiety sub-scale triggered the referral.
  const validationSchema = Yup.object(
    referredForAnxiety
      ? Object.fromEntries(
          GAD_EXTRA.map((qn) => [qn, Yup.string().oneOf(dayRange).required('Required')]),
        )
      : {},
  )

  const handleSubmit = async (values, { setSubmitting }) => {
    // Only the GAD-7 expansion is editable here; everything else is history-taking
    // data shown for reference and must not be written back.
    const submittedValues = referredForAnxiety
      ? {
          ...Object.fromEntries(GAD_EXTRA.map((qn) => [qn, values[qn]])),
          GAD7Total: sumScore(values, GAD_ALL),
        }
      : {}

    if (!Object.keys(submittedValues).length) {
      setSubmitting(false)
      return
    }

    setLoading(true)
    const response = await submitForm(submittedValues, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      await showFormSubmitSuccess()
    } else {
      showFormSubmitError(`Unsuccessful. ${response.error}`)
    }
  }

  return (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Paper elevation={2}>
          <Form className='fieldPadding'>
            <Typography variant='h4' gutterBottom>
              <strong>PHQ / GAD</strong>
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1'>
                PHQ-2 (depression): <b>{phq2} / 6</b> &nbsp;&nbsp; GAD-2 (anxiety):{' '}
                <b>{gad2} / 6</b>
              </Typography>
              <Typography variant='subtitle1' sx={{ color: 'red' }}>
                {referredForDepression && referredForAnxiety
                  ? 'Referred for depression and anxiety.'
                  : referredForDepression
                    ? 'Referred for depression.'
                    : referredForAnxiety
                      ? 'Referred for anxiety.'
                      : 'Neither sub-scale reached the referral cutoff.'}
              </Typography>
            </Box>

            {/* Depression arm: show what history taking recorded, read-only. */}
            {referredForDepression && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant='h6' fontWeight='bold'>
                  Depression &mdash; recorded at History Taking
                </Typography>
                <ReadOnly>
                  <FastField
                    name='PHQ1'
                    label={mentalHealthPHQQuestionText.PHQ1}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
                    row
                  />
                  <FastField
                    name='PHQ2'
                    label={mentalHealthPHQQuestionText.PHQ2}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
                    row
                  />
                  <FastField
                    name='PHQ9'
                    label={mentalHealthPHQQuestionText.PHQ9}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
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
                      label={mentalHealthPHQQuestionText.PHQExtra9}
                      component={CustomRadioGroup}
                      options={[
                        { label: 'Yes', value: 'Yes' },
                        { label: 'No', value: 'No' },
                      ]}
                      row
                    />
                  </PopupText>
                </ReadOnly>
                <PopupText qnNo='PHQExtra9' triggerValue='Yes'>
                  <Typography variant='subtitle1' sx={{ color: 'red' }}>
                    <b>
                      *Patient requires urgent attention, please escalate to supervisor of the
                      station to bring to Doctor&apos;s station*
                    </b>
                  </Typography>
                </PopupText>
              </>
            )}

            {/* Anxiety arm: GAD-2 from history taking, then GAD3-GAD7 asked here. */}
            {referredForAnxiety && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant='h6' fontWeight='bold'>
                  Anxiety &mdash; GAD-7
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Questions 1 and 2 were asked at History Taking and are shown for reference.
                  Please complete questions 3 to 7.
                </Typography>
                <Typography variant='subtitle2' fontWeight='bold' sx={{ mt: 1 }}>
                  Over the last 2 weeks, how often have you been bothered by the following problems?
                </Typography>

                <ReadOnly>
                  <FastField
                    name='GAD1'
                    label={gad7QuestionText.GAD1}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
                    row
                  />
                  <FastField
                    name='GAD2'
                    label={gad7QuestionText.GAD2}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
                    row
                  />
                </ReadOnly>

                {GAD_EXTRA.map((qn) => (
                  <FastField
                    key={qn}
                    name={qn}
                    label={gad7QuestionText[qn]}
                    component={CustomRadioGroup}
                    options={dayRangeOptions}
                    row
                  />
                ))}

                <Gad7Score />

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                  {loading || isSubmitting ? (
                    <CircularProgress />
                  ) : (
                    <Button type='submit' variant='contained' color='primary'>
                      Submit
                    </Button>
                  )}
                </div>
              </>
            )}

            {!referredForDepression && !referredForAnxiety && (
              <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
                Nothing to complete here. Neither PHQ-2 nor GAD-2 reached the cutoff of{' '}
                {REFERRAL_CUTOFF} at History Taking.
              </Typography>
            )}

            <Divider sx={{ mt: 2 }} />
          </Form>
        </Paper>
      )}
    </Formik>
  )
}
