import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import {
  Divider,
  Paper,
  CircularProgress,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Box,
  Alert
} from '@mui/material'

import { submitForm, formatBmi } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

let calSyst
let calDias

// NEW: Yup validation schema
const validationSchema = Yup.object({
  triageQ1: Yup.number()
    .required('First reading systolic is required')
    .min(0, 'Value must be positive'),
  triageQ2: Yup.number()
    .required('First reading diastolic is required')
    .min(0, 'Value must be positive'),
  triageQ3: Yup.number()
    .required('Second reading systolic is required')
    .min(0, 'Value must be positive'),
  triageQ4: Yup.number()
    .required('Second reading diastolic is required')
    .min(0, 'Value must be positive'),
  triageQ5: Yup.number()
    .min(0, 'Value must be positive')
    .nullable(),
  triageQ6: Yup.number()
    .min(0, 'Value must be positive')
    .nullable(),
  triageQ7: Yup.number()
    .nullable(),
  triageQ8: Yup.number()
    .nullable(),
  triageQ9: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('This field is required'),
  triageQ10: Yup.number()
    .required('Height is required')
    .min(0, 'Value must be positive'),
  triageQ11: Yup.number()
    .required('Weight is required')
    .min(0, 'Value must be positive'),
  triageQ12: Yup.number()
    .nullable(),
  triageQ13: Yup.number()
    .required('Waist circumference is required')
    .min(0, 'Value must be positive')
})

// NEW: Initial values
const initialValues = {
  triageQ1: '',
  triageQ2: '',
  triageQ3: '',
  triageQ4: '',
  triageQ5: '',
  triageQ6: '',
  triageQ7: '',
  triageQ8: '',
  triageQ9: '',
  triageQ10: '',
  triageQ11: '',
  triageQ12: '',
  triageQ13: ''
}

function CalcBMI({ values }) {
  const { triageQ10: height_cm, triageQ11: weight } = values
  if (height_cm && weight) {
    return formatBmi(height_cm, weight)
  }
  return null
}

function IsHighBP({ systolic, diastolic }) {
  if (systolic > 140 && diastolic > 90) {
    console.log("HIGH BP")
    return (
      <Fragment>
        <font color='red'>
          <b>BP HIGH!</b>
        </font>{' '}
        <br />
      </Fragment>
    )
  }
  return null
}

function compareNumbers(a, b) {
  return a - b;
}

function CalcAvg({ reading1, reading2, reading3, label }) {

  let ans

  if (reading3 == null || reading3 === '') {
    ans = Math.round((reading1 + reading2) / 2)
    if (label == 1) {
      calSyst = ans
    } else {
      calDias = ans
    }
    return ans
  } else {
    let diff1 = Math.abs(reading1 - reading2)
    let diff2 = Math.abs(reading1 - reading3)
    let diff3 = Math.abs(reading3 - reading2)

    const diffArray = [diff1, diff2, diff3]

    diffArray.sort(compareNumbers);

    if (diffArray[0] == diff1) {
      ans = Math.round((reading1 + reading2) / 2)
      if (label == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    } else if (diffArray[0] == diff2) {
      ans = Math.round((reading1 + reading3) / 2)
      if (label == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    } else {
      ans = Math.round((reading2 + reading3) / 2)
      if (label == 1) {
        calSyst = ans
      } else {
        calDias = ans
      }
    }
    return ans
  }
}

// Custom Field Components: Formik is lower level 
const NumberField = ({ field, form, label, ...props }) => {
  const { name } = field
  const hasError = form.touched[name] && form.errors[name]
  
  return (
    <TextField
      {...field}
      {...props}
      label={label}
      type="number"
      variant="outlined"
      fullWidth
      margin="normal"
      error={hasError}
      helperText={hasError ? form.errors[name] : ''}
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          display: "none",
        },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
      }}
    />
  )
}

const RadioField = ({ field, form, options, label, ...props }) => {
  const { name } = field
  const hasError = form.touched[name] && form.errors[name]
  
  return (
    <FormControl component="fieldset" error={hasError} margin="normal">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup {...field} {...props}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {hasError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {form.errors[name]}
        </Alert>
      )}
    </FormControl>
  )
}

const formName = 'triageForm'

