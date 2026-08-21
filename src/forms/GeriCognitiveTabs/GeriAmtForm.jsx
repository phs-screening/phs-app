import { Box, Button, CircularProgress, Paper, Typography, Grid, Divider } from '@mui/material'
import { FastField, Field, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomSelect from '../../components/form-components/CustomSelect'
import ErrorNotification from '../../components/form-components/ErrorNotification'

import { getSavedData } from '../../services/patientData'

import '../fieldPadding.css'
import '../forms.css'
import allForms from '../forms.json'
import {
  geriAmtFormQuestionText,
  hasFailedAmt,
  AMT_PASS_MARK,
} from '../questions/GeriAmtFormQuestions'

const formName = 'geriAmtForm'

const validationSchema = Yup.object({
  ...Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [
      `geriAmtQ${i + 1}`,
      Yup.string()
        .oneOf(['Yes (Answered correctly)', 'No (Answered incorrectly)'])
        .required('Required'),
    ]),
  ),
  geriAmtQ11: Yup.string().oneOf(['Before PSLE', 'After PSLE']).required('Required'),
  geriAmtQ12: Yup.string().oneOf(['Yes', 'No']).required('Required'),
})

const formOptions = {
  YesNo: [
    { label: 'Yes (Answered correctly)', value: 'Yes (Answered correctly)' },
    { label: 'No (Answered incorrectly)', value: 'No (Answered incorrectly)' },
  ],
  geriAmtQ11: [
    { label: 'Before PSLE', value: 'Before PSLE' },
    { label: 'After PSLE', value: 'After PSLE' },
  ],
  geriAmtQ12: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const getScore = (values) => {
  return Array.from({ length: 10 }, (_, i) => values[`geriAmtQ${i + 1}`]).filter(
    (v) => v === 'Yes (Answered correctly)',
  ).length
}

const formatDateOfBirth = (value) => {
  const date = dayjs(value)
  return date.isValid() ? date.format('D MMMM YYYY') : 'Not available'
}

const initialValues = {
  geriAmtQ1: '',
  geriAmtQ2: '',
  geriAmtQ3: '',
  geriAmtQ4: '',
  geriAmtQ5: '',
  geriAmtQ6: '',
  geriAmtQ7: '',
  geriAmtQ8: '',
  geriAmtQ9: '',
  geriAmtQ10: '',
  geriAmtQ11: '',
  geriAmtQ12: '', // DSG referral decision, Yes/No
}

const GeriAmtForm = () => {
  const { patientId } = useContext(FormContext)
  const navigate = useNavigate()
  const [savedData, setSavedData] = useState(initialValues)
  const [regForm, setRegForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      const reg = await getSavedData(patientId, allForms.registrationForm)
      setSavedData({ ...initialValues, ...res })
      setRegForm(reg)
      setLoadingSidePanel(false)
    }
    fetchData()
  }, [patientId])

  const renderForm = () => (
    <Formik
      enableReinitialize
      initialValues={savedData}
      validationSchema={validationSchema}
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
      {(formikProps) => (
        <Paper>
          <Form className='fieldPadding'>
            <div className='form--div'>
              <h1>ABBREVIATED MENTAL TEST (for dementia)</h1>
              <Typography sx={{ fontWeight: 'bold', mb: 2 }}>
                Before you start the AMT, please (1) ask for the participant&apos;s NRIC to refer to
                their address for a later question and (2) tell them to remember the phrase
                &quot;37 Bukit Timah Road&quot;.
                <br />
                <br />
                If the participant does not have their NRIC with them, we can ask for their postal
                code.
              </Typography>
              <img
                src='../../../images/geri-amt/scoring-rubric.png'
                alt='Scoring rubric for geri AMT'
              />
              <h2>
                Please select &apos;Yes&apos; if participant answered correctly or &apos;No&apos; if
                answered incorrectly.
              </h2>

              {[...Array(10)].map((_, i) => {
                const qNum = i + 1
                return (
                  <div key={qNum}>
                    <h3>
                      {`${qNum})`} {`Question ${qNum}`} {geriAmtFormQuestionText[`geriAmtQ${qNum}`]}
                    </h3>
                    {qNum === 8 && (
                      <Box
                        component='img'
                        src='/images/geri-amt/q8-occupation.jpg'
                        alt='Doctor and nurse shown for AMT question 8'
                        sx={{
                          display: 'block',
                          width: '100%',
                          maxWidth: 520,
                          height: 'auto',
                          mx: 'auto',
                          mb: 2,
                        }}
                      />
                    )}
                    {qNum === 10 && (
                      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
                        &quot;37 Bukit Timah Road&quot;
                      </Typography>
                    )}
                    <Typography variant='body2'>{`Was Q${qNum} answered correctly?`}</Typography>
                    <Field
                      name={`geriAmtQ${qNum}`}
                      label={`geriAmtQ${qNum}`}
                      component={CustomRadioGroup}
                      options={formOptions.YesNo}
                      row
                    />
                  </div>
                )
              })}

              {/*<h3>Supplementary questions:</h3>
              <Field
                name='geriAmtQ11'
                label='geriAmtQ11'
                component={CustomRadioGroup}
                options={options}
                row
              />*/}

              <h4>AMT Total Score: {getScore(formikProps.values)} /10</h4>

              <Typography sx={{ fontWeight: 'bold', mt: 3 }}>
                {geriAmtFormQuestionText.geriAmtQ11}
              </Typography>
              <FastField
                name='geriAmtQ11'
                component={CustomSelect}
                label=''
                options={formOptions.geriAmtQ11}
              />
              <img
                src='../../../images/geri-amt/g-race-criteria.png'
                alt='Eligibility for g-race based on education level'
              />
              {/* Pass mark depends on schooling: >= 7/10 Before PSLE, >= 9/10 After.
                  Shown as guidance for the referral decision below. */}
              {(() => {
                const score = getScore(formikProps.values)
                const educationLevel = formikProps.values.geriAmtQ11
                const passMark = AMT_PASS_MARK[educationLevel]
                if (passMark === undefined) return null

                const failed = hasFailedAmt(score, educationLevel)
                return (
                  <Typography sx={{ fontWeight: 'bold', mt: 3, color: failed ? 'red' : 'green' }}>
                    AMT {failed ? 'FAILED' : 'PASSED'}: scored {score}/10, pass mark is {passMark}/10
                    for {educationLevel}.
                  </Typography>
                )
              })()}

              <Typography sx={{ fontWeight: 'bold', mt: 3 }}>
                {geriAmtFormQuestionText.geriAmtQ12}
              </Typography>
              <Field
                name='geriAmtQ12'
                label='geriAmtQ12'
                component={CustomRadioGroup}
                options={formOptions.geriAmtQ12}
                row
              />
            </div>

            <ErrorNotification
              show={formikProps.submitCount > 0 && Object.keys(formikProps.errors || {}).length > 0}
              message='Please fill in all required fields correctly.'
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
          </Form>
        </Paper>
      )}
    </Formik>
  )

  const renderSidePanel = () => (
    <div className='summary--question-div'>
      <h2>AMT References</h2>
      <p className='underlined'>Question 3: Age</p>
      <p className='blue'>{regForm?.registrationQ4 ?? 'Not available'}</p>
      <Divider />
      <p className='underlined'>Question 4: Date of Birth</p>
      <p className='blue'>{formatDateOfBirth(regForm?.registrationQ3)}</p>
      <Divider />
      <p className='underlined'>Question 5: Home Address</p>
      <p>Refer to the participant&apos;s NRIC. If unavailable, ask for their postal code.</p>
      <Divider />
      <p className='underlined'>Question 10: Recall Phrase</p>
      <p className='blue'>&quot;37 Bukit Timah Road&quot;</p>
      <Divider />
    </div>
  )

  return (
    <Paper elevation={2} sx={{ p: 0, m: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          {renderForm()}
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            {loadingSidePanel ? <CircularProgress /> : renderSidePanel()}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default GeriAmtForm
