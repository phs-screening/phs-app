import { Divider, Paper, CircularProgress, Button, Grid } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { submitForm } from '../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'
import './fieldPadding.css'
import allForms from './forms.json'

import PopupText from 'src/utils/popupText'
import CustomRadioGroup from '../components/form-components/CustomRadioGroup'
import CustomTextField from '../components/form-components/CustomTextField'
import ErrorNotification from '../components/form-components/ErrorNotification'

const YesNo = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
]

const formOptions = {
  AudiometryQ1: YesNo,
  AudiometryQ9: YesNo,
  AudiometryQ11: YesNo,
  AudiometryQ13: [
    {
      value:
        'There is some hearing loss detected. This test is not diagnostic, and the participant needs to undergo a more comprehensive hearing assessment.',
      label:
        'There is some hearing loss detected. This test is not diagnostic, and the participant needs to undergo a more comprehensive hearing assessment.',
    },
    {
      value: "There is no hearing loss detected, the participant's hearing is normal.",
      label: "There is no hearing loss detected, the participant's hearing is normal.",
    },
  ],
}

const validationSchema = Yup.object().shape({
  AudiometryQ1: Yup.string().required(),
  AudiometryQ9: Yup.string().required(),
  AudiometryQ10: Yup.string(),
  AudiometryQ11: Yup.string().required(),
  AudiometryQ12: Yup.string().required(),
  AudiometryQ13: Yup.string().required(),
})

const formName = 'audiometryForm'

const AudiometryForm = () => {
  const { patientId } = useContext(FormContext)
  const navigate = useNavigate()

  const [saveData, setSaveData] = useState({})
  const [hcsr, setHcsr] = useState({})
  const [pmhx, setPMHX] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  // const [dataLoaded, setDataLoaded] = useState(false)
  const [setDataLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const savedDataPromise = getSavedData(patientId, formName)
      const hcsrDataPromise = getSavedData(patientId, allForms.hxHcsrForm)
      const pmhxDataPromise = getSavedData(patientId, allForms.hxNssForm)

      const [savedResult, hcsrResult, pmhxResult] = await Promise.all([
        savedDataPromise,
        hcsrDataPromise,
        pmhxDataPromise,
      ])

      setSaveData(savedResult || {})
      setHcsr(hcsrResult || {})
      setPMHX(pmhxResult || {})

      setDataLoaded(true)
      setLoadingSidePanel(false)
    }
    fetchData()
  }, [patientId])

  const initialValues = {
    AudiometryQ1: saveData.AudiometryQ1 || '',
    AudiometryQ9: saveData.AudiometryQ9 || '',
    AudiometryQ10: saveData.AudiometryQ10 || '',
    AudiometryQ11: saveData.AudiometryQ11 || '',
    AudiometryQ12: saveData.AudiometryQ12 || '',
    AudiometryQ13: saveData.AudiometryQ13 || '',
  }

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
                    <h1>AUDIOMETRY</h1>
                    <h3>Did participant visit Audiometry Booth by NUS audiology team?</h3>
                    <FastField
                      name='AudiometryQ1'
                      label='AudiometryQ1'
                      component={CustomRadioGroup}
                      options={formOptions.AudiometryQ1}
                      row
                    />
                    <h4>
                      When senior is found to have abnormal hearing results, please ask the
                      following questions:
                    </h4>
                    <h3>
                      Do you have an upcoming appointment with your ear specialist or audiologist?
                    </h3>
                    <FastField
                      name='AudiometryQ9'
                      label='AudiometryQ9'
                      component={CustomRadioGroup}
                      options={formOptions.AudiometryQ9}
                      row
                    />

                    <PopupText qnNo='AudiometryQ9' triggerValue='Yes'>
                      <h4>If yes, please specify:</h4>
                      <FastField
                        name='AudiometryQ10'
                        label='AudiometryQ10'
                        component={CustomTextField}
                        fullWidth
                      />
                    </PopupText>

                    <h3>Referred to Doctor&apos;s Consult?</h3>
                    <FastField
                      name='AudiometryQ11'
                      label='AudiometryQ11'
                      component={CustomRadioGroup}
                      options={formOptions.AudiometryQ11}
                      row
                    />

                    <h3>
                      Please document significant findings from audiometry test and recommended
                      course of action for participant:
                    </h3>
                    <FastField
                      name='AudiometryQ12'
                      label='AudiometryQ12'
                      component={CustomTextField}
                      fullWidth
                      multiline
                      rows={3}
                    />

                    <FastField
                      name='AudiometryQ13'
                      label='Assessment Result'
                      component={CustomRadioGroup}
                      options={formOptions.AudiometryQ13}
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
                  <Divider />
                </Form>
              </Paper>
            </Grid>
            <Grid
              p={1}
              width='50%'
              display='flex'
              flexDirection='column'
              alignItems={loadingSidePanel ? 'center' : 'left'}
            >
              {loadingSidePanel ? (
                <CircularProgress />
              ) : (
                <div className='summary--question-div'>
                  <h2>Hearing Issues</h2>
                  {<p className='underlined'>Has participant seen an ENT Specialist before?</p>}
                  {hcsr && hcsr.hxHcsrQ13 ? (
                    <p className='blue'>{hcsr.hxHcsrQ13}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  {hcsr && hcsr.hxHcsrQ14 ? (
                    <p className='blue'>{hcsr.hxHcsrQ14}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  {<p className='underlined'>Does participant use any hearing aids?</p>}
                  {hcsr && hcsr.hxHcsrQ15 ? (
                    <p className='blue'>{hcsr.hxHcsrQ15}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  {hcsr && hcsr.hxHcsrQ16 ? (
                    <p className='blue'>{hcsr.hxHcsrQ16}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}

                  {pmhx ? (
                    <>
                      <p className='underlined'>
                        If participant is 60 and above, do they currently use hearing aids/have been
                        detected to require hearing aids?
                      </p>
                      <p className='blue'>{pmhx.PMHX13}</p>

                      <p className='underlined'>
                        For geriatric participants, has the senior seen an ENT specialist before?
                      </p>
                      <p className='blue'>{pmhx.PMHX8}</p>
                      <p className='blue'>{pmhx.PMHXShortAns8}</p>

                      <p className='underlined'>
                        <span className='red'>For geriatric participants,</span> did he/she answer
                        yes to any of the following questions?
                      </p>
                      <ol type='a'>
                        <li>Have you had your hearing aids for more than 5 years?</li>
                        <li>
                          Has it been 3 years or more since you used your hearing aids (i.e. did not
                          use the hearing aids for more than 3 years)?
                        </li>
                        <li>Are your hearing aids spoilt/not working?</li>
                      </ol>
                      <p className='blue'>{pmhx.PMHX9}</p>
                      <p className='blue'>{pmhx.PMHXShortAns9}</p>
                    </>
                  ) : (
                    <p className='red'>nil pmhx data</p>
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

AudiometryForm.contextType = FormContext

export default AudiometryForm