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

const formOptions = {
  SCOL1: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SCOL2: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SCOL3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SCOL4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SCOL5: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  SCOL6: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

export default function HxScoliosis({ changeTab, nextTab }) {
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
            <strong>SCOLIOSIS</strong>
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Do you have..
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            Chronic low back pain/leg pain a/w numbness, tingling
          </Typography>
          <FastField
            name='SCOL1'
            label='SCOL1'
            component={CustomRadioGroup}
            options={formOptions.SCOL1}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Noticeable postural changes (eg. forward lean during walking/lean to one side/uneven
            shoulder or hip heights)
          </Typography>
          <FastField
            name='SCOL2'
            label='SCOL2'
            component={CustomRadioGroup}
            options={formOptions.SCOL2}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Progressive loss of height (3cm in past few years)
          </Typography>
          <FastField
            name='SCOL3'
            label='SCOL3'
            component={CustomRadioGroup}
            options={formOptions.SCOL3}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Past medical history of childhood/adolescent scoliosis
          </Typography>
          <FastField
            name='SCOL4'
            label='SCOL4'
            component={CustomRadioGroup}
            options={formOptions.SCOL4}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Past medical history of lumbar surgery
          </Typography>
          <FastField
            name='SCOL5'
            label='SCOL5'
            component={CustomRadioGroup}
            options={formOptions.SCOL5}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Past medical history of osteopenia/osteoporosis
          </Typography>
          <FastField
            name='SCOL6'
            label='SCOL6'
            component={CustomRadioGroup}
            options={formOptions.SCOL6}
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

          <br />
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
