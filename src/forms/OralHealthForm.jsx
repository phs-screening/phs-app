import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, Grid, CircularProgress, Button, Typography, Box } from '@mui/material'

import CustomCheckboxGroup from '../components/form-components/CustomCheckboxGroup'
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
import { oralHealthFormQuestionText } from './questions/OralHealthFormQuestions'

const initialValues = {
  DENT1: [],
  DENT3: [],
}

const validationSchema = Yup.object({
  DENT1: Yup.array()
    .of(Yup.string().oneOf(['I have been informed and understand.']))
    .min(1, 'You must check this box to proceed')
    .required('Required'),
  DENT3: Yup.array()
    .of(Yup.string().oneOf(['Yes']))
    .min(1, 'You must check this box to proceed')
    .required('Required'),
})

const formOptions = {
  DENT1: [
    {
      label: 'I have been informed and understand.',
      value: 'I have been informed and understand.',
    },
  ],
  DENT3: [{ label: 'Yes', value: 'Yes' }],
}

const formName = 'oralHealthForm'

const OralHealthForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState(initialValues)

  // forms to retrieve for side panel
  const [doctorConsult, setDoctorConsult] = useState({})
  const [regi, setRegi] = useState({})
  const [hxOral, setHxOral] = useState({})
  const [social, setSocial] = useState({})
  const [pmhx, setPMHX] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      const loadPastForms = async () => {
        const dcData = getSavedData(patientId, allForms.doctorConsultForm)
        const regiData = getSavedData(patientId, allForms.registrationForm)
        const hxOralData = getSavedData(patientId, allForms.hxOralForm)
        const socialData = getSavedData(patientId, allForms.hxSocialForm)
        const pmhxData = getSavedData(patientId, allForms.hxNssForm)

        Promise.all([dcData, regiData, hxOralData, socialData, pmhxData]).then((result) => {
          setDoctorConsult(result[0] || {})
          setRegi(result[1] || {})
          setHxOral(result[2] || {})
          setSocial(result[3] || {})
          setPMHX(result[4] || {})
        })
        isLoadingSidePanel(false)
      }
      const currentData = { ...(savedData || {}) }
      delete currentData.DENT2
      delete currentData.DENTShortAns2
      setSaveData({ ...initialValues, ...currentData })
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
          <div className='form--div'>
            <Typography variant='h1' gutterBottom>
              <strong>Oral Health</strong>
            </Typography>

            <Typography variant='h4' fontWeight='bold'>
              {oralHealthFormQuestionText.DENT1}
            </Typography>
            <Typography component='div' gutterBottom>
              <ol type='a'>
                <li>
                  The oral health screening may be provided by clinical instructors <br />
                  AND/OR postgraduate dental students who are qualified dentists <br />
                  AND/OR undergraduate dental students who are not qualified dentists
                  <ul>
                    <li>
                      ALL undergraduate dental students will be supervised by a clinical instructor
                      and/or postgraduate dental student.
                    </li>
                  </ul>
                </li>
                <li>
                  The Oral Health Screening only provides a basic assessment of my/my ward&apos;s
                  oral health condition and that it does not take the place of a thorough oral
                  health examination.
                </li>
                <li>
                  I/My ward will be advised on the type(s) of follow-up dental treatment required
                  for my/my ward&apos;s oral health condition after the Oral Health Screening.
                  <ul>
                    <li>
                      I/My ward will be responsible to seek such follow-up dental treatment as
                      advised at my/myward&apos; own cost.
                    </li>
                  </ul>
                </li>
                <li>
                  My decision to participate/let my ward participate in this Oral Health Screening
                  is voluntary.
                </li>
              </ol>
            </Typography>

            <FastField
              name='DENT1'
              label='DENT1'
              component={CustomCheckboxGroup}
              options={formOptions.DENT1}
            />

            <Typography variant='h4' fontWeight='bold'>
              {oralHealthFormQuestionText.DENT3}
            </Typography>
            <FastField
              name='DENT3'
              label='DENT3'
              component={CustomCheckboxGroup}
              options={formOptions.DENT3}
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
      <h2>Referral:</h2>
      {doctorConsult ? (
        <>
          <p className='underlined'>Is patient refered to Dental:</p>
          <p className='blue'>{doctorConsult.doctorSConsultQ8 ? 'Yes' : 'No'}</p>
          <p className='underlined'>Does patient require urgent follow up?</p>
          <p className='blue'>{doctorConsult.doctorSConsultQ10}</p>
        </>
      ) : (
        <p className='red'>nil doctorConsult data!</p>
      )}
      <Divider />

      <h2>Patient Info:</h2>
      {regi ? (
        <p className='blue'>Age: {regi.registrationQ4}</p>
      ) : (
        <p className='red'>nil registration data!</p>
      )}
      <Divider />

      <h2>Patient History:</h2>
      {hxOral ? (
        <>
          <p className='underlined'>Patient&apos;s Oral Health:</p>
          <p className='blue'>{hxOral.ORAL1}</p>

          <p className='underlined'>
            Is patient currently experiencing any pain in their mouth area?:
          </p>
          <p className='blue'>{hxOral.ORAL3}</p>

        </>
      ) : (
        <p className='red'>nil hxOral data!</p>
      )}
      <Divider />

      {social ? (
        <>
          <p className='underlined'>Has patient ever smoked:</p>
          <p className='blue'>{social.SOCIAL10}</p>
          <p className='underlined'>How many years did the patient smoke?:</p>
          <p className='blue'>{social.SOCIAL10Years}</p>
          <p className='underlined'>How many packs per day?:</p>
          <p className='blue'>{social.SOCIAL10Packs}</p>
          <p className='underlined'>How many years ago did the patient quit?:</p>
          <p className='blue'>{social.SOCIAL10End}</p>
        </>
      ) : (
        <p className='red'>nil social data!</p>
      )}
      <Divider />

      {pmhx && pmhx.PMHX5 ? (
        <>
          <p className='underlined'>Patient has the following conditions:</p>
          <ul>
            {pmhx.PMHX5.map((condition) => (
              <li key={condition} className='blue'>
                {condition}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className='red'>nil PMHX5 data!</p>
      )}
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

OralHealthForm.contextType = FormContext

export default OralHealthForm
