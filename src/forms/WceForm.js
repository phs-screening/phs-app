import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField } from 'uniforms-material'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import '../Snippet.css'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import allForms from './forms.json'
import { blueText } from '../theme/commonComponents'

const schema = new SimpleSchema({
  wceQ2: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: true,
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
})

const formName = 'wceForm'
const WceForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [hxCancer, setHxCancer] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regData = getSavedData(patientId, allForms.registrationForm)
    const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
    const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)

    Promise.all([savedData, regData, hxSocialData, hxCancerData]).then((result) => {
      setSaveData(result[0])
      setReg(result[1])
      setHxSocial(result[2])
      setHxCancer(result[3])
    })
  }, [])

  const formOptions = {
    wceQ2: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
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
        <h2>PARTICIPANT IDENTIFICATION</h2>
        <h3 className='red'>
          Please verify participant&apos;s identity using his/her
          <ol type='A'>
            <li>APP ID on wristband AND</li>
            <li>INITIALS </li>
          </ol>
        </h3>
        <h2>1. FINANCIAL STATUS</h2>
        <h4 className='red'>Please refer to page 1 of Form A for following questions.</h4>
        <h3>1. Current CHAS status?</h3>
        {reg && reg.registrationQ8 ? (
          <p className='blue'>{reg.registrationQ8}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h3>2. Pioneer / Merdeka Generation Card?</h3>
        {reg && reg.registrationQ9 ? (
          <p className='blue'>{reg.registrationQ9}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h3>
          3. Are you currently on any other Government Financial Assistance, other than CHAS and PG
          (e.g. Public Assistance Scheme)?
        </h3>
        {hxSocial && hxSocial.hxSocialQ1 ? (
          <p className='blue'>{hxSocial.hxSocialQ1}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        {hxSocial && hxSocial.hxSocialQ2 ? (
          <p className='blue'>{hxSocial.hxSocialQ2}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h2>2. CANCER SCREENING </h2>
        <h3>
          <span className='red'>1. For female respondent aged 40 and above only.</span>
          <br />
          When was the last time you had your last mammogram?
        </h3>
        <p className='increase-top-margin'>
          (A mammogram is an x-ray of each breast to look for breast cancer.)
        </p>
        {hxCancer && hxCancer.hxCancerQ7 ? (
          <p className='blue'>{hxCancer.hxCancerQ7}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h3>
          <span className='red'>
            2. For female respondent aged 25 and above, who have/had a husband/boyfriend and not had
            their womb completely surgically removed only.{' '}
          </span>
          <br />
          When was the last time you had a PAP smear test?
        </h3>
        <p className='increase-top-margin'>
          (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the
          womb, to check for changes in the cells of your cervix, which may develop into cancer
          later.)
        </p>
        {hxCancer && hxCancer.hxCancerQ8 ? (
          <p className='blue'>{hxCancer.hxCancerQ8}</p>
        ) : (
          <p className='blue'>nil</p>
        )}
        <h4 className='red'>
          For women:
          <ul>
            <li>40-49, advise yearly mammogram.</li>
            <li>50-69, advise mammogram every 2 years.</li>
            <li>70 and above and if interested, refer to WCE.</li>
          </ul>
          Please encourage participants to go for HPV test every 5 years. <br />
        </h4>
        <h2>3. FOLLOW UP PLAN</h2>
        <h3>1. Completed Breast Self Examination station?</h3>
        <RadioField name='wceQ2' label='WCE Q2' options={formOptions.wceQ2} />
        <h3>2. Completed Cervical Education station?</h3>
        <RadioField name='wceQ3' label='WCE Q3' options={formOptions.wceQ3} />
        <h3>3. Indicated interest for HPV Test under SCS?</h3>
        <RadioField name='wceQ4' label='WCE Q4' options={formOptions.wceQ4} />
        <h3>4. Indicated interest for Mammogram under SCS?</h3>
        <RadioField name='wceQ5' label='WCE Q5' options={formOptions.wceQ5} />
      </div>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <snippet-container>
      <Paper className='snippet-item' elevation={2} p={0} m={0}>
        {newForm()}
      </Paper>

      {/*<Paper className="snippet-item" elevation={2} p={0} m={0}>*/}
      {/*  <h2>Snippets appear here</h2>*/}
      {/*</Paper>*/}
    </snippet-container>
  )
}

WceForm.contextType = FormContext

export default function Wceform(props) {
  const navigate = useNavigate()

  return <WceForm {...props} navigate={navigate} />
}
