import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, BoolField } from 'uniforms-material'
import { RadioField, LongTextField } from 'uniforms-material'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@material-ui/core/Grid'
import { blueText, title, underlined } from '../theme/commonComponents'
import allForms from './forms.json'
import { blue } from '@material-ui/core/colors'

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
      <Fragment>
        <h2>Social Service Station</h2>
        1. Has the participant visited the social service station?
        <RadioField name='socialServiceQ1' label='Social Service Q1' />
        2. Brief summary of the participant&apos;s concerns
        <LongTextField name='socialServiceQ2' label='Social Service Q2' />
        3. Brief summary of what will be done for the participant (Eg name of scheme participant
        wants to apply for)
        <LongTextField name='socialServiceQ3' label='Social Service Q3' />
        5. Is follow-up required?
        <BoolField name='socialServiceQ4' />
        6. Brief summary of follow-up for the participant
        <LongTextField name='socialServiceQ5' label='Social Service Q5' />
        7. Completed application for HDB EASE?
        <BoolField name='socialServiceQ7' />
        8. Completed CHAS application?
        <BoolField name='socialServiceQ8' />
        9. If application is unsuccessful, document the reasons below and further follow-up action.
        <LongTextField name='socialServiceQ9' label='Social Service Q9' />
      </Fragment>
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
            <div>
              {title('Financial Status')}
              {underlined('CHAS Status')}
              {reg && reg.registrationQ8 ? blueText(reg.registrationQ8) : blueText('nil')}
              {underlined('Pioneer/ Merdeka Generation Status')}
              {reg && reg.registrationQ9 ? blueText(reg.registrationQ9) : blueText('nil')}
              {underlined('Is the participant on any Government Financial Assistance?')}
              {hxSocial && hxSocial.hxSocialQ1 ? blueText(hxSocial.hxSocialQ1) : blueText('nil')}
              {hxSocial && hxSocial.hxSocialQ2 ? blueText(hxSocial.hxSocialQ2) : blueText('no')}
              {underlined('Household Income Per Month')}
              {hxSocial && hxSocial.hxSocialQ3 ? blueText(hxSocial.hxSocialQ3) : blueText('nil')}
              {underlined('Number of Household Members (Including Participant)')}
              {hxSocial && hxSocial.hxSocialQ4 ? blueText(hxSocial.hxSocialQ4) : blueText('nil')}
              {underlined('Interest in CHAS Card Application')}
              {hxSocial && hxSocial.hxSocialQ5 ? blueText(hxSocial.hxSocialQ5) : blueText('nil')}
              {hxSocial && hxSocial.hxSocialQ6 ? blueText(hxSocial.hxSocialQ6) : blueText('nil')}
              {underlined(
                'Does the participant need advice on financial schemes in Singapore or financial assistance?',
              )}
              {hxSocial && hxSocial.hxSocialQ7 ? blueText(hxSocial.hxSocialQ7) : blueText('nil')}
              {hxSocial && hxSocial.hxSocialQ8 ? blueText(hxSocial.hxSocialQ8) : blueText('nil')}
              {title('Social Issues')}
              {underlined('Is the participant caring for a loved one')}
              {hxSocial && hxSocial.hxSocialQ9 ? blueText(hxSocial.hxSocialQ9) : blueText('nil')}
              {underlined('Does the participant require caregiver training?')}
              {hxSocial && hxSocial.hxSocialQ10 ? blueText(hxSocial.hxSocialQ10) : blueText('nil')}
              {underlined('Does the participant need assistance in caring for a loved one?')}
              {hxSocial && hxSocial.hxSocialQ11 ? blueText(hxSocial.hxSocialQ11) : blueText('nil')}
              {underlined('Does the participant require social support?')}
              {hxSocial && hxSocial.hxSocialQ12 ? blueText(hxSocial.hxSocialQ12) : blueText('nil')}
              {title('Referrals')}
              {underlined("Reasons for referral from Doctor's Consult:")}
              {doctorConsult && doctorConsult.doctorSConsultQ6
                ? blueText(doctorConsult.doctorSConsultQ6.toString())
                : blueText('nil')}
              {doctorConsult && doctorConsult.doctorSConsultQ6 && doctorConsult.doctorSConsultQ7
                ? blueText(doctorConsult.doctorSConsultQ7)
                : blueText('nil')}
              {underlined('Failed EBAS-DEP?')}
              {geriEbas && geriEbas.geriEbasDepQ10
                ? blueText(geriEbas.geriEbasDepQ10)
                : blueText('nil')}
              {underlined('Potential financial/ family difficulties?')}
              {geriEbas && geriEbas.geriEbasDepQ11
                ? blueText(geriEbas.geriEbasDepQ11)
                : blueText('nil')}
              {underlined('Reasons for referral from Geri-EBAS & AMT:')}
              {geriEbas && geriEbas.geriEbasDepQ12
                ? blueText(geriEbas.geriEbasDepQ12)
                : blueText('nil')}
              {underlined('Reasons for referral from OT consult')}
              {geriOt && geriOt.geriOtConsultQ5
                ? blueText(geriOt.geriOtConsultQ5)
                : blueText('nil')}
              {underlined('Reasons for referral from PT consult')}
              {geriPt && geriPt.geriPtConsultQ5
                ? blueText(geriPt.geriPtConsultQ5)
                : blueText('nil')}
              {underlined('Referred to Social Service for HDB EASE application?')}
              {underlined('Functional Assessment Report completed?')}
              {doctorConsult && doctorConsult.doctorSConsultQ12
                ? blueText(doctorConsult.doctorSConsultQ12.toString())
                : blueText('nil')}
              {underlined(
                "Participant signed up for SWCDC's Safe & Sustainable Homes (Geri Appointment)?",
              )}
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
