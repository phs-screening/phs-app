import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Paper, Divider, CircularProgress, FormControl,
  FormControlLabel, RadioGroup, Radio, FormLabel,
  TextField, Button, Typography
} from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'

const formName = 'hxSocialForm'

const initialValues = {
  SOCIAL3: '', SOCIALShortAns3: '', SOCIAL4: '', SOCIAL5: '',
  SOCIAL6: '', SOCIALShortAns6: '', SOCIAL7: '', SOCIALShortAns7: '',
  SOCIAL8: '', SOCIAL9: '', SOCIAL10: '', SOCIALShortAns10: '',
  SOCIAL11: '', SOCIALShortAns11: '', SOCIAL12: '', SOCIAL13: '',
  SOCIALExtension13A: '', SOCIALExtension13B: '', SOCIALExtension13C: '',
  SOCIAL14: '', SOCIAL15: ''
}

const validationSchema = Yup.object({
  SOCIAL3: Yup.string().required('Required'),
  SOCIAL4: Yup.string().required('Required'),
  SOCIAL5: Yup.number().required('Required'),
  SOCIAL6: Yup.string().required('Required'),
  SOCIAL7: Yup.string().required('Required'),
  SOCIAL8: Yup.string().required('Required'),
  SOCIAL9: Yup.string().required('Required'),
  SOCIAL10: Yup.string().required('Required'),
  SOCIAL11: Yup.string().required('Required'),
  SOCIAL12: Yup.string().required('Required'),
  SOCIAL13: Yup.string().required('Required'),
  SOCIAL14: Yup.string().required('Required'),
  SOCIAL15: Yup.string().required('Required')
})

const RadioGroupField = ({ name, label, options }) => (
  <FormControl fullWidth sx={{ mb: 3 }}>
    <FormLabel><Typography variant="subtitle1" fontWeight="bold">{label}</Typography></FormLabel>
    <Field name={name}>
      {({ field }) => (
        <RadioGroup {...field} row>
          {options.map((val) => (
            <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
          ))}
        </RadioGroup>
      )}
    </Field>
    <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
  </FormControl>
)

export default function HxSocialForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState(initialValues)
  const [regForm, setRegForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSavedData(patientId, formName).then((res) => {
      setSavedValues({ ...initialValues, ...res })
    })
    getSavedData(patientId, 'registrationForm').then((res) => {
      setRegForm(res)
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
            <Typography variant="h4" fontWeight="bold" gutterBottom>FINANCIAL STATUS</Typography>
            <Typography variant="h6">CHAS Status</Typography>
            <Typography color="primary" gutterBottom>
              {regForm ? regForm.registrationQ12 : '-'}
            </Typography>

            <Typography variant="h6">Pioneer Generation Status 建国一代配套</Typography>
            <Typography color="primary" gutterBottom>
              {regForm ? regForm.registrationQ13 : '-'}
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
            </Typography>
            <RadioGroupField name="SOCIAL3" label="SOCIAL3" options={["Yes, (please specify)", "No"]} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="SOCIALShortAns3" label="SOCIALShortAns3" as={TextField} fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">What is the average earnings of participant&apos;s household per month?</Typography>
            <RadioGroupField name="SOCIAL4" label="SOCIAL4" options={["1200 and below per month", "1,201 - 2,000 per month", "2,001 - 3,999 per month", "4,000 - 5,999 per month", "6,000 - 9,999 per month", "10,000 & above", "NIL"]} />

            <Typography variant="subtitle1" fontWeight="bold">Number of household members (including yourself)?</Typography>
            <Field name="SOCIAL5" type="number" as={TextField} fullWidth sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              If you are currently not on CHAS but qualify, do you want to apply for CHAS card?
            </Typography>
            <RadioGroupField name="SOCIAL6" label="SOCIAL6" options={["Yes", "No"]} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="SOCIALShortAns6" as={TextField} fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Do you need advice on financial schemes that are available in Singapore or require further financial assistance?
            </Typography>
            <RadioGroupField name="SOCIAL7" label="SOCIAL7" options={["Yes, (please specify)", "No"]} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="SOCIALShortAns7" as={TextField} fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="h4" fontWeight="bold" gutterBottom>2. SOCIAL ISSUES</Typography>
            <Typography variant="subtitle1" fontWeight="bold">Are you caring for a loved one?</Typography>
            <RadioGroupField name="SOCIAL8" label="SOCIAL8" options={["Yes", "No"]} />

            <Typography variant="subtitle1" fontWeight="bold">Do you feel equipped to provide care to your loved one?</Typography>
            <RadioGroupField name="SOCIAL9" label="SOCIAL9" options={["Yes", "No"]} />

            <Typography variant="h4" fontWeight="bold" gutterBottom>3. LIFESTYLE</Typography>
            <Typography variant="subtitle1" fontWeight="bold">Do you currently smoke?</Typography>
            <RadioGroupField name="SOCIAL10" label="SOCIAL10" options={["Yes, (please specify how many pack-years)", "No"]} />
            <Typography variant="subtitle1" fontWeight="bold">How many pack-years?</Typography>
            <Field name="SOCIALShortAns10" as={TextField} fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Have you smoked before? For how long and when did you stop?</Typography>
            <RadioGroupField name="SOCIAL11" label="SOCIAL11" options={["Yes, (please specify)", "No"]} />
            <Typography variant="subtitle1" fontWeight="bold">Please specify:</Typography>
            <Field name="SOCIALShortAns11" as={TextField} fullWidth multiline sx={{ mb: 3, mt: 1 }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you consume alcoholic drinks?</Typography>
            <RadioGroupField name="SOCIAL12" label="SOCIAL12" options={["Less than 2 standard drinks per day on average", "More than 2 standard drinks per day on average", "No", "Quit alcoholic drinks"]} />

            <Typography variant="subtitle1" fontWeight="bold">Do you consciously try to eat more fruits, vegetables, whole grain and cereals?</Typography>
            <RadioGroupField name="SOCIAL13" label="SOCIAL13" options={["Yes", "No"]} />
            <RadioGroupField name="SOCIALExtension13A" label="Fruits" options={["1 serving/day", "2 or more servings/day"]} />
            <RadioGroupField name="SOCIALExtension13B" label="Vegetables" options={["1 serving/day", "2 or more servings/day"]} />
            <RadioGroupField name="SOCIALExtension13C" label="Whole grain and cereals" options={["Yes", "No"]} />

            <Typography variant="subtitle1" fontWeight="bold">Do you exercise or participate in physical activity?</Typography>
            <RadioGroupField name="SOCIAL14" label="SOCIAL14" options={["Yes, at least 20 minutes each time, for 3 or more days per week", "Yes, at least 20 minutes each time, for less than 3 days per week", "No participation of at least 20 minutes each time"]} />

            <Typography variant="subtitle1" fontWeight="bold">Do you feel the patient would benefit from a Dietitian consult?</Typography>
            <RadioGroupField name="SOCIAL15" label="SOCIAL15" options={["Yes", "No"]} />

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
    </Paper>
  )
}
