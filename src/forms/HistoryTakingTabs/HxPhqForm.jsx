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

const formName = 'geriPhqForm'

const pointsMap = {
  '0 - Not at all': 0,
  '1 - Several days': 1,
  '2 - More than half the days': 2,
  '3 - Nearly everyday': 3,
}

const GetScore = () => {
  const { values } = useFormikContext()
  const [score, setScore] = useState(0)
  let condition = ''

  useEffect(() => {
    const qns = ['PHQ1', 'PHQ2', 'PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8', 'PHQ9']
    const total = qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)
    setScore(total)
  }, [values])

  if (score >= 20) condition = 'Severe Depression'
  else if (score >= 15) condition = 'Moderately Severe Depression'
  else if (score >= 10) condition = 'Moderate Depression'
  else if (score >= 5) condition = 'Mild Depression'

  return (
    <Typography variant='subtitle1' sx={{ color: score >= 10 ? 'red' : 'blue' }}>
      Score: {score} / 27{score >= 10 ? ' - Patient fails PHQ, score is 10 and above' : ''}
      <br />
      {score >= 5 ? `Patient is at risk of ${condition}` : ''}
    </Typography>
  )
}

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
  PHQextra9: '',
  PHQ10: 0,
  PHQ11: '',
  PHQShortAns11: '',
}

const validationSchema = Yup.object({
  PHQ1: Yup.string().required('Required'),
  PHQ2: Yup.string().required('Required'),
  PHQ3: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ4: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ5: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ6: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ7: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ8: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ9: Yup.string().when(['PHQ1', 'PHQ2'], {
    is: (phq1, phq2) => {
      const score = (pointsMap[phq1] || 0) + (pointsMap[phq2] || 0)
      return score >= 2
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQextra9: Yup.string().when(['PHQ9'], {
    is: (phq9) => {
      return (pointsMap[phq9] || 0) >= 1
    },
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PHQ11: Yup.string().required('Required'),
})

const formOptions = {
  DAYRANGE: [
    { label: '0 - Not at all', value: '0 - Not at all' },
    { label: '1 - Several days', value: '1 - Several days' },
    { label: '2 - More than half the days', value: '2 - More than half the days' },
    { label: '3 - Nearly everyday', value: '3 - Nearly everyday' },
  ],
  PHQextra9: [
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
    const pointsMap = {
      '0 - Not at all': 0,
      '1 - Several days': 1,
      '2 - More than half the days': 2,
      '3 - Nearly everyday': 3,
    }
    const qns = ['PHQ1', 'PHQ2', 'PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8', 'PHQ9']
    const score = qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)
    values.PHQ10 = score

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
      {({
        isSubmitting,
        values,
        setFieldValue,
        setFieldTouched,
        submitCount,
        errors,
        // ...formikProps
      }) => {
        const score = (pointsMap[values.PHQ1] || 0) + (pointsMap[values.PHQ2] || 0)

        // Resets PHQ3 to PHQ9 if the score of PHQ1 + PHQ2 is less than 3
        useEffect(() => {
          if (score < 2) {
            ;['PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8', 'PHQ9', 'PHQextra9'].forEach((qn) => {
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
              Over the last 2 weeks, how often have you been bothered by any of the following
              problems?
            </Typography>

            <FastField
              name='PHQ1'
              label='PHQ1. Little interest or pleasure in doing things'
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />
            <FastField
              name='PHQ2'
              label='PHQ2. Feeling down, depressed or hopeless'
              component={CustomRadioGroup}
              options={formOptions.DAYRANGE}
              row
            />

            {/* *PHQ3 - PHQ9 will only be rendered if the score of PHQ1 + PHQ2 >= 3*/}
            {score >= 2 && (
              <>
                <FastField
                  name='PHQ3'
                  label='PHQ3. Trouble falling asleep or staying asleep, or sleeping too much'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />

                <FastField
                  name='PHQ4'
                  label='PHQ4. Feeling tired or having little energy'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />
                <FastField
                  name='PHQ5'
                  label='PHQ5. Poor appetite or overeating'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />
                <FastField
                  name='PHQ6'
                  label='PHQ6. Feeling bad about yourself, or that you are a failure or have let yourself or your family down'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />
                <FastField
                  name='PHQ7'
                  label='PHQ7. Trouble concentrating on things, such as reading the newspaper or watching television'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />
                <FastField
                  name='PHQ8'
                  label='PHQ8. Moving or speaking so slowly that other people have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual'
                  component={CustomRadioGroup}
                  options={formOptions.DAYRANGE}
                  row
                />
                <FastField
                  name='PHQ9'
                  label='PHQ9. Thoughts that you would be better off dead or hurting yourself in some way'
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
                    name='PHQextra9'
                    label='*Do you want to take your life now?*'
                    component={CustomRadioGroup}
                    options={formOptions.PHQextra9}
                    row
                  />
                </PopupText>
                <PopupText qnNo='PHQextra9' triggerValue='Yes'>
                  <Typography variant='subtitle1' sx={{ color: 'red' }}>
                    <b>
                      *Patient requires urgent attention, please escalate to supervisor of the
                      station to bring to Doctor station*
                    </b>
                  </Typography>
                </PopupText>
              </>
            )}

            <GetScore />

            <FastField
              name='PHQ11'
              label='Do you feel like the patient will benefit from counselling?'
              component={CustomRadioGroup}
              options={formOptions.PHQ11}
              row
            />

            <PopupText qnNo='PHQ11' triggerValue='Yes'>
              <Typography variant='subtitle2'>Please specify.</Typography>
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
