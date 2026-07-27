import { Button, CircularProgress, Divider, Grid, Paper, Typography, Box } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import * as Yup from 'yup'
import { submitForm } from '../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'

import './fieldPadding.css'
import allForms from './forms.json'

import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import ErrorNotification from '../components/form-components/ErrorNotification'

const formName = 'vaccineForm'

const initialValues = {
  VAX1: '',
  VAX2: '',
  VAX3: '',
}

const formOptions = {
  YesNo: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  VAX1: Yup.string().required(),
  VAX2: Yup.string().required(),
  VAX3: Yup.string().required(),
})

export default function VaccineForm() {
  const { patientId } = useContext(FormContext)
  const [saveData, setSaveData] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [regi, setRegi] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData || initialValues)

      const regiData = await getSavedData(patientId, allForms.registrationForm)
      Promise.all([regiData]).then((result) => {
        setRegi(result[0])
        setLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    setSubmitting(true)
    
    const response = await submitForm(values, patientId, formName)
    
    setLoading(false)
    setSubmitting(false)
    
    if (response.result) {
      setTimeout(async () => {
        await showFormSubmitSuccess()
        navigate('/app/dashboard')
      }, 80)
    } else {
      setTimeout(() => {
        showFormSubmitError(`Unsuccessful. ${response.error}`)
      }, 80)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={saveData}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ errors, submitCount, isSubmitting }) => (
          <Grid container display='flex' flexDirection='row'>
            <Grid item xs={9} md={9}>
              <Paper elevation={2}>
                <Form className='fieldPadding'>
                  <Typography variant='h1' fontWeight='bold' gutterBottom>
                    Vaccination
                  </Typography>

                  <Typography variant='subtitle1' fontWeight='bold'>
                    Are you eligible for vaccination?
                  </Typography>
                  <FastField
                    name='VAX1'
                    label='VAX1'
                    component={CustomRadioGroup}
                    options={formOptions.YesNo}
                    row
                  />

                  <Typography variant='subtitle1' fontWeight='bold'>
                    You have received a pneumococcal vaccine.
                  </Typography>
                  <FastField
                    name='VAX2'
                    label='VAX2'
                    component={CustomRadioGroup}
                    options={formOptions.YesNo}
                    row
                  />

                  <Typography variant='subtitle1' fontWeight='bold'>
                    You have received an Influenza vaccine.
                  </Typography>
                  <FastField
                    name='VAX3'
                    label='VAX3'
                    component={CustomRadioGroup}
                    options={formOptions.YesNo}
                    row
                  />

                  <ErrorNotification
                    show={submitCount > 0 && Object.keys(errors).length > 0}
                  />

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    {loading || isSubmitting ? (
                      <CircularProgress />
                    ) : (
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    )}
                  </Box>
                  
                  <br />
                  <Divider />
                </Form>
              </Paper>
            </Grid>

            <Grid
              item
              p={1}
              xs={3}
              md={3}
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
                  {regi ? (
                    <>
                      {regi.registrationQ4 ? (
                        <Typography variant='body1' className='blue'>
                          Age: {regi.registrationQ4}
                        </Typography>
                      ) : (
                        <Typography variant='body1' className='blue'>
                          Age: nil
                        </Typography>
                      )}

                      {regi.registrationQ7 ? (
                        <Typography variant='body1' className='blue'>
                          Citizenship: {regi.registrationQ7}
                        </Typography>
                      ) : (
                        <Typography variant='body1' className='blue'>
                          Citizenship: nil
                        </Typography>
                      )}

                      {regi.registrationQ12 ? (
                        <Typography variant='body1' className='blue'>
                          CHAS status: {regi.registrationQ12}
                        </Typography>
                      ) : (
                        <Typography variant='body1' className='blue'>
                          CHAS status: nil
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant='body1' className='red'>
                      NO REGI DATA
                    </Typography>
                  )}

                </div>
              )}
            </Grid>
          </Grid>
        )}
      </Formik>
    </Paper>
  )
}

VaccineForm.contextType = FormContext