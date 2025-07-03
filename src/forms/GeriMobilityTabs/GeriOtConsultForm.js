import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, FormControl, FormLabel, Box, 
  FormControlLabel, Checkbox, RadioGroup, Radio, TextField, Button, Grid } from '@mui/material'

import { submitForm, calculateSppbScore } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'

const formName = 'geriOtConsultForm'

const formOptions = {
  geriOtConsultQ2: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  geriOtConsultQ4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  geriOtConsultQ6: [
    { label: 'HDB EASE', value: 'HDB EASE' },
    { label: 'Own vendors', value: 'Own vendors' },
  ],
  geriOtConsultQ7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  geriOtConsultQ8: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  geriOtConsultQ9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  geriOtConsultQ1: Yup.string().required(),
  geriOtConsultQ2: Yup.string().oneOf(formOptions.geriOtConsultQ2.map(opt => opt.value)).required(),
  geriOtConsultQ3: Yup.string(),
  geriOtConsultQ4: Yup.string().oneOf(formOptions.geriOtConsultQ4.map(opt => opt.value)).required(),
  geriOtConsultQ5: Yup.string(),
  geriOtConsultQ6: Yup.array().of(Yup.string().oneOf(formOptions.geriOtConsultQ6.map(opt => opt.value))),
  geriOtConsultQ7: Yup.string().oneOf(formOptions.geriOtConsultQ7.map(opt => opt.value)),
  geriOtConsultQ8: Yup.string().oneOf(formOptions.geriOtConsultQ8.map(opt => opt.value)),
  geriOtConsultQ9: Yup.string().oneOf(formOptions.geriOtConsultQ9.map(opt => opt.value)),
})

const isRequiredField = (schema, fieldName) => {
  try {
    const tests = schema.fields[fieldName]?.tests || []
    return tests.some((test) => test.OPTIONS?.name === 'required')
  } catch {
    return false
  }
}

const formatLabel = (name, schema) => {
  const match = name.match(/geriOtConsultQ(\d+)/i)
  const label = match ? `Geri - OT Consult Q${match[1]}` : name
  return `${label}${isRequiredField(schema, name) ? ' *' : ''}`
}

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

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      isLoading(true)
      const response = await submitForm(values, patientId, formName)
      setTimeout(() => {
        isLoading(false)
        if (response.result) {
          alert('Successfully submitted form')
          navigate('/app/dashboard', { replace: true })
        } else {
          alert(`Unsuccessful. ${response.error}`)
        }
      }, 80)
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
      const geriOtQData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
      const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
      const geriTugData = getSavedData(patientId, allForms.geriTugForm)

      Promise.all([savedData, geriVisionData, geriOtQData, geriSppbData, geriTugData]).then((result) => {
        setInitialValues(result[0])
        setGeriVision(result[1])
        setGeriOtQ(result[2])
        setGeriSppb(result[3])
        setGeriTug(result[4])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

  const renderRadioGroup = (name, options = formOptions[name]) => (
    <FormControl sx = {{ mt: 1 }}>
      <FormLabel sx={{ color: 'text.secondary' }}>{formatLabel(name, validationSchema)}</FormLabel>
      <RadioGroup value={formik.values[name]} onChange={formik.handleChange} name={name}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={`${opt.label}${isRequiredField(validationSchema, name) ? ' *' : ''}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )

  const renderCheckboxGroup = (name, options = formOptions[name].map(o => o.value)) => (
    <FormControl sx = {{ mt: 1 }}>
      <FormLabel sx={{ color: 'text.secondary' }}>{formatLabel(name, validationSchema)}</FormLabel>
      <Box display='flex' flexDirection='column'>
        {options.map((val) => (
          <FormControlLabel
            key={val}
            control={
              <Checkbox
                name={name}
                checked={(formik.values[name] || []).includes(val)}
                onChange={(e) => {
                  const checked = e.target.checked
                  const newArr = checked
                    ? [...(formik.values[name] || []), val]
                    : (formik.values[name] || []).filter((v) => v !== val)
                  formik.setFieldValue(name, newArr)
                }}
              />
            }
            label={`${val}${isRequiredField(validationSchema, name) ? ' *' : ''}`}
          />
        ))}
      </Box>
    </FormControl>
  )
  
  const renderTextField = (name) => (
    <TextField
      name={name}
      label={formatLabel(name, validationSchema)}
      value={formik.values[name] || ''}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      fullWidth
      multiline
      sx={{ mt: 1 }}
    />
  )
  
  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            <form onSubmit={formik.handleSubmit} className='fieldPadding'>
              <div className='form--div'>
                <h1>OT Consult</h1>
                <h3>Memo (for participant):</h3>
                {renderTextField('geriOtConsultQ1')}

                <h3>To be referred for doctor&apos;s consult (OT)?</h3>
                If referral to long-term OT rehab services is necessary, this will be done through the doctor&apos;s consult route.
                <br />
                {renderRadioGroup('geriOtConsultQ2')}

                <h4>Reasons for referral to Doctor&apos;s consult (OT):</h4>
                For Referral to Polyclinic for OT Rehabilitation Services
                {renderTextField('geriOtConsultQ3')}

                <h3>To be referred for social services (OT):</h3>
                {renderRadioGroup('geriOtConsultQ4')}

                <h4>Reasons for referral to social services (OT):</h4>
                {renderTextField('geriOtConsultQ5')}

                <h4>Which of the following programmes would you recommend the participant for?</h4>
                (Please select the most appropriate programme)
                <br />
                {renderCheckboxGroup('geriOtConsultQ6')}

                <h3>HDB EASE</h3>
                <p className='remove-bottom-margin'>
                  SC flat owners qualify for EASE (Direct Application) if a family member in the household:
                </p>
                <ul>
                  <li>is 65 years old and above; or</li>
                  <li>aged between 60 and 64 years and requires assistance for one or more of the</li>
                </ul>

                <h4>Activities of Daily Living (ADL)</h4>
                ADL refers to daily self-care activities within an individual&apos;s place of residence. These activities include washing/ bathing, dressing, feeding, toileting, mobility, and transferring.
                <p className='underlined'>Note: Age criterion is not applicable for EASE under HIP.</p>

                <h3>Is participant eligible for HDB EASE?</h3>
                {renderRadioGroup('geriOtConsultQ7')}

                <h3>Does participant wish to sign up for HDB EASE?</h3>
                {renderRadioGroup('geriOtConsultQ8')}
                
                <h3>Functional Assessment Report completed & given to participant?</h3>
                {renderRadioGroup('geriOtConsultQ9')}
              </div>
              <div> 
                {loading ? <CircularProgress /> : <Button type='submit' variant='contained' color='primary'>Submit</Button>}
              </div>
              <br />
              <Divider />
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
              <p className='underlined'>Short Physical Performance Battery Score (out of 12):</p>
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
  )
}

export default GeriOtConsultForm
