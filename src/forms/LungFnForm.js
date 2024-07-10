import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, NumField } from 'uniforms-mui'
import { SelectField, RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import allForms from './forms.json'

import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import { useField } from 'uniforms'
import { useNavigate } from 'react-router'

const schema = new SimpleSchema({
  LUNG1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  LUNGShortAns1: {
    type: String,
    optional: true,
  },
  LUNG2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  LUNGShortAns2: {
    type: String,
    optional: true,
  },
  LUNG3: {
    type: Number,
    optional: false,
  },
  LUNG4: {
    type: Number,
    optional: false,
  },
  LUNG7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'lungFnForm'
const LungFnForm = (props) => {
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const [ratio, setRatio] = useState(null)

  const [social, setSocial] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const socialData = getSavedData(patientId, allForms.hxSocialForm)
    setSaveData(savedData)

    Promise.all([
      socialData,
    ]).then((result) => {
      setSocial(result[0])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    LUNG1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    LUNG2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    LUNG7: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
  }

  const GetRatio = () => {
    const [{ value: FVC }] = useField('LUNG3', {})
    const [{ value: FEV1 }] = useField('LUNG4', {})

    if (FVC && FEV1) {
      const ratio = FEV1 / FVC
      setRatio(ratio)
      return <p className='blue'>{ratio}</p>
    }
    setRatio(null)
    return <p className='blue'>nil</p>
  }

  const GetResultType = () => {
    if (!ratio) {
      return null
    }
    if (ratio >= 0.7) {
      return <p className='blue'>Result is normal (&ge; 0.7)</p>
    }
    return <p className='red'>Result is abnormal (&lt; 0.7)</p>
  }

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
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
        <h1>Lung Function</h1>
        <h3>Are you well today? (Any flu, fever etc)</h3>
        <RadioField name='LUNG1' label='LUNG1' options={formOptions.LUNG1} />
        <LongTextField name='LUNGShortAns1' label='LUNG1' />
        <h3>Lung function test completed?</h3>
        <RadioField name='LUNG2' label='LUNG2' options={formOptions.LUNG2} />
        <PopupText qnNo='LUNG2' triggerValue='No'>
          <p>
            <h4>If no, why?</h4>
            <LongTextField name='LUNGShortAns2' label='LUNG2' />
          </p>
        </PopupText>
        <h2>Results of lung function test:</h2>
        <h3>FVC</h3>
        <NumField name='LUNG3' label='LUNG3' />
        <h3>FEV1</h3>
        <NumField name='LUNG4' label='LUNG4' />
        <h3>FEV1:FVC ratio</h3>
        <GetRatio />
        <GetResultType />
        <h3>Patient needs to be referred to doctor&apos;s station for followup on their result?</h3>
        <RadioField name='LUNG7' label='LUNG7' options={formOptions.LUNG7} />
      </div>
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
            <div className='summary--question-div'>
              <h2>Social</h2>
              <p className='underlined'>Does patient currently smoke:</p>
              {social && social.SOCIAL10 ? (
                <p className='blue'>{social.SOCIAL10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>How many pack-years:</p>
              {social && social.SOCIALShortAns10 ? (
                <p className='blue'>{social.SOCIALShortAns10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Has patient smoked before:</p>
              {social && social.SOCIAL11 ? (
                <p className='blue'>{social.SOCIAL11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>For how long and when did they stop:</p>
              {social && social.SOCIALShortAns11 ? (
                <p className='blue'>{social.SOCIALShortAns11}</p>
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

LungFnForm.contextType = FormContext

export default LungFnForm
