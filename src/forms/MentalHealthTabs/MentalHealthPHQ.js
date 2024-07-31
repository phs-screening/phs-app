import React, { Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm, useField } from 'uniforms'
import { SubmitField, ErrorsField, NumField } from 'uniforms-mui'
import { RadioField, LongTextField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import PopupText from 'src/utils/popupText'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
]

const dayRangeFormOptions = [
  { label: '0 - Not at all', value: '0 - Not at all' },
  { label: '1 - Several days', value: '1 - Several days' },
  { label: '2 - More than half the days', value: '2 - More than half the days' },
  { label: '3 - Nearly everyday', value: '3 - Nearly everyday' },
]

const schema = new SimpleSchema({
  PHQ1: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ2: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ3: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ4: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ5: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ6: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ7: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ8: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQ9: {
    type: String,
    allowedValues: dayRange,
    optional: false,
  },
  PHQextra9: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PHQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  PHQShortAns11: {
    type: String,
    optional: true,
  },
})

//const formName = 'mentalPhqForm'
const formName = 'geriPhqForm' // this is the Hx form but the summary is reference from geriPhqForm

const MentalPhqForm = (props) => {
  const [loading, setLoading] = useState(false)
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})

  let score = 0

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)
    }
    fetchData()
  }, [patientId])

  const formOptions = {
    PHQ1: dayRangeFormOptions,
    PHQ2: dayRangeFormOptions,
    PHQ3: dayRangeFormOptions,
    PHQ4: dayRangeFormOptions,
    PHQ5: dayRangeFormOptions,
    PHQ6: dayRangeFormOptions,
    PHQ7: dayRangeFormOptions,
    PHQ8: dayRangeFormOptions,
    PHQ9: dayRangeFormOptions,
    PHQextra9: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
    PHQ11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      {
        label: 'No',
        value: 'No',
      },
    ],
  }

  const GetScore = () => {
    const [{ value: q1 }] = useField('PHQ1', {})
    const [{ value: q2 }] = useField('PHQ2', {})
    const [{ value: q3 }] = useField('PHQ3', {})
    const [{ value: q4 }] = useField('PHQ4', {})
    const [{ value: q5 }] = useField('PHQ5', {})
    const [{ value: q6 }] = useField('PHQ6', {})
    const [{ value: q7 }] = useField('PHQ7', {})
    const [{ value: q8 }] = useField('PHQ8', {})
    const [{ value: q9 }] = useField('PHQ9', {})

    const points = {
      '0 - Not at all': 0,
      '1 - Several days': 1,
      '2 - More than half the days': 2,
      '3 - Nearly everyday': 3,
    }

    const questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9]

    /*questions.forEach((qn) => {
      while (qn) {
        score += points[qn]
        break
      }
    })*/

    score =
      points[q1] +
      points[q2] +
      points[q3] +
      points[q4] +
      points[q5] +
      points[q6] +
      points[q7] +
      points[q8] +
      points[q9]

    if (score >= 10) {
      return (
        <Fragment>
          <p className='blue'>{score} / 27</p>
          <font color='red'>
            <b>Patient fails PHQ, score is 10 and above </b>
          </font>{' '}
          <br />
        </Fragment>
      )
    } else {
      return <p className='blue'>{score} / 27</p>
    }
  }

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        setLoading(true)

        model.PHQ10 = score //update score

        const responseGeriPHQ = await submitForm(model, patientId, formName)
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          const event = null // not interested in this value
          setLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            changeTab(event, nextTab)
          }, 80)
        } else {
          setLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h2>**When asking these questions, please let patient know that it can be sensitive**</h2>
        <br />
        <h2>
          Over the last 2 weeks, how often have you been bothered by any of the following problems?
        </h2>
        <h3>1. Little interest or pleasure in doing things</h3>
        <RadioField name='PHQ1' label='PHQ1' options={formOptions.PHQ1} />
        <h3>2. Feeling down, depressed or hopeless</h3>
        <RadioField name='PHQ2' label='PHQ2' options={formOptions.PHQ2} />
        <h3>3. Trouble falling asleep or staying asleep, or sleeping too much</h3>
        <RadioField name='PHQ3' label='PHQ3' options={formOptions.PHQ3} />
        <h3>4. Feeling tired or having little energy</h3>
        <RadioField name='PHQ4' label='PHQ4' options={formOptions.PHQ4} />
        <h3>5. Poor appetite or overeating</h3>
        <RadioField name='PHQ5' label='PHQ5' options={formOptions.PHQ5} />
        <h3>
          6. Feeling bad about yourself, or that you are a failure or have let yourself or your
          family down
        </h3>
        <RadioField name='PHQ6' label='PHQ6' options={formOptions.PHQ6} />
        <h3>7. Trouble concentrating on things, such as reading the newspaper or television</h3>
        <RadioField name='PHQ7' label='PHQ7' options={formOptions.PHQ7} />
        <h3>
          8. Moving or speaking so slowly that other people have noticed? Or the opposite, being so
          fidgety or restless that you have been moving around a lot more than usual
        </h3>
        <RadioField name='PHQ8' label='PHQ8' options={formOptions.PHQ8} />
        <h3>9. Thoughts that you would be better off dead or hurting yourself in some way</h3>
        <RadioField name='PHQ9' label='PHQ9' options={formOptions.PHQ9} />
        <PopupText
          qnNo='PHQ9'
          triggerValue={['1 - Several days', '2 - More than half the days', '3 - Nearly everyday']}
        >
          <h3>*Do you want to take your life now?*</h3>
          <RadioField name='PHQextra9' label='PHQextra9' options={formOptions.PHQextra9} />
        </PopupText>
        <PopupText qnNo='PHQextra9' triggerValue='Yes'>
          <font color='red'>
            <b>*Patient requires urgent attention, please escalate*</b>
          </font>{' '}
        </PopupText>
        <h3>Score:</h3>
        <GetScore />
        <h3>Do you feel like the patient will benefit from counselling? Specify why.</h3>
        <RadioField name='PHQ11' label='PHQ11' options={formOptions.PHQ11} />
        <h4>Please specify.</h4>
        <LongTextField name='PHQShortAns11' label='PHQ11' />
        <br />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

MentalPhqForm.contextType = FormContext

export default MentalPhqForm
