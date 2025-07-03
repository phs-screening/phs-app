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

const formName = 'hxHcsrForm'

const initialValues = {
  hxHcsrQ1: '', hxHcsrQ2: '', hxHcsrQ3: '', hxHcsrShortAnsQ3: '',
  hxHcsrQ4: '', hxHcsrQ5: '', hxHcsrShortAnsQ5: '',
  hxHcsrQ6: '', hxHcsrShortAnsQ6: '', hxHcsrQ7: '',
  hxHcsrShortAnsQ7: '', hxHcsrQ8: ''
}

const validationSchema = Yup.object({
  hxHcsrQ1: Yup.string().required('Required'),
  hxHcsrQ2: Yup.string().required('Required'),
  hxHcsrQ3: Yup.string().required('Required'),
  hxHcsrQ6: Yup.string().required('Required'),
  hxHcsrQ8: Yup.string().required('Required'),
})

const yesNoOptions = ['Yes', 'No']

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

export default function HxHcsrForm({ changeTab, nextTab }) {
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
        {({ isSubmitting }) => (
          <Form className="fieldPadding">
            <Typography variant="h4" gutterBottom><strong>PARTICIPANT IDENTIFICATION</strong></Typography>
            <Typography gutterBottom>
              <span style={{ color: "error", fontWeight: 'bold' }}>
                Please verify participant&apos;s identity using:
                <ol type="A">
                  <li>APP ID on wristband</li>
                  <li>INITIALS</li>
                </ol>
              </span>{' '}

            </Typography>

            <Typography variant="h6">Booth number and History-taker&apos;s surname followed by initials</Typography>
            <Field name="hxHcsrQ1" as={TextField} label="hxHcsrQ1" fullWidth multiline margin="normal" />

            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW<br />1. HEALTH CONCERNS
            </Typography>

            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
              If the participant has any <u>presenting complaints or concern(s)</u>, please take a brief history. (Please write NIL if otherwise).
            </Typography>
            <Typography gutterBottom>
              &quot;Do you have any health issues that you are currently concerned about?&quot;
              <br />&quot;最近有没有哪里不舒服&quot;
            </Typography>
            <Field name="hxHcsrQ2" as={TextField} label="hxHcsrQ2" fullWidth multiline margin="normal" />

            <Typography variant="subtitle1" fontWeight="bold" color="error">
              Please advise that there will be no diagnosis or prescription made at our screening.<br />
              Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting treatment for their problems.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Please indicate if you feel that HEALTH CONCERNS require closer scrutiny by doctors later or if participant strongly insists.
            </Typography>
            <RadioGroupField name="hxHcsrQ3" label="hxHcsrQ3" values={yesNoOptions} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="hxHcsrShortAnsQ3" as={TextField} label="hxHcsrShortAnsQ3" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Below is a non-exhaustive list of possible red flags:</Typography>
            <ul>
              <li><u>Constitutional Symptoms:</u> LOA, LOW, Fever</li>
              <li><u>CVS:</u> Chest pain, Palpitations</li>
              <li><u>Respi:</u> SOB, Haemoptysis, Night Sweat, Cough</li>
              <li><u>GI:</u> change in BO habits, PR bleed, Haematemesis</li>
              <li>Frequent falls</li>
            </ul>

            <Typography variant="subtitle1" fontWeight="bold">
              Based on&nbsp;
              <span style={{ color: 'red', textDecoration: 'underline' }}>
                participant&apos;s health concerns,
              </span>
              &nbsp;please rule out red flags <b>(Please write NIL if otherwise)</b>
            </Typography>
            <Field name="hxHcsrQ4" as={TextField} label="hxHcsrQ4" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have any problems passing urine or motion? Please specify if yes.</Typography>
            <RadioGroupField name="hxHcsrQ5" label="hxHcsrQ5" values={yesNoOptions} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="hxHcsrShortAnsQ5" as={TextField} label="hxHcsrShortAnsQ5" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have any vision problems? Please specify if yes. Exclude complaints like unspecific itchy eyes etc.</Typography>
            <RadioGroupField name="hxHcsrQ6" label="hxHcsrQ6" values={yesNoOptions} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="hxHcsrShortAnsQ6" as={TextField} label="hxHcsrShortAnsQ6" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have any hearing problems? Please specify if yes.</Typography>
            <RadioGroupField name="hxHcsrQ7" label="hxHcsrQ7" values={yesNoOptions} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="hxHcsrShortAnsQ7" as={TextField} label="hxHcsrShortAnsQ7" fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Please tick to highlight if you feel SYSTEMS REVIEW require closer scrutiny by doctors later or if participant strongly insists.</Typography>
            <RadioGroupField name="hxHcsrQ8" label="hxHcsrQ8" values={yesNoOptions} />

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
