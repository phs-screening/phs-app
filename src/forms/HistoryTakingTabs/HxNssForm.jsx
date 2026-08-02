import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import PopupText from 'src/utils/popupText.jsx'
import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import CustomTextField from 'src/components/form-components/CustomTextField.jsx'
import CustomCheckboxGroup from '../../components/form-components/CustomCheckboxGroup'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import { getSavedData } from '../../services/patientData'
import allForms from '../forms.json'
import { hxNssFormQuestionText } from './HxNssFormQuestions'

// IMPORTANT: Formerly NSS, renamed to PMHX as of PHS 2022. MongoDB forms not renamed, only tab name
const formName = 'hxNssForm'

const initialValues = {
  PMHX1: '',
  PMHX5: [],
  PMHX6: '',
  PMHX7: '',
  PMHXShortAns7: '',
  PMHX8: '',
  PMHXShortAns8: '',
  PMHX9: '',
  PMHXShortAns9: '',
  PMHXVAX1: '',
  PMHXVAX2: '',
  PMHXVAX3: '',
  PMHXVAX4: '',
  PMHXVAX5: '',
  PMHXVAX6: '',
}

const vaccinationAnswers = ['Yes', 'No', 'Unsure']
const requiresVaccinationInterestQuestion = (answer) => ['No', 'Unsure'].includes(answer)

