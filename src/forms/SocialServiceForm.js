import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, BoolField } from 'uniforms-material'
import { RadioField, LongTextField } from 'uniforms-material'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@mui/material/Grid'
import { blueText, title, underlined } from '../theme/commonComponents'
import allForms from './forms.json'
import { blue } from '@mui/material/colors'

const schema = new SimpleSchema({
  socialServiceQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  socialServiceQ2: {
    type: String,
    optional: false,
  },
  socialServiceQ3: {
    type: String,
    optional: false,
  },
  socialServiceQ4: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  socialServiceQ5: {
    type: String,
    optional: true,
  },
  socialServiceQ7: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  socialServiceQ8: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  socialServiceQ9: {
    type: String,
    optional: true,
  },
})

const formName = 'socialServiceForm'
const SocialServiceForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [doctorConsult, setDoctorConsult] = useState({})
  const [geriEbas, setGeriEbas] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [geriPt, setGeriPt] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regData = getSavedData(patientId, allForms.registrationForm)
    const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
    const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
    const geriEbasDepData = getSavedData(patientId, allForms.geriEbasDepForm)
    const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
    const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)

    Promise.all([
      savedData,
      regData,
      hxSocialData,
      doctorConsultData,
      geriEbasDepData,
      geriOtData,
      geriPtData,
    ]).then((result) => {
      setSaveData(result[0])
      setReg(result[1])
      setHxSocial(result[2])
      setDoctorConsult(result[3])
      setGeriEbas(result[4])
      setGeriOt(result[5])
      setGeriPt(result[6])
      isLoadingSidePanel(false)
    })
  }, [])

  const formOptions = {
    socialServiceQ1: [
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
        <h1>Social Service Station</h1>
        <h3>1. Has the participant visited the social service station?</h3>
        <RadioField
          name='socialServiceQ1'
          label='Social Service Q1'
          options={formOptions.socialServiceQ1}
        />
        <h3>2. Brief summary of the participant&apos;s concerns</h3>
        <LongTextField name='socialServiceQ2' label='Social Service Q2' />
        <h3>
          3. Brief summary of what will be done for the participant (Eg name of scheme participant
          wants to apply for)
        </h3>
        <LongTextField name='socialServiceQ3' label='Social Service Q3' />
        <h3>5. Is follow-up required?</h3>
        <BoolField name='socialServiceQ4' />
        <h3>6. Brief summary of follow-up for the participant</h3>
        <LongTextField name='socialServiceQ5' label='Social Service Q5' />
        <h3>7. Completed application for HDB EASE?</h3>
        <BoolField name='socialServiceQ7' />
        <h3>8. Completed CHAS application?</h3>
        <BoolField name='socialServiceQ8' />
        <h3>
          9. If application is unsuccessful, document the reasons below and further follow-up
          action.
        </h3>
        <LongTextField name='socialServiceQ9' label='Social Service Q9' />
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
          width='50%'
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? (
            <CircularProgress />
          ) : (
            <div className='summary--question-div'>
              <h2>Financial Status</h2>
              <p className='underlined'>CHAS Status</p>
              {reg && reg.registrationQ8 ? (
                <p className='blue'>{reg.registrationQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Pioneer/ Merdeka Generation Status</p>
              {reg && reg.registrationQ9 ? (
                <p className='blue'>{reg.registrationQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Is the participant on any Government Financial Assistance?
              </p>
              {hxSocial && hxSocial.hxSocialQ1 ? (
                <p className='blue'>{hxSocial.hxSocialQ1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.hxSocialQ2 ? (
                <p className='blue'>{hxSocial.hxSocialQ2}</p>
              ) : (
                <p className='blue'>no</p>
              )}
              <p className='underlined'>Household Income Per Month</p>
              {hxSocial && hxSocial.hxSocialQ3 ? (
                <p className='blue'>{hxSocial.hxSocialQ3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Number of Household Members (Including Participant)</p>
              {hxSocial && hxSocial.hxSocialQ4 ? (
                <p className='blue'>{hxSocial.hxSocialQ4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Interest in CHAS Card Application</p>
              {hxSocial && hxSocial.hxSocialQ5 ? (
                <p className='blue'>{hxSocial.hxSocialQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.hxSocialQ6 ? (
                <p className='blue'>{hxSocial.hxSocialQ6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Does the participant need advice on financial schemes in Singapore or financial
                assistance?
              </p>
              {hxSocial && hxSocial.hxSocialQ7 ? (
                <p className='blue'>{hxSocial.hxSocialQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.hxSocialQ8 ? (
                <p className='blue'>{hxSocial.hxSocialQ8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Social Issues</h2>
              <p className='underlined'>Is the participant caring for a loved one</p>
              {hxSocial && hxSocial.hxSocialQ9 ? (
                <p className='blue'>{hxSocial.hxSocialQ9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Does the participant require caregiver training?</p>
              {hxSocial && hxSocial.hxSocialQ10 ? (
                <p className='blue'>{hxSocial.hxSocialQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Does the participant need assistance in caring for a loved one?
              </p>
              {hxSocial && hxSocial.hxSocialQ11 ? (
                <p className='blue'>{hxSocial.hxSocialQ11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Does the participant require social support?</p>
              {hxSocial && hxSocial.hxSocialQ12 ? (
                <p className='blue'>{hxSocial.hxSocialQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />
              <h2>Referrals</h2>
              <p className='underlined'>Reasons for referral from Doctor&apos;s Consult:</p>
              {doctorConsult && doctorConsult.doctorSConsultQ6 ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ6.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {doctorConsult && doctorConsult.doctorSConsultQ6 && doctorConsult.doctorSConsultQ7 ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Failed EBAS-DEP?</p>
              {geriEbas && geriEbas.geriEbasDepQ10 ? (
                <p className='blue'>{geriEbas.geriEbasDepQ10}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Potential financial/ family difficulties?</p>
              {geriEbas && geriEbas.geriEbasDepQ11 ? (
                <p className='blue'>{geriEbas.geriEbasDepQ11}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Reasons for referral from Geri-EBAS & AMT:</p>
              {geriEbas && geriEbas.geriEbasDepQ12 ? (
                <p className='blue'>{geriEbas.geriEbasDepQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Reasons for referral from OT consult</p>
              {geriOt && geriOt.geriOtConsultQ5 ? (
                <p className='blue'>{geriOt.geriOtConsultQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Reasons for referral from PT consult</p>
              {geriPt && geriPt.geriPtConsultQ5 ? (
                <p className='blue'>{geriPt.geriPtConsultQ5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Referred to Social Service for HDB EASE application?</p>
              <p className='underlined'>Functional Assessment Report completed?</p>
              {doctorConsult && doctorConsult.doctorSConsultQ12 ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ12.toString()}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Participant signed up for SWCDC&apos;s Safe & Sustainable Homes (Geri Appointment)?
              </p>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

SocialServiceForm.contextType = FormContext

export default function SeocialServiceform(props) {
  const navigate = useNavigate()

  return <SocialServiceForm {...props} navigate={navigate} />
}
