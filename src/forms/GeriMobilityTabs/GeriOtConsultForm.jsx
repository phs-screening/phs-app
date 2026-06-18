import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, FastField } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, Button, Grid, Typography } from '@mui/material'

import { submitForm, calculateSppbScore } from '../../api/api.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'
import allForms from '../forms.json'

import PopupText from 'src/utils/popupText'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import CustomCheckboxGroup from '../../components/form-components/CustomCheckboxGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'

const formName = 'geriOtConsultForm'

const YesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  geriOtConsultQ2: YesNo,
  geriOtConsultQ4: YesNo,
  geriOtConsultQ6: [
    { label: 'HDB EASE', value: 'HDB EASE' },
    { label: 'Own vendors', value: 'Own vendors' },
  ],
  geriOtConsultQ7: YesNo,
  geriOtConsultQ8: YesNo,
  geriOtConsultQ9: YesNo,
}

const validationSchema = Yup.object({
  geriOtConsultQ1: Yup.string().required(),
  geriOtConsultQ2: Yup.string().required(),
  geriOtConsultQ3: Yup.string(),
  geriOtConsultQ4: Yup.string().required(),
  geriOtConsultQ5: Yup.string(),
  geriOtConsultQ6: Yup.array().of(Yup.string()),
  geriOtConsultQ7: Yup.string().required(),
  geriOtConsultQ8: Yup.string().required(),
  geriOtConsultQ9: Yup.string().required(),
})

function GetSppbScore(q2, q6, q8) {
  let score = 0
  if (q2 !== undefined) {
    score += parseInt(q2.slice(0))
  }
  if (q6 !== undefined) {
    const num = parseInt(q6.slice(0))
    if (!Number.isNaN(num)) {
      score += num
    }
  }
  if (q8 !== undefined) {
    score += parseInt(q8.slice(0))
  }
  return score
}

