import React, { useContext, useEffect, useState } from 'react'
import {
  Paper, Divider, Typography, CircularProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel,
  Radio, TextField, Button
} from '@mui/material'
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'
import PopupText from 'src/utils/popupText.js'
import '../fieldPadding.css'

const formName = 'geriPhqForm'

const RadioGroupField = ({ name, label, values }) => (
  <FormControl fullWidth sx={{ mb: 3 }}>
    <FormLabel><Typography variant="subtitle1" fontWeight="bold">{label}</Typography></FormLabel>
    <Field name={name}>
      {({ field }) => (
        <RadioGroup {...field} row>
          {values.map((val) => (
            <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
          ))}
        </RadioGroup>
      )}
    </Field>
    <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
  </FormControl>
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
    const qns = ['PHQ1','PHQ2','PHQ3','PHQ4','PHQ5','PHQ6','PHQ7','PHQ8','PHQ9']
    const total = qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)
    setScore(total)
  }, [values])

  return (
    <Typography variant="subtitle1" sx={{ color: score >= 10 ? 'red' : 'blue' }}>
      Score: {score} / 27{score >= 10 ? ' - Patient fails PHQ, score is 10 and above' : ''}
    </Typography>
  )
}

export default function HxPhqForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState({})
  const [loading, setLoading] = useState(false)

  const initialValues = {
    PHQ1: '', PHQ2: '', PHQ3: '', PHQ4: '', PHQ5: '',
    PHQ6: '', PHQ7: '', PHQ8: '', PHQ9: '', PHQextra9: '',
    PHQ10: 0, PHQ11: '', PHQShortAns11: ''
  }

  const validationSchema = Yup.object({
    PHQ1: Yup.string().required('Required'),
    PHQ2: Yup.string().required('Required'),
    PHQ3: Yup.string().required('Required'),
    PHQ4: Yup.string().required('Required'),
    PHQ5: Yup.string().required('Required'),
    PHQ6: Yup.string().required('Required'),
    PHQ7: Yup.string().required('Required'),
    PHQ8: Yup.string().required('Required'),
    PHQ9: Yup.string().required('Required'),
    PHQ11: Yup.string().required('Required')
  })

  useEffect(() => {
    getSavedData(patientId, formName).then((res) => {
      setSavedValues({ ...initialValues, ...res })
    })
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    const pointsMap = {
      '0 - Not at all': 0,
      '1 - Several days': 1,
      '2 - More than half the days': 2,
      '3 - Nearly everyday': 3,
    }
    const qns = ['PHQ1','PHQ2','PHQ3','PHQ4','PHQ5','PHQ6','PHQ7','PHQ8','PHQ9']
    const score = qns.reduce((acc, qn) => acc + (pointsMap[values[qn]] || 0), 0)
    values.PHQ10 = score

    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      alert('Successfully submitted form')
      changeTab(null, nextTab)
    } else {
      alert(`Unsuccessful. ${response.error}`)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="fieldPadding">
            <Typography variant="subtitle1" fontWeight="bold">**When asking these questions, please let patient know that it can be sensitive**</Typography>
            <Typography variant="subtitle1" fontWeight="bold">Over the last 2 weeks, how often have you been bothered by any of the following problems?</Typography>

            <RadioGroupField name="PHQ1" label="1. Little interest or pleasure in doing things" values={dayRange} />
            <RadioGroupField name="PHQ2" label="2. Feeling down, depressed or hopeless" values={dayRange} />
            <RadioGroupField name="PHQ3" label="3. Trouble falling asleep or staying asleep, or sleeping too much" values={dayRange} />
            <RadioGroupField name="PHQ4" label="4. Feeling tired or having little energy" values={dayRange} />
            <RadioGroupField name="PHQ5" label="5. Poor appetite or overeating" values={dayRange} />
            <RadioGroupField name="PHQ6" label="6. Feeling bad about yourself, or that you are a failure or have let yourself or your family down" values={dayRange} />
            <RadioGroupField name="PHQ7" label="7. Trouble concentrating on things, such as reading the newspaper or television" values={dayRange} />
            <RadioGroupField name="PHQ8" label="8. Moving or speaking so slowly that other people have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual" values={dayRange} />
            <RadioGroupField name="PHQ9" label="9. Thoughts that you would be better off dead or hurting yourself in some way" values={dayRange} />

            <PopupText qnNo='PHQ9' triggerValue={['1 - Several days', '2 - More than half the days', '3 - Nearly everyday']}>
              <RadioGroupField name="PHQextra9" label="*Do you want to take your life now?*" values={["Yes", "No"]} />
            </PopupText>
            <PopupText qnNo='PHQextra9' triggerValue='Yes'>
              <Typography variant="subtitle1" sx={{ color: 'red' }}><b>*Patient requires urgent attention, please escalate*</b></Typography>
            </PopupText>

            <GetScore />

            <RadioGroupField name="PHQ11" label="Do you feel like the patient will benefit from counselling?" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify.</Typography>
            <Field name="PHQShortAns11" as={TextField} label="PHQ11" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="PHQShortAns11" component="div" style={{ color: 'red' }} />

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? <CircularProgress /> : (
                <Button type="submit" variant="contained" color="primary">
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

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
]