const TriageForm = () => {
  const [loading, isLoading] = useState(false)
  const { patientId } = useContext(FormContext)
  const [saveData, setSaveData] = useState(initialValues)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData({ ...initialValues, ...savedData })
    }
    fetchData()
  }, [patientId])

  const formOptions = {
    triageQ9: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

    const handleSubmit = async (model, { setSubmitting }) => {
      isLoading(true)
      setSubmitting(true)
      
      //calculated values
      model.triageQ7 = calSyst
      model.triageQ8 = calDias
      model.triageQ12 = parseFloat(formatBmi(model.triageQ10, model.triageQ11).props.children)

      const response = await submitForm(model, patientId, formName)

        if (response.result) {
          isLoading(false)
          setSubmitting(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          isLoading(false)
          setSubmitting(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }
      return (
    <Paper elevation={2} p={0} m={0}>
      <Formik
        initialValues={saveData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, isSubmitting, errors, touched }) => (
          <Form>
            <div className='form--div'>
              <h1>Triage</h1>
              <h2>VITALS</h2>
              <h4>
                Please fill in the participant&apos;s BP and BMI based on what you earlier recorded on
                Form A and copy to <font color='red'>NUHS form too.</font>
              </h4>
              <h2>1) BLOOD PRESSURE</h2>
              <p>
                (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last 30
                minutes.)
              </p>
              
              <h3>1st Reading Systolic (units in mmHg)</h3>
              <Field name="triageQ1" component={NumberField} label="Triage Q1" min={0} />
              
              <h3>1st Reading Diastolic (units in mmHg)</h3>
              <Field name="triageQ2" component={NumberField} label="Triage Q2" min={0} />
              <IsHighBP systolic={values.triageQ1} diastolic={values.triageQ2} />
              
              <h3>2nd Reading Systolic (units in mmHg)</h3>
              <Field name="triageQ3" component={NumberField} label="Triage Q3" min={0} />
              
              <h3>2nd Reading Diastolic (units in mmHg)</h3>
              <Field name="triageQ4" component={NumberField} label="Triage Q4" min={0} />
              <IsHighBP systolic={values.triageQ3} diastolic={values.triageQ4} />
              
              <h4>
                3rd Reading Systolic (ONLY if 1st and 2nd systolic reading differ by <b>&gt;5mmHg</b>)
              </h4>
              <Field name="triageQ5" component={NumberField} label="Triage Q5" min={0} />
              
              <h4>3rd Reading Diastolic (ONLY if 1st and 2nd diastolic reading differ by &gt;5mmHg)</h4>
              <Field name="triageQ6" component={NumberField} label="Triage Q6" min={0} />
              <IsHighBP systolic={values.triageQ5} diastolic={values.triageQ6} />

              <h3>Average Reading Systolic (average of closest 2 readings):</h3>
              <h3>
                Calculated Average: &nbsp;
                <CalcAvg 
                  label={1} 
                  reading1={values.triageQ1} 
                  reading2={values.triageQ3} 
                  reading3={values.triageQ5} 
                />
              </h3>
              <br />
              
              <h3>Average Reading Diastolic (average of closest 2 readings):</h3>
              <h3>
                Calculated Average: &nbsp;
                <CalcAvg 
                  label={2} 
                  reading1={values.triageQ2} 
                  reading2={values.triageQ4} 
                  reading3={values.triageQ6} 
                />
              </h3>
              <br />
              
              <h3>Hypertension criteria:</h3>
              <ul>
                <li>Younger participants: &gt; 140/90</li>
                <li>
                  Participants &gt; 80 years old: &gt; 150/90
                  <ul>
                    <li>CKD w proteinuria (mod to severe albuminuria): &gt; 130/80</li>
                  </ul>
                </li>
                <li>DM: &gt; 130/80</li>
              </ul>
              <p>
                Please tick to highlight if you feel <b>BLOOD PRESSURE</b> require closer scrutiny by
                doctors later.
              </p>
              
              <Field 
                name="triageQ9" 
                component={RadioField} 
                label="Triage Q9" 
                options={formOptions.triageQ9} 
              />

              <h2>2) BMI</h2>
              <h3>Height (in cm)</h3>
              <Field name="triageQ10" component={NumberField} label="Triage Q10" min={0} />
              
              <h3>Weight (in kg)</h3>
              <Field name="triageQ11" component={NumberField} label="Triage Q11" min={0} />
              
              <h3>
                BMI: <CalcBMI values={values} />
              </h3>
              
              <h2>3) Waist Circumference (all participants)</h2>
              <h3>Waist Circumference (in cm)</h3>
              <Field name="triageQ13" component={NumberField} label="Triage Q13" min={0} />
            </div>

            {/* Display form errors */}
            {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error">
                  Please correct the errors above before submitting.
                </Alert>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              )}
            </Box>

            <br />
            <Divider />
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

TriageForm.contextType = FormContext

export default TriageForm
    