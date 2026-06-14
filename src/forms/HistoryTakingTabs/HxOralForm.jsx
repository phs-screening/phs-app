import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/api.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from '../../utils/popupText'

const formName = 'hxOralForm'

const initialValues = {
  ORAL1: '',
  ORALShortAns1: '',
  ORAL2: '',
  ORAL3: '',
  ORAL4: '',
  ORAL5: '',
  ORALShortAns5: '',
}

const validationSchema = Yup.object({
  ORAL1: Yup.string().required('Required'),
  ORAL2: Yup.string().required('Required'),
  ORAL3: Yup.string().required('Required'),
  ORAL4: Yup.string().required('Required'),
  ORAL5: Yup.string().required('Required'),
})

const formOptions = {
  ORAL1: [
    { label: 'Healthy', value: 'Healthy' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Poor (such as oral disease symptoms), please specify', value: 'Poor' },
  ],
  ORAL2: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL5: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

export default function HxOralForm({ changeTab, nextTab }) {
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
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>ORAL ISSUES</strong>
          </Typography>

          <Typography variant='subtitle1' color='error' fontWeight='bold'>
            Please do a quick inspection of participant&apos;s oral health status:
            <ol>
              <li>Lips, Tongue, Gums & Tissues (Healthy - pink and moist)</li>
              <li>
                Natural Teeth, Oral Cleanliness & Dentures (Tooth/Root decay, no cracked/broken
                dentures, no food particles/tartar in mouth)
              </li>
              <li>Saliva status (free-flowing) and any dental pain</li>
            </ol>
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            How is the participant&apos;s Oral Health?
          </Typography>
          <FastField
            name='ORAL1'
            label='ORAL1'
            component={CustomRadioGroup}
            options={formOptions.ORAL1}
          />

          <PopupText qnNo='ORAL1' triggerValue='Poor'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='ORALShortAns1'
              label='ORALShortAns1'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='subtitle1' fontWeight='bold'>
            Do you wear dentures?
          </Typography>
          <FastField
            name='ORAL2'
            label='ORAL2'
            component={CustomRadioGroup}
            options={formOptions.ORAL2}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you experiencing any dental concerns (eg. currently experiencing any pain in your
            mouth area)?
          </Typography>
          <FastField
            name='ORAL3'
            label='ORAL3'
            component={CustomRadioGroup}
            options={formOptions.ORAL3}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Have you visited a dentist in the past 2 years?
          </Typography>
          <FastField
            name='ORAL4'
            label='ORAL4'
            component={CustomRadioGroup}
            options={formOptions.ORAL4}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Would you like to go through free Oral Health Education by NUS Dentistry dentists and
            students?
          </Typography>
          <Typography gutterBottom>
            If the patient has any queries regarding dental health, or if you think that the patient
            would benefit from an Oral Health Consult.
          </Typography>
          <FastField
            name='ORAL5'
            label='ORAL5'
            component={CustomRadioGroup}
            options={formOptions.ORAL5}
            row
          />
          <PopupText qnNo='ORAL5' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='ORALShortAns5'
              label='ORALShortAns5'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='subtitle1' fontWeight='bold'>
            The dental examination booth will only provide <u>simple dental screening</u>, there
            will be no treatment provided on site (e.g. scaling and polishing)
          </Typography>
          <Typography variant='subtitle1' fontWeight='bold'>
            <span style={{ color: 'red' }}>Please help to emphasise that: </span>
            screening DOES NOT take the place of a thorough oral health examination with a dentist.
          </Typography>

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

          <br />
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
