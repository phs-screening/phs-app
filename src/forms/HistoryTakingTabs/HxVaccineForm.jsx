import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from '../../utils/popupText'

const formName = 'hxVaccineForm'

// Per-vaccine pairs: PMHXVAX(odd) = "received?", PMHXVAX(even) = "interested?"
// (shown only when the corresponding vaccine was not received / unsure).
// Pneumococcal (VAX3/4) is only for age > 65; shingles (VAX5/6) only for age > 50.
const initialValues = {
  PMHXVAX1: '',
  PMHXVAX2: '',
  PMHXVAX3: '',
  PMHXVAX4: '',
  PMHXVAX5: '',
  PMHXVAX6: '',
}

const validationSchema = Yup.object({
  PMHXVAX1: Yup.string().required('Required'),
  PMHXVAX2: Yup.string().when('PMHXVAX1', {
    is: (value) => value === 'No' || value === 'Unsure',
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  PMHXVAX3: Yup.string().notRequired(),
  PMHXVAX4: Yup.string().notRequired(),
  PMHXVAX5: Yup.string().notRequired(),
  PMHXVAX6: Yup.string().notRequired(),
})

const yesNoUnsure = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Unsure', value: 'Unsure' },
]

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

export default function HxVaccineForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [age, setAge] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      const reg = await getSavedData(patientId, 'registrationForm')
      setSavedData({ ...initialValues, ...res })
      setAge(Number(reg?.registrationQ4) || 0)
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

  const interestQuestion = (name) => (
    <>
      <Typography variant='subtitle1' fontWeight='bold'>
        Would you be interested in receiving this vaccine?
      </Typography>
      <FastField name={name} label={name} component={CustomRadioGroup} options={yesNo} row />
    </>
  )

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
            <strong>VACCINATION SCREENING</strong>
          </Typography>
          <Typography gutterBottom>
            If the participant is unsure, select <strong>Unsure</strong> (treated as not received).
            For all vaccines, please advise that some are fully subsidised based on CHAS status and
            age; otherwise charges may apply, and they can find out at the vaccination station.
          </Typography>

          {/* Influenza — all participants */}
          <Typography variant='subtitle1' fontWeight='bold'>
            Have you received an influenza (flu) vaccine in the last year?
          </Typography>
          <FastField
            name='PMHXVAX1'
            label='PMHXVAX1'
            component={CustomRadioGroup}
            options={yesNoUnsure}
            row
          />
          <PopupText qnNo='PMHXVAX1' triggerValue={['No', 'Unsure']}>
            {interestQuestion('PMHXVAX2')}
          </PopupText>

          {/* Pneumococcal — only for patients over 65 */}
          {age > 65 && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                Have you received a pneumococcal vaccine?
              </Typography>
              <FastField
                name='PMHXVAX3'
                label='PMHXVAX3'
                component={CustomRadioGroup}
                options={yesNoUnsure}
                row
              />
              <PopupText qnNo='PMHXVAX3' triggerValue={['No', 'Unsure']}>
                {interestQuestion('PMHXVAX4')}
              </PopupText>
            </>
          )}

          {/* Shingles — only for patients over 50 */}
          {age > 50 && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                Have you received a shingles vaccine?
              </Typography>
              <FastField
                name='PMHXVAX5'
                label='PMHXVAX5'
                component={CustomRadioGroup}
                options={yesNoUnsure}
                row
              />
              <PopupText qnNo='PMHXVAX5' triggerValue={['No', 'Unsure']}>
                {interestQuestion('PMHXVAX6')}
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
