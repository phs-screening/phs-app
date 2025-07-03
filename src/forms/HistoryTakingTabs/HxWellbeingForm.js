import React, { useContext, useEffect, useState } from 'react'
import {
  Paper, Grid, Divider, CircularProgress,
  Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio,
  Button
} from '@mui/material'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'

import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'
import '../fieldPadding.css'
import allForms from '../forms.json'
import '../forms.css'

const formName = 'hxWellbeingForm'

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

const HxWellbeingForm = () => {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState({})
  const [regForm, setRegForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const navigate = useNavigate()

  const initialValues = {
    hxWellbeingQ1: '', hxWellbeingQ2: '', hxWellbeingQ3: '', hxWellbeingQ4: '', hxWellbeingQ5: '',
    hxWellbeingQ6: '', hxWellbeingQ7: '', hxWellbeingQ8: '', hxWellbeingQ9: '', hxWellbeingQ10: '',
    hxWellbeingQ11: ''
  }

  const validationSchema = Yup.object({
    hxWellbeingQ1: Yup.string().required('Required'),
    hxWellbeingQ2: Yup.string().required('Required'),
    hxWellbeingQ3: Yup.string().required('Required'),
    hxWellbeingQ4: Yup.string().required('Required'),
    hxWellbeingQ5: Yup.string().required('Required'),
    hxWellbeingQ6: Yup.string().required('Required'),
    hxWellbeingQ7: Yup.string().required('Required'),
    hxWellbeingQ8: Yup.string().required('Required'),
    hxWellbeingQ9: Yup.string().required('Required'),
    hxWellbeingQ10: Yup.string().required('Required'),
    hxWellbeingQ11: Yup.string().required('Required'),
  })

  useEffect(() => {
    Promise.all([
      getSavedData(patientId, formName),
      getSavedData(patientId, allForms.registrationForm)
    ]).then(([savedData, regFormData]) => {
      setSavedValues({ ...initialValues, ...savedData })
      setRegForm(regFormData)
      setLoadingSidePanel(false)
    })
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      alert('Successfully submitted form')
      navigate('/app/dashboard', { replace: true })
    } else {
      alert(`Unsuccessful. ${response.error}`)
    }
  }

  const oneToFive = ['0', '1', '2', '3', '4', '5']
  const oneToSix = ['1', '2', '3', '4', '5', '6']
  const freqOptions = [
    '1 (Never or very rarely)',
    '2 (Rarely)',
    '3 (Sometimes)',
    '4 (Often)',
    '5 (Very often or always)',
  ]

  return (
    <Paper elevation={2}>
      <Grid container>
        <Grid item xs={9}>
          <Formik
            initialValues={savedValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className='fieldPadding'>
                <Typography variant="h5">WELLBEING</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  From a scale of 0 to 5, 0 being &apos;no all the time&apos; and 5 being &apos;all of the time&apos;, please give a number for each of the following statements.
                </Typography>
                <RadioGroupField name='hxWellbeingQ1' label='1. "I have felt cheerful and in good spirits."' values={oneToFive} />
                <RadioGroupField name='hxWellbeingQ2' label='2. "I have felt calm and relaxed."' values={oneToFive} />
                <RadioGroupField name='hxWellbeingQ3' label='3. "I have felt active and vigorous."' values={oneToFive} />
                <RadioGroupField name='hxWellbeingQ4' label='4. "I woke up feeling refreshed and rested."' values={oneToFive} />
                <RadioGroupField name='hxWellbeingQ5' label='5. "My daily life has been filled with things that interest me."' values={oneToFive} />

                <Typography variant="h5" mt={4}>Rapid Positive Mental Health Instrument</Typography>
                <Typography variant="subtitle1">Thinking over the last 4 weeks, please select a number showing how much the statements describe you.</Typography>
                <Typography variant="body2">1 - Not at all like me<br/>2 - Very slightly like me<br/>3 - Slightly like me<br/>4 - Moderately like me<br/>5 - Very much like me<br/>6 - Exactly like me</Typography>

                <Divider sx={{ my: 2 }} />

                <RadioGroupField name='hxWellbeingQ6' label='6. "I spend time with people I like."' values={oneToSix} />
                <RadioGroupField name='hxWellbeingQ7' label='7. "I make friends easily."' values={oneToSix} />
                <RadioGroupField name='hxWellbeingQ8' label='8. "I try to be patient with others."' values={oneToSix} />
                <RadioGroupField name='hxWellbeingQ9' label='9. "I am willing to share my time with others."' values={oneToSix} />
                <RadioGroupField name='hxWellbeingQ10' label='10. "I have freedom to make choices that concern my future."' values={oneToSix} />
                <RadioGroupField name='hxWellbeingQ11' label='11. How often in the past 4 weeks have you felt calm?' values={freqOptions} />

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                  {loading || isSubmitting ? <CircularProgress /> : (
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                  )}
                </div>
                <br />
                <Divider />
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid
          item
          xs={3}
          p={2}
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'flex-start'}
        >
          {loadingSidePanel ? <CircularProgress /> : (
            <div className='summary--question-div'>
              <Typography variant="h6">Registration</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Participant consent to participation in Research? (Participant has to sign IRB Consent Form)
              </Typography>
              <Typography className='blue'>{regForm.registrationQ20}</Typography>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default HxWellbeingForm
