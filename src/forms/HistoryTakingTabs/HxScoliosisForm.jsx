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

const formName = 'hxScoliosisForm'

const initialValues = {
  SCOL1: '',
  SCOL2: '',
  SCOL3: '',
  SCOL4: '',
  SCOL5: '',
  SCOL6: '',
}

const validationSchema = Yup.object({
  SCOL1: Yup.string().required('Required'),
  SCOL2: Yup.string().required('Required'),
  SCOL3: Yup.string().required('Required'),
  SCOL4: Yup.string().required('Required'),
  SCOL5: Yup.string().required('Required'),
  SCOL6: Yup.string().required('Required'),
})

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  SCOL1: yesNo,
  SCOL2: yesNo,
  SCOL3: yesNo,
  SCOL4: yesNo,
  SCOL5: yesNo,
  SCOL6: yesNo,
}

// Each question maps to one of the 6 scoliosis eligibility criteria (SCOL1-6).
// Any "Yes" makes the participant eligible for the Scoliosis station.
const questions = [
  {
    name: 'SCOL1',
    text: 'Do you have chronic lower back pain or leg pain associated with numbness or tingling?',
  },
  {
    name: 'SCOL2',
    text: 'Do you have any noticeable postural changes? (e.g. forward lean while walking, leaning to one side, or uneven shoulder/hip heights)',
  },
  {
    name: 'SCOL3',
    text: 'Have you had a progressive loss of height (about 3cm) over the past few years?',
  },
  {
    name: 'SCOL4',
    text: 'Do you have a past history of childhood or adolescent scoliosis?',
  },
  {
    name: 'SCOL5',
    text: 'Have you previously had any lumbar (lower back) surgery?',
  },
  {
    name: 'SCOL6',
    text: 'Have you been diagnosed with osteopenia or osteoporosis?',
  },
]

export default function HxScoliosisForm({ changeTab, nextTab }) {
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
            <strong>SCOLIOSIS SCREENING</strong>
          </Typography>
          <Typography gutterBottom>
            Ask the following questions. If the participant answers <strong>Yes</strong> to any one
            of them, they are eligible for the Scoliosis station.
          </Typography>

          {questions.map(({ name, text }) => (
            <div key={name}>
              <Typography variant='subtitle1' fontWeight='bold'>
                {text}
              </Typography>
              <FastField
                name={name}
                label={name}
                component={CustomRadioGroup}
                options={formOptions[name]}
                row
              />
            </div>
          ))}

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
