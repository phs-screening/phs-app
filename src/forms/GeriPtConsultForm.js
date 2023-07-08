import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField, LongTextField, SelectField } from 'uniforms-material'
import { submitForm, calculateSppbScore } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import Grid from '@material-ui/core/Grid'
import { blueText, title, underlined } from '../theme/commonComponents'

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
  const { patientId, updatePatientId } = useContext(FormContext)
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

  useEffect(async () => {
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
  }, [])
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
      <Fragment>
        <h2>3.4a PT Consult</h2>
        Memo (for participant):
        <LongTextField name='geriPtConsultQ1' label='Geri - PT Consult Q1' />
        <br />
        To be referred for doctor&apos;s consult (PT)?
        <RadioField name='geriPtConsultQ2' label='Geri - PT Consult Q2' />
        <br />
        Reasons for referral to Doctor&apos;s consult (PT):
        <SelectField name='geriPtConsultQ3' checkboxes='true' label='Geri - PT Consult Q3' />
        <br />
        Please specify (if others):
        <LongTextField name='geriPtConsultQ8' label='Geri - PT Consult Q8' />
        <br />
        <br />
        To be referred for social support (PT):
        <RadioField name='geriPtConsultQ4' label='Geri - PT Consult Q4' />
        Reasons for referral to social support (PT):
        <LongTextField name='geriPtConsultQ5' label='Geri - PT Consult Q5' />
        <h2>
          <span style={{ color: 'red' }}>
            IF THE PATIENT NEEDS TO GO TO DOCTOR&apos;S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU
            RECOMMENDED, PLEASE EDIT ON FORM A
          </span>
        </h2>
        <br />
      </Fragment>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

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
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div>
              {title('Physical Activity Level Results ')}
              {underlined('How often do you exercise in a week?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ1
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ1)
                : blueText('nil')}
              {underlined('How long do you exercise each time?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ2
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ2)
                : blueText('nil')}
              {underlined('What do you do for exercise?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ3
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ3)
                : blueText('nil')}
              {underlined('How would you rate the level of exertion when you exercise?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ4
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ4)
                : blueText('nil')}
              {underlined(
                'Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?',
              )}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ5
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ5)
                : blueText('nil')}
              {underlined('History of falls in past 1 year? If yes, how many falls?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ8
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ8)
                : blueText('nil')}
              {underlined('If yes, were any of the falls injurious?')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ9
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ9)
                : blueText('nil')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ10
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ10)
                : blueText('nil')}
              {underlined('Notes:')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ7
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ7)
                : blueText('nil')}
              {underlined('Reasons for referral to PT Consult:')}
              {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ6
                ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ6)
                : blueText('nil')}
              {title('SPPB Scores')}
              {underlined('Short Physical Performance Battery Score (out of 12):')}
              {geriSppb
                ? blueText(
                    calculateSppbScore(
                      geriSppb.geriSppbQ2,
                      geriSppb.geriSppbQ6,
                      geriSppb.geriSppbQ8,
                    ),
                  )
                : blueText('nil')}
              {underlined('Gait speed (Time taken in seconds):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ7) : blueText('nil')}
              {underlined('Gait speed Score (out of 4):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ8) : blueText('nil')}
              {underlined('Chair rise (Time taken in seconds):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ1) : blueText('nil')}
              {underlined('Number of chairs completed:')}
              {geriSppb ? blueText(geriSppb.geriSppbQ13) : blueText('nil')}
              {underlined('5 Chair rise Score (out of 4):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ2) : blueText('nil')}
              {underlined('Side to Side (Time taken in seconds):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ3) : blueText('nil')}
              {underlined('Semi-tandem Stand (Time taken in seconds):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ4) : blueText('nil')}
              {underlined('Tandem Stand (Time taken in seconds):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ5) : blueText('nil')}
              {underlined('Balance score (out of 4):')}
              {geriSppb ? blueText(geriSppb.geriSppbQ6) : blueText('nil')}
              {underlined('Falls Risk Level: ')}
              {geriSppb ? blueText(geriSppb.geriSppbQ11) : blueText('nil')}
              {underlined('Notes:')}
              {geriSppb ? blueText(geriSppb.geriSppbQ12) : blueText('nil')}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

GeriPtConsultForm.contextType = FormContext

export default function GeriPtConsultform(props) {
  return <GeriPtConsultForm {...props} />
}