const createValidationSchema = (isPneumococcalEligible, isShinglesEligible) =>
  Yup.object({
    PMHX1: Yup.string().required('Required'),
    PMHX6: Yup.string().required('Required'),
    PMHX7: Yup.string().required('Required'),
    PMHXVAX1: Yup.string().oneOf(vaccinationAnswers).required('Required'),
    PMHXVAX2: Yup.string().when('PMHXVAX1', {
      is: requiresVaccinationInterestQuestion,
      then: (schema) => schema.oneOf(vaccinationAnswers).required('Required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    PMHXVAX3: isPneumococcalEligible
      ? Yup.string().oneOf(vaccinationAnswers).required('Required')
      : Yup.string().notRequired(),
    PMHXVAX4: isPneumococcalEligible
      ? Yup.string().when('PMHXVAX3', {
          is: requiresVaccinationInterestQuestion,
          then: (schema) => schema.oneOf(vaccinationAnswers).required('Required'),
          otherwise: (schema) => schema.notRequired(),
        })
      : Yup.string().notRequired(),
    PMHXVAX5: isShinglesEligible
      ? Yup.string().oneOf(vaccinationAnswers).required('Required')
      : Yup.string().notRequired(),
    PMHXVAX6: isShinglesEligible
      ? Yup.string().when('PMHXVAX5', {
          is: requiresVaccinationInterestQuestion,
          then: (schema) => schema.oneOf(vaccinationAnswers).required('Required'),
          otherwise: (schema) => schema.notRequired(),
        })
      : Yup.string().notRequired(),
  })

const formOptions = {
  PMHX5: [
    { label: 'Kidney Disease', value: 'Kidney Disease' },
    { label: 'Hypertension', value: 'Hypertension' },
    { label: 'Hyperlipidemia', value: 'Hyperlipidemia' },
    { label: 'Diabetes/Pre-Diabetic', value: 'Diabetes/Pre-Diabetic' },
    {
      label:
        'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)',
      value: 'Heart disease',
    },
    {
      label: 'Others (e.g. Fatty liver / respiratory / kidney problems)',
      value: 'Others',
    },
  ],
  PMHX7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX8: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  vaccination: vaccinationAnswers.map((answer) => ({ label: answer, value: answer })),
}

export default function HxNssForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [regForm, setRegForm] = useState({})
  const [registrationLoaded, setRegistrationLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setRegistrationLoaded(false)

    const fetchData = async () => {
      const [res, regData] = await Promise.all([
        getSavedData(patientId, formName),
        getSavedData(patientId, allForms.registrationForm),
      ])
      setSavedData({ ...initialValues, ...res })
      setRegForm(regData || {})
      setRegistrationLoaded(true)
    }

    fetchData()
  }, [patientId])

  const patientAge = Number(regForm.registrationQ4)
  const isPneumococcalEligible =
    registrationLoaded && Number.isFinite(patientAge) && patientAge >= 65
  const isShinglesEligible = registrationLoaded && Number.isFinite(patientAge) && patientAge >= 60

  const handleSubmit = async (values, { setSubmitting }) => {
    const submittedValues = { ...values }

    if (!requiresVaccinationInterestQuestion(submittedValues.PMHXVAX1)) {
      submittedValues.PMHXVAX2 = ''
    }
    if (!isPneumococcalEligible) {
      submittedValues.PMHXVAX3 = ''
      submittedValues.PMHXVAX4 = ''
    } else if (!requiresVaccinationInterestQuestion(submittedValues.PMHXVAX3)) {
      submittedValues.PMHXVAX4 = ''
    }
    if (!isShinglesEligible) {
      submittedValues.PMHXVAX5 = ''
      submittedValues.PMHXVAX6 = ''
    } else if (!requiresVaccinationInterestQuestion(submittedValues.PMHXVAX5)) {
      submittedValues.PMHXVAX6 = ''
    }

    setLoading(true)
    const response = await submitForm(submittedValues, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      await showFormSubmitSuccess()
      changeTab(null, nextTab)
    } else {
      showFormSubmitError(`Unsuccessful. ${response.error}`)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={createValidationSchema(isPneumococcalEligible, isShinglesEligible)}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>PAST MEDICAL HISTORY</strong>
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            {hxNssFormQuestionText.PMHX1}
          </Typography>
          <Typography component='ol'>
            <li>Conditions</li>
            <li>Duration</li>
            <li>Control</li>
            <li>Compliance</li>
            <li>Complications</li>
            <li>Follow up route (specify whether GP/Polyclinic/FMC/SOC)</li>
          </Typography>
          <FastField
            name='PMHX1'
            component={CustomTextField}
            label='PMHX1'
            sx={{ mb: 5 }}
            multiline
          />

          <Typography variant='subtitle1' color='error' fontWeight='bold' gutterBottom>
            If participant is not engaged with any follow-up, ask:
          </Typography>
          <Typography gutterBottom>
            &quot;What is the reason that you&apos;re not following up with your doctor for your
            existing conditions?&quot;
            <br />
            e.g. do not see the purpose for tests, busy/no time, lack of access
            <br />
            e.g. mobility issues, financial issues, fear of doctors/clinics/hospitals etc
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxNssFormQuestionText.PMHX5}
          </Typography>

          {/* Check if this works in Mongo */}
          <FastField
            name='PMHX5'
            component={CustomCheckboxGroup}
            options={formOptions.PMHX5}
            label='PMHX5'
            row
          />
          <Typography variant='subtitle1' fontWeight='bold'>
            {hxNssFormQuestionText.PMHX6}
          </Typography>
          <FastField name='PMHX6' component={CustomTextField} label='PMHX6' fullWidth multiline />

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxNssFormQuestionText.PMHXVAX1}
          </Typography>
          <FastField
            name='PMHXVAX1'
            component={CustomRadioGroup}
            label='PMHXVAX1'
            options={formOptions.vaccination}
            row
          />
          <PopupText qnNo='PMHXVAX1' triggerValue={['No', 'Unsure']}>
            <Typography variant='subtitle1' fontWeight='bold'>
              {hxNssFormQuestionText.PMHXVAX2}
            </Typography>
            <Typography gutterBottom>
              For all vaccines, please advise patient that some vaccines are fully subsidised based
              on CHAS status and age, and if not charges may apply and they can find out at the
              vaccine station.
            </Typography>
            <FastField
              name='PMHXVAX2'
              component={CustomRadioGroup}
              label='PMHXVAX2'
              options={formOptions.vaccination}
              row
            />
          </PopupText>

          {isPneumococcalEligible && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                {hxNssFormQuestionText.PMHXVAX3}
              </Typography>
              <FastField
                name='PMHXVAX3'
                component={CustomRadioGroup}
                label='PMHXVAX3'
                options={formOptions.vaccination}
                row
              />
              <PopupText qnNo='PMHXVAX3' triggerValue={['No', 'Unsure']}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {hxNssFormQuestionText.PMHXVAX4}
                </Typography>
                <FastField
                  name='PMHXVAX4'
                  component={CustomRadioGroup}
                  label='PMHXVAX4'
                  options={formOptions.vaccination}
                  row
                />
              </PopupText>
            </>
          )}

          {isShinglesEligible && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                {hxNssFormQuestionText.PMHXVAX5}
              </Typography>
              <FastField
                name='PMHXVAX5'
                component={CustomRadioGroup}
                label='PMHXVAX5'
                options={formOptions.vaccination}
                row
              />
              <PopupText qnNo='PMHXVAX5' triggerValue={['No', 'Unsure']}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {hxNssFormQuestionText.PMHXVAX6}
                </Typography>
                <FastField
                  name='PMHXVAX6'
                  component={CustomRadioGroup}
                  label='PMHXVAX6'
                  options={formOptions.vaccination}
                  row
                />
              </PopupText>
            </>
          )}

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxNssFormQuestionText.PMHX7}
          </Typography>
          <Typography variant='subtitle1' fontWeight='bold'>
            For participant with DM, refer to Doctor&apos;s Station if:
          </Typography>
          <ul>
            <li>Symptomatic, and non-compliant</li>
            <li>Asymptomatic, and non-compliant</li>
          </ul>
          <Typography>
            Also refer to Doctor&apos;s Station if participant has not been diagnosed with DM, but
            has signs of DM (polyuria, polydipsia, periphery neuropathy, blurring of vision etc.)
          </Typography>

          <FastField
            name='PMHX7'
            label='PMHX7'
            component={CustomRadioGroup}
            options={formOptions.PMHX7}
            row
          />

          <PopupText qnNo='PMHX7' triggerValue='Yes'>
            <FastField
              name='PMHXShortAns7'
              component={CustomTextField}
              label={hxNssFormQuestionText.PMHXShortAns7}
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          {/* For participants who are 60 and above, show PMHX8 and PMHX9 */}
          {regForm.registrationQ4 >= 60 && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                {hxNssFormQuestionText.PMHX8}
              </Typography>
              <FastField
                name='PMHX8'
                component={CustomRadioGroup}
                label='PMHX8'
                options={formOptions.PMHX8}
                row
              />
              <PopupText qnNo='PMHX8' triggerValue='Yes'>
                <FastField
                  name='PMHXShortAns8'
                  component={CustomTextField}
                  label={hxNssFormQuestionText.PMHXShortAns8}
                  fullWidth
                  multiline
                  sx={{ mb: 3 }}
                />
              </PopupText>

              <Typography variant='subtitle1' fontWeight='bold'>
                {hxNssFormQuestionText.PMHX9}
              </Typography>
              <Typography component='ol' type='a'>
                <li>Have you had your hearing aids for more than 5 years?</li>
                <li>
                  Has it been 3 years or more since you used your hearing aids (i.e. did not use the
                  hearing aids for more than 3 years)?
                </li>
                <li>Are your hearing aids spoilt/not working?</li>
              </Typography>
              <FastField
                name='PMHX9'
                label='PMHX9'
                component={CustomRadioGroup}
                options={formOptions.PMHX9}
                row
              />
              <PopupText qnNo='PMHX9' triggerValue='Yes'>
                <FastField
                  name='PMHXShortAns9'
                  component={CustomTextField}
                  label={hxNssFormQuestionText.PMHXShortAns9}
                  fullWidth
                  multiline
                  sx={{ mb: 3 }}
                />
              </PopupText>
            </>
          )}

          <ErrorNotification
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message='Please fill in all required fields correctly.'
          />

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {loading || isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={!registrationLoaded}
              >
                Submit
              </Button>
            )}
          </div>
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
