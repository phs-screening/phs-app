import React, { useContext, useEffect, useState } from 'react'
import { Field, Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Typography, Paper, CircularProgress, Button } from '@mui/material'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomNumberField from '../../components/form-components/CustomNumberField'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'

import { submitForm, calculateSppbScore } from '../../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'

const formName = 'geriSppbForm'

const formOptions = {
  geriSppbQ2: [
    {
      label: '0 (If not able to complete 5 chair stands)',
      value: '0 (If not able to complete 5 chair stands)',
    },
    { label: '1 (> 16.7s)', value: '1 (> 16.7s)' },
    { label: '2 (16.6 – 13.7s)', value: '2 (16.6 – 13.7s)' },
    { label: '3 (13.6 – 11.2s)', value: '3 (13.6 – 11.2s)' },
    { label: '4 (< 11.1s)', value: '4 (< 11.1s)' },
  ],
  geriSppbQ6: [
    { label: '0 (Side by side < 10s or unable)', value: '0 (Side by side < 10s or unable)' },
    {
      label: '1 (Side by side 10s AND < 10s semi tandem)',
      value: '1 (Side by side 10s AND < 10s semi tandem)',
    },
    { label: '2 (Semi tandem 10s AND tandem < 3s)', value: '2 (Semi tandem 10s AND tandem < 3s)' },
    {
      label: '3 (Semi tandem 10s AND tandem < 10s but > 3s)',
      value: '3 (Semi tandem 10s AND tandem < 10s but > 3s)',
    },
    { label: '4 (Tandem >= 10s)', value: '4 (Tandem >= 10s)' },
    { label: 'Refused to do', value: 'Refused to do' },
  ],
  geriSppbQ8: [
    { label: '0 (Could not do)', value: '0 (Could not do)' },
    { label: '1 (> 6.52s)', value: '1 (> 6.52s)' },
    { label: '2 (4.66 – 6.52s)', value: '2 (4.66 – 6.52s)' },
    { label: '3 (3.62 – 4.65s)', value: '3 (3.62 – 4.65s)' },
    { label: '4 (< 3.62s)', value: '4 (< 3.62s)' },
  ],
  geriSppbQ10: [
    { label: 'High Fall Risk (0-3)', value: 'High Fall Risk (0-3)' },
    { label: 'Moderate Fall Risk (4-9)', value: 'Moderate Fall Risk (4-9)' },
    { label: 'Low Fall Risk (10-12)', value: 'Low Fall Risk (10-12)' },
  ],
  geriSppbQ11: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  geriSppbQ1: Yup.number().nullable(),
  geriSppbQ13: Yup.number().nullable(),
  geriSppbQ2: Yup.string().required(),
  geriSppbQ3: Yup.number().nullable(),
  geriSppbQ4: Yup.number().nullable(),
  geriSppbQ5: Yup.number().nullable(),
  geriSppbQ6: Yup.string().required(),
  geriSppbQ7: Yup.number().nullable(),
  geriSppbQ8: Yup.string().required(),
  geriSppbQ10: Yup.string().required(),
  geriSppbQ11: Yup.string().required(),
  geriSppbQ12: Yup.string(),
})

const initialEmptyValues = {
  geriSppbQ1: '',
  geriSppbQ13: '',
  geriSppbQ2: '',
  geriSppbQ3: '',
  geriSppbQ4: '',
  geriSppbQ5: '',
  geriSppbQ6: '',
  geriSppbQ7: '',
  geriSppbQ8: '',
  geriSppbQ10: '',
  geriSppbQ11: '',
  geriSppbQ12: '',
}

