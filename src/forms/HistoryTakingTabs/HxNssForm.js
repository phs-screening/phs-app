import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Paper, Divider, CircularProgress, RadioGroup,
  FormControlLabel, Radio, FormControl, FormLabel,
  Checkbox, FormGroup, TextField, Button, Typography
} from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'

// IMPORTANT: Formerly NSS, renamed to PMHX as of PHS 2022. Forms not renamed, only tab name
const formName = 'hxNssForm'

const validationSchema = Yup.object({
  PMHX1: Yup.string().required('Required'),
  PMHX2: Yup.string().required('Required'),
  PMHX5: Yup.string().required('Required'),
  PMHX6: Yup.string().required('Required'),
  PMHX8: Yup.string().required('Required'),
  PMHX9: Yup.string().required('Required'),
  PMHX10: Yup.string().required('Required'),
  PMHX11: Yup.string().required('Required'),
  PMHX12: Yup.string().required('Required'),
})

const initialValues = {
  PMHX1: '', PMHX2: '', PMHX5: '', PMHXShortAns5: '',
  PMHX6: '', PMHXShortAns6: '', PMHX7: [], PMHX8: '',
  PMHX9: '', PMHX10: '', PMHX11: '', PMHX12: '', PMHXShortAns12: '',
  PMHX13: '', PMHX14: '', PMHXShortAns14: '', PMHX15: '', PMHXShortAns15: ''
}

const options = {
  PMHX5: ['Yes, (please specify)', 'No'],
  PMHX6: ['Yes, (please specify)', 'No'],
  PMHX7: ['Kidney Disease', 'Hypertension', 'Hyperlipidemia', 'Diabetes', 'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)'],
  PMHX9: ['Yes', 'No'], PMHX10: ['Yes', 'No'], PMHX11: ['Yes', 'No'],
  PMHX12: ['Yes', 'No'], PMHX13: ['Yes', 'No'],
  PMHX14: ['Yes', 'No'], PMHX15: ['Yes', 'No']
}

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

const CheckboxGroupField = ({ name, label, values }) => (
  <FormControl fullWidth component="fieldset" sx={{ mb: 3 }}>
    <FormLabel><Typography variant="subtitle1" fontWeight="bold">{label}</Typography></FormLabel>
    <FormGroup row>
      {values.map((val) => (
        <Field key={val} name={name} type="checkbox" value={val}>
          {({ field }) => (
            <FormControlLabel control={<Checkbox {...field} />} label={val} />
          )}
        </Field>
      ))}
    </FormGroup>
  </FormControl>
)

