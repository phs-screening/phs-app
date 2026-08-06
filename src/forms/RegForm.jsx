import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, FastField } from 'formik'
import { validationSchema } from './registrationSchema'
import { registrationQuestionText } from './questions/registrationQuestions'

import { Alert, Divider, Paper, CircularProgress, Button, TextField, Typography, Box } from '@mui/material'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getPatientFormDataStrict } from '../services/patientData'
import { getPatientPreRegistrationPrefillStrict } from '../services/preRegistrations'
import { calculateAgeFromBirthday } from '../utils/calculateAge'
import { toLoadErrorMessage } from '../utils/retryRequest'
import PopupText from 'src/utils/popupText'
import './fieldPadding.css'
import './forms.css'
import CustomTextField from '../components/form-components/CustomTextField'
import CustomCheckbox from '../components/form-components/CustomCheckbox'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomSelect from '../components/form-components/CustomSelect'

import ErrorNotification from 'src/components/form-components/ErrorNotification'
import DataLoadError from 'src/components/DataLoadError'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const initialValues = {
  registrationQ1: 'Mr',
  registrationQ2: '',
  registrationQ3: dayjs(),
  registrationQ4: 0,
  registrationQ5: '',
  registrationQ6: '',
  registrationShortAnsQ6: '',
  registrationQ7: '',
  registrationQ10: '',
  registrationQ11: '',
  registrationQ12: '',
  registrationQ13: '',
  registrationQ16: '',
  registrationQ14: '',
  registrationQ17: false,
  registrationQ18: '',
  registrationQ19: '',
  registrationQ20: '',
}

const formName = 'registrationForm'

