import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Paper, Divider, CircularProgress, RadioGroup,
  FormControlLabel, Radio, FormControl, FormLabel,
  TextField, Button, Typography
} from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'

const formName = 'hxOralForm'

const initialValues = {
  ORAL1: '', ORALShortAns1: '', ORAL2: '', ORAL3: '', ORAL4: '', ORAL5: '', ORALShortAns5: ''
}

const validationSchema = Yup.object({
  ORAL1: Yup.string().required('Required'),
  ORAL2: Yup.string().required('Required'),
  ORAL3: Yup.string().required('Required'),
  ORAL4: Yup.string().required('Required'),
  ORAL5: Yup.string().required('Required'),
})

const yesNoOptions = ['Yes', 'No']
const oral1Options = ['Healthy', 'Moderate', 'Poor, (please specify)']

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

export default function HxOralForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSavedData(patientId, formName).then((res) => {
      setSavedValues({ ...initialValues, ...res })
    })
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
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
        {({ values, isSubmitting }) => (
          <Form className="fieldPadding">
            <Typography variant="h4" gutterBottom><strong>ORAL ISSUES</strong></Typography>

            <Typography variant="subtitle1" color="error" fontWeight="bold">
              Please do a quick inspection of participant&apos;s oral health status:
              <ol>
                <li>Lips, Tongue, Gums & Tissues (Healthy - pink and moist)</li>
                <li>Natural Teeth, Oral Cleanliness & Dentures (Tooth/Root decay, no cracked/broken dentures, no food particles/tartar in mouth)</li>
                <li>Saliva status (free-flowing) and any dental pain</li>
              </ol>
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">How is the participant&apos;s Oral Health?</Typography>
            <RadioGroupField name="ORAL1" label="ORAL1" values={oral1Options} />

            {values.ORAL1 === 'Poor, (please specify)' && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
                <Field name="ORALShortAns1" as={TextField} label="ORALShortAns1" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
              </>
            )}

            <Typography variant="subtitle1" fontWeight="bold">Do you wear dentures?</Typography>
            <RadioGroupField name="ORAL2" label="ORAL2" values={yesNoOptions} />

            <Typography variant="subtitle1" fontWeight="bold">Are you currently experiencing any pain in your mouth area?</Typography>
            <RadioGroupField name="ORAL3" label="ORAL3" values={yesNoOptions} />

            <Typography variant="subtitle1" fontWeight="bold">Have you visited a dentist in the past 1 year?</Typography>
            <RadioGroupField name="ORAL4" label="ORAL4" values={yesNoOptions} />

            <Typography variant="subtitle1" fontWeight="bold">
              Would you like to go through free Oral Health Education by NUS Dentistry dentists and students?
            </Typography>
            <Typography gutterBottom>
              If the patient has any queries regarding dental health, or if you think that the patient would benefit from an Oral Health Consult.
            </Typography>
            <RadioGroupField name="ORAL5" label="ORAL5" values={yesNoOptions} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="ORALShortAns5" as={TextField} label="ORALShortAns5" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              The dental examination booth will only provide <u>simple dental screening</u>, there will be no treatment provided on site (e.g. scaling and polishing)
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              <span style={{ color: 'red' }}>Please help to emphasise that: </span>
              screening DOES NOT take the place of a thorough oral health examination with a dentist.
            </Typography>

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
