
import { Button, CircularProgress, Paper, Typography, Grid, Divider } from '@mui/material'
import { FastField, Field, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as Yup from 'yup'
import { submitForm } from '../../api/api.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'

import { FormContext } from '../../api/utils.js'
import CustomNumberField from '../../components/form-components/CustomNumberField.jsx'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'

import { getSavedData } from '../../services/patientData'

import '../fieldPadding.css'
import '../forms.css'
import allForms from '../forms.json'

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
  geriAmtQ11: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be at least 0')
    .required('Required'),
  geriAmtQ12: Yup.string()
    .oneOf(['Yes (Eligible for G-RACE)', 'No (Not eligible for G-RACE)'])
    .required('Required'),
})

const formOptions = {
  YesNo: [
    { label: 'Yes (Answered correctly)', value: 'Yes (Answered correctly)' },
    { label: 'No (Answered incorrectly)', value: 'No (Answered incorrectly)' },
  ],
  geriAmtQ12: [
    { label: 'Yes (Eligible for G-RACE)', value: 'Yes (Eligible for G-RACE)' },
    { label: 'No (Not eligible for G-RACE)', value: 'No (Not eligible for G-RACE)' },
  ],
}

const getScore = (values) => {
  return Array.from({ length: 10 }, (_, i) => values[`geriAmtQ${i + 1}`]).filter(
    (v) => v === 'Yes (Answered correctly)',
  ).length
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
  geriAmtQ11: '', // number field, keep as '' for Formik compatibility
  geriAmtQ12: '', // Yes/No field
}

const GeriAmtForm = ({ changeTab, nextTab }) => {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [regForm, setRegForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const navigate = useNavigate()

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
        if (response.result) {
          await showFormSubmitSuccess()
          // If patient is eligible for G-RACE, navigate to next tab. If not, navigate to PatientTimeline.
          if (values.geriAmtQ12 === 'Yes (Eligible for G-RACE)') {
            changeTab(null, nextTab)
          } else if (values.geriAmtQ12 === 'No (Not eligible for G-RACE)') {
            navigate('/app/dashboard')
          }
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
              <img
                src='../../../images/geri-amt/scoring-rubric.png'
                alt='Scoring rubric for geri AMT'
              />
              <h2>
                Please select &apos;Yes&apos; if participant answered correctly or &apos;No&apos; if answered
                incorrectly.
              </h2>

              {[...Array(10)].map((_, i) => {
                const qNum = i + 1
                return (
                  <div key={qNum}>
                    <h3>
                      {`${qNum})`} {`Question ${qNum}`} {getQuestionText(qNum)}
                    </h3>
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
                11) How many years of education does the patient have?
              </Typography>
              <FastField
                name='geriAmtQ11'
                component={CustomNumberField}
                label='geriAmtQ11'
                placeholder='Enter number of years'
                fullWidth
              />
              <img
                src='../../../images/geri-amt/g-race-criteria.png'
                alt='Eligibility for g-race based on education level'
              />
              <Typography sx={{ fontWeight: 'bold', mt: 3 }}>
                Follow the criteria shown in the image above.
                <br />
                12) Based on the patient&apos;s age ({regForm?.registrationQ4}), years of education and AMT score, is the patient
                eligible for G-RACE for MMSE?
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
          </Form>
        </Paper>
      )}
    </Formik>
  )

  const renderSidePanel = () => (
    <div className='summary--question-div'>
      <h2>Patient Registration</h2>
      <p className='underlined'>Patient&apos;s Age</p>
      {regForm ? <p className='blue'>{regForm.registrationQ4}</p> : null}
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

const getQuestionText = (qNum) => {
  const textMap = {
    1: 'What is the year? 请问今年是什么年份？',
    2: 'About what time is it? (within 1 hour) 请问现在大约是几点钟（一在一个小时之内）？',
    3: 'What is your age? 请问您今年几岁？',
    4: 'What is your date of birth? 请问您的出生日期或生日？',
    5: 'What is your home address? 请问您的住家地址是在什么地方？',
    6: 'Where are we now? 请问我们现在正在什么地方？',
    7: "Who is our country's Prime Minister? 请问新加坡现任总理是哪位？",
    8: 'What is his/her job? (show picture) 请问图片里的人士很有可能是从事哪种行业？',
    9: 'Count backwards from 20 to 1. 请您从二十开始，倒数到一。',
    10: 'Recall memory phase 请您把刚才我要您记住的地址重复一遍。',
  }
  return textMap[qNum] || ''
}

export default GeriAmtForm