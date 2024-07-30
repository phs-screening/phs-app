import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, BoolField } from 'uniforms-mui'
import { RadioField, LongTextField } from 'uniforms-mui'
import { submitFormSpecial } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@mui/material/Grid'
import allForms from './forms.json'

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
  const [geriVision, setVision] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [geriPt, setGeriPt] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const regData = getSavedData(patientId, allForms.registrationForm)
    const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
    const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
    const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
    const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
    const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)

    Promise.all([
      savedData,
      regData,
      hxSocialData,
      doctorConsultData,
      geriVisionData,
      geriOtData,
      geriPtData,
    ]).then((result) => {
      setSaveData(result[0])
      setReg(result[1])
      setHxSocial(result[2])
      setDoctorConsult(result[3])
      setVision(result[4])
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
              <h2>Referrals</h2>
              <p className='underlined'>Referred to Social Services from Doctor&apos;s Consult?</p>
              {doctorConsult ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ6 ? "Yes" : "No"}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {doctorConsult && doctorConsult.doctorSConsultQ6 && doctorConsult.doctorSConsultQ7 ? (
                <p className='blue'>{doctorConsult.doctorSConsultQ7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <h2>Financial Status</h2>
              <p className='underlined'>CHAS Status</p>
              {reg && reg.registrationQ12 ? (
                <p className='blue'>{reg.registrationQ12}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Pioneer/ Merdeka Generation Status</p>
              {reg && reg.registrationQ13 ? (
                <p className='blue'>{reg.registrationQ13}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Is the participant on any other Government Financial Assistance, other than CHAS and PG
                (e.g. Public Assistance Scheme)
              </p>
              {hxSocial && hxSocial.SOCIAL3 ? (
                <p className='blue'>{hxSocial.SOCIAL3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.SOCIALShortAns3 ? (
                <p className='blue'>{hxSocial.SOCIALShortAns3}</p>
              ) : (
                <p className='blue'>no</p>
              )}
              <p className='underlined'>Average Household Income Per Month</p>
              {hxSocial && hxSocial.SOCIAL4 ? (
                <p className='blue'>{hxSocial.SOCIAL4}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Number of Household Members (Including Participant)</p>
              {hxSocial && hxSocial.SOCIAL5 ? (
                <p className='blue'>{hxSocial.SOCIAL5}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Interest in CHAS Card Application</p>
              {hxSocial && hxSocial.SOCIAL6 ? (
                <p className='blue'>{hxSocial.SOCIAL6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.SOCIALShortAns6 ? (
                <p className='blue'>{hxSocial.SOCIALShortAns6}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>
                Does the participant need advice on financial schemes in Singapore or financial
                assistance?
              </p>
              {hxSocial && hxSocial.SOCIAL7 ? (
                <p className='blue'>{hxSocial.SOCIAL7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.SOCIALShortAns7 ? (
                <p className='blue'>{hxSocial.SOCIALShortAns7}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <Divider />

              <h2>Social Issues</h2>
              <p className='underlined'>Is the participant caring for a loved one</p>
              {hxSocial && hxSocial.SOCIAL8 ? (
                <p className='blue'>{hxSocial.SOCIAL8}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Do the participant feel equipped to provide care to their loved one?</p>
              {hxSocial && hxSocial.SOCIAL9 ? (
                <p className='blue'>{hxSocial.SOCIAL9}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {/* <p className='underlined'>
                Does the participant need assistance in caring for a loved one?
              </p>
              {hxSocial && hxSocial.SOCIAL31 ? (
                <p className='blue'>{hxSocial.SOCIAL31}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Does the participant require social support?</p>
              {hxSocial && hxSocial.SOCIAL32 ? (
                <p className='blue'>{hxSocial.SOCIAL32}</p>
              ) : (
                <p className='blue'>nil</p>
              )} */}
              <Divider />

              {
                geriVision ? (
                  <>
                    <p className='underlined'>Is participant currently on any eye review/ consulting any eye specialist?</p>
                    <p className='blue'>{geriVision.geriVisionQ10}</p>
                    <p className='blue'>{geriVision.geriVisionQ11}</p>
                  </>
                ) : <p className='red'>nil geriVision data!</p>
              }
              <Divider />

              <p className='underlined'>Referral from PT consult?</p>
              {geriPt && geriPt.geriPtConsultQ4 ? (
                <>
                <p className='blue'>{geriPt.geriPtConsultQ4}</p>
                <p className='blue'>{geriPt.geriPtConsultQ5}</p>
                </>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Referral from OT consult?</p>
              {geriOt && geriOt.geriOtConsultQ4 ? (
                <>
                <p className='blue'>{geriOt.geriOtConsultQ4}</p>
                <p className='blue'>{geriOt.geriOtConsultQ5}</p>
                </>
              ) : (
                <p className='blue'>nil</p>
              )}
              
              {
                geriOt ? (
                  <>
                    <p className='underlined'>Recommended programme for participant</p>
                    <p className='blue'>{geriOt.geriOtConsultQ6}</p>

                    <p className='underlined'>Is participant eligible for HDB EASE?</p>
                    <p className='blue'>{geriOt.geriOtConsultQ7}</p>

                    <p className='underlined'>Does participant wish to sign up for HDB EASE?</p>
                    <p className='blue'>{geriOt.geriOtConsultQ8}</p>

                    <p className='underlined'>Functional Assessment Report completed & given to participant?</p>
                    <p className='blue'>{geriOt.geriOtConsultQ9}</p>
                  </>
                ) : <p className='red'>nil geriOt data!</p>
              }
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
