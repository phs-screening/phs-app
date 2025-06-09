import React from 'react'
import { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, NumField } from 'uniforms-mui'
import { RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import PopupText from 'src/utils/popupText'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'

const schema = new SimpleSchema({
  SOCIAL3: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  SOCIALShortAns3: {
    type: String,
    optional: true,
  },
  SOCIAL4: {
    type: String,
    allowedValues: [
      '1200 and below per month',
      '1,201 - 2,000 per month',
      '2,001 - 3,999 per month',
      '4,000 - 5,999 per month',
      '6,000 - 9,999 per month',
      '10,000 & above',
      'NIL'
    ],
    optional: false,
  },
  SOCIAL5: {
    type: Number,
    optional: false,
  },
  SOCIAL6: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  SOCIALShortAns6: {
    type: String,
    optional: true,
  },
  SOCIAL7: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  SOCIALShortAns7: {
    type: String,
    optional: true,
  },
  SOCIAL8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  SOCIAL9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  SOCIAL10: {
    type: String,
    allowedValues: ['Yes, (please specify how many pack-years)', 'No'],
    optional: false,
  },
  SOCIALShortAns10: {
    type: String,
    optional: true,
  },
  SOCIAL11: {
    type: String,
    allowedValues: ['Yes, (please specify)', 'No'],
    optional: false,
  },
  SOCIALShortAns11: {
    type: String,
    optional: true,
  },
  SOCIAL12: {
    type: String,
    allowedValues: [
      'Less than 2 standard drinks per day on average',
      'More than 2 standard drinks per day on average',
      'No',
      'Quit alcoholic drinks',
    ],
    optional: false,
  },
  SOCIAL13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  SOCIALExtension13A: {
    type: String,
    optional: true,
    allowedValues: ['1 serving/day', '2 or more servings/day'],
  },
  SOCIALExtension13B: {
    type: String,
    optional: true,
    allowedValues: ['1 serving/day', '2 or more servings/day'],
  },
  SOCIALExtension13C: {
    type: String,
    optional: true,
    allowedValues: ['Yes', 'No'],
  },
  SOCIAL14: {
    type: String,
    allowedValues: [
      'Yes, at least 20 minutes each time, for 3 or more days per week',
      'Yes, at least 20 minutes each time, for less than 3 days per week',
      'No participation of at least 20 minutes each time',
    ],
    optional: false,
  },
  SOCIAL15: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'hxSocialForm'
const HxSocialForm = (props) => {
  const [loading, isLoading] = useState(false)
  const { patientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})
  const [regForm, setRegForm] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const regFormData = getSavedData(patientId, allForms.registrationForm)
      Promise.all([savedData, regFormData]).then((result) => {
        setSaveData(result[0])
        setRegForm(result[1])
      })
    }
    fetchData()
  }, [])

  const formOptions = {
    SOCIAL3: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL4: [
      {
        label: '1200 and below per month',
        value: '1200 and below per month',
      },
      {
        label: '1,201 - 2,000 per month',
        value: '1,201 - 2,000 per month'
      },
      {
        label: '2,001 - 3,999 per month',
        value: '2,001 - 3,999 per month',
      },
      {
        label: '4,000 - 5,999 per month',
        value: '4,000 - 5,999 per month',
      },
      {
        label: '6,000 - 9,999 per month',
        value: '6,000 - 9,999 per month',
      },
      {
        label: '10,000 & above',
        value: '10,000 & above',
      },
      {
        label: 'NIL',
        value: 'NIL',
      },
    ],
    SOCIAL6: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL7: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL8: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL9: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL10: [
      {
        label: 'Yes, (please specify how many pack-years)',
        value: 'Yes, (please specify how many pack-years)',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL11: [
      {
        label: 'Yes, (please specify)',
        value: 'Yes, (please specify)',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL12: [
      {
        label: 'Less than 2 standard drinks per day on average',
        value: 'Less than 2 standard drinks per day on average',
      },
      {
        label: 'More than 2 standard drinks per day on average',
        value: 'More than 2 standard drinks per day on average',
      },
      { label: 'No', value: 'No' },
      { label: 'Quit alcoholic drinks', value: 'Quit alcoholic drinks' },
    ],
    SOCIAL13: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIALExtension13A: [
      {
        label: '1 serving/day',
        value: '1 serving/day',
      },
      { label: '2 or more servings/day', value: '2 or more servings/day' },
    ],
    SOCIALExtension13B: [
      {
        label: '1 serving/day',
        value: '1 serving/day',
      },
      { label: '2 or more servings/day', value: '2 or more servings/day' },
    ],
    SOCIALExtension13C: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SOCIAL14: [
      {
        label: 'Yes, at least 20 minutes each time, for 3 or more days per week',
        value: 'Yes, at least 20 minutes each time, for 3 or more days per week',
      },
      {
        label: 'Yes, at least 20 minutes each time, for less than 3 days per week',
        value: 'Yes, at least 20 minutes each time, for less than 3 days per week',
      },
      {
        label: 'No participation of at least 20 minutes each time',
        value: 'No participation of at least 20 minutes each time',
      },
    ],
    SOCIAL15: [
      {
        label: 'Yes',
        value: 'Yes',
      },
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
        <h1>FINANCIAL STATUS</h1>
        <h3>CHAS Status</h3>
        <p className='blue'>{regForm ? regForm.registrationQ12 : '-'}</p>
        <h3>Pioneer Generation Status 建国一代配套</h3>
        <p className='blue'>{regForm ? regForm.registrationQ13 : '-'}</p>
        <h3>
          Are you currently on any other Government Financial Assistance, other than CHAS and PG
          (e.g. Public Assistance Scheme)?
        </h3>
        <RadioField name='SOCIAL3' label='SOCIAL3' options={formOptions.SOCIAL3} />
        <h4>Please specify:</h4>
        <LongTextField name='SOCIALShortAns3' label='SOCIAL3' />
        <h3>What is the average earnings of participant&apos;s household per month?</h3>
        <RadioField name='SOCIAL4' label='SOCIAL4' options={formOptions.SOCIAL4} />
        <h3>Number of household members (including yourself)?</h3>
        <NumField sx={{ "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none", }, "& input[type=number]": { MozAppearance: "textfield", }, }}
          type="number" name='SOCIAL5' label='SOCIAL5' />
        <h3>
          <span className='red'>If you are currently not on CHAS but qualify, </span>do you want to
          apply for CHAS card?
        </h3>
        <RadioField name='SOCIAL6' label='SOCIAL6' options={formOptions.SOCIAL6} />
        <h4>Please specify:</h4>
        <LongTextField name='SOCIALShortAns6' label='SOCIAL6' />
        <h3>
          Do you need advice on financial schemes that are available in Singapore or require further
          financial assistance?
        </h3>
        <RadioField name='SOCIAL7' label='SOCIAL7' options={formOptions.SOCIAL7} />
        <h4>Please specify:</h4>
        <LongTextField name='SOCIALShortAns7' label='SOCIAL7' />
        <h1>2. SOCIAL ISSUES</h1>
        <h3>Are you caring for a loved one?</h3>
        <RadioField name='SOCIAL8' label='SOCIAL8' options={formOptions.SOCIAL8} />
        <h3>Do you feel equipped to provide care to your loved one? (Please click Yes if not caring for any loved ones)</h3>
        <RadioField name='SOCIAL9' label='SOCIAL9' options={formOptions.SOCIAL9} />
        <h1>3. LIFESTYLE</h1>
        <h3>Do you currently smoke?</h3>
        <RadioField name='SOCIAL10' label='SOCIAL10' options={formOptions.SOCIAL10} />
        <h4>How many pack-years?</h4>
        <LongTextField name='SOCIALShortAns10' label='SOCIAL10' />
        <h3>Have you smoked before? For how long and when did you stop? (Please click Yes if still currently smoking)</h3>
        <RadioField name='SOCIAL11' label='SOCIAL11' options={formOptions.SOCIAL11} />
        <h4>Please specify:</h4>
        <LongTextField name='SOCIALShortAns11' label='SOCIAL11' />
        <h3>Do you consume alcoholic drinks?</h3>
        <p>
          <b>Note: </b>Standard drink means a shot of hard liquor, a can or bottle of beer, or a
          glass of wine.
        </p>
        <RadioField name='SOCIAL12' label='SOCIAL12' options={formOptions.SOCIAL12} />
        <h3>
          Do you have consciously try to eat more fruits, vegetables, whole grain and cereals?
          Please tick where applicable.
        </h3>
        <RadioField name='SOCIAL13' label='SOCIAL13' options={formOptions.SOCIAL13} />
        <PopupText qnNo='SOCIAL13' triggerValue='Yes'>
          <h4>Fruits?</h4>
          <RadioField
            name='SOCIALExtension13A'
            label='SOCIALExtension13A'
            options={formOptions.SOCIALExtension13A}
          />
          <h4>Vegetables?</h4>
          <RadioField
            name='SOCIALExtension13B'
            label='SOCIALExtension13B'
            options={formOptions.SOCIALExtension13B}
          />
          <h4>Whole grain and cereals?</h4>
          <RadioField
            name='SOCIALExtension13C'
            label='SOCIALExtension13C'
            options={formOptions.SOCIALExtension13C}
          />
        </PopupText>
        <h3>
          Do you exercise or participate in any form of: moderate physical activity for at least 150
          minutes, OR intense physical activity for ate least 75 minutes
        </h3>
        <p>
          <b>Note: </b>Examples of physical activity includes exercising, walking, playing sports,
          washing your car, lifting/moving moderately heavy luggage & doing housework.
        </p>
        <RadioField name='SOCIAL14' label='SOCIAL14' options={formOptions.SOCIAL14} />
        <h3>
          Do you feel like the patient would benefit from a consult with the Dietitian or does the
          patient express interest to see a Dietitian.
        </h3>
        <RadioField name='SOCIAL15' label='SOCIAL15' options={formOptions.SOCIAL15} />
      </div>

      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={() => { }} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

HxSocialForm.contextType = FormContext

export default HxSocialForm
