import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, LongTextField } from 'uniforms-mui'
import { RadioField } from 'uniforms-mui'
import { submitFormSpecial } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'

const schema = new SimpleSchema({
  wceQ1: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: false,
  },
  wceQ2: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: false,
  },
  wceQ3: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ4: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ5: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
  },
  wceQ6: {
    type: String,
    optional: true,
  },
  wceQ7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
})

const formName = 'wceForm'
const WceForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [hxCancer, setHxCancer] = useState({})
  const [hxFamily, setHxFamily] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regData = getSavedData(patientId, allForms.registrationForm)
    const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
    const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)
    const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)

    Promise.all([savedData, regData, hxSocialData, hxCancerData, hxFamilyData]).then((result) => {
      setSaveData(result[0])
      setReg(result[1])
      setHxSocial(result[2])
      setHxCancer(result[3])
      setHxFamily(result[4])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    wceQ1: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    wceQ2: [
      {
        label: '1 year ago or less',
        value: '1 year ago or less',
      },
      { label: 'More than 1 year to 2 years', value: 'More than 1 year to 2 years' },
      { label: 'More than 2 years to 3 years', value: 'More than 2 years to 3 years' },
      { label: 'More than 3 years to 4 years', value: 'More than 3 years to 4 years' },
      { label: 'More than 4 years to 5 years', value: 'More than 4 years to 5 years' },
      { label: 'More than 5 years', value: 'More than 5 years' },
      { label: 'Never been checked', value: 'Never been checked' },
    ],
    wceQ3: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    wceQ4: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    wceQ5: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    wceQ7: [
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
        const response = await submitFormSpecial(model, patientId, formName)
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
        <h1>WCE</h1>
        <h3>
          <span className='red'>1. For female respondent aged 40 and above only. </span>
          When was the last time you had your last mammogram?
        </h3>
        <p>(A mammogram is an x-ray of each breast to look for breast cancer.)</p>
        <RadioField name='wceQ1' label='WCE Q1' options={formOptions.wceQ1} />
        <h3>
          <span className='red'>
            2. For female respondent aged 25 and above, who have/had a husband/boyfriend and not had
            their womb completely surgically removed only.{' '}
          </span>
          When was the last time you had a PAP smear test?
        </h3>
        <p>
          (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the
          womb, to check for changes in the cells of your cervix, which may develop into cancer
          later.)
        </p>
        <RadioField name='wceQ2' label='WCE Q2' options={formOptions.wceQ2} />
        <h3>Completed Breast Self Examination station?</h3>
        <RadioField name='wceQ3' label='WCE Q3' options={formOptions.wceQ3} />
        <h3>Completed Cervical Education station?</h3>
        <RadioField name='wceQ4' label='WCE Q4' options={formOptions.wceQ4} />
        <h3>Indicated interest for HPV Test under SCS?</h3>
        <RadioField name='wceQ5' label='WCE Q5' options={formOptions.wceQ5} />
        <h3>Details of HPV Test (Date, Time)</h3>
        <p>
          <b>Write in this format:</b> 16th January, 2024 at 3pm
        </p>
        <LongTextField name='wceQ6' label='WCE Q6' />
        <h3>
          Is patient indicated for on-site testing? Please circle On-Site Testing on Form A as well
        </h3>
        <RadioField name='wceQ7' label='WCE Q7' options={formOptions.wceQ7} />
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
              <h2>Social Support</h2>
              <p className='underlined'>CHAS Status 社保援助计划:</p>
              {reg && reg.registrationQ12 ? (
                <p className='blue'>{reg.registrationQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Pioneer Generation Status 建国一代配套:</p>
              {reg && reg.registrationQ13 ? (
                <p className='blue'>{reg.registrationQ13}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <p className='underlined'>Patient on any other Government Financial Assistance, other than CHAS and PG:</p>
              {hxSocial && hxSocial.SOCIAL3 ? (
                <p className='blue'>{hxSocial.SOCIAL3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.SOCIALShortAns3 ? (
                <p className='blue'>{hxSocial.SOCIALShortAns3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <h2>Family History</h2>
              <p className='underlined'>Is there positive family history{' '}
              <span className='red'>(AMONG FIRST DEGREE RELATIVES)</span> for the following cancers?:</p>
              {hxFamily && hxFamily.FAMILY1 ? (
                <p className='blue'>{hxFamily.FAMILY1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Age of diagnosis:</p>
              {hxFamily && hxFamily.FAMILYShortAns1 ? (
                <p className='blue'>{hxFamily.FAMILYShortAns1}</p>
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

WceForm.contextType = FormContext

export default WceForm