const GeriSppbForm = (props) => {
  const { patientId } = useContext(FormContext)
  const [initialValues, setInitialValues] = useState(initialEmptyValues)
  const [loading, setLoading] = useState(false)
  const { changeTab, nextTab } = props

  useEffect(() => {
    const fetchData = async () => {
      const saved = await getSavedData(patientId, formName)
      setInitialValues(saved || initialEmptyValues)
    }
    fetchData()
  }, [patientId])

  const getScore = (values) => {
    const { geriSppbQ2, geriSppbQ6, geriSppbQ8 } = values
    return calculateSppbScore(geriSppbQ2, geriSppbQ6, geriSppbQ8)
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setLoading(true)
        const response = await submitForm(values, patientId, formName)
        setLoading(false)
        if (response.result) {
          await showFormSubmitSuccess()
          changeTab(null, nextTab)
        } else {
          showFormSubmitError(`Unsuccessful. ${response.error}`)
        }
      }}
    >
      {(formikProps) => (
        <Form>
          <Paper elevation={2} className='fieldPadding'>
            <Typography variant='h4' fontWeight='bold'>
              SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)
            </Typography>

            <Typography variant='h6' fontWeight='bold'>
              1) REPEATED CHAIR STANDS
            </Typography>
            <Typography fontWeight='bold'>
              Time taken in seconds (only if 5 chair stands were completed):
            </Typography>
            <Field name='geriSppbQ1' label='geriSppbQ1' component={CustomNumberField} />
            <Typography fontWeight='bold'>Number of chairs completed:</Typography>
            <Field name='geriSppbQ13' label='geriSppbQ13' component={CustomNumberField} />
            <Typography color='blue' fontWeight='bold'>
              Score for REPEATED CHAIR STANDS (out of 4):
            </Typography>
            <Field
              name='geriSppbQ2'
              label='geriSppbQ2'
              component={CustomRadioGroup}
              options={formOptions.geriSppbQ2}
              row
            />

            <br />

            <Typography variant='h6' fontWeight='bold'>
              2) BALANCE
            </Typography>
            <Typography fontWeight='bold'>
              2a) Side-by-side Stand Time held for in seconds:
            </Typography>
            <Field name='geriSppbQ3' label='geriSppbQ3' component={CustomNumberField} />
            <Typography fontWeight='bold'>
              2b) Semi-tandem Stand - Time held for in seconds:
            </Typography>
            <Field name='geriSppbQ4' label='geriSppbQ4' component={CustomNumberField} />
            <Typography fontWeight='bold'>2c) Tandem Stand - Time held for in seconds:</Typography>
            <Field name='geriSppbQ5' label='geriSppbQ5' component={CustomNumberField} />
            <Typography color='blue' fontWeight='bold'>
              Score for BALANCE (out of 4):
            </Typography>
            <Field
              name='geriSppbQ6'
              label='geriSppbQ6'
              component={CustomRadioGroup}
              options={formOptions.geriSppbQ6}
              row
            />

            <br />

            <Typography variant='h6' fontWeight='bold'>
              3) 3m WALK
            </Typography>
            <Typography fontWeight='bold'>Time taken in seconds:</Typography>
            <Field name='geriSppbQ7' label='geriSppbQ7' component={CustomNumberField} />
            <Typography color='blue' fontWeight='bold'>
              Score for 3m WALK (out of 4):
            </Typography>
            <Field
              name='geriSppbQ8'
              label='geriSppbQ8'
              component={CustomRadioGroup}
              options={formOptions.geriSppbQ8}
              row
            />

            <br />

            <Typography variant='h6' color='blue' fontWeight='bold'>
              Total score (Max Score: 12): {getScore(formikProps.values)}
            </Typography>

            <br />

            <Typography variant='subtitle1' fontWeight='bold' sx={{ mt: 2}}>
              Fall Risk Level:
            </Typography>
            <Field
              name='geriSppbQ10'
              label='geriSppbQ10'
              component={CustomRadioGroup}
              options={formOptions.geriSppbQ10}
              row
            />

            <Typography variant='h6' fontWeight='bold' color='red'>
              Referral to Physiotherapist and Occupational Therapist Consult
            </Typography>
            <Field
              name='geriSppbQ11'
              label='geriSppbQ11'
              component={CustomRadioGroup}
              options={formOptions.geriSppbQ11}
              row
            />

            <Typography variant='h6' fontWeight='bold'>
              Notes:
            </Typography>
            <Field name='geriSppbQ12' label='geriSppbQ12' component={CustomTextField} />

            <br />

            <ErrorNotification 
              show={formikProps.submitCount > 0 && Object.keys(formikProps.errors || {}).length > 0}
              message="Please fill in all required fields correctly."
            />

            <br />
            
            <div>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button type='submit' variant='contained' color='primary'>
                  Submit
                </Button>
              )}
            </div>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}

export default GeriSppbForm
