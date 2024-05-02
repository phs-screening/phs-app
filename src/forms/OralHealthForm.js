import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, TextField } from 'uniforms-material'
import { BoolField } from 'uniforms-material'
import { submitForm, calculateBMI } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { title, underlined, blueText } from '../theme/commonComponents'
import { getSavedData } from '../services/mongoDB'
import allForms from './forms.json'
import './fieldPadding.css'

const schema = new SimpleSchema({
  oralHealthQ1: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  oralHealthQ2: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  oralHealthQ3: {
    type: String,
    optional: true,
  },
})

const formName = 'oralHealthForm'
const OralHealthForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState({})
  // forms to retrieve for side panel
  const [doctorConsult, setDoctorConsult] = useState({})
  const [hxSocial, sethxSocial] = useState({})
  const [hxHcsr, setHxHcsr] = useState({})
  const [geriOt, setGeriOt] = useState({})
  const [hxNss, setHxNss] = useState({})
  const [hxCancer, setHxCancer] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    const loadPastForms = async () => {
      const doctorsConsultData = getSavedData(patientId, allForms.doctorConsultForm)
      const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
      const hxHcsrData = getSavedData(patientId, allForms.hxHcsrForm)
      const geriOtData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
      const hxNssData = getSavedData(patientId, allForms.hxNssForm)
      const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)

      Promise.all([
        doctorsConsultData,
        hxSocialData,
        hxHcsrData,
        geriOtData,
        hxNssData,
        hxCancerData,
      ]).then((result) => {
        setDoctorConsult(result[0])
        sethxSocial(result[1])
        setHxHcsr(result[2])
        setGeriOt(result[3])
        setHxNss(result[4])
        setHxCancer(result[5])
      })

      isLoadingSidePanel(false)
    }
    setSaveData(savedData)
    loadPastForms()
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
        <h1>Oral Health</h1>
        <br />
        Will participant undergo follow-up by NUS Dentistry?
        <BoolField name='oralHealthQ1' />
        Completed Oral Health station. Please check that Form A is filled.
        <BoolField name='oralHealthQ2' />
        Notes:
        <TextField name='oralHealthQ3' />
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
              {title("Referral from Doctor's Consult ")}
              {underlined('Reasons for referral:')}
              {doctorConsult && doctorConsult.doctorSConsultQ8
                ? blueText(doctorConsult.doctorSConsultQ8.toString())
                : null}
              {doctorConsult ? blueText(doctorConsult.doctorSConsultQ9) : null}
              {title('Referral from History Taking ')}
              {underlined("Participant's Oral Health Brief Assessment:")}
              {hxSocial ? blueText(hxSocial.hxSocialQ13) : null}
              {hxSocial ? blueText(hxSocial.hxSocialQ15) : null}
              {underlined('Interest in Oral Health Screening: ')}
              {hxSocial ? blueText(hxSocial.hxSocialQ14) : null}
              {title('Health Concerns')}
              {underlined('Requires scrutiny by doctor? ')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ11) : null}
              {underlined('Summarised reasons for referral to Doctor Consultation')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ2) : null}
              {title('Systems Review')}
              {underlined('Requires scrutiny by doctor? ')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ12) : null}
              {underlined('Summarised systems review')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ3) : null}
              {title('Urinary/Faecal incontinence')}
              {underlined('Urinary/Faecal incontinence')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ4) : null}
              {hxHcsr && hxHcsr.hxHcsrQ5 ? blueText(hxHcsr.hxHcsrQ5) : null}
              {underlined('Urinary Incontinence or nocturia (at least 3 or more times at night)?')}
              {geriOt ? blueText(geriOt.geriOtQuestionnaireQ6) : null}
              {title('Vision problems')}
              {underlined('Vision Problems')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ6) : null}
              {hxHcsr && hxHcsr.hxHcsrQ7 ? blueText(hxHcsr.hxHcsrQ7) : null}
              {title('Hearing problems')}
              {underlined('Hearing Problems')}
              {hxHcsr ? blueText(hxHcsr.hxHcsrQ8) : null}
              {hxHcsr && hxHcsr.hxHcsrQ9 ? blueText(hxHcsr.hxHcsrQ9) : null}
              {title('Past Medical History')}
              {underlined('Summary of Relevant Past Medical History')}
              {hxNss && hxNss.hxNssQ12 ? blueText(hxNss.hxNssQ12) : blueText('nil')}
              {underlined('Drug allergies?')}
              {hxNss && hxNss.hxNssQ1 ? blueText(hxNss.hxNssQ1.toString()) : blueText('nil')}
              {hxNss && hxNss.hxNssQ2 ? blueText(hxNss.hxNssQ2.toString()) : blueText('nil')}
              {underlined('Currently on any alternative medicine?')}
              {hxNss && hxNss.hxNssQ9 ? blueText(hxNss.hxNssQ9.toString()) : blueText('nil')}
              {hxNss && hxNss.hxNssQ10 ? blueText(hxNss.hxNssQ10.toString()) : blueText('nil')}
              {title('Smoking History')}
              {underlined('Smoking frequency')}
              {hxNss ? blueText(hxNss.hxNssQ14) : null}
              {underlined('Pack years:')}
              {hxNss ? blueText(hxNss.hxNssQ3) : null}
              {title('Alcohol history')}
              {underlined('Alcohol consumption')}
              {hxNss ? blueText(hxNss.hxNssQ15) : null}
              {title('Family History')}
              {hxCancer && hxCancer.hxCancerQ10 ? blueText(hxCancer.hxCancerQ10) : null}
              {title('Blood Pressure')}
              {underlined('Requires scrutiny by doctor?')}
              {hxCancer && hxCancer.hxCancerQ27 ? blueText(hxCancer.hxCancerQ27) : null}
              {underlined('Dizziness on standing up from a seated or laid down position?')}
              {geriOt && geriOt.geriOtQuestionnaireQ5
                ? blueText(geriOt.geriOtQuestionnaireQ5)
                : null}
              {underlined('Average Blood Pressure')}
              {hxCancer ? blueText('Average Reading Systolic: ' + hxCancer.hxCancerQ17) : null}
              {hxCancer ? blueText('Average Reading Diastolic: ' + hxCancer.hxCancerQ18) : null}
              {title('BMI')}
              {underlined('Requires scrutiny by doctor?')}
              {hxCancer && hxCancer.hxCancerQ23
                ? blueText(hxCancer.hxCancerQ23.toString())
                : blueText('no')}
              {underlined('BMI')}
              {hxCancer ? blueText('Height: ' + hxCancer.hxCancerQ19 + 'cm') : null}
              {hxCancer ? blueText('Weight: ' + hxCancer.hxCancerQ20 + 'kg') : null}
              {hxCancer && hxCancer.hxCancerQ19 && hxCancer.hxCancerQ20
                ? blueText('BMI: ' + calculateBMI(hxCancer.hxCancerQ19, hxCancer.hxCancerQ20))
                : null}
              {underlined('Waist circumference (cm)')}
              {hxCancer ? blueText(hxCancer.hxCancerQ24) : null}
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

OralHealthForm.contextType = FormContext

export default function OralHealthform(props) {
  const navigate = useNavigate()

  return <OralHealthForm {...props} navigate={navigate} />
}
