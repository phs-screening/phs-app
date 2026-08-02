import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, Grid, CircularProgress, Button, Typography, Box } from '@mui/material'

import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import CustomCheckboxGroup from '../components/form-components/CustomCheckboxGroup'
import ErrorNotification from '../components/form-components/ErrorNotification'
import PopupText from '../utils/popupText'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'
import allForms from './forms.json'
import './fieldPadding.css'
import { socialServiceFormQuestionText } from './SocialServiceFormQuestions'

const initialValues = {
  socialServiceQ1: '',
  socialServiceQ2: '',
  socialServiceQ3: '',
  socialServiceQ4: '',
  socialServiceQ5: [],
  socialServiceQ7: [],
  socialServiceQ8: [],
  socialServiceQ9: '',
}

const validationSchema = Yup.object({
  socialServiceQ1: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('Required'),
  socialServiceQ2: Yup.string().required('Required'),
  socialServiceQ3: Yup.string().required('Required'),
  socialServiceQ4: Yup.string().required('Required'),
  socialServiceQ5: Yup.string().when('socialServiceQ4', {
    is: 'Yes',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema,
  }),
  socialServiceQ7: Yup.array().min(1, 'Required').required('Required'),
  socialServiceQ8: Yup.array().min(1, 'Required').required('Required'),
  socialServiceQ9: Yup.string().required(
    'Please specify the follow-up actions. NIL if not applicable',
  ),
})

const formOptions = {
  socialServiceQ1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  socialServiceQ4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  socialServiceCheckbox: [{ label: 'Yes', value: 'Yes' }],
}

const formName = 'socialServiceForm'

const SocialServiceForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState(initialValues)

  // forms to retrieve for side panel
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [doctorConsult, setDoctorConsult] = useState({})
  const [geriVision, setVision] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [geriPt, setGeriPt] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      const loadPastForms = async () => {
        const regData = getSavedData(patientId, allForms.registrationForm)
        const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
        const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
        const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
        const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
        const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)

        Promise.all([
          regData,
          hxSocialData,
          doctorConsultData,
          geriVisionData,
          geriOtData,
          geriPtData,
        ]).then((result) => {
          setReg(result[0])
          setHxSocial(result[1])
          setDoctorConsult(result[2])
          setVision(result[3])
          setGeriOt(result[4])
          setGeriPt(result[5])
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
          <div className='form--div'>
            <Typography variant='h2' fontWeight='bold'>
              Social Service Station
            </Typography>

            <Typography variant='h4' fontWeight='bold' sx={{ mt: 2 }}>
              {socialServiceFormQuestionText.socialServiceQ1}
            </Typography>
            <FastField
              name='socialServiceQ1'
              label='socialServiceQ1'
              component={CustomRadioGroup}
              options={formOptions.socialServiceQ1}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ2}
            </Typography>
            <FastField
              name='socialServiceQ2'
              label='socialServiceQ2'
              component={CustomTextField}
              multiline
              minRows={2}
            />

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ3}
            </Typography>
            <FastField
              name='socialServiceQ3'
              label='socialServiceQ3'
              component={CustomTextField}
              multiline
              minRows={2}
            />

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ4}
            </Typography>
            <FastField
              name='socialServiceQ4'
              label='socialServiceQ4'
              component={CustomRadioGroup}
              options={formOptions.socialServiceQ4}
              row
            />

            <PopupText qnNo='socialServiceQ4' triggerValue='Yes'>
              <Typography variant='h4' fontWeight='bold'>
                {socialServiceFormQuestionText.socialServiceQ5}
              </Typography>
              <FastField
                name='socialServiceQ5'
                label='socialServiceQ5'
                component={CustomTextField}
                multiline
                minRows={2}
              />
            </PopupText>

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ7}
            </Typography>
            <FastField
              name='socialServiceQ7'
              label='socialServiceQ7'
              component={CustomCheckboxGroup}
              options={formOptions.socialServiceCheckbox}
            />

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ8}
            </Typography>
            <FastField
              name='socialServiceQ8'
              label='socialServiceQ8'
              component={CustomCheckboxGroup}
              options={formOptions.socialServiceCheckbox}
            />

            <Typography variant='h4' fontWeight='bold'>
              {socialServiceFormQuestionText.socialServiceQ9}
            </Typography>
            <FastField
              name='socialServiceQ9'
              label='socialServiceQ9'
              component={CustomTextField}
              multiline
              minRows={2}
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
      <h2>Referrals</h2>
      <p className='underlined'>Referred to Social Services from Doctor&apos;s Consult?</p>
      {doctorConsult ? (
        <p className='blue'>{doctorConsult.doctorSConsultQ6 ? 'Yes' : 'No'}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      {doctorConsult && doctorConsult.doctorSConsultQ6 && doctorConsult.doctorSConsultQ7 ? (
        <p className='blue'>{doctorConsult.doctorSConsultQ7}</p>
      ) : (
        <p className='blue'>nil</p>
      )}

      <h2>Financial Status</h2>
      <p className='underlined'>CHAS Status</p>
      {reg && reg.registrationQ12 ? (
        <p className='blue'>{reg.registrationQ12}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>Pioneer/ Merdeka Generation Status</p>
      {reg && reg.registrationQ13 ? (
        <p className='blue'>{reg.registrationQ13}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>
        Is the participant on any other Government Financial Assistance, other than CHAS and PG
        (e.g. Public Assistance Scheme)
      </p>
      {hxSocial && hxSocial.SOCIAL3 ? (
        <p className='blue'>{hxSocial.SOCIAL3}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      {hxSocial && hxSocial.SOCIALShortAns3 ? (
        <p className='blue'>{hxSocial.SOCIALShortAns3}</p>
      ) : (
        <p className='blue'>no</p>
      )}
      <p className='underlined'>Average Household Income Per Month</p>
      {hxSocial && hxSocial.SOCIAL4 ? (
        <p className='blue'>{hxSocial.SOCIAL4}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>Number of Household Members (Including Participant)</p>
      {hxSocial && hxSocial.SOCIAL5 ? (
        <p className='blue'>{hxSocial.SOCIAL5}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>Interest in CHAS Card Application</p>
      {hxSocial && hxSocial.SOCIAL6 ? (
        <p className='blue'>{hxSocial.SOCIAL6}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      {hxSocial && hxSocial.SOCIALShortAns6 ? (
        <p className='blue'>{hxSocial.SOCIALShortAns6}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>
        Does the participant need advice on financial schemes in Singapore or financial assistance?
      </p>
      {hxSocial && hxSocial.SOCIAL7 ? (
        <p className='blue'>{hxSocial.SOCIAL7}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      {hxSocial && hxSocial.SOCIALShortAns7 ? (
        <p className='blue'>{hxSocial.SOCIALShortAns7}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <Divider />

      <h2>Social Issues</h2>
      <p className='underlined'>Is the participant caring for a loved one</p>
      {hxSocial && hxSocial.SOCIAL8 ? (
        <p className='blue'>{hxSocial.SOCIAL8}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>
        Do the participant feel equipped to provide care to their loved one?
      </p>
      {hxSocial && hxSocial.SOCIAL9 ? (
        <p className='blue'>{hxSocial.SOCIAL9}</p>
      ) : (
        <p className='blue'>nil</p>
      )}
      <Divider />

      {geriVision ? (
        <>
          <p className='underlined'>
            Is participant currently on any eye review/ consulting any eye specialist?
          </p>
          <p className='blue'>{geriVision.geriVisionQ10}</p>
          <p className='blue'>{geriVision.geriVisionQ11}</p>
        </>
      ) : (
        <p className='red'>nil geriVision data!</p>
      )}
      <Divider />

      <p className='underlined'>Referral from PT consult?</p>
      {geriPt && geriPt.geriPtConsultQ4 ? (
        <>
          <p className='blue'>{geriPt.geriPtConsultQ4}</p>
          <p className='blue'>{geriPt.geriPtConsultQ5}</p>
        </>
      ) : (
        <p className='blue'>nil</p>
      )}
      <p className='underlined'>Referral from OT consult?</p>
      {geriOt && geriOt.geriOtConsultQ4 ? (
        <>
          <p className='blue'>{geriOt.geriOtConsultQ4}</p>
          <p className='blue'>{geriOt.geriOtConsultQ5}</p>
        </>
      ) : (
        <p className='blue'>nil</p>
      )}

      {geriOt ? (
        <>
          <p className='underlined'>Recommended programme for participant</p>
          <p className='blue'>{geriOt.geriOtConsultQ6}</p>

          <p className='underlined'>Is participant eligible for HDB EASE?</p>
          <p className='blue'>{geriOt.geriOtConsultQ7}</p>

          <p className='underlined'>Does participant wish to sign up for HDB EASE?</p>
          <p className='blue'>{geriOt.geriOtConsultQ8}</p>

          <p className='underlined'>
            Functional Assessment Report completed & given to participant?
          </p>
          <p className='blue'>{geriOt.geriOtConsultQ9}</p>
        </>
      ) : (
        <p className='red'>nil geriOt data!</p>
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

SocialServiceForm.contextType = FormContext

export default SocialServiceForm
