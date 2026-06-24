import React, { useContext, useEffect, useState } from 'react'
import { Paper, Divider, Typography, CircularProgress, Button } from '@mui/material'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import PopupText from 'src/utils/popupText.jsx'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
// import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import '../fieldPadding.css'
import '../forms.css'

const formName = 'gynaeForm'

const initialValues = {
  GYNAE12: '',
  GYNAE13: '',
  GYNAE14: '',
  GYNAE15: '',
  GYNAE16: '',
  GYNAE17: '',
  GYNAE18: '',
}

const validationSchema = Yup.object({
  GYNAE12: Yup.string().required('Required'),
  GYNAE13: Yup.string().required('Required'),
  GYNAE14: Yup.string().required('Required'),
  GYNAE15: Yup.string().required('Required'),
  GYNAE16: Yup.string().required('Required'),
  GYNAE17: Yup.string().required('Required'),
  GYNAE18: Yup.string().required('Required'),
})

const formOptions = {
  YESNO: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  GYNAE12: [
    { label: 'Never before', value: 'Never before' },
    { label: 'Less than 5 years ago', value: 'Less than 5 years ago' },
    { label: '5 years or longer', value: '5 years or longer' },
    { label: 'Not answered', value: 'Never before' },
  ],
  GYNAE13: [
    { label: 'Never before', value: 'Never before' },
    { label: 'Within the last 3 years', value: 'Within the last 3 years' },
    { label: '3 years or longer', value: '3 years or longer' },
    { label: 'Not answered', value: 'Never before' },
  ],
  GYNAE17: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not answered', value: 'No' },
    { label: 'Not Applicable', value: 'Not Applicable' },
  ],
}

export default function HxGynaeForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...res })
    }

    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
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
      {({ isSubmitting, submitCount, errors }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4'>
            <strong>GYNECOLOGY</strong>
          </Typography>
          <Typography fontWeight='bold' color='error' sx={{ mb: 2 }}>
            This form should only be submitted for female participants
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            When, if any, was the last HPV test you have taken? <br />
            (Please verify on HealthHub. HPV is different from Pap Smear, answer Pap Smear in the
            next question)
          </Typography>
          <FastField
            name='GYNAE12'
            label='GYNAE12'
            component={CustomRadioGroup}
            options={formOptions.GYNAE12}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            When if any, was the last Pap Smear test you have taken? (Please verify on HealthHub)
          </Typography>
          <FastField
            name='GYNAE13'
            label='GYNAE13'
            component={CustomRadioGroup}
            options={formOptions.GYNAE13}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            I am asking the next few questions to check your eligibility for a Pap Smear. This
            question may be sensitive, but could I ask if you have engaged in sexual intercourse
            before?
          </Typography>
          <FastField
            name='GYNAE14'
            label='GYNAE14'
            component={CustomRadioGroup}
            options={formOptions.YESNO}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you pregnant?
          </Typography>
          <FastField
            name='GYNAE15'
            label='GYNAE15'
            component={CustomRadioGroup}
            options={formOptions.YESNO}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Was your last menstrual period within the window where the first day falls between 28
            July and 4 Aug 2025? <br />
            If you are post-menopausal or use contraception, please indicate &apos;yes&apos;
          </Typography>
          <FastField
            name='GYNAE16'
            label='GYNAE16'
            component={CustomRadioGroup}
            options={formOptions.YESNO}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Indicated interest for HPV Test under SCS?
          </Typography>
          <FastField
            name='GYNAE17'
            label='GYNAE17'
            component={CustomRadioGroup}
            options={formOptions.GYNAE17}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Is patient indicated for on-site testing? Please circle On-Site Testing on Form A as
            well
          </Typography>
          <FastField
            name='GYNAE18'
            label='GYNAE18'
            component={CustomRadioGroup}
            options={formOptions.YESNO}
            row
          />

          <ErrorNotification
            show={Object.keys(errors).length > 0 && submitCount > 0}
            message='Please correct the errors above before submitting.'
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
          <br />
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
