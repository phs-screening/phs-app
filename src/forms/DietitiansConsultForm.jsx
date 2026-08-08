import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, Grid, CircularProgress, Button, Typography, Box } from '@mui/material'

import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import ErrorNotification from '../components/form-components/ErrorNotification'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'
import allForms from './forms.json'
import './fieldPadding.css'
import { dietitiansConsultFormQuestionText } from './questions/DietitiansConsultFormQuestions'

const initialValues = {
  dietitiansConsultQ1: '',
  dietitiansConsultQ4: '',
  dietitiansConsultQ7: '',
  dietitiansConsultQ8: '',
  dietitiansConsultQ9: '',
}

const validationSchema = Yup.object({
  dietitiansConsultQ1: Yup.string().required("Dietitian's name is required"),
  dietitiansConsultQ4: Yup.string(),
  dietitiansConsultQ7: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('This field is required'),
  dietitiansConsultQ8: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('This field is required'),
  dietitiansConsultQ9: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('This field is required'),
})

const formOptions = {
  dietitiansConsultQ7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  dietitiansConsultQ8: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  dietitiansConsultQ9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const formName = 'dietitiansConsultForm'

const DietitiansConsultForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState(initialValues)

  // forms to retrieve for side panel
  const [doctorConsult, setDoctorConsult] = useState({})
  const [triage, setTriage] = useState({})
  const [hxSocial, setSocial] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      const loadPastForms = async () => {
        const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
        const triageData = getSavedData(patientId, allForms.triageForm)
        const socialData = getSavedData(patientId, allForms.hxSocialForm)

        Promise.all([doctorConsultData, triageData, socialData]).then((result) => {
          setDoctorConsult(result[0])
          setTriage(result[1])
          setSocial(result[2])
        })
        isLoadingSidePanel(false)
      }
      setSaveData(savedData || initialValues)
      loadPastForms()
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    isLoading(true)
    setSubmitting(true)

    try {
      const response = await submitForm(values, patientId, formName)
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
      setTimeout(() => {
        showFormSubmitError(`Error: ${error.message}`)
      }, 80)
    } finally {
      isLoading(false)
      setSubmitting(false)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={saveData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <div>
            <Typography variant='h2' fontWeight='bold' gutterBottom>
              Dietitian&apos;s Consultation
            </Typography>

            <Typography variant='h4' fontWeight='bold'>
              {dietitiansConsultFormQuestionText.dietitiansConsultQ7}
            </Typography>
            <FastField
              name='dietitiansConsultQ7'
              label='dietitiansConsultQ7'
              component={CustomRadioGroup}
              options={formOptions.dietitiansConsultQ7}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {dietitiansConsultFormQuestionText.dietitiansConsultQ1}
            </Typography>
            <FastField
              name='dietitiansConsultQ1'
              label='dietitiansConsultQ1'
              component={CustomTextField}
              multiline
            />

            <Typography variant='h4' fontWeight='bold'>
              {dietitiansConsultFormQuestionText.dietitiansConsultQ4}
            </Typography>
            <FastField
              name='dietitiansConsultQ4'
              label='dietitiansConsultQ4'
              component={CustomTextField}
              multiline
              minRows={4}
            />

            <Typography variant='h4' fontWeight='bold'>
              {dietitiansConsultFormQuestionText.dietitiansConsultQ8}
            </Typography>
            <FastField
              name='dietitiansConsultQ8'
              component={CustomRadioGroup}
              options={formOptions.dietitiansConsultQ8}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {dietitiansConsultFormQuestionText.dietitiansConsultQ9}
            </Typography>
            <FastField
              name='dietitiansConsultQ9'
              component={CustomRadioGroup}
              options={formOptions.dietitiansConsultQ9}
              row
            />
          </div>

          <ErrorNotification
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message='Please fill in all required fields correctly.'
          />

          <Box mt={2} mb={2}>
            {loading || isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Submit
              </Button>
            )}
          </Box>

          <Divider />
        </Form>
      )}
    </Formik>
  )

  const renderSidePanel = () => (
    <div className='summary--question-div'>
      <h2>Doctor&apos;s Consult</h2>
      <p className='underlined'>Reasons for referral from Doctor&apos;s Consult</p>
      {doctorConsult ? <p className='blue'>{doctorConsult.doctorSConsultQ5}</p> : null}
      <Divider />
      <h2>Blood Pressure</h2>
      <p className='underlined'>Average Reading Systolic (average of closest 2 readings)</p>
      Systolic BP:
      {triage ? <p className='blue'>{triage.triageQ7}</p> : null}
      <p className='underlined'>Average Reading Diastolic (average of closest 2 readings)</p>
      Diastolic BP:
      {triage ? <p className='blue'>{triage.triageQ8}</p> : null}
      <Divider />
      <h2>BMI</h2>
      <p className='underlined'>BMI</p>
      {triage ? <p className='blue'>{triage.triageQ12}</p> : null}
      <p className='underlined'>Waist Circumference (in cm)</p>
      {triage ? <p className='blue'>{triage.triageQ13}</p> : null}
      <Divider />
      <h2>Smoking History</h2>
      <p className='underlined'>Has participant ever smoked?</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL10}</p> : null}
      <p className='underlined'>No. of years smoked:</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL10Years}</p> : null}
      <p className='underlined'>Packs per day:</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL10Packs}</p> : null}
      <p className='underlined'>Years since quitting:</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL10End}</p> : null}
      <p className='underlined'>
        Has participant smoked before? For how long and when did they stop?
      </p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL11}</p> : null}
      <p className='underlined'>Participant specifies:</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIALShortAns11}</p> : null}
      <Divider />
      <h2>Alcohol history</h2>
      <p className='underlined'>Alcohol consumption</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL12}</p> : null}
      <Divider />
      <h2>Diet</h2>
      <p className='underlined'>Does the participant think they eat a balanced diet?</p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL13}</p> : null}
      <p className='underlined'>
        Does the participant exercise in any form of moderate physical activity for at least 150
        minutes OR intense physical activity at least 75 minutes throuhgout the week?
      </p>
      {hxSocial ? <p className='blue'>{hxSocial.SOCIAL14}</p> : null}
    </div>
  )

  return (
    <Paper elevation={2} sx={{ p: 0, m: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          {renderForm()}
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {loadingSidePanel ? <CircularProgress /> : renderSidePanel()}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DietitiansConsultForm
