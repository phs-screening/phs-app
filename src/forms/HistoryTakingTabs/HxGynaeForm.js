import React, { useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-mui'
import { RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB.js'
import '../fieldPadding.css'
import '../forms.css'
import PopupText from 'src/utils/popupText.js'

const schema = new SimpleSchema({
  GYNAE1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAE2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns2: {
    type: String,
    optional: true,
  },
  GYNAE3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns3: {
    type: String,
    optional: true,
  },
  GYNAE4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns4: {
    type: String,
    optional: true,
  },
  GYNAE5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns5: {
    type: String,
    optional: true,
  },
  GYNAE6: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns6: {
    type: String,
    optional: true,
  },
  GYNAE7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns7: {
    type: String,
    optional: true,
  },
  GYNAE8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns8: {
    type: String,
    optional: true,
  },
  GYNAE9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAE10: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns10: {
    type: String,
    optional: true,
  },
  GYNAE11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns11: {
    type: String,
    optional: true,
  },
  GYNAE13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  GYNAEShortAns13: {
    type: String,
    optional: true,
  },
})

const formName = 'gynaeForm'
const HxGynaeForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [saveData, setSaveData] = useState({})

  const form_schema = new SimpleSchema2Bridge(schema)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [])

  const formOptions = {
    GYNAE1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE4: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE5: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE6: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE7: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE8: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE9: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE10: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    GYNAE13: [
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
        <h1>GYNECOLOGY</h1>
        <h3 className='red'>Only ask if participant is female: </h3>
        <h3>Are you menopaused?</h3>
        <p>i.e. &gt; 1 year from your last menstrual period</p>
        <RadioField name='GYNAE1' label='GYNAE1' options={formOptions.GYNAE1} />
        <PopupText qnNo='GYNAE1' triggerValue='Yes'>
          <h3>Do you have any postmenopausal bleeding? (bleeding after menopause)</h3>
          <RadioField name='GYNAE2' label='GYNAE2' options={formOptions.GYNAE2} />
          <h4>Please specify:</h4>
          <LongTextField name='GYNAEShortAns2' label='GYNAE2' />
        </PopupText>
        <h3>Do you have any abnormal per vaginal bleeding?</h3>
        <p>
          e.g. bleeding between periods (intermenstrual bleeding), prolonged menses, bleeding after
          intercourse (post-coital bleeding)
        </p>
        <RadioField name='GYNAE3' label='GYNAE3' options={formOptions.GYNAE3} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns3' label='GYNAE3' />
        <h3>Do you have irregular period or less than 4 menstrual cycles a year?</h3>
        <RadioField name='GYNAE4' label='GYNAE4' options={formOptions.GYNAE4} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns4' label='GYNAE4' />
        <h3>
          Do you have any menstrual concerns such as extremely heavy menses/severe pain during
          menses?
        </h3>
        <RadioField name='GYNAE5' label='GYNAE5' options={formOptions.GYNAE5} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns5' label='GYNAE5' />
        <h3>Do you feel any abnormal abdominal masses?</h3>
        <RadioField name='GYNAE6' label='GYNAE6' options={formOptions.GYNAE6} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns6' label='GYNAE6' />
        <h3>Do you have any new onset abdominal pain/bloatedness?</h3>
        <RadioField name='GYNAE7' label='GYNAE8' options={formOptions.GYNAE7} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns7' label='GYNAE7' />
        <h3>
          Do you have any fertility concerns or any difficulties conceiving after trying for more
          than 1 year?
        </h3>
        <RadioField name='GYNAE8' label='GYNAE8' options={formOptions.GYNAE8} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns8' label='GYNAE8' />
        <PopupText qnNo='GYNAE8' triggerValue='Yes'>
          <h3>
            If so, are you keen to investigate for the cause of subfertility and to pursue fertility
            treatment?
          </h3>
          <RadioField name='GYNAE9' label='GYNAE9' options={formOptions.GYNAE9} />
        </PopupText>
        <h3>
          Do you have any urinary symptoms such as urinary leakage, recurrent urinary infection,
          urgency or nocturia?
        </h3>
        <RadioField name='GYNAE10' label='GYNAE10' options={formOptions.GYNAE10} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns10' label='GYNAE10' />
        <h3>Do you feel any lump in vagina or have any pelvic organ prolapse?</h3>
        <RadioField name='GYNAE11' label='GYNAE11' options={formOptions.GYNAE11} />
        <h4>Please specify:</h4>
        <LongTextField name='GYNAEShortAns11' label='GYNAE11' />
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

HxGynaeForm.contextType = FormContext

export default HxGynaeForm
