import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, Grid, CircularProgress, Button, Typography, Box } from '@mui/material'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'

import allForms from './forms.json'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import ErrorNotification from '../components/form-components/ErrorNotification'
import PopupText from 'src/utils/popupText'

import './fieldPadding.css'
import { lungFnFormQuestionText } from './questions/LungFnFormQuestions'

const formName = 'lungFnForm'

const initialValues = {
  LUNG1: '',
  LUNGShortAns1: '',
  LUNG1a: '',
  LUNG2: '',
  LUNGShortAns2: '',
  LUNG3: '',
  LUNG4: '',
  LUNG5: '',
  LUNG6: '',
  LUNG7: '',
  LUNG14: '',
}

const YesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  LUNG1: YesNo,
  LUNG1a: YesNo,
  LUNG2: YesNo,
}

const validationSchema = Yup.object({
  LUNG1: Yup.string().required('This field is required'),
  LUNGShortAns1: Yup.string().when('LUNG1', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify why'),
    otherwise: (schema) => schema,
  }),
  LUNG1a: Yup.string().required('This field is required'),
  LUNG2: Yup.string().required('This field is required'),
  LUNGShortAns2: Yup.string().when('LUNG2', {
    is: 'No',
    then: (schema) => schema.required('Please specify why test was not completed'),
    otherwise: (schema) => schema,
  }),
})

function determineLungType(lung5, lung7) {
  const fvcPred = Number(lung5)
  const fevRatio = Number(lung7)

  if (isNaN(fvcPred) || isNaN(fevRatio)) return null

  if (fvcPred >= 80 && fevRatio < 70) return 'Obstructive Defect'
  if (fvcPred < 80 && fevRatio < 70) return 'Mixed Pattern'
  if (fvcPred < 80 && fevRatio >= 70) return 'Restrictive Defect'
  if (fvcPred >= 80 && fevRatio >= 70) return 'Normal'
  return null
}

const LungFnForm = () => {
  const { patientId } = useContext(FormContext)
  const navigate = useNavigate()

  const [savedData, setSavedData] = useState(initialValues)
  const [social, setSocial] = useState({})
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedFormData = await getSavedData(patientId, formName)
        const socialData = await getSavedData(patientId, allForms.hxSocialForm)
        setSavedData({ ...initialValues, ...savedFormData })
        setSocial(socialData || {})
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingSidePanel(false)
      }
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    setSubmitting(true)

    try {
      const finalValues = {
        ...values,
        LUNG13: determineLungType(values.LUNG5, values.LUNG7),
      }

      const response = await submitForm(finalValues, patientId, formName)

      if (response.result) {
        setTimeout(async () => {
          await showFormSubmitSuccess()
          navigate('/app/dashboard')
        }, 80)
      } else {
        setTimeout(() => {
          showFormSubmitError(`Unsuccessful. ${response.error}`)
        }, 80)
      }
    } catch (error) {
      console.error('Submission error:', error)
      showFormSubmitError('An error occurred during submission')
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ submitCount, errors, isSubmitting }) => (
          <Form className='fieldPadding'>
            <Grid container>
              <Grid item xs={9}>
                <div className='form--div'>
                  <Typography variant='h4' component='h1' gutterBottom>
                    Lung Function
                  </Typography>

                  <Typography variant='h6' component='h3' gutterBottom>
                    {lungFnFormQuestionText.LUNG1}
                  </Typography>
                  <FastField
                    name='LUNG1'
                    label='LUNG1'
                    component={CustomRadioGroup}
                    options={formOptions.LUNG1}
                    row
                  />

                  <PopupText qnNo='LUNG1' triggerValue='Yes'>
                    <Typography variant='h6' component='h4' gutterBottom>
                      {lungFnFormQuestionText.LUNGShortAns1}
                    </Typography>
                    <FastField
                      name='LUNGShortAns1'
                      label='LUNGShortAns1'
                      component={CustomTextField}
                      multiline
                      fullWidth
                    />
                  </PopupText>

                  <Typography variant='h6' component='h3' gutterBottom>
                    {lungFnFormQuestionText.LUNG1a}
                  </Typography>
                  <FastField
                    name='LUNG1a'
                    label='LUNG1a'
                    component={CustomRadioGroup}
                    options={formOptions.LUNG1a}
                    row
                  />

                  <Typography variant='h6' component='h3' gutterBottom>
                    {lungFnFormQuestionText.LUNG2}
                  </Typography>
                  <FastField
                    name='LUNG2'
                    label='LUNG2'
                    component={CustomRadioGroup}
                    options={formOptions.LUNG2}
                    row
                  />

                  <PopupText qnNo='LUNG2' triggerValue='No'>
                    <Typography variant='h6' component='h4' gutterBottom>
                      {lungFnFormQuestionText.LUNGShortAns2}
                    </Typography>
                    <FastField
                      name='LUNGShortAns2'
                      label='LUNGShortAns2'
                      component={CustomTextField}
                      multiline
                      fullWidth
                    />
                  </PopupText>
                </div>

                <ErrorNotification
                  show={submitCount > 0 && Object.keys(errors || {}).length > 0}
                  message='Please fill in all required fields correctly.'
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  {loading || isSubmitting ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      size='large'
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  )}
                </Box>

                <br />
                <Divider />
              </Grid>

              <Grid item xs={3} p={1} display='flex' flexDirection='column'>
                {loadingSidePanel ? (
                  <Box display='flex' justifyContent='center' p={2}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <div className='summary--question-div'>
                    <Typography variant='h5' component='h2' gutterBottom>
                      Social
                    </Typography>
                    <Typography variant='body2' className='underlined'>
                      Currently smoke:
                    </Typography>
                    <Typography
                      variant='body1'
                      className='blue'
                      sx={{ color: 'primary.main', mb: 1 }}
                    >
                      {social.SOCIAL10 || 'nil'}
                    </Typography>

                    <Typography variant='body2' className='underlined'>
                      Years smoked:
                    </Typography>
                    <Typography
                      variant='body1'
                      className='blue'
                      sx={{ color: 'primary.main', mb: 1 }}
                    >
                      {social.SOCIAL10Years || 'nil'}
                    </Typography>

                    <Typography variant='body2' className='underlined'>
                      Packs per day:
                    </Typography>
                    <Typography
                      variant='body1'
                      className='blue'
                      sx={{ color: 'primary.main', mb: 1 }}
                    >
                      {social.SOCIAL10Packs || 'nil'}
                    </Typography>

                    <Typography variant='body2' className='underlined'>
                      Years since quitting:
                    </Typography>
                    <Typography
                      variant='body1'
                      className='blue'
                      sx={{ color: 'primary.main', mb: 1 }}
                    >
                      {social.SOCIAL10End || 'nil'}
                    </Typography>

                    <Typography variant='body2' className='underlined'>
                      Smoked before:
                    </Typography>
                    <Typography
                      variant='body1'
                      className='blue'
                      sx={{ color: 'primary.main', mb: 1 }}
                    >
                      {social.SOCIAL11 || 'nil'}
                    </Typography>

                    <Typography variant='body2' className='underlined'>
                      Quit history:
                    </Typography>
                    <Typography variant='body1' className='blue' sx={{ color: 'primary.main' }}>
                      {social.SOCIALShortAns11 || 'nil'}
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default LungFnForm
