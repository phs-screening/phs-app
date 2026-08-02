import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, Divider, CircularProgress, Button, Typography } from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import { hxScoliosisFormQuestionText } from './HxScoliosisFormQuestions'

const formName = 'hxScoliosisForm'

const initialValues = {
  Scoliosis1: '',
  Scoliosis2: '',
  Scoliosis3: '',
  Scoliosis4: '',
  Scoliosis5: '',
  Scoliosis6: '',
}

const validationSchema = Yup.object({
  Scoliosis1: Yup.string().required('Required'),
  Scoliosis2: Yup.string().required('Required'),
  Scoliosis3: Yup.string().required('Required'),
  Scoliosis4: Yup.string().required('Required'),
  Scoliosis5: Yup.string().required('Required'),
  Scoliosis6: Yup.string().required('Required'),
})

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  Scoliosis1: yesNo,
  Scoliosis2: yesNo,
  Scoliosis3: yesNo,
  Scoliosis4: yesNo,
  Scoliosis5: yesNo,
  Scoliosis6: yesNo,
}

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

          {Object.entries(hxScoliosisFormQuestionText).map(([name, text]) => (
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
