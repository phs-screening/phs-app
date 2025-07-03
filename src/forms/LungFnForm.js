import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import {
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material'

import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import allForms from './forms.json'


import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

import { useNavigate } from 'react-router'

// Yup validation schema
const schema = Yup.object({
  LUNG1: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('This field is required'),
  LUNGShortAns1: Yup.string()
    .when('LUNG1', {
      is: 'No',
      then: (schema) => schema.required('Please specify'),
      otherwise: (schema) => schema
    }),
  LUNG2: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('This field is required'),
  LUNGShortAns2: Yup.string()
    .when('LUNG2', {
      is: 'No',
      then: (schema) => schema.required('Please specify why'),
      otherwise: (schema) => schema
    }),
  LUNG3: Yup.number()
    .typeError('Must be a number')
    .required('This field is required'),
  LUNG4: Yup.number()
    .typeError('Must be a number')
    .required('This field is required'),
  LUNG5: Yup.number()
    .typeError('Must be a number')
    .required('This field is required'),
  LUNG6: Yup.number()
    .typeError('Must be a number')
    .required('This field is required'),
  LUNG7: Yup.number()
    .typeError('Must be a number')
    .required('This field is required'),
  LUNG14: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select a valid option')
    .required('This field is required'),
})

const formName = 'lungFnForm'

const LungFnForm = () => {
  const { patientId } = useContext(FormContext)

  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})

  const [lungType, setLungType] = useState(null)
  const [social, setSocial] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
    const savedData = getSavedData(patientId, formName)
    const socialData = getSavedData(patientId, allForms.hxSocialForm)
    Promise.all([savedData, socialData]).then((result) => {
      setSaveData(result[0])
      setSocial(result[1])
      isLoadingSidePanel(false)
    })}
    fetchData()
  }, [])

  const formOptions = {
    LUNG1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    LUNG2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    LUNG14: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
  }

  const LungType_cal = (lung5, lung7) => {
    if ((lung5 >= 80) && (lung7 < 70)) {
      const typeOfLung = "Obstructive Defect"
      setLungType(typeOfLung)
      return <p className='blue'>{typeOfLung}</p>
    } else if ((lung5 < 80) && (lung7 < 70)) {
      const typeOfLung = "Mixed Pattern"
      setLungType(typeOfLung)
      return <p className='blue'>{typeOfLung}</p>
    } else if ((lung5 < 80) && (lung7 >= 70)) {
      const typeOfLung = "Restrictive Defect"
      setLungType(typeOfLung)
      return <p className='blue'>{typeOfLung}</p>
    } else if ((lung5 >= 80) && (lung7 >= 70)) {
      const typeOfLung = "Normal"
      setLungType(typeOfLung)
      return <p className='blue'>{typeOfLung}</p>
    } else {
      setLungType(null)
      return <p className='blue'>nil</p>
    }
  }

  const RadioField = ({ name, label, options, values, setFieldValue, errors, touched }) => (
    <FormControl component="fieldset" margin="normal" fullWidth>
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
      {errors[name] && touched[name] && (
        <Box color="error.main" fontSize="0.75rem" mt={0.5}>
          {errors[name]}
        </Box>
      )}
    </FormControl>
  )

  const NumField = ({ name, label, values, setFieldValue, errors, touched }) => (
    <TextField
      fullWidth
      margin="normal"
      name={name}
      label={label}
      type="number"
      value={values[name] || ''}
      onChange={(e) => setFieldValue(name, parseFloat(e.target.value) || '')}
      error={errors[name] && touched[name]}
      helperText={errors[name] && touched[name] ? errors[name] : ''}
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

  const LongTextField = ({ name, label, values, setFieldValue, errors, touched }) => (
    <TextField
      fullWidth
      margin="normal"
      name={name}
      label={label}
      multiline
      rows={3}
      value={values[name] || ''}
      onChange={(e) => setFieldValue(name, e.target.value)}
      error={errors[name] && touched[name]}
      helperText={errors[name] && touched[name] ? errors[name] : ''}
    />
  )

  const newForm = (values, setFieldValue, errors, touched, isSubmitting) => (
    <Form className='fieldPadding'>
      <div className='form--div'>
        <h1>Lung Function</h1>
        <h3>Are you well today? (Any flu, fever etc)</h3>
        <RadioField 
          name='LUNG1' 
          label='LUNG1' 
          options={formOptions.LUNG1}
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <LongTextField 
          name='LUNGShortAns1' 
          label='LUNG1'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <h3>Lung function test completed?</h3>
        <RadioField 
          name='LUNG2' 
          label='LUNG2' 
          options={formOptions.LUNG2}
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        {values.LUNG2 === 'No' && (
          <div>
            <h4>If no, why?</h4>
            <LongTextField 
              name='LUNGShortAns2' 
              label='LUNG2'
              values={values}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
            />
          </div>
        )}
        <h2>Results of lung function test:</h2><br />
        <h2>Pre-bronchodilator</h2>
        <h3>FVC (L)</h3>
        <NumField 
          name='LUNG3' 
          label='LUNG3'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <h3>FEV1 (L)</h3>
        <NumField 
          name='LUNG4' 
          label='LUNG4'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <h3>FVC (%pred)</h3>
        <NumField 
          name='LUNG5' 
          label='LUNG5'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <h3>FEV1 (%pred)</h3>
        <NumField 
          name='LUNG6' 
          label='LUNG6'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
        <h3>FEV1:FVC (%)</h3>
        <NumField 
          name='LUNG7' 
          label='LUNG7'
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        /><br />
        <h3>What defect does the patient have? </h3>
        <LungType_cal lung5={values.LUNG5} lung7={values.LUNG7} />
        <h3>Patient needs to be referred to doctor&apos;s station for followup on their result?</h3>
        <RadioField 
          name='LUNG14' 
          label='LUNG14' 
          options={formOptions.LUNG14}
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />
      </div>
      
      <Box mt={2}>
        {loading || isSubmitting ? (
          <CircularProgress />
        ) : (
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        )}
      </Box>

      <br />
      <Divider />
    </Form>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            <Formik
              initialValues={{
                LUNG1: saveData.LUNG1 || '',
                LUNGShortAns1: saveData.LUNGShortAns1 || '',
                LUNG2: saveData.LUNG2 || '',
                LUNGShortAns2: saveData.LUNGShortAns2 || '',
                LUNG3: saveData.LUNG3 || '',
                LUNG4: saveData.LUNG4 || '',
                LUNG5: saveData.LUNG5 || '',
                LUNG6: saveData.LUNG6 || '',
                LUNG7: saveData.LUNG7 || '',
                LUNG14: saveData.LUNG14 || '',
              }}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={async (model, { setSubmitting }) => {
                isLoading(true)
                model.LUNG13 = lungType
                const response = await submitForm(model, patientId, formName)
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
                setSubmitting(false)
              }}
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => 
                newForm(values, setFieldValue, errors, touched, isSubmitting)
              }
            </Formik>
          </Paper>
        </Grid>
        <Grid
          p={1}
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Social</h2>
              <p className='underlined'>Does patient currently smoke:</p>
              {social && social.SOCIAL10 ? (
                <p className='blue'>{social.SOCIAL10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>How many pack-years:</p>
              {social && social.SOCIALShortAns10 ? (
                <p className='blue'>{social.SOCIALShortAns10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Has patient smoked before:</p>
              {social && social.SOCIAL11 ? (
                <p className='blue'>{social.SOCIAL11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>For how long and when did they stop:</p>
              {social && social.SOCIALShortAns11 ? (
                <p className='blue'>{social.SOCIALShortAns11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

LungFnForm.contextType = FormContext

export default LungFnForm