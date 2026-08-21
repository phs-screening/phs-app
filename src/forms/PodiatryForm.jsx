import { Paper, Divider, Typography, CircularProgress, Button, Grid } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import allForms from './forms.json'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup.jsx'
import CustomTextField from '../components/form-components/CustomTextField.jsx'
import ErrorNotification from '../components/form-components/ErrorNotification.jsx'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'
import './forms.css'
import { podiatryFormQuestionText } from './questions/PodiatryFormQuestions'

const formName = 'podiatryForm'

const initialValues = {
  podiatryQ1: '',
  podiatryQ2: '',
  podiatryQ3: '',
  podiatryQ4: '',
}

const validationSchema = Yup.object({
  podiatryQ1: Yup.string().required('Required'),
  podiatryQ2: Yup.string().required('Required'),
  podiatryQ3: Yup.string().required('Required'),
  podiatryQ4: Yup.string().trim().required('Required'),
})

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  podiatryQ1: yesNo,
  podiatryQ2: yesNo,
  podiatryQ3: yesNo,
}

const PodiatryForm = () => {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [loading, setLoading] = useState(false)
  const [PMHX, setPMHX] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...savedData })

      const PMHXData = await getSavedData(patientId, allForms.hxNssForm)
      Promise.all([PMHXData]).then((result) => {
        setPMHX(result[0])
        setLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [patientId])

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true)
        const response = await submitForm(values, patientId, formName)
        setLoading(false)
        setSubmitting(false)
        if (response.result) {
          await showFormSubmitSuccess()
          navigate('/app/dashboard')
        } else {
          showFormSubmitError(`Unsuccessful. ${response.error}`)
        }
      }}
    >
      {({ errors, submitCount, isSubmitting }) => (
        <Paper elevation={2}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9} sx={{ width: '50%' }}>
              <Paper elevation={2}>
                <Form className='fieldPadding'>
                  <Typography variant='h4'>
                    <strong>Podiatry</strong>
                  </Typography>
                  <Typography fontWeight='bold'>{podiatryFormQuestionText.podiatryQ2}</Typography>
                  <FastField
                    name='podiatryQ2'
                    label='podiatryQ2'
                    component={CustomRadioGroup}
                    options={formOptions.podiatryQ2}
                    row
                  />

                  <Typography fontWeight='bold'>{podiatryFormQuestionText.podiatryQ1}</Typography>
                  <FastField
                    name='podiatryQ1'
                    label='podiatryQ1'
                    component={CustomRadioGroup}
                    options={formOptions.podiatryQ1}
                    row
                  />

                  <Typography fontWeight='bold'>{podiatryFormQuestionText.podiatryQ3}</Typography>
                  <FastField
                    name='podiatryQ3'
                    label='podiatryQ3'
                    component={CustomRadioGroup}
                    options={formOptions.podiatryQ3}
                    row
                  />

                  <Typography fontWeight='bold'>{podiatryFormQuestionText.podiatryQ4}</Typography>
                  <FastField
                    name='podiatryQ4'
                    label='podiatryQ4'
                    component={CustomTextField}
                    fullWidth
                    multiline
                    rows={3}
                  />

                  <ErrorNotification
                    show={submitCount > 0 && Object.keys(errors || {}).length > 0}
                    message='Please fill in all required fields correctly.'
                  />

                  <div>
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
              </Paper>
            </Grid>

            <Grid
              p={1}
              width='30%'
              display='flex'
              flexDirection='column'
              alignItems={loadingSidePanel ? 'center' : 'left'}
            >
              {loadingSidePanel ? (
                <CircularProgress />
              ) : (
                <div className='summary--question-div'>
                  <Typography variant='h6' gutterBottom>
                    Patient Info
                  </Typography>

                  {PMHX ? (
                    <>
                      {Array.isArray(PMHX.PMHX5) && PMHX.PMHX5.length > 0 ? (
                        <Typography variant='body1' className='blue'>
                          PMHX: {PMHX.PMHX5.join(', ')}
                        </Typography>
                      ) : (
                        <Typography variant='body1' className='blue'>
                          PMHX: nil
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant='body1' className='red'>
                      NO PMHX DATA
                    </Typography>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}

export default PodiatryForm