export default function HxNssForm({ changeTab, nextTab }) {
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
            <Typography variant="h4" gutterBottom><strong>PAST MEDICAL HISTORY</strong></Typography>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Do you have any chronic conditions? Take a short chronic history summarizing:
            </Typography>
            <Typography component="ol">
              <li>Conditions</li>
              <li>Duration</li>
              <li>Control</li>
              <li>Compliance</li>
              <li>Complications</li>
              <li>Follow up route (specify whether GP/Polyclinic/FMC/SOC)</li>
            </Typography>
            <Field name="PMHX1" as={TextField} label="PMHX1" fullWidth multiline margin="normal" />

            <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
              If participant is not engaged with any follow-up, ask:
            </Typography>
            <Typography gutterBottom>
              &quot;What is the reason that you&apos;re not following up with your doctor for your existing conditions?&quot;<br />
              e.g. do not see the purpose for tests, busy/no time, lack of access<br />
              e.g. mobility issues, financial issues, fear of doctors/clinics/hospitals etc
            </Typography>

            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Are you on any long term medications? Are you compliant to your medications?
            </Typography>
            <Field name="PMHX2" as={TextField} label="PMHX2" fullWidth multiline sx={{ mb: 3 }} />

            <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
              If a participant is not compliant to medications, do probe further on his/her reasons for not consuming medications as prescribed.
            </Typography>
            <Typography gutterBottom>
              e.g. Medication not effective? Can be managed without medication? Forget to take? Lost/Ran out of medication?
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Do you have any drug allergies? If yes, please specify.
            </Typography>
            <RadioGroupField name="PMHX5" label="PMHX5" values={options.PMHX5} />
            <Field name="PMHXShortAns5" as={TextField} label="Please specify" fullWidth multiline sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Are you on any alternative medicine including traditional chinese medications, homeopathy etc?
            </Typography>
            <RadioGroupField name="PMHX6" label="PMHX6" values={options.PMHX6} />
            <Field name="PMHXShortAns6" as={TextField} label="Please specify" fullWidth multiline sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Tick if you have these conditions:
            </Typography>
            <CheckboxGroupField name="PMHX7" label="PMHX7" values={options.PMHX7} />

            <Typography variant="subtitle1" fontWeight="bold">
              If a participant does not elicit any Past Medical History, ask if they regularly go for screening/blood tests etc. If no, ask why.
            </Typography>
            <Field name="PMHX8" as={TextField} label="PMHX8" fullWidth multiline margin="normal" />

            <Typography variant="subtitle1" fontWeight="bold">
              Have you had a kidney screening in the past 1 year?
            </Typography>
            <RadioGroupField name="PMHX9" label="PMHX9" values={options.PMHX9} />

            <Typography variant="subtitle1" fontWeight="bold">
              Have you done a FIT test in the last 1 year?
            </Typography>
            <RadioGroupField name="PMHX10" label="PMHX10" values={options.PMHX10} />

            <Typography variant="subtitle1" fontWeight="bold">
              Have you done a colonoscopy in the last 10 years or otherwise advised by your doctor?
            </Typography>
            <RadioGroupField name="PMHX11" label="PMHX11" values={options.PMHX11} />

            <Typography variant="subtitle1" fontWeight="bold">
              Please tick to highlight if you feel Past Medical History requires closer scrutiny by doctors later. Explain reasons for recommendation.
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">For participant with DM, refer to DS if:</Typography>
            <ul>
              <li>Symptomatic, and non-compliant</li>
              <li>Asymptomatic, and non-compliant</li>
            </ul>
            <Typography>
              Also, refer to DS if participant has not been diagnosed with DM, but has signs of DM (polyuria, polydipsia, periphery neuropathy, blurring of vision etc)
            </Typography>

            <RadioGroupField name="PMHX12" label="PMHX12" values={options.PMHX12} />
            <Field name="PMHXShortAns12" as={TextField} label="Please specify" fullWidth multiline sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <span style={{ color: '#d32f2f' }}>
                If you are 60 and above,
              </span>{' '}
              do you currently use hearing aids/have been detected to require hearing aids?
            </Typography>
            <RadioGroupField name="PMHX13" label="PMHX13" values={options.PMHX13} />

            <Typography variant="subtitle1" fontWeight="bold">
              <span style={{ color: '#d32f2f' }}>
                For geriatric participants,
              </span>{' '}
              has the senior seen an ENT specialist before?
            </Typography>
            <RadioGroupField name="PMHX14" label="PMHX14" values={options.PMHX14} />
            <Field name="PMHXShortAns14" as={TextField} label="Please specify" fullWidth multiline sx={{ mb: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              <span style={{ color: '#d32f2f' }}>
                For geriatric participants,
              </span>{' '}
              did he/she answer yes to any of the following questions?
            </Typography>
            <Typography component="ol" type="a">
              <li>Have you had your hearing aids for more than 5 years?</li>
              <li>Has it been 3 years or more since you used your hearing aids (i.e. did not use the hearing aids for more than 3 years)?</li>
              <li>Are your hearing aids spoilt/not working?</li>
            </Typography>
            <RadioGroupField name="PMHX15" label="PMHX15" values={options.PMHX15} />
            <Field name="PMHXShortAns15" as={TextField} label="Please specify" fullWidth multiline sx={{ mb: 3 }} />

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
