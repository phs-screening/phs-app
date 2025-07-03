import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, FormControl, FormLabel, Box, 
  FormControlLabel, Checkbox, RadioGroup, Radio, TextField, Button } from '@mui/material'

import { submitForm, calculateSppbScore } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'
import Grid from '@mui/material/Grid'
import '../forms.css'

const formName = 'geriPtConsultForm';

const formOptions = {
  geriPtConsultQ2: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  geriPtConsultQ3: [
    {
      label: 'Fall risk (i.e. 2 or more falls/1 fall with injury in the past 1 year)',
      value: 'Fall risk (i.e. 2 or more falls/1 fall with injury in the past 1 year)',
    },
    {
      label: 'Reduced functional mobility (i.e. Short Physical Performance Battery <10)',
      value: 'Reduced functional mobility (i.e. Short Physical Performance Battery <10)',
    },
    { label: 'Others (please specify:)', value: 'Others (please specify:)' },
  ],
  geriPtConsultQ4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  geriPtConsultQ1: Yup.string().required(),
  geriPtConsultQ2: Yup.string().oneOf(formOptions.geriPtConsultQ2.map(option => option.value)).required(),
  geriPtConsultQ3: Yup.array().of(Yup.string().oneOf(formOptions.geriPtConsultQ3.map(option => option.value))).nullable(),
  geriPtConsultQ4: Yup.string().oneOf(formOptions.geriPtConsultQ4.map(option => option.value)).required(),
  geriPtConsultQ5: Yup.string(),
  geriPtConsultQ8: Yup.string(),
});

const isRequiredField = (schema, fieldName) => {
  try {
    const tests = schema.fields[fieldName]?.tests || []
    return tests.some((test) => test.OPTIONS?.name === 'required')
  } catch {
    return false
  }
}

const formatLabel = (name, schema) => {
  const match = name.match(/geriPtConsultQ(\d+)/i)
  const label = match ? `Geri - PT Consult Q${match[1]}` : name
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

const getTotalFrailScaleScore = (doc) => {
  let sum = 0
  try {
    if (doc.geriFrailScaleQ1 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ1)
    }
    if (doc.geriFrailScaleQ2 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ2)
    }

    if (doc.geriFrailScaleQ3 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ3)
    }

    if (doc.geriFrailScaleQ4 !== undefined) {
      const length = doc.geriFrailScaleQ4.length
      const score = length > 4 ? 1 : 0
      sum += score
    }

    if (doc.geriFrailScaleQ5 !== undefined) {
      const weightPercent = parseInt(doc.geriFrailScaleQ5)
      const score = weightPercent > 5 ? 1 : 0
      sum += score
    }
    return sum
  } catch (e) {
    return 'error calculating score'
  }
}

const GeriPtConsultForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    geriPtConsultQ1: '',
    geriPtConsultQ2: '',
    geriPtConsultQ3: [],
    geriPtConsultQ4: '',
    geriPtConsultQ5: '',
    geriPtConsultQ8: ''
  })
  const [geriParq, setGeriParq] = useState({})
  const [geriPhysicalActivity, setGeriPhysicalActivity] = useState({})
  const [geriFrailScale, setGeriFrailScale] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)

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
          const event = null // not interested in this value
          alert('Successfully submitted form')
          changeTab(event, nextTab)
        } else {
          alert(`Unsuccessful. ${response.error}`)
        }
      }, 80)
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const geriParqData = getSavedData(patientId, allForms.geriParQForm)
      const geriPhysicalActivityData = getSavedData(patientId, allForms.geriPhysicalActivityLevelForm)
      const geriFrailScaleData = getSavedData(patientId, allForms.geriFrailScaleForm)
      const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
      const geriTugData = getSavedData(patientId, allForms.geriTugForm)

      Promise.all([
        savedData,
        geriParqData,
        geriPhysicalActivityData,
        geriFrailScaleData,
        geriSppbData,
        geriTugData,
      ]).then((result) => {
        setInitialValues(result[0])
        setGeriParq(result[1])
        setGeriPhysicalActivity(result[2])
        setGeriFrailScale(result[3])
        setGeriSppb(result[4])
        setGeriTug(result[5])
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
                <h1>PT Consult</h1>
                <h3>Memo (for participant):</h3>
                {renderTextField('geriPtConsultQ1')}

                <h3>To be referred for doctor&apos;s consult (PT)?</h3>
                {renderRadioGroup('geriPtConsultQ2')}

                <h4>Reasons for referral to Doctor&apos;s consult (PT):</h4>
                {renderCheckboxGroup('geriPtConsultQ3')}

                <h4>Please specify (if others):</h4>
                {renderTextField('geriPtConsultQ8')}

                <h3>To be referred for social support (PT):</h3>
                {renderRadioGroup('geriPtConsultQ4')} 

                <h4>Please specify:</h4>
                {renderTextField('geriPtConsultQ5')}
              </div>

              <br />
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
              <h2>Physical Activity Level Results</h2>
              <p className='underlined'>How often do you exercise in a week?</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ1 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>How long do you exercise each time?</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ2 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ2}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>What do you do for exercise?</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ3 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                How would you rate the level of exertion when you exercise?
              </p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ4 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Do you have significant difficulties going about your regular exercise regime? Or do
                you not know how to start exercising?
              </p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ5 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>History of falls in past 1 year? If yes, how many falls?</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ8 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>If yes, were any of the falls injurious?</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ9 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ10 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Notes:</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ7 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Reasons for referral to PT Consult:</p>
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ6 ? (
                <p className='blue'>{geriPhysicalActivity.geriPhysicalActivityLevelQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
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
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Gait speed Score (out of 4):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Chair rise (Time taken in seconds):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Number of chairs completed:</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ13}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>5 Chair rise Score (out of 4):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ2}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Side to Side (Time taken in seconds):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Semi-tandem Stand (Time taken in seconds):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Tandem Stand (Time taken in seconds):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Balance score (out of 4):</p>
              {geriSppb ? (
                <p className='blue'>{geriSppb.geriSppbQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Falls Risk Level: </p>
              {geriSppb ? (
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

export default GeriPtConsultForm
