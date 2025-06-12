import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB.js'
import allForms from '../forms.json'
import '../fieldPadding.css'

const dayRangeFormOptions = [
  { label: '0 - Not at all', value: '0 - Not at all' },
  { label: '1 - Several days', value: '1 - Several days' },
  { label: '2 - More than half the days', value: '2 - More than half the days' },
  { label: '3 - Nearly everyday', value: '3 - Nearly everyday' },
]

const schema = new SimpleSchema({
  SAMH1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  SAMH2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

const formName = 'mentalHealthForm'

const MentalHealthForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})

  const [regi, setReg] = useState({})
  const [phq, setPHQ] = useState({})

  const form_schema = new SimpleSchema2Bridge(schema)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)

      const regData = getSavedData(patientId, allForms.registrationForm)
      // const docData = getSavedData(patientId, allForms.triageForm)
      const phqData = getSavedData(patientId, allForms.geriPhqForm)

      Promise.all([regData, phqData]).then((result) => {
        setReg(result[0]),
          // setHxFamily(result[1])
          setPHQ(result[1])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

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
    PHQ11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SAMH1: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
    ],
    SAMH2: [
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
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
        isLoading(false)
      }}
      model={saveData}
    >
      <div className='form--div'>
        <h3>Patient has attended mental health consultation?</h3>
        <RadioField name='SAMH1' label='SAMH1' options={formOptions.SAMH1} />
        <h3>Patient has signed up for follow-up with SAMH?</h3>
        <RadioField name='SAMH2' label='SAMH2' options={formOptions.SAMH2} />
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
          width='30%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Patient Info</h2>
              {regi && regi.registrationQ4 ? (
                <p className='blue'>Age: {regi.registrationQ4}</p>
              ) : (
                <p className='blue'>Age: nil</p>
              )}

              <p className='blue'>DOC11: UNKNOWN DATA</p>

              <p className='blue'>DOC12: UNKNOWN DATA</p>

              <p className='blue'>PHQ Score: {phq.PHQ10}</p>

              <p className='underlined'>Would the patient benefit from counselling:</p>
              <p className='blue'>{phq.PHQ11},</p>
              <p className='blue'>{phq.PHQShortAns11}</p>


            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

MentalHealthForm.contextType = FormContext

export default MentalHealthForm
