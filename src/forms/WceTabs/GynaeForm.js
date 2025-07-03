import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'

import {
  Divider,
  Paper,
  CircularProgress,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  TextField
} from '@mui/material';

import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import '../forms.css'
import { useNavigate } from 'react-router'

// Yup validation schema
const validationSchema = Yup.object({
  GYNAE1: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAE2: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns2: Yup.string(),
  GYNAE3: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns3: Yup.string(),
  GYNAE4: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns4: Yup.string(),
  GYNAE5: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns5: Yup.string(),
  GYNAE6: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns6: Yup.string(),
  GYNAE7: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns7: Yup.string(),
  GYNAE8: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns8: Yup.string(),
  GYNAE9: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAE10: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns10: Yup.string(),
  GYNAE11: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns11: Yup.string(),
  GYNAE13: Yup.string().oneOf(['Yes', 'No'], 'Invalid selection'),
  GYNAEShortAns13: Yup.string(),
})

// Initial values
const initialValues = {
  GYNAE1: '',
  GYNAE2: '',
  GYNAEShortAns2: '',
  GYNAE3: '',
  GYNAEShortAns3: '',
  GYNAE4: '',
  GYNAEShortAns4: '',
  GYNAE5: '',
  GYNAEShortAns5: '',
  GYNAE6: '',
  GYNAEShortAns6: '',
  GYNAE7: '',
  GYNAEShortAns7: '',
  GYNAE8: '',
  GYNAEShortAns8: '',
  GYNAE9: '',
  GYNAE10: '',
  GYNAEShortAns10: '',
  GYNAE11: '',
  GYNAEShortAns11: '',
  GYNAE13: '',
  GYNAEShortAns13: '',
}

// Custom Radio Field Component
const RadioField = ({ name, label, options, ...props }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext()
  
  return (
    <FormControl error={touched[name] && !!errors[name]} {...props}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        value={values[name] || ''}
        onChange={(e) => setFieldValue(name, e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel 
            key={option.value}
            value={option.value} 
            control={<Radio />} 
            label={option.label} 
          />
        ))}
      </RadioGroup>
      {touched[name] && errors[name] && (
        <FormHelperText>{errors[name]}</FormHelperText>
      )}
    </FormControl>
  )
}

// Custom Text Field Component
const TextFieldFormik = ({ name, label, multiline = false, rows = 1, ...props }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext()
  
  return (
    <TextField
      name={name}
      label={label}
      value={values[name] || ''}
      onChange={(e) => setFieldValue(name, e.target.value)}
      error={touched[name] && !!errors[name]}
      helperText={touched[name] && errors[name]}
      multiline={multiline}
      rows={rows}
      fullWidth
      margin="normal"
      {...props}
    />
  )
}

// Referral Component
const GetReferral = () => {
  const { values } = useFormikContext()
  const { GYNAE2, GYNAE3, GYNAE4, GYNAE5, GYNAE6, GYNAE7, GYNAE8, GYNAE9, GYNAE10, GYNAE11 } = values

  const generalGynae = [GYNAE2, GYNAE3, GYNAE4, GYNAE5, GYNAE6, GYNAE7]
  const reproMedicine = [GYNAE8, GYNAE9]
  const urogynae = [GYNAE10, GYNAE11]

  let result = ''
  for (const qn of generalGynae) {
    if (qn === 'Yes') {
      result += 'General Gynecology Clinic'
      break
    }
  }
  for (const qn of reproMedicine) {
    if (qn === 'Yes') {
      result += '\nReproductive Medicine Clinic (if patient is keen for fertility)'
      break
    }
  }
  for (const qn of urogynae) {
    if (qn === 'Yes') {
      result += '\nUrogynecology Clinic'
      break
    }
  }
  return (
    <p style={{ whiteSpace: 'pre-line' }} className='blue'>
      {result}
    </p>
  )
}

const formName = 'gynaeForm'

