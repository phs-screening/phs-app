import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField, LongTextField, SelectField } from 'uniforms-material'
import { submitForm, calculateSppbScore } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import Grid from '@mui/material/Grid'

const schema = new SimpleSchema({
  geriOtConsultQ1: {
    type: String,
    optional: false,
  },
  geriOtConsultQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtConsultQ3: {
    type: String,
    optional: true,
  },
  geriOtConsultQ4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtConsultQ5: {
    type: String,
    optional: true,
  },
  geriOtConsultQ6: {
    type: Array,
    optional: true,
  },
  'geriOtConsultQ6.$': {
    type: String,
    allowedValues: ['HDB EASE', 'Own vendors'],
  },
  geriOtConsultQ7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriOtConsultQ8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriOtConsultQ9: {
    type: String,
    allowedValues: ['Yes', 'No'],
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

const formName = 'geriOtConsultForm'
const GeriOtConsultForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const [geriVision, setGeriVision] = useState({})
  const [geriOtQ, setGeriOtQ] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const { changeTab, nextTab } = props

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
    const geriOtQData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
    const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
    const geriTugData = getSavedData(patientId, allForms.geriTugForm)

    Promise.all([savedData, geriVisionData, geriOtQData, geriSppbData, geriTugData]).then(
      (result) => {
        setSaveData(result[0])
        setGeriVision(result[1])
        setGeriOtQ(result[2])
        setGeriSppb(result[3])
        setGeriTug(result[4])
        isLoadingSidePanel(false)
      },
    )
  }, [])

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
        <h1>OT Consult</h1>
        <h3>Memo (for participant):</h3>
        <LongTextField name='geriOtConsultQ1' label='Geri - OT Consult Q1' />
        <h3>To be referred for doctor&apos;s consult (OT)?</h3>
        If referral to long-term OT rehab services is necessary, this will be done through the
        doctor&apos;s consult route.
        <RadioField
          name='geriOtConsultQ2'
          label='Geri - OT Consult Q2'
          options={formOptions.geriOtConsultQ2}
        />
        <h4>Reasons for referral to Doctor&apos;s consult (OT):</h4>
        For Referral to Polyclinic for OT Rehabilitation Services
        <LongTextField name='geriOtConsultQ3' label='Geri - OT Consult Q3' />
        <h3>To be referred for social support (OT):</h3>
        <RadioField
          name='geriOtConsultQ4'
          label='Geri - OT Consult Q4'
          options={formOptions.geriOtConsultQ4}
        />
        <h4>Reasons for referral to social support (OT):</h4>
        <LongTextField name='geriOtConsultQ5' label='Geri - OT Consult Q5' />
        <h4>Which of the following programmes would you recommend the participant for?</h4>
        (Please select the most appropriate programme)
        <br />
        <SelectField
          name='geriOtConsultQ6'
          checkboxes='true'
          label='Geri - OT Consult Q6'
          options={formOptions.geriOtConsultQ6}
        />
        <h3>HDB EASE</h3>
        <p className='remove-bottom-margin'>
          SC flat owners qualify for EASE (Direct Application) if a family member in the household:
        </p>
        <ul>
          <li>is 65 years old and above; or</li>
          <li>aged between 60 and 64 years and requires assistance for one or more of the</li>
        </ul>
        <h4>Activities of Daily Living (ADL)</h4>
        ADL refers to daily self-care activities within an individual&apos;s place of residence.
        These activities include washing/ bathing, dressing, feeding, toileting, mobility, and
        transferring.
        <p className='underlined'>Note: Age criterion is not applicable for EASE under HIP.</p>
        <h3>Is participant eligible for HDB EASE?</h3>
        <RadioField
          name='geriOtConsultQ7'
          label='Geri - OT Consult Q7'
          options={formOptions.geriOtConsultQ7}
        />
        <h3>Does participant wish to sign up for HDB EASE?</h3>
        <RadioField
          name='geriOtConsultQ8'
          label='Geri - OT Consult Q8'
          options={formOptions.geriOtConsultQ8}
        />
        <h3>Functional Assessment Report completed & given to participant?</h3>
        <RadioField
          name='geriOtConsultQ9'
          label='Geri - OT Consult Q9'
          options={formOptions.geriOtConsultQ9}
        />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

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

GeriOtConsultForm.contextType = FormContext

export default function GeriOtConsultform(props) {
  return <GeriOtConsultForm {...props} />
}
