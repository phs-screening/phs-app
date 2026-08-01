import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { Button, CircularProgress, Paper, Grid } from '@mui/material'
import { Formik, Form, FastField } from 'formik'

import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import allForms from '../forms.json'
import '../fieldPadding.css'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formName = 'mentalHealthForm'

const validationSchema = Yup.object({
  SAMH1: Yup.string().required(),
  SAMH2: Yup.string().required(),
  SAMH3: Yup.string().required(),
})

const MentalHealthForm = () => {
  const { patientId } = useContext(FormContext)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [loading, setLoading] = useState(false)

  const [regi, setReg] = useState({})
  const [phq, setPHQ] = useState({})
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    SAMH1: '',
    SAMH2: '',
    SAMH3: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setInitialValues(savedData)
      const regData = getSavedData(patientId, allForms.registrationForm)

      Promise.all([regData]).then((result) => {
        setReg(result[0])
        isLoadingSidePanel(false)
      })
    }

    fetchData()
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true)
        const response = await submitForm(values, patientId, formName)
        setTimeout(async () => {
          setLoading(false)
          setSubmitting(false)
          if (response.result) {
            await showFormSubmitSuccess()
            navigate('/app/dashboard')
          } else {
            showFormSubmitError(`Unsuccessful. ${response.error}`)
          }
        }, 80)
      }}
      enableReinitialize={true}
    >
      {({ errors, submitCount, isValid }) => (
        <Paper elevation={2}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9}>
              <Paper elevation={2}>
                <Form className='fieldPadding'>
                  <div className='form--div'>
                    <h3>Patient has attended mental health consultation?</h3>
                    <FastField
                      name='SAMH1'
                      label='SAMH1'
                      component={CustomRadioGroup}
                      options={yesNo}
                      row
                    />

                    <h3>Patient has signed up for follow-up with SAMH?</h3>
                    <FastField
                      name='SAMH2'
                      label='SAMH2'
                      component={CustomRadioGroup}
                      options={yesNo}
                      row
                    />

                    <h3>Refer to Doctor&apos;s Station?</h3>
                    <FastField
                      name='SAMH3'
                      label='SAMH3'
                      component={CustomRadioGroup}
                      options={yesNo}
                      row
                    />
                  </div>

                  <ErrorNotification
                    show={submitCount > 0 && Object.keys(errors || {}).length > 0}
                    message='Please fill in all required fields correctly.'
                  />

                  <div>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={!isValid || loading}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
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
                  <h2>Patient Info</h2>
                  {regi && regi.registrationQ4 ? (
                    <p className='blue'>Age: {regi.registrationQ4}</p>
                  ) : (
                    <p className='blue'>Age: nil</p>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Formik>
  )
}

MentalHealthForm.contextType = FormContext

export default MentalHealthForm