const GynaeForm = () => {
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const { patientId } = useContext(FormContext)
  const [saveData, setSaveData] = useState(initialValues)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      // Merge saved data with initial values to ensure all fields are present
      setSaveData({ ...initialValues, ...savedData })
    }
    fetchData()
  }, [])

  const formOptions = {
    yesNo: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const handleSubmit = async (values) => {
    isLoading(true)
    const response = await submitForm(values, patientId, formName)
    if (response.result) {
      isLoading(false)
      setTimeout(() => {
        alert('Successfully submitted form')
        navigate('/app/dashboard', { replace: true })
      }, 80)
    } else {
      isLoading(false)
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
        {({ values }) => (
          <Form>
            <div className='form--div fieldPadding'>
              <h1>Gynecology</h1>
              <h3 className='red'>Only ask if participant is female: </h3>
              
              <h3>Are you menopaused?</h3>
              <p>i.e. &gt; 1 year from your last menstrual period</p>
              <RadioField 
                name='GYNAE1' 
                label='GYNAE1' 
                options={formOptions.yesNo} 
              />

              {values.GYNAE1 === 'Yes' && (
                <>
                  <h3>Do you have any postmenopausal bleeding? (bleeding after menopause)</h3>
                  <RadioField 
                    name='GYNAE2' 
                    label='GYNAE2' 
                    options={formOptions.yesNo} 
                  />
                  <h4>Please specify:</h4>
                  <TextFieldFormik 
                    name='GYNAEShortAns2' 
                    label='GYNAE2 Details' 
                    multiline 
                    rows={3} 
                  />
                </>
              )}

              <h3>Do you have any abnormal per vaginal bleeding?</h3>
              <p>
                e.g. bleeding between periods (intermenstrual bleeding), prolonged menses, bleeding after
                intercourse (post-coital bleeding)
              </p>
              <RadioField 
                name='GYNAE3' 
                label='GYNAE3' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns3' 
                label='GYNAE3 Details' 
                multiline 
                rows={3} 
              />

              <h3>Do you have irregular period or less than 4 menstrual cycles a year?</h3>
              <RadioField 
                name='GYNAE4' 
                label='GYNAE4' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns4' 
                label='GYNAE4 Details' 
                multiline 
                rows={3} 
              />

              <h3>
                Do you have any menstrual concerns such as extremely heavy menses/severe pain during
                menses?
              </h3>
              <RadioField 
                name='GYNAE5' 
                label='GYNAE5' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns5' 
                label='GYNAE5 Details' 
                multiline 
                rows={3} 
              />

              <h3>Do you feel any abnormal abdominal masses?</h3>
              <RadioField 
                name='GYNAE6' 
                label='GYNAE6' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns6' 
                label='GYNAE6 Details' 
                multiline 
                rows={3} 
              />

              <h3>Do you have any new onset abdominal pain/bloatedness?</h3>
              <RadioField 
                name='GYNAE7' 
                label='GYNAE7' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns7' 
                label='GYNAE7 Details' 
                multiline 
                rows={3} 
              />

              <h3>
                Do you have any fertility concerns or any difficulties conceiving after trying for more
                than 1 year?
              </h3>
              <RadioField 
                name='GYNAE8' 
                label='GYNAE8' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns8' 
                label='GYNAE8 Details' 
                multiline 
                rows={3} 
              />

              {values.GYNAE8 === 'Yes' && (
                <>
                  <h3>
                    If so, are you keen to investigate for the cause of subfertility and to pursue fertility
                    treatment?
                  </h3>
                  <RadioField 
                    name='GYNAE9' 
                    label='GYNAE9' 
                    options={formOptions.yesNo} 
                  />
                </>
              )}

              <h3>
                Do you have any urinary symptoms such as urinary leakage, recurrent urinary infection,
                urgency or nocturia?
              </h3>
              <RadioField 
                name='GYNAE10' 
                label='GYNAE10' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns10' 
                label='GYNAE10 Details' 
                multiline 
                rows={3} 
              />

              <h3>Do you feel any lump in vagina or have any pelvic organ prolapse?</h3>
              <RadioField 
                name='GYNAE11' 
                label='GYNAE11' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns11' 
                label='GYNAE11 Details' 
                multiline 
                rows={3} 
              />

              <h3>
                Based on Advanced Gynae Screening, please kindly refer her to the following gynecological
                service for further evaluation:
              </h3>
              <GetReferral />

              <h3>Referral was given</h3>
              <RadioField 
                name='GYNAE13' 
                label='GYNAE13' 
                options={formOptions.yesNo} 
              />
              <h4>Please specify:</h4>
              <TextFieldFormik 
                name='GYNAEShortAns13' 
                label='GYNAE13 Details' 
                multiline 
                rows={3} 
              />
              <br />
            </div>

            <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button 
                  type='submit' 
                  variant='contained' 
                  color='primary'
                  disabled={loading}
                >
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

GynaeForm.contextType = FormContext

export default GynaeForm