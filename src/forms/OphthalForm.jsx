import { Paper, CircularProgress, Button, Grid } from '@mui/material'
import { Form, Formik, FastField } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { submitForm } from '../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import allForms from '../forms/forms.json'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'

import PopupText from 'src/utils/popupText'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import CustomCheckboxGroup from '../components/form-components/CustomCheckboxGroup'
import ErrorNotification from '../components/form-components/ErrorNotification'
import { ophthalFormQuestionText } from './questions/OphthalFormQuestions'

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
  OphthalQ8: YesNo,
  OphthalQ10: [
    { label: 'Refractive', value: 'Refractive' },
    { label: 'Non-refractive', value: 'Non-refractive' },
    { label: 'None', value: 'None' },
  ],
  OphthalQ11: [{ label: "Referred to Doctor's Station", value: "Referred to Doctor's Station" }],
  OphthalQ12: YesNo,
  OphthalQ13: YesNo,
}

export const ophthalValidationSchema = Yup.object().shape({
  OphthalQ1: Yup.string().required(),
  OphthalQ2: Yup.string().required(),
  OphthalQ3: Yup.string().when('OphthalQ1', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify the eye condition or surgery'),
    otherwise: (schema) => schema.notRequired(),
  }),
  // All four acuity readings are optional; an unrecorded one renders as 6/___
  // on the report, and the remark fields explain why it was not taken.
  OphthalQ4: Yup.string().notRequired(),
  OphthalQ4Remark: Yup.string().notRequired(),
  OphthalQ5: Yup.string().notRequired(),
  OphthalQ5Remark: Yup.string().notRequired(),
  OphthalQ6: Yup.string().notRequired(),
  OphthalQ7: Yup.string().notRequired(),
  OphthalQ8: Yup.string().required(),
  OphthalQ9: Yup.string().when('OphthalQ8', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  OphthalQ10: Yup.string().required(),
  OphthalQ11: Yup.array().of(Yup.string()).required(),
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
    OphthalQ4Remark: saveData.OphthalQ4Remark || '',
    OphthalQ5: saveData.OphthalQ5 || '',
    OphthalQ5Remark: saveData.OphthalQ5Remark || '',
    OphthalQ6: saveData.OphthalQ6 || '',
    OphthalQ7: saveData.OphthalQ7 || '',
    OphthalQ8: saveData.OphthalQ8 || '',
    OphthalQ9: saveData.OphthalQ9 || '',
    OphthalQ10: saveData.OphthalQ10 || '',
    OphthalQ11: saveData.OphthalQ11 || [],
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
      validationSchema={ophthalValidationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true)
        const submissionValues = {
          ...values,
          OphthalQ3: values.OphthalQ1 === 'Yes' ? values.OphthalQ3 : '',
          OphthalQ9: values.OphthalQ8 === 'Yes' ? values.OphthalQ9 : '',
        }
        const response = await submitForm(submissionValues, patientId, formName)
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
                    <h3>{ophthalFormQuestionText.OphthalQ1}</h3>
                    <FastField
                      name='OphthalQ1'
                      label={ophthalFormQuestionText.OphthalQ1Label}
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ1}
                      row
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ2}</h3>
                    <FastField
                      name='OphthalQ2'
                      label='Ophthal Q2'
                      component={CustomTextField}
                      multiline
                      rows={2}
                      fullWidth
                    />
                    <PopupText qnNo='OphthalQ1' triggerValue='Yes'>
                      <h4>{ophthalFormQuestionText.OphthalQ3}</h4>
                      <FastField
                        name='OphthalQ3'
                        label='Ophthal Q3'
                        component={CustomTextField}
                        multiline
                        rows={2}
                        fullWidth
                      />
                    </PopupText>
                    <h3>{ophthalFormQuestionText.OphthalQ4}</h3>
                    <FastField
                      name='OphthalQ4'
                      label='Ophthal Q4'
                      component={CustomTextField}
                      type='number'
                      placeholder='___'
                      fullWidth
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ4Remark}</h3>
                    <FastField
                      name='OphthalQ4Remark'
                      label='Ophthal Q4 Remark'
                      component={CustomTextField}
                      fullWidth
                      multiline
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ5}</h3>
                    <FastField
                      name='OphthalQ5'
                      label='Ophthal Q5'
                      component={CustomTextField}
                      type='number'
                      placeholder='___'
                      fullWidth
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ5Remark}</h3>
                    <FastField
                      name='OphthalQ5Remark'
                      label='Ophthal Q5 Remark'
                      component={CustomTextField}
                      fullWidth
                      multiline
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ6}</h3>
                    <FastField
                      name='OphthalQ6'
                      label='Ophthal Q6'
                      component={CustomTextField}
                      type='number'
                      placeholder='___'
                      fullWidth
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ7}</h3>
                    <FastField
                      name='OphthalQ7'
                      label='Ophthal Q7'
                      component={CustomTextField}
                      type='number'
                      placeholder='___'
                      fullWidth
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ8}</h3>
                    <FastField
                      name='OphthalQ8'
                      label='Ophthal Q8'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ8}
                      row
                    />
                    <PopupText qnNo='OphthalQ8' triggerValue='Yes'>
                      <h4>{ophthalFormQuestionText.OphthalQ9}</h4>
                      <FastField
                        name='OphthalQ9'
                        label='Ophthal Q9'
                        component={CustomTextField}
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </PopupText>
                    <h3>{ophthalFormQuestionText.OphthalQ10}</h3>
                    <FastField
                      name='OphthalQ10'
                      label='Ophthal Q10'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ10}
                      row
                    />
                    <h4>{ophthalFormQuestionText.OphthalQ11}</h4>
                    <FastField
                      name='OphthalQ11'
                      component={CustomCheckboxGroup}
                      options={formOptions.OphthalQ11}
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
                    <h3>{ophthalFormQuestionText.OphthalQ12}</h3>
                    <FastField
                      name='OphthalQ12'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ12}
                      row
                    />
                    <h3>{ophthalFormQuestionText.OphthalQ13}</h3>
                    <FastField
                      name='OphthalQ13'
                      component={CustomRadioGroup}
                      options={formOptions.OphthalQ13}
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
