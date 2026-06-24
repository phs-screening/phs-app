import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, FastField, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import CustomTextField from '../../components/form-components/CustomTextField'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup.jsx'
import CustomNumberField from 'src/components/form-components/CustomNumberField.jsx'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from 'src/utils/popupText.jsx'

const formName = 'hxSocialForm'

const initialValues = {
  SOCIAL3: '',
  SOCIALShortAns3: '',
  SOCIAL4: '',
  SOCIAL5: '',
  SOCIAL6: '',
  SOCIALShortAns6: '',
  SOCIAL7: '',
  SOCIALShortAns7: '',
  SOCIAL8: '',
  SOCIAL9: '',
  SOCIAL10: '',
  SOCIAL10Years: '',
  SOCIAL10Packs: '',
  SOCIALShortAns10: '',
  SOCIAL11: '',
  SOCIALShortAns11: '',
  SOCIAL12: '',
  SOCIAL13: '',
  SOCIAL13A: '',
  SOCIAL13B: '',
  SOCIAL13C: '',
  SOCIAL14: '',
  SOCIAL15: '',
  SOCIAL16: '',
}

const validationSchema = Yup.object({
  SOCIAL3: Yup.string().required('Required'),
  SOCIAL4: Yup.string().required('Required'),
  SOCIAL5: Yup.number().required('Required'),
  SOCIAL6: Yup.string().required('Required'),
  SOCIAL7: Yup.string().required('Required'),
  SOCIAL8: Yup.string().required('Required'),
  SOCIAL10: Yup.string().required('Required'),
  SOCIAL10Years: Yup.number().when('SOCIAL10', {
    is: 'Yes',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  SOCIAL10Packs: Yup.number().when('SOCIAL10', {
    is: 'Yes',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  SOCIAL11: Yup.string().when('SOCIAL10', {
    is: 'No',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  SOCIAL12: Yup.string().required('Required'),
  SOCIAL13: Yup.string().required('Required'),
  SOCIAL14: Yup.string().required('Required'),
  SOCIAL15: Yup.string().required('Required'),
  SOCIAL16: Yup.string().required('Required'),
})

const formOptions = {
  SOCIAL3: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL4: [
    { label: '$1,200 and below', value: '$1,200 and below' },
    { label: '$1,201 - $2,000', value: '$1,201 - $2,000' },
    { label: '$2,001 - $3,999', value: '$2,001 - $3,999' },
    { label: '$4,000 - $5,999', value: '$4,000 - $5,999' },
    { label: '$6,000 - $9,999', value: '$6,000 - $9,999' },
    { label: '$10,000 & above', value: '$10,000 & above' },
    { label: 'NIL', value: 'NIL' },
  ],
  SOCIAL6: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL7: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL8: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL10: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL11: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL13: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL13A: [
    { label: '1 serving/day', value: '1 serving/day' },
    { label: '2 or more servings/day', value: '2 or more servings/day' },
  ],
  SOCIAL13B: [
    { label: '1 serving/day', value: '1 serving/day' },
    { label: '2 or more servings/day', value: '2 or more servings/day' },
  ],
  SOCIAL13C: [
    { label: '1 serving/day', value: '1 serving/day' },
    { label: '2 or more servings/day', value: '2 or more servings/day' },
  ],
  SOCIAL14: [
    {
      label: 'Yes, at least 20 minutes each time, for 3 or more days per week',
      value: 'Yes, at least 20 minutes each time, for 3 or more days per week',
    },
    {
      label: 'Yes, at least 20 minutes each time, for less than 3 days per week',
      value: 'Yes, at least 20 minutes each time, for less than 3 days per week',
    },
    {
      label: 'No participation of at least 20 minutes each time',
      value: 'No participation of at least 20 minutes each time',
    },
  ],
  SOCIAL15: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SOCIAL16: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const PackYearsDisplay = () => {
  const { values } = useFormikContext()
  const years = Number(values.SOCIAL10Years) || 0
  const packsPerDay = Number(values.SOCIAL10Packs) || 0
  const packYears = years * packsPerDay

  return <Typography className='blue'>{packYears}</Typography>
}

export default function HxSocialForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [regForm, setRegForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      const regForm = await getSavedData(patientId, 'registrationForm')
      setSavedData({ ...initialValues, ...savedData })
      setRegForm(regForm)
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)

    // Calculate and submit no. of pack years
    const years = Number(values.SOCIAL10Years) || 0
    const packsPerDay = Number(values.SOCIAL10Packs) || 0
    const packYears = years * packsPerDay
    values.SOCIALShortAns10 = packYears

    const response = await submitForm(values, patientId, formName)
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
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4'>
            <strong>FINANCIAL STATUS</strong>
          </Typography>
          <Typography variant='h6'>CHAS Status</Typography>
          <Typography color='primary'>{regForm ? regForm.registrationQ12 : '-'}</Typography>

          <Typography variant='h6'>Pioneer Generation Status 建国一代配套</Typography>
          <Typography color='primary' sx={{ mb: 3 }}>
            {regForm ? regForm.registrationQ13 : '-'}
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you currently on any other Government Financial Assistance, other than CHAS and PG
            (e.g. Public Assistance Scheme)?
          </Typography>
          <FastField
            name='SOCIAL3'
            label='SOCIAL3'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL3}
            sx={{ mb: 3 }}
            row
          />
          <PopupText qnNo='SOCIAL3' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='SOCIALShortAns3'
              label='SOCIALShortAns3'
              component={CustomTextField}
              fullWidth
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography fontWeight='bold'>
            What is the average earnings of participant&apos;s household per month?
          </Typography>
          <FastField
            name='SOCIAL4'
            label='SOCIAL4'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL4}
          />

          <Typography fontWeight='bold'>
            Number of household members (including yourself)?
          </Typography>
          <FastField
            name='SOCIAL5'
            label='SOCIAL5'
            component={CustomNumberField}
            sx={{ width: '50%', mb: 3, mt: 1 }}
          />

          <Typography fontWeight='bold'>
            If you are currently not on CHAS but qualify, do you want to apply for CHAS card? <br />
            For SG PRs, they do not qualify. Select &apos;No&apos; if patient is a PR.
          </Typography>
          <FastField
            name='SOCIAL6'
            label='SOCIAL6'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL6}
            sx={{ mb: 3 }}
            row
          />
          <PopupText qnNo='SOCIAL6' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='SOCIALShortAns6'
              label='SOCIALShortAns6'
              component={CustomTextField}
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography fontWeight='bold'>
            Do you need advice on financial schemes that are available in Singapore or require
            further financial assistance?
          </Typography>
          <FastField
            name='SOCIAL7'
            label='SOCIAL7'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL7}
            row
          />
          <PopupText qnNo='SOCIAL7' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='SOCIALShortAns7'
              label='SOCIALShortAns7'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography variant='h4' fontWeight='bold' gutterBottom>
            2. SOCIAL ISSUES
          </Typography>
          <Typography fontWeight='bold'>Are you a caregiver for a family member?</Typography>
          <FastField
            name='SOCIAL8'
            label='SOCIAL8'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL8}
            sx={{ mb: 3 }}
            row
          />
          <PopupText qnNo='SOCIAL8' triggerValue='Yes'>
            <Typography fontWeight='bold'>
              Do you feel equipped to provide care to your loved one?
            </Typography>
            <FastField
              name='SOCIAL9'
              label='SOCIAL9'
              component={CustomRadioGroup}
              options={formOptions.SOCIAL9}
              sx={{ mb: 3 }}
              row
            />
          </PopupText>

          <Typography variant='h4' fontWeight='bold' gutterBottom>
            3. LIFESTYLE
          </Typography>
          <Typography fontWeight='bold'>Do you currently smoke?</Typography>
          <FastField
            name='SOCIAL10'
            label='SOCIAL10'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL10}
            row
          />

          <PopupText qnNo='SOCIAL10' triggerValue='Yes'>
            <Typography fontWeight='bold'>Please specify the no. of years smoked:</Typography>
            <FastField
              name='SOCIAL10Years'
              label='SOCIAL10Years'
              component={CustomNumberField}
              sx={{ mb: 3, width: '50%' }}
            />
            <Typography fontWeight='bold'>
              How many packs per day? (1 pack = 20 cigarettes)
            </Typography>
            <FastField
              name='SOCIAL10Packs'
              label='SOCIAL10Packs'
              component={CustomNumberField}
              sx={{ mb: 3, width: '50%' }}
            />

            <Typography fontWeight='bold'>Total pack-years:</Typography>
            <PackYearsDisplay />
          </PopupText>
          <PopupText qnNo='SOCIAL10' triggerValue='No'>
            <Typography fontWeight='bold'>
              Have you smoked before? For how long and when did you stop?
            </Typography>

            <FastField
              name='SOCIAL11'
              label='SOCIAL11'
              component={CustomRadioGroup}
              options={formOptions.SOCIAL11}
              sx={{ mb: 3 }}
              row
            />
            <PopupText qnNo='SOCIAL11' triggerValue='Yes'>
              <Typography variant='subtitle1' fontWeight='bold'>
                Please specify:
              </Typography>
              <FastField
                name='SOCIALShortAns11'
                label='SOCIALShortAns11'
                component={CustomTextField}
                sx={{ mb: 3, mt: 1 }}
              />
            </PopupText>
          </PopupText>

          <Typography>
            For the next question:
            <br />
            Appropriate amount of alcohol:
            <ul>
              <li> Males: &lt;2 standard drinks per day</li>
              <li> Females: &lt;1 standard drink per day</li>
            </ul>
          </Typography>
          <Typography fontWeight='bold' sx={{ mt: 2 }}>
            Do you consume alcoholic drinks?
          </Typography>
          <FastField name='SOCIAL12' label='SOCIAL12' component={CustomTextField} />

          <Typography fontWeight='bold'>
            Do you consciously try to eat more fruits, vegetables, whole grain and cereals?
          </Typography>
          <FastField
            name='SOCIAL13'
            label='SOCIAL13'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL13}
            row
          />

          <Typography sx={{ fontWeight: 'bold' }}>Fruits?</Typography>
          <FastField
            name='SOCIAL13A'
            label='SOCIAL13A'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL13A}
            sx={{ mb: 3 }}
            row
          />

          <Typography sx={{ fontWeight: 'bold' }}>Vegetables?</Typography>
          <FastField
            name='SOCIAL13B'
            label='SOCIAL13B'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL13B}
            sx={{ mb: 3 }}
            row
          />

          <Typography sx={{ fontWeight: 'bold' }}>Whole grains or cereals?</Typography>
          <FastField
            name='SOCIAL13C'
            label='SOCIAL13C'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL13C}
            sx={{ mb: 3 }}
            row
          />

          <Typography fontWeight='bold'>
            Do you exercise or participate in physical activity?
          </Typography>
          <FastField
            name='SOCIAL14'
            label='SOCIAL14'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL14}
            sx={{ mb: 3 }}
          />

          <Typography fontWeight='bold'>
            Do you feel the patient would benefit from a Dietitian consult?
          </Typography>
          <FastField
            name='SOCIAL15'
            label='SOCIAL15'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL15}
            sx={{ mb: 3 }}
            row
          />

          <Typography fontWeight='bold'>Dietician consultation criteria:</Typography>
          <ul>
            <li>interested in dietary advice</li>
            <li>Any chronic metabolic diseases that will benefit from dietetic intervention</li>
            <ul>
              <li>Diabetes</li>
              <li>Hyperlipidemia</li>
              <li>Hypertension</li>
            </ul>
            <li>Obesity cases (BMI &gt; 23.0 kg/m^2)</li>
            <li>Underweight cases (BMI &lt; 18.0 kg/m^2)</li>
            <li>Any other metabolic imbalance</li>
          </ul>

          <Typography fontWeight='bold'>
            Have you visited any GP or polyclinic in the last 1 year?
          </Typography>
          <Field
            name='SOCIAL16'
            label='SOCIAL16'
            component={CustomRadioGroup}
            options={formOptions.SOCIAL16}
            row
          />

          <ErrorNotification
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message='Please fill in all required fields correctly.'
          />

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {loading || isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary'>
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
