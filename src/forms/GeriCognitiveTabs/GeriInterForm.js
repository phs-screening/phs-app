import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import allForms from '../forms.json'

import { AutoForm, useField } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-mui'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB.js'
import '../fieldPadding.css'

const responses = [
  '1 - Hardly ever',
  '2 - Some of the time',
  '3 - Often',
]

const responsesValue = [
  { label: '1 - Hardly ever', value: '1 - Hardly ever' },
  { label: '2 - Some of the time', value: '2 - Some of the time' },
  { label: '3 - Often', value: '3 - Often' },
]

const schema = new SimpleSchema({
  InterQ1: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
  InterQ2: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
  InterQ3: {
    type: String,
    allowedValues: responses,
    optional: false,
  },
})

const formName = 'geriInterForm'

const geriInterForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  const [regi, setRegi] = useState({})

  const form_schema = new SimpleSchema2Bridge(schema)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData(savedData)

      const regiData = getSavedData(patientId, allForms.registrationForm)
      Promise.all([regiData]).then((result) => {
        setRegi(result[0])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

  const formOptions = {
    InterQ1: responsesValue,
    InterQ2: responsesValue,
    InterQ3: responsesValue,
  }

  const GetScore = () => {
    const [{ value: q1 }] = useField('InterQ1', {})
    const [{ value: q2 }] = useField('InterQ2', {})
    const [{ value: q3 }] = useField('InterQ3', {})

    let score = 0

    const points = {
      '1 - Hardly ever': 1,
      '2 - Some of the time': 2,
      '3 - Often': 3,
    }

    const questions = [q1, q2, q3]

    questions.forEach((qn) => {
      if (!qn) {
        return
      }
      score += points[qn]
    })

    return <p className='blue'>{score} / 9</p>
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
        <h1>INTERACTION</h1>
        <h3>How often do you feel that you lack companionship?</h3>
        <RadioField name='InterQ1' label='InterQ1' options={formOptions.InterQ1} />
        <h3>How often do you feel left out?</h3>
        <RadioField name='InterQ2' label='InterQ2' options={formOptions.InterQ2} />
        <h3>How often do you feel isolated from others? </h3>
        <RadioField name='InterQ3' label='InterQ3' options={formOptions.InterQ3} />
        <h3>Score:</h3>
        <GetScore />
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
              <p>Patient consented to being considered for participation in Long Term Follow-Up (LTFU)?
                (Patient has to sign and tick Form C)<br></br><strong>{regi.registrationQ19}</strong></p>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

geriInterForm.contextType = FormContext

export default geriInterForm
