import React, { useContext, useEffect, useState } from 'react'
import { Paper, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, FastField, ErrorMessage, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import '../fieldPadding.css'
import PopupText from 'src/utils/popupText'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup.jsx'
import CustomTextField from '../../components/form-components/CustomTextField.jsx'

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

export default function GeriPhqForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(null)

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
    PHQ11: '',
    PHQShortAns11: '',
  }

  const validationSchema = Yup.object({
    PHQ1: Yup.string().oneOf(dayRange).required('Required'),
    PHQ2: Yup.string().oneOf(dayRange).required('Required'),
    PHQ3: Yup.string().oneOf(dayRange).required('Required'),
    PHQ4: Yup.string().oneOf(dayRange).required('Required'),
    PHQ5: Yup.string().oneOf(dayRange).required('Required'),
    PHQ6: Yup.string().oneOf(dayRange).required('Required'),
    PHQ7: Yup.string().oneOf(dayRange).required('Required'),
    PHQ8: Yup.string().oneOf(dayRange).required('Required'),
    PHQ9: Yup.string().oneOf(dayRange).required('Required'),
    PHQExtra9: Yup.string().oneOf(yesNo).optional(),
    PHQ11: Yup.string().oneOf(yesNo).required('Required'),
    PHQShortAns11: Yup.string().optional(),
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

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={() => {}}
      >
        {(handleSubmit, errors, submitCount) => (
          <Form className='fieldPadding'>
            <Typography variant='h6' color='error' fontWeight='bold'>
              **This form is duplicate of the HX PHQ form (read-only)**
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

            <DisabledWrapper>
              {['PHQ1', 'PHQ2', 'PHQ3', 'PHQ4', 'PHQ5', 'PHQ6', 'PHQ7', 'PHQ8', 'PHQ9'].map(
                (name, i) => (
                  <FastField
                    key={name}
                    name={name}
                    label={`${i + 1}. ${questionLabels[name]}`}
                    component={CustomRadioGroup}
                    options={dayRange.map((val) => ({ label: val, value: val }))}
                    row
                  />
                ),
              )}

              <br />

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
                  label='*Do you want to take your life now?*'
                  component={CustomRadioGroup}
                  options={yesNo.map((v) => ({ label: v, value: v }))}
                  row
                />
              </PopupText>
              <PopupText qnNo='PHQExtra9' triggerValue='Yes'>
                <Typography variant='subtitle1' sx={{ color: 'red' }}>
                  <b>
                    *Patient requires urgent attention, please escalate to supervisor of the station
                    to bring to Doctor&apos;s station*
                  </b>
                </Typography>
              </PopupText>

              <Typography variant='subtitle1' fontWeight='bold'>
                Score:
              </Typography>
              <GetScore />

              <FastField
                name='PHQ11'
                label='Do you feel like the patient will benefit from counselling?'
                component={CustomRadioGroup}
                options={yesNo.map((v) => ({ label: v, value: v }))}
                row
              />
              <Typography variant='subtitle2'>Please specify.</Typography>
              <FastField
                name='PHQShortAns11'
                component={CustomTextField}
                fullWidth
                multiline
                sx={{ mb: 3, mt: 1 }}
              />
              <ErrorMessage name='PHQShortAns11' component='div' style={{ color: 'red' }} />

              <Typography variant='body2' color='text.secondary'>
                This form is read-only. Please edit the HX PHQ form instead.
              </Typography>
            </DisabledWrapper>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

const questionLabels = {
  PHQ1: 'Little interest or pleasure in doing things',
  PHQ2: 'Feeling down, depressed or hopeless',
  PHQ3: 'Trouble falling asleep or staying asleep, or sleeping too much',
  PHQ4: 'Feeling tired or having little energy',
  PHQ5: 'Poor appetite or overeating',
  PHQ6: 'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
  PHQ7: 'Trouble concentrating on things, such as reading the newspaper or television',
  PHQ8: 'Moving or speaking so slowly that other people have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
  PHQ9: 'Thoughts that you would be better off dead or hurting yourself in some way',
}
