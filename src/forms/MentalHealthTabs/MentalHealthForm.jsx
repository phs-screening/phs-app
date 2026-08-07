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
import { mentalHealthFormQuestionText } from '../questions/MentalHealthFormQuestions'

const yesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
].map((value) => ({ label: value, value }))

const gadQuestionIds = ['GAD3', 'GAD4', 'GAD5', 'GAD6', 'GAD7']
const getAnswerScore = (answer) => Number.parseInt(answer, 10) || 0

const formName = 'mentalHealthForm'

const createValidationSchema = (showGadFollowUp) =>
  Yup.object({
    SAMH1: Yup.string().required(),
    SAMH2: Yup.string().required(),
    SAMH3: Yup.string().required(),
    ...Object.fromEntries(
      gadQuestionIds.map((questionId) => [
        questionId,
        showGadFollowUp ? Yup.string().required() : Yup.string().notRequired(),
      ]),
    ),
  })

const emptyValues = {
  GAD3: '',
  GAD4: '',
  GAD5: '',
  GAD6: '',
  GAD7: '',
  SAMH1: '',
  SAMH2: '',
  SAMH3: '',
}

const MentalHealthForm = () => {
  const { patientId } = useContext(FormContext)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [loading, setLoading] = useState(false)

  const [regi, setReg] = useState({})
  const [phq, setPHQ] = useState({})
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState(emptyValues)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setInitialValues({ ...emptyValues, ...(savedData || {}) })
      const regData = getSavedData(patientId, allForms.registrationForm)
      const phqData = getSavedData(patientId, allForms.geriPhqForm)

      Promise.all([regData, phqData]).then((result) => {
        setReg(result[0] || {})
        setPHQ(result[1] || {})
        isLoadingSidePanel(false)
      })
    }

    fetchData()
  }, [patientId])

  const gad2Score = getAnswerScore(phq.GAD1) + getAnswerScore(phq.GAD2)
  const showGadFollowUp = gad2Score >= 3

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createValidationSchema(showGadFollowUp)}
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true)
        const submissionValues = showGadFollowUp
          ? values
          : { ...values, ...Object.fromEntries(gadQuestionIds.map((id) => [id, ''])) }
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
      enableReinitialize={true}
    >
      {({ errors, submitCount, isValid }) => (
        <Paper elevation={2}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9}>
              <Paper elevation={2}>
                <Form className='fieldPadding'>
                  <div className='form--div'>
                    {showGadFollowUp && (
                      <>
                        <h2>GAD follow-up</h2>
                        <p>
                          Over the last 2 weeks, how often have you been bothered by the following
                          problems?
                        </p>
                        {gadQuestionIds.map((questionId) => (
                          <FastField
                            key={questionId}
                            name={questionId}
                            label={mentalHealthFormQuestionText[questionId]}
                            component={CustomRadioGroup}
                            options={dayRange}
                            row
                          />
                        ))}
                      </>
                    )}

                    <h3>{mentalHealthFormQuestionText.SAMH1}</h3>
                    <FastField
                      name='SAMH1'
                      label='SAMH1'
                      component={CustomRadioGroup}
                      options={yesNo}
                      row
                    />

                    <h3>{mentalHealthFormQuestionText.SAMH2}</h3>
                    <FastField
                      name='SAMH2'
                      label='SAMH2'
                      component={CustomRadioGroup}
                      options={yesNo}
                      row
                    />

                    <h3>{mentalHealthFormQuestionText.SAMH3}</h3>
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
                        disabled={!isValid || loading || loadingSidePanel}
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

                  <p className='blue'>PHQ Score: {phq.PHQ10}</p>
                  {phq.PHQ10 >= 6 ? (
                    <p className='red'>
                      Patient meets the PHQ score threshold for referral to SAMH. Patient is
                      recommended to sign up for follow up to SAMH.
                    </p>
                  ) : null}
                  <p className='underlined'>Would the patient benefit from counselling:</p>
                  <p className='blue'>{phq.PHQ11}</p>
                  <p className='blue'>{phq.PHQShortAns11}</p>
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
