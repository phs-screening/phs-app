import { Paper, CircularProgress, Button, Grid } from '@mui/material'
import { Form, Formik, FastField } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'

import PopupText from 'src/utils/popupText'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import CustomCheckboxGroup from '../components/form-components/CustomCheckboxGroup'
import ErrorNotification from '../components/form-components/ErrorNotification'

const YesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

//value declared but not used - comment out to pass CICD cehcks
/*
const VisualAcuityValues = [
  { label: 'CF2M', value: 'CF2M' },
  { label: 'CF1M', value: 'CF1M' },
  { label: 'HM', value: 'HM' },
  { label: 'LP', value: 'LP' },
  { label: 'NLP', value: 'NLP' },
  { label: 'NIL', value: 'NIL' },
]
  */

const formOptions = {
  OphthalQ1: YesNo,
  OphthalQ8: [
    { label: 'Refractive', value: 'Refractive' },
    { label: 'Non-refractive', value: 'Non-refractive' },
    { label: 'None', value: 'None' },
  ],
  OphthalQ9: [{ label: "Referred to Doctor's Station", value: "Referred to Doctor's Station" }],
  OphthalQ10: YesNo,
  OphthalQ12: YesNo,
  OphthalQ13: YesNo,
}

const validationSchema = Yup.object().shape({
  OphthalQ1: Yup.string().required(),
  OphthalQ2: Yup.string().when('OphthalQ1', {
    is: 'Yes (Specify in textbox)',
    then: (schema) => schema.required('Please specify the eye condition or surgery'),
    otherwise: (schema) => schema,
  }),
  OphthalQ3: Yup.string().required(),
  OphthalQ4: Yup.string().required(),
  OphthalQ5: Yup.string().required(),
  OphthalQ6: Yup.string().required(),
  OphthalQ7: Yup.string(),
  OphthalQ8: Yup.string().required(),
  OphthalQ9: Yup.array().of(Yup.string()).required(),
  OphthalQ10: Yup.string().required(),
  OphthalQ11: Yup.string().when('OphthalQ10', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  OphthalQ12: Yup.string().required(),
  OphthalQ13: Yup.string().required(),
})

const formName = 'ophthalForm'

const OphthalForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  const [hxHCSR, setHxHCSR] = useState({})
  const navigate = useNavigate()

  const initialValues = {
    OphthalQ1: saveData.OphthalQ1 || '',
    OphthalQ2: saveData.OphthalQ2 || '',
    OphthalQ3: saveData.OphthalQ3 || '',
    OphthalQ4: saveData.OphthalQ4 || '',
    OphthalQ5: saveData.OphthalQ5 || '',
    OphthalQ6: saveData.OphthalQ6 || '',
    OphthalQ7: saveData.OphthalQ7 || '',
    OphthalQ8: saveData.OphthalQ8 || '',
    OphthalQ9: saveData.OphthalQ9 || [],
    OphthalQ10: saveData.OphthalQ10 || '',
    OphthalQ11: saveData.OphthalQ11 || '',
    OphthalQ12: saveData.OphthalQ12 || '',
    OphthalQ13: saveData.OphthalQ13 || '',
  }

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)

      const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)

      Promise.all([hcsrData]).then((result) => {
        setHxHCSR(result[0])
        setLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [patientId])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
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
    >
      {({ errors, submitCount }) => (
        <Paper elevation={2} p={0} m={0}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9}>
              <Paper elevation={2} p={0} m={0}>
                <Form className='fieldPadding'>
                  <div className='form--div'>
                    <h1>VISION SCREENING</h1>
                    <h2>Non-Refractive Error</h2>
                    <h3>1. Previous eye condition or surgery</h3>
                    <FastField
                      name='OphthalQ1'
                      label='Previous eye condition or surgery'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ1}
                      row
                    />
                    <PopupText qnNo='OphthalQ1' triggerValue='Yes'>
                      <h4>Explanation</h4>
                      <FastField
                        name='OphthalQ2'
                        label='Ophthal Q2'
                        component={CustomTextField}
                        multiline
                        rows={2}
                        fullWidth
                      />
                    </PopupText>
                    <h3>2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__</h3>
                    <FastField
                      name='OphthalQ3'
                      label='Ophthal Q3'
                      component={CustomTextField}
                      type='number'
                      fullWidth
                    />
                    <h3>3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__</h3>
                    <FastField
                      name='OphthalQ4'
                      label='Ophthal Q4'
                      component={CustomTextField}
                      type='number'
                      fullWidth
                    />
                    <h3>
                      4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye
                      6/__
                    </h3>
                    <FastField
                      name='OphthalQ5'
                      label='Ophthal Q5'
                      component={CustomTextField}
                      type='number'
                      fullWidth
                    />
                    <h3>
                      5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye
                      6/__
                    </h3>
                    <FastField
                      name='OphthalQ6'
                      label='Ophthal Q6'
                      component={CustomTextField}
                      type='number'
                      fullWidth
                    />
                    <h3>
                      6. Is participant currently on any eye review/ consulting any eye specialist?
                    </h3>
                    <FastField
                      name='OphthalQ10'
                      label='Ophthal Q10'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ10}
                      row
                    />
                    <PopupText qnNo='OphthalQ10' triggerValue='Yes'>
                      <h4>Please specify:</h4>
                      <FastField
                        name='OphthalQ11'
                        label='Ophthal Q11'
                        component={CustomTextField}
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </PopupText>
                    <h3>7. Type of vision error?</h3>
                    <FastField
                      name='OphthalQ8'
                      label='Ophthal Q8'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ8}
                      row
                    />
                    <h4>
                      Please <u>refer to Doctor&apos;s Consult</u> if pinhole visual acuity is{' '}
                      <u>worse than 6/12</u>
                    </h4>
                    <FastField
                      name='OphthalQ9'
                      component={CustomCheckboxGroup}
                      options={formOptions.OphthalQ9}
                      row
                    />
                    <h2>Refractive Error</h2>
                    Senior Citizens are eligible to receiving subsidy for spectacles under the
                    Senior Mobility Fund (SMF) provided they qualify for the following:
                    <ul>
                      <li>
                        Have a household monthly income per person of $2,000 and below OR Annual
                        Value (AV) of residence reflected on NRIC of $13,000 and below for
                        households with no income
                      </li>
                      <li>
                        Be living in the community (not residing in a nursing home or sheltered
                        home).
                      </li>
                      <li>First time SMF applicant</li>
                      <li>
                        Be assessed by a qualified assessor on the type of device required when
                        applicable.
                      </li>
                      <li>
                        Not concurrently receive (or apply for) any other public or private grants,
                        or subsidies.
                      </li>
                    </ul>
                    <h3>1. Does the participant wish to apply for the Senior Mobility Fund?</h3>
                    <FastField
                      name='OphthalQ12'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ12}
                      row
                    />
                    <h3>2. Referred to Social Services?</h3>
                    <FastField
                      name='OphthalQ13'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ13}
                      row
                    />
                  </div>

                  <ErrorNotification
                    show={submitCount > 0 && Object.keys(errors || {}).length > 0}
                    message="Please fill in all required fields correctly."
                  />

                  <div>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button type='submit' variant='contained' color='primary'>
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
                  <h2>Patient History</h2>
                  {hxHCSR ? (
                    <>
                      <p>Does participant complain of any vision problems: {hxHCSR.hxHcsrQ3}</p>
                      <p>participant specified: {hxHCSR.hxHcsrShortAnsQ3}</p>
                    </>
                  ) : (
                    <p className='red'>nil hxHCSR data</p>
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

OphthalForm.contextType = FormContext

export default OphthalForm