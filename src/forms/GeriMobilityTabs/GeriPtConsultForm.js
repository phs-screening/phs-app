import React, { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { RadioField, LongTextField, SelectField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'
import Grid from '@mui/material/Grid'
import '../forms.css'

const schema = new SimpleSchema({
  geriPtConsultQ1: {
    type: String,
    optional: false,
  },
  geriPtConsultQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriPtConsultQ3: {
    type: Array,
    optional: true,
  },
  'geriPtConsultQ3.$': {
    type: String,
    allowedValues: [
      'Fall risk (i.e. 2 or more falls/1 fall with injury in the past 1 year)',
      'Reduced functional mobility (i.e. Short Physical Performance Battery <10)',
      'Others (please specify:)',
    ],
    optional: true,
  },
  geriPtConsultQ8: {
    type: String,
    optional: true,
  },
  geriPtConsultQ4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriPtConsultQ5: {
    type: String,
    optional: true,
  },
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

const formName = 'geriPtConsultForm'
const GeriPtConsultForm = (props) => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})
  const [geriParq, setGeriParq] = useState({})
  const [geriPhysicalActivity, setGeriPhysicalActivity] = useState({})
  const [geriFrailScale, setGeriFrailScale] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)

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
        setSaveData(result[0])
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
  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          const event = null // not interested in this value
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            changeTab(event, nextTab)
          }, 80)
        } else {
          isLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h1>PT Consult</h1>
        <h3>Memo (for participant):</h3>
        <LongTextField name='geriPtConsultQ1' label='Geri - PT Consult Q1' />
        <h3>To be referred for doctor&apos;s consult (PT)?</h3>
        <RadioField
          name='geriPtConsultQ2'
          label='Geri - PT Consult Q2'
          options={formOptions.geriPtConsultQ2}
        />
        <h4>Reasons for referral to Doctor&apos;s consult (PT):</h4>
        <SelectField
          name='geriPtConsultQ3'
          checkboxes='true'
          label='Geri - PT Consult Q3'
          options={formOptions.geriPtConsultQ3}
        />
        <h4>Please specify (if others):</h4>
        <LongTextField name='geriPtConsultQ8' label='Geri - PT Consult Q8' />
        <h3>To be referred for social support (PT):</h3>
        <RadioField
          name='geriPtConsultQ4'
          label='Geri - PT Consult Q4'
          options={formOptions.geriPtConsultQ4}
        />
        <h4>Please specify:</h4>
        <LongTextField name='geriPtConsultQ5' label='Geri - PT Consult Q5' />
        <br />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={() => { }} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {newForm()}
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
              {geriSppb ? (
                <p className='blue'>
                  calculateSppbScore( geriSppb.geriSppbQ2, geriSppb.geriSppbQ6, geriSppb.geriSppbQ8,
                  )
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
              {geriSppb ? (
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

GeriPtConsultForm.contextType = FormContext

export default GeriPtConsultForm