const RegForm = () => {
  const { patientId, updatePatientInfo } = useContext(FormContext)
  const [loading, isLoading] = useState(true)
  const navigate = useNavigate()
  const [savedData, setSavedData] = useState(initialValues)
  const [birthday, setBirthday] = useState(dayjs())
  const [patientAge, setPatientAge] = useState(0)
  const [loadError, setLoadError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [loadedFromPreRegistration, setLoadedFromPreRegistration] = useState(false)
  const [nameMappingWarnings, setNameMappingWarnings] = useState([])
  const [preRegistrationMappingIssues, setPreRegistrationMappingIssues] = useState([])

  useEffect(() => {
    let isCurrent = true

    const fetchData = async () => {
      try {
        isLoading(true)
        setLoadError('')
        console.log('Patient ID: ' + patientId)
        let res = {}
        let preRegistration = null

        if (patientId !== -1 && patientId != null) {
          res = await getPatientFormDataStrict(patientId, formName)
          if (!res) {
            preRegistration =
              await getPatientPreRegistrationPrefillStrict(patientId)
          }
        }

        const formData = {
          ...initialValues,
          ...(res || preRegistration?.registrationData || {}),
        }

        // Calculate age if birthday exists in saved data, otherwise use today
        if (formData.registrationQ3) {
          const dayjsBirthday = dayjs(formData.registrationQ3)
          const calculatedAge = calculateAgeFromBirthday(dayjsBirthday)
          formData.registrationQ3 = dayjsBirthday.toDate()
          formData.registrationQ4 = calculatedAge

          if (isCurrent) {
            setBirthday(dayjsBirthday)
            setPatientAge(calculatedAge)
          }
        } else {
          // If no saved birthday, default to today
          const today = dayjs()
          const calculatedAge = calculateAgeFromBirthday(today)
          formData.registrationQ3 = today.toDate()
          formData.registrationQ4 = calculatedAge

          if (isCurrent) {
            setBirthday(today)
            setPatientAge(calculatedAge)
          }
        }

        if (isCurrent) {
          setSavedData(formData)
          setLoadedFromPreRegistration(Boolean(!res && preRegistration))
          setNameMappingWarnings(
            !res ? preRegistration?.nameMappingWarnings || [] : [],
          )
          setPreRegistrationMappingIssues(
            !res ? preRegistration?.mappingIssues || [] : [],
          )
        }
      } catch (error) {
        console.error('Failed to load registration form:', error)
        if (isCurrent) {
          setLoadError(
            toLoadErrorMessage(error, 'Unable to load registration data. Refresh or try again.'),
          )
        }
      } finally {
        if (isCurrent) {
          isLoading(false)
        }
      }
    }
    fetchData()

    return () => {
      isCurrent = false
    }
  }, [patientId, loadAttempt])

  const handleSubmit = async (values, { setSubmitting }) => {
    isLoading(true)
    setSubmitting(true)
    values.registrationQ3 = birthday.toDate()
    values.registrationQ4 = patientAge

    console.log('Patient ID: ' + patientId)
    const response = await submitForm(values, patientId, formName)

    console.log('test  _' + response.result + ' ' + patientAge)
    if (response.result) {
      setTimeout(async () => {
        console.log('response data: ' + response.qNum)
        await showFormSubmitSuccess()
        console.log('Successfully submitted form')
        updatePatientInfo({ ...response.data, queueNo: response.qNum })
        navigate('/app/dashboard')
      }, 80)
    } else {
      setTimeout(() => {
        console.log('Form submission failed')
        showFormSubmitError(`Unsuccessful. ${response.error}`)
      }, 80)
    }
    isLoading(false)
    setSubmitting(false)
  }

  const formOptions = {
    registrationQ1: [
      { label: 'Mr', value: 'Mr' },
      { label: 'Ms', value: 'Ms' },
      { label: 'Mrs', value: 'Mrs' },
      { label: 'Dr', value: 'Dr' },
      { label: 'Mdm', value: 'Mdm' },
    ],
    registrationQ5: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ],
    registrationQ6: [
      { label: 'Chinese 华裔', value: 'Chinese 华裔' },
      { label: 'Malay 巫裔', value: 'Malay 巫裔' },
      { label: 'Indian 印裔', value: 'Indian 印裔' },
      { label: 'Eurasian 欧亚裔', value: 'Eurasian 欧亚裔' },
      { label: 'Others 其他', value: 'Others 其他' },
    ],
    registrationQ7: [
      { label: 'Singapore Citizen 新加坡公民', value: 'Singapore Citizen 新加坡公民' },
      {
        label: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
        value: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
      },
    ],
    registrationQ11: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ12: [
      { label: 'CHAS Green', value: 'CHAS Green' },
      { label: 'CHAS Blue', value: 'CHAS Blue' },
      { label: 'CHAS Orange', value: 'CHAS Orange' },
      { label: 'Public Assistance', value: 'Public Assistance' },
      { label: 'None', value: 'None' },
    ],
    registrationQ13: [
      { label: 'Pioneer generation card holder', value: 'Pioneer generation card holder' },
      { label: 'Merdeka generation card holder', value: 'Merdeka generation card holder' },
      { label: 'None', value: 'None' },
    ],
    registrationQ14: [
      { label: 'English', value: 'English' },
      { label: 'Mandarin', value: 'Mandarin' },
      { label: 'Malay', value: 'Malay' },
      { label: 'Tamil', value: 'Tamil' },
    ],
    registrationQ16: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ18: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ19: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ20: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, submitCount, setFieldValue, values, ...formikProps }) => (
        <Form className='fieldPadding'>
          <div>
            <Typography variant='h2' fontWeight='bold' sx={{ mb: 2 }}>
              Registration
            </Typography>
            {loadedFromPreRegistration && (
              <>
                <Alert severity='info' sx={{ mb: 2 }}>
                  Loaded from pre-registration. Please verify the patient&apos;s name and all
                  prefilled answers.
                </Alert>
                {preRegistrationMappingIssues.length > 0 && (
                  <Alert severity='warning' sx={{ mb: 2 }}>
                    Some answers could not be prefilled. Complete all blank required fields.
                  </Alert>
                )}
              </>
            )}

            <Typography variant='h4' fontWeight='bold' gutterBottom>
              {registrationQuestionText.registrationQ1}
            </Typography>
            <FastField
              name='registrationQ1'
              label=''
              component={CustomSelect}
              options={formOptions.registrationQ1}
            />

            <Typography variant='h4' fontWeight='bold' gutterBottom>
              {registrationQuestionText.registrationQ2}
            </Typography>
            <Typography>
              For Indian/Malay/patients with no Chinese name, ask for their preferred name.
            </Typography>
            {nameMappingWarnings.map((warning) => (
              <Alert key={warning} severity='warning' sx={{ mt: 1, mb: 1 }}>
                {warning}
              </Alert>
            ))}
            <FastField name='registrationQ2' label='' component={CustomTextField} multiline />

            <Typography variant='h4' fontWeight='bold' gutterBottom>
              {registrationQuestionText.registrationQ3}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <Box>
                  <DatePicker
                    label=''
                    value={birthday}
                    format='DD/MM/YYYY'
                    onChange={(newValue) => {
                      if (newValue && newValue.isValid()) {
                        // Valid date selected
                        setBirthday(newValue)
                        setFieldValue('registrationQ3', newValue.toDate())
                        const age = calculateAgeFromBirthday(newValue)
                        setPatientAge(age)
                        setFieldValue('registrationQ4', age)
                      } else {
                        // Invalid date - reset to today's date instead of null
                        const today = dayjs()
                        setBirthday(today)
                        setFieldValue('registrationQ3', today.toDate())
                        const age = calculateAgeFromBirthday(today)
                        setPatientAge(age)
                        setFieldValue('registrationQ4', age)
                      }
                      formikProps.setFieldTouched('registrationQ3', true, true)
                      formikProps.validateField('registrationQ3')
                    }}
                    onAccept={() => {
                      formikProps.setFieldTouched('registrationQ3', true, true)
                      formikProps.validateField('registrationQ3')
                    }}
                    onClose={() => {
                      formikProps.setFieldTouched('registrationQ3', true, true)
                      formikProps.validateField('registrationQ3')
                    }}
                  />
                  {formikProps.errors.registrationQ3 && (
                    <Typography color='error' variant='body2' sx={{ mb: 1 }}>
                      {formikProps.errors.registrationQ3}
                    </Typography>
                  )}
                </Box>
              </DemoContainer>
            </LocalizationProvider>

            <Typography variant='h4' fontWeight='bold' gutterBottom>
              {registrationQuestionText.registrationQ4}
            </Typography>
            <Typography sx={{ color: 'blue', mb: 2 }}>{patientAge}</Typography>
            {patientAge > 0 && patientAge < 40 && (
              <Alert severity='warning' sx={{ mb: 2 }}>
                Patient is below 40 years old. Please verify eligibility before proceeding.
              </Alert>
            )}

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ5}
            </Typography>
            <FastField
              name='registrationQ5'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ5}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ6}
            </Typography>
            <FastField
              name='registrationQ6'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ6}
            />

            <PopupText qnNo='registrationQ6' triggerValue='Others 其他'>
              <Field
                name='registrationShortAnsQ6'
                label={registrationQuestionText.registrationShortAnsQ6}
                component={CustomTextField}
                multiline
                rows={2}
                placeholder={registrationQuestionText.registrationShortAnsQ6}
              />
            </PopupText>

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ7}
            </Typography>
            <Typography sx={{ color: 'red' }}>
              Please Note: Non Singapore Citizens/ Non-PRs are unfortunately not eligible for this
              health screening
            </Typography>
            <FastField
              name='registrationQ7'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ7}
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ11}
            </Typography>
            <Typography>
              If unsure, access HealthHub through app or Singpass. You are considered to have
              enrolled when you are able to view your selected clinic&apos;s name under &quot;Your
              Enrolled Clinic&quot; tab.
            </Typography>
            <FastField
              name='registrationQ11'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ11}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ12}
            </Typography>
            <FastField
              name='registrationQ12'
              label=''
              component={CustomSelect}
              options={formOptions.registrationQ12}
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ13}
            </Typography>
            <FastField
              name='registrationQ13'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ13}
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ16}
            </Typography>
            <FastField
              name='registrationQ16'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ16}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ14}
            </Typography>
            <FastField
              name='registrationQ14'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ14}
            />

            <Typography variant='h4' fontWeight='bold' sx={{ mt: 4 }}>
              {registrationQuestionText.registrationQ18}
            </Typography>
            <FastField
              name='registrationQ18'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ18}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ19}
            </Typography>
            <FastField
              name='registrationQ19'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ19}
              row
            />

            <Typography variant='h4' fontWeight='bold'>
              {registrationQuestionText.registrationQ20}
            </Typography>
            <FastField
              name='registrationQ20'
              label=''
              component={CustomRadioGroup}
              options={formOptions.registrationQ20}
              row
            />
          </div>

          <Typography variant='h4' fontWeight='bold' sx={{ mt: 4 }}>
            Compliance to PDPA 同意书
          </Typography>
          <Typography paragraph>
            I hereby give consent to having photos and/or videos taken of me for publicity purposes.
            I hereby give my consent to the Public Health Service Executive Committee to collect my
            personal information for the purpose of participating in the Public Health Service
            (hereby called &quot;PHS&quot;) and its related events, and to contact me via calls,
            SMS, text messages or emails regarding the event and follow-up process.
          </Typography>
          <Typography paragraph>
            Should you wish to withdraw your consent for us to contact you for the purposes stated
            above, please notify a member of the PHS Executive Committee at &nbsp;
            <a href='mailto:ask.phs@gmail.com'>ask.phs@gmail.com</a> &nbsp; in writing. We will then
            remove your personal information from our database. Please allow 3 business days for
            your withdrawal of consent to take effect. All personal information will be kept
            confidential, will only be disseminated to members of the PHS Executive Committee, and
            will be strictly used by these parties for the purposes stated.
          </Typography>
          <Field
            name='registrationQ17'
            component={CustomCheckbox}
            label={registrationQuestionText.registrationQ17}
          />

          <Box mt={2} mb={2}>
            <ErrorNotification
              show={submitCount > 0 && Object.keys(formikProps.errors || {}).length > 0}
              message='Please fill in all required fields correctly.'
            />
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

          <Divider />
        </Form>
      )}
    </Formik>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {loadError ? (
        <DataLoadError
          message={loadError}
          onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        />
      ) : (
        renderForm()
      )}
    </Paper>
  )
}

export default RegForm
