import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { SelectField, RadioField, BoolField } from 'uniforms-material'
import PopupText from 'src/utils/popupText'
import { calculateBMI, calculateSppbScore, submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import Grid from '@material-ui/core/Grid'
import { blueText, title, underlined } from '../theme/commonComponents'
import allForms from './forms.json'

const schema = new SimpleSchema({
  // geriGeriApptQ1: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ2: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ3: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  //},
  // Q1 - 3 missing
  geriGeriApptQ5: {
    type: Boolean,
    label: 'Done',
    optional: true,
  },
  geriGeriApptQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriGeriApptQ13: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
  geriGeriApptQ15: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: true,
  },
})

// TODO: Delete this file as Geri appt form is removed
const formName = 'geriGeriApptForm'
const GeriGeriApptForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [geriVision, setGeriVision] = useState({})
  const [geriEbas, setGeriEbas] = useState({})
  const [geriPt, setGeriPt] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [geriPhysical, setGeriPhysical] = useState({})
  useEffect(async () => {
    const savedData = getSavedData(patientId, formName)
    const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
    const geriEbasData = getSavedData(patientId, allForms.geriEbasDepForm)
    const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)
    const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
    const geriPhysicalData = getSavedData(patientId, allForms.geriPhysicalActivityLevelForm)
    Promise.all([
      savedData,
      geriVisionData,
      geriEbasData,
      geriPtData,
      geriOtData,
      geriPhysicalData,
    ]).then((result) => {
      setSaveData(result[0])
      setGeriVision(result[1])
      setGeriEbas(result[2])
      setGeriPt(result[3])
      setGeriOt(result[4])
      setGeriPhysical(result[5])

      isLoadingSidePanel(false)
    })
  }, [])
  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const response = await submitForm(model, patientId, formName)
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
        <h2>Geriatrics Appointment</h2>
        <br />
        Participant (aged 60-64 years old, inclusive) referred to Doctor&apos;s Consult for
        Functional Assessment Report completion?
        <RadioField name='geriGeriApptQ11' label='Geri - Geri Appt Q11' />
        <br />
        To be referred to Social Service for HDB EASE application?
        <RadioField name='geriGeriApptQ13' label='Geri - Geri Appt Q13' />
        <br />
        <Fragment>
          <h3>If participant is recommended for social support:</h3>
          Are pages 1-2 of SACS referral form filled up for the participant?
          <RadioField name='geriGeriApptQ15' label='Geri - Geri Appt Q15' />
          Persuade participant to go to social support booth and explain that AIC can help
          <BoolField name='geriGeriApptQ5' />
        </Fragment>
        <br />
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
              {title('SWCDC Eye Vouchers')}
              {underlined('Type of vision error:')}
              {geriVision ? blueText(geriVision.geriVisionQ8) : blueText('nil')}
              {title('Social Service')}
              {underlined('Referred to Social Service from Geri EBAS:')}
              {geriEbas ? blueText(geriEbas.geriEbasDepQ11) : blueText('nil')}
              {underlined('Reasons for referral:')}
              {geriEbas ? blueText(geriEbas.geriEbasDepQ12) : blueText('nil')}
              {underlined('Referred to Social Service (PT):')}
              {geriPt ? blueText(geriPt.geriPtConsultQ4) : blueText('nil')}
              {underlined('Reasons for referral:')}
              {geriPt ? blueText(geriPt.geriPtConsultQ5) : blueText('nil')}
              {underlined('Referred to Social Service (OT):')}
              {geriOt ? blueText(geriOt.geriOtConsultQ4) : blueText('nil')}
              {underlined('Reasons for referral:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ5) : blueText('nil')}
              {underlined('Programmes recommended by OT:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ6) : blueText('nil')}
              {underlined('Referred for HDB EASE Sign-Up:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ7) : blueText('nil')}
              {underlined('Reasons for referral:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ8) : blueText('nil')}
              {underlined('Indications for SWCDC S&S homes:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ9) : blueText('nil')}
              {underlined('Comments:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ10) : blueText('nil')}
              {title("Doctor's Consult")}
              {underlined("Reasons for referral to Doctor's Consult (PT):")}
              {geriPt ? blueText(geriPt.geriPtConsultQ3) : blueText('nil')}
              {underlined('Number of falls in past 1 year:')}
              {geriPhysical ? blueText(geriPhysical.geriPhysicalActivityLevelQ8) : blueText('nil')}
              {underlined('Were any of the falls injurious?')}
              {geriPhysical ? blueText(geriPhysical.geriPhysicalActivityLevelQ9) : blueText('nil')}
              {underlined("Referred to Doctor's Consult (OT):")}
              {geriOt ? blueText(geriOt.geriOtConsultQ2) : blueText('nil')}
              {underlined('Reasons for referral:')}
              {geriOt ? blueText(geriOt.geriOtConsultQ3) : blueText('nil')}
              {geriVision ? blueText(geriVision.geriVisionQ9) : blueText('nil')}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

GeriGeriApptForm.contextType = FormContext

export default function HxCancerform(props) {
  const navigate = useNavigate()

  return <GeriGeriApptForm {...props} navigate={navigate} />
}