const GeriOtConsultForm = () => {
  const { patientId } = useContext(FormContext)
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    geriOtConsultQ1: '',
    geriOtConsultQ2: '',
    geriOtConsultQ3: '',
    geriOtConsultQ4: '',
    geriOtConsultQ5: '',
    geriOtConsultQ6: [],
    geriOtConsultQ7: '',
    geriOtConsultQ8: '',
    geriOtConsultQ9: '',
  })

  const [geriVision, setGeriVision] = useState({})
  const [geriOtQ, setGeriOtQ] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [loading, isLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
      const geriOtQData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
      const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
      const geriTugData = getSavedData(patientId, allForms.geriTugForm)

      Promise.all([savedData, geriVisionData, geriOtQData, geriSppbData, geriTugData]).then(
        (result) => {
          setInitialValues(result[0])
          setGeriVision(result[1])
          setGeriOtQ(result[2])
          setGeriSppb(result[3])
          setGeriTug(result[4])
          isLoadingSidePanel(false)
        },
      )
    }
    fetchData()
  }, [])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        isLoading(true)
        const response = await submitForm(values, patientId, formName)
        setTimeout(async () => {
          isLoading(false)
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
      {({ handleSubmit, errors, submitCount }) => (
        <Paper elevation={2} p={0} m={0}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9}>
              <Paper>
                <form onSubmit={handleSubmit} className='fieldPadding'>
                  <div className='form--div'>
                    <h1>OT Consult</h1>
                    <h3>Memo (for participant):</h3>
                    <FastField
                      name='geriOtConsultQ1'
                      label='geri - OT Consult Q1'
                      component={CustomTextField}
                      fullWidth
                      multiline
                    />
                    <h3>To be referred for doctor&apos;s consult (OT)?</h3>
                    If referral to long-term OT rehab services is necessary, this will be done
                    through the doctor&apos;s consult route.
                    <br />
                    <FastField
                      name='geriOtConsultQ2'
                      label='geri - OT Consult Q2'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtConsultQ2}
                      row
                    />
                    <PopupText qnNo='geriOtConsultQ2' triggerValue='Yes'>
                      <h4>Reasons for referral to Doctor&apos;s consult (OT):</h4>
                      For Referral to Polyclinic for OT Rehabilitation Services
                      <FastField
                        name='geriOtConsultQ3'
                        label='geri - OT Consult Q3'
                        component={CustomTextField}
                      />
                    </PopupText>
                    <h3>To be referred for social services (OT):</h3>
                    <FastField
                      name='geriOtConsultQ4'
                      label='geri - OT Consult Q4'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtConsultQ4}
                      row
                    />
                    <PopupText qnNo='geriOtConsultQ4' triggerValue='Yes'>
                      <h4>Reasons for referral to social services (OT):</h4>
                      <FastField
                        name='geriOtConsultQ5'
                        label='geri - OT Consult Q5'
                        component={CustomTextField}
                      />
                    </PopupText>
                    <h4>
                      Which of the following programmes would you recommend the participant for?
                    </h4>
                    (Please select the most appropriate programme)
                    <br />
                    <FastField
                      name='geriOtConsultQ6'
                      label='Recommended programme(s)'
                      component={CustomCheckboxGroup}
                      options={formOptions.geriOtConsultQ6}
                    />
                    <h3>HDB EASE</h3>
                    <p className='remove-bottom-margin'>
                      SC flat owners qualify for EASE (Direct Application) if a family member in the
                      household:
                    </p>
                    <ul>
                      <li>is 65 years old and above; or</li>
                      <li>
                        aged between 60 and 64 years and requires assistance for one or more of the
                      </li>
                    </ul>
                    <h4>Activities of Daily Living (ADL)</h4>
                    ADL refers to daily self-care activities within an individual&apos;s place of
                    residence. These activities include washing/ bathing, dressing, feeding,
                    toileting, mobility, and transferring.
                    <p className='underlined'>
                      Note: Age criterion is not applicable for EASE under HIP.
                    </p>
                    <h3>Is participant eligible for HDB EASE?</h3>
                    <FastField
                      name='geriOtConsultQ7'
                      label='geri - OT Consult Q7'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtConsultQ7}
                      row
                    />
                    <h3>Does participant wish to sign up for HDB EASE?</h3>
                    <FastField
                      name='geriOtConsultQ8'
                      label='geri - OT Consult Q8'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtConsultQ8}
                      row
                    />
                    <h3>Functional Assessment Report completed & given to participant?</h3>
                    <FastField
                      name='geriOtConsultQ9'
                      label='geriOtConsultQ9'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtConsultQ9}
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
                </form>
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
                  <h2>OT Questionnaire Results</h2>
                  <p className='underlined'>Notes (Q1 - 9, Living room/ Home entrance):</p>
                  {geriOtQ ? (
                    <p className='blue'>{geriOtQ.geriOtQuestionnaireQ10}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Notes (Q10 - 15, Toilet):</p>
                  {geriOtQ ? (
                    <p className='blue'>{geriOtQ.geriOtQuestionnaireQ17}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Notes (Q16 - 25, Kitchen and Living Environment):</p>
                  {geriOtQ ? (
                    <p className='blue'>{geriOtQ.geriOtQuestionnaireQ28}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Scores</p>
                  Yes:
                  {geriOtQ && geriOtQ.geriOtQuestionnaireQ29 ? (
                    <span className='blue'>{geriOtQ.geriOtQuestionnaireQ29}</span>
                  ) : (
                    <span className='blue'> nil</span>
                  )}
                  <br />
                  No:
                  {geriOtQ && geriOtQ.geriOtQuestionnaireQ30 ? (
                    <span className='blue'>{geriOtQ.geriOtQuestionnaireQ30}</span>
                  ) : (
                    <span className='blue'> nil</span>
                  )}
                  <br />
                  NA:
                  {geriOtQ && geriOtQ.geriOtQuestionnaireQ31 ? (
                    <span className='blue'>{geriOtQ.geriOtQuestionnaireQ31}</span>
                  ) : (
                    <span className='blue'> nil</span>
                  )}
                  <br />
                  Total:
                  {geriOtQ && geriOtQ.geriOtQuestionnaireQ32 ? (
                    <span className='blue'>{geriOtQ.geriOtQuestionnaireQ32}</span>
                  ) : (
                    <span className='blue'> nil</span>
                  )}
                  <br />
                  <Divider />
                  <h2>SPPB Scores</h2>
                  <p className='underlined'>
                    Short Physical Performance Battery Score (out of 12):
                  </p>
                  {geriSppb && geriSppb.geriSppbQ2 && geriSppb.geriSppbQ6 && geriSppb.geriSppbQ8 ? (
                    <p className='blue'>
                      {calculateSppbScore(
                        geriSppb.geriSppbQ2,
                        geriSppb.geriSppbQ6,
                        geriSppb.geriSppbQ8,
                      )}
                    </p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Gait speed (Time taken in seconds):</p>
                  {geriSppb && geriSppb.geriSppbQ7 ? (
                    <p className='blue'>{geriSppb.geriSppbQ7}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Gait speed Score (out of 4):</p>
                  {geriSppb && geriSppb.geriSppbQ8 ? (
                    <p className='blue'>{geriSppb.geriSppbQ8}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Chair rise (Time taken in seconds):</p>
                  {geriSppb && geriSppb.geriSppbQ1 ? (
                    <p className='blue'>{geriSppb.geriSppbQ1}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Number of chairs completed:</p>
                  {geriSppb && geriSppb.geriSppbQ13 ? (
                    <p className='blue'>{geriSppb.geriSppbQ13}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>5 Chair rise Score (out of 4):</p>
                  {geriSppb && geriSppb.geriSppbQ2 ? (
                    <p className='blue'>{geriSppb.geriSppbQ2}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Side to Side (Time taken in seconds):</p>
                  {geriSppb && geriSppb.geriSppbQ3 ? (
                    <p className='blue'>{geriSppb.geriSppbQ3}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Semi-tandem Stand (Time taken in seconds):</p>
                  {geriSppb && geriSppb.geriSppbQ4 ? (
                    <p className='blue'>{geriSppb.geriSppbQ4}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Tandem Stand (Time taken in seconds):</p>
                  {geriSppb && geriSppb.geriSppbQ5 ? (
                    <p className='blue'>{geriSppb.geriSppbQ5}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Balance score (out of 4):</p>
                  {geriSppb && geriSppb.geriSppbQ6 ? (
                    <p className='blue'>{geriSppb.geriSppbQ6}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Falls Risk Level: </p>
                  {geriSppb && geriSppb.geriSppbQ11 ? (
                    <p className='blue'>{geriSppb.geriSppbQ11}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  <p className='underlined'>Notes:</p>
                  {geriSppb && geriSppb.geriSppbQ12 ? (
                    <p className='blue'>{geriSppb.geriSppbQ12}</p>
                  ) : (
                    <p className='blue'>nil</p>
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

export default GeriOtConsultForm
