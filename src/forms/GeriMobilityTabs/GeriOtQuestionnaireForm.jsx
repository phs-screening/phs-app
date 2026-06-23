import React, { useContext, useEffect, useState } from 'react'
import { FastField, Formik, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { Paper, CircularProgress, Button, Grid } from '@mui/material'

import allForms from '../forms.json'
import { formatBmi, submitForm } from '../../api/api.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import CustomNumberField from '../../components/form-components/CustomNumberField'
import ErrorNotification from '../../components/form-components/ErrorNotification'

const formName = 'geriOtQuestionnaireForm'

const YesNo = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
]

const formOptions = {
  geriOtQuestionnaireQ1: YesNo,
  geriOtQuestionnaireQ2: YesNo,
  geriOtQuestionnaireQ3: YesNo,
  geriOtQuestionnaireQ4: YesNo,
  geriOtQuestionnaireQ5: YesNo,
  geriOtQuestionnaireQ6: [
    ...YesNo,
    {
      label: 'NA (client uses wheelchair constantly)',
      value: 'NA (client uses wheelchair constantly)',
    },
  ],
  geriOtQuestionnaireQ7: YesNo,
  geriOtQuestionnaireQ8: YesNo,
  geriOtQuestionnaireQ9: [
    ...YesNo,
    {
      label: 'NA (nil kerbs and steps - new BTO building)',
      value: 'NA (nil kerbs and steps - new BTO building)',
    },
  ],
  geriOtQuestionnaireQ11: [
    ...YesNo,
    {
      label: 'NA (client uses commode constantly)',
      value: 'NA (client uses commode constantly)',
    },
  ],
  geriOtQuestionnaireQ12: [
    ...YesNo,
    {
      label: 'NA (does not use bathtub, uses shower)',
      value: 'NA (does not use bathtub, uses shower)',
    },
  ],
  geriOtQuestionnaireQ13: [
    ...YesNo,
    {
      label: 'NA (nil shower at home, uses bathtub)',
      value: 'NA (nil shower at home, uses bathtub)',
    },
  ],
  geriOtQuestionnaireQ14: YesNo,
  geriOtQuestionnaireQ15: YesNo,
  geriOtQuestionnaireQ16: YesNo,
  geriOtQuestionnaireQ18: YesNo,
  geriOtQuestionnaireQ19: YesNo,
  geriOtQuestionnaireQ20: [
    ...YesNo,
    {
      label: 'NA (no steps / stairs at home - including toilet - new BTO building)',
      value: 'NA (no steps / stairs at home - including toilet - new BTO building)',
    },
  ],
  geriOtQuestionnaireQ21: [
    ...YesNo,
    {
      label: 'NA (nil steps / kerbs at entrance)',
      value: 'NA (nil steps / kerbs at entrance)',
    },
  ],
  geriOtQuestionnaireQ22: [
    ...YesNo,
    {
      label: 'NA (nil steps at home, lift landing, does not climb stairs)',
      value: 'NA (nil steps at home, lift landing, does not climb stairs)',
    },
  ],
  geriOtQuestionnaireQ23: [
    ...YesNo,
    {
      label: 'NA (nil steps at home, lift landing, does not climb stairs)',
      value: 'NA (nil steps at home, lift landing, does not climb stairs)',
    },
  ],
  geriOtQuestionnaireQ24: YesNo,
  geriOtQuestionnaireQ25: [
    ...YesNo,
    {
      label: 'NA (nil garden, path, corridor walkway)',
      value: 'NA (nil garden, path, corridor walkway)',
    },
  ],
  geriOtQuestionnaireQ26: YesNo,
  geriOtQuestionnaireQ27: [
    ...YesNo,
    {
      label: 'NA (nil pets / animals at home)',
      value: 'NA (nil pets / animals at home)',
    },
  ],
}

const validationSchema = Yup.object({
  geriOtQuestionnaireQ1: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ1.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ2: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ2.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ3: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ3.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ4: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ4.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ5: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ5.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ6: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ6.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ7: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ7.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ8: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ8.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ9: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ9.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ10: Yup.string(),
  geriOtQuestionnaireQ11: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ11.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ12: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ12.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ13: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ13.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ14: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ14.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ15: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ15.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ16: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ16.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ17: Yup.string(),
  geriOtQuestionnaireQ18: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ18.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ19: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ19.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ20: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ20.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ21: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ21.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ22: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ22.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ23: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ23.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ24: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ24.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ25: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ25.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ26: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ26.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ27: Yup.string()
    .oneOf(formOptions.geriOtQuestionnaireQ27.map((opt) => opt.value))
    .required(),
  geriOtQuestionnaireQ28: Yup.string(),
  geriOtQuestionnaireQ33: Yup.string(),
})

const generateInitialValues = () => {
  const values = {}
  for (let i = 1; i <= 33; i++) {
    values[`geriOtQuestionnaireQ${i}`] = ''
  }
  return values
}

const calculateScores = (values) => {
  const keys = [
    'geriOtQuestionnaireQ1',
    'geriOtQuestionnaireQ2',
    'geriOtQuestionnaireQ3',
    'geriOtQuestionnaireQ4',
    'geriOtQuestionnaireQ5',
    'geriOtQuestionnaireQ6',
    'geriOtQuestionnaireQ7',
    'geriOtQuestionnaireQ8',
    'geriOtQuestionnaireQ9',
    'geriOtQuestionnaireQ11',
    'geriOtQuestionnaireQ12',
    'geriOtQuestionnaireQ13',
    'geriOtQuestionnaireQ14',
    'geriOtQuestionnaireQ15',
    'geriOtQuestionnaireQ16',
    'geriOtQuestionnaireQ18',
    'geriOtQuestionnaireQ19',
    'geriOtQuestionnaireQ20',
    'geriOtQuestionnaireQ21',
    'geriOtQuestionnaireQ22',
    'geriOtQuestionnaireQ23',
    'geriOtQuestionnaireQ24',
    'geriOtQuestionnaireQ25',
    'geriOtQuestionnaireQ26',
    'geriOtQuestionnaireQ27',
  ]
  let yes = 0,
    no = 0,
    na = 0,
    total = ''
  keys.forEach((key) => {
    const val = (values[key] || '').toLowerCase().trim()
    if (val.startsWith('yes')) yes++
    else if (val.startsWith('no')) no++
    else na++
  })
  total = `${yes}/${25 - na}`
  return { yes, no, na, total }
}

const GeriOtQuestionnaireForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props

  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [initialValues, setInitialValues] = useState(generateInitialValues())

  const [reg, setReg] = useState({})
  const [social, setSocial] = useState({})
  const [triage, setTriage] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = await getSavedData(patientId, formName)
        const regData = await getSavedData(patientId, allForms.registrationForm)
        const triageData = await getSavedData(patientId, allForms.triageForm)
        const hxSocialData = await getSavedData(patientId, allForms.hxSocialForm)

        const results = await Promise.all([savedData, regData, triageData, hxSocialData])
        
        setInitialValues({ ...generateInitialValues(), ...results[0] })
        setReg(results[1] || {})
        setTriage(results[2] || {})
        setSocial(results[3] || {})
        setLoadingSidePanel(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoadingSidePanel(false)
      }
    }

    fetchData()
  }, [patientId])

  const GetScores = () => {
    const { values } = useFormikContext()
    const scores = calculateScores(values)
    return (
      <div className='form--div'>
        <br />
        <b>Yes (calculated):</b> {scores.yes}
        <br />
        <b>No (calculated):</b> {scores.no}
        <br />
        <b>NA (calculated):</b> {scores.na}
        <br />
        <b>Total Score (calculated):</b> {scores.total}
      </div>
    )
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true)
        setSubmitting(true)

        try {
          const scores = calculateScores(values)
          const response = await submitForm(
            {
              ...values,
              geriOtQuestionnaireQ29: scores.yes,
              geriOtQuestionnaireQ30: scores.no,
              geriOtQuestionnaireQ31: scores.na,
              geriOtQuestionnaireQ32: scores.total,
            },
            patientId,
            formName,
          )

          if (response.result) {
            await showFormSubmitSuccess()
            changeTab(null, nextTab)
          } else {
            showFormSubmitError(`Unsuccessful. ${response.error}`)
          }
        } catch (error) {
          console.error('Submission error:', error)
          showFormSubmitError('An error occurred during submission')
        } finally {
          setLoading(false)
          setSubmitting(false)
        }
      }}
    >
      {({ handleSubmit, errors, submitCount, isSubmitting }) => (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Grid container>
            <Grid item xs={9}>
              <Paper>
                <Form onSubmit={handleSubmit} className='fieldPadding'>
                  <div className='form--div'>
                    <h1>HOME FALLS AND ACCIDENTS SCREENING TOOL (HOME FAST)</h1>
                    <h4 className='red'>
                      Instructions: Please select either YES / NO / NA. Remember to fill up the
                      total scoring
                    </h4>
                    <p>
                      The HOMEFAST assessment is a 25 question standardized assessment that aims to
                      identify any potential fall risks at home, and within your home environment
                      (lift landing, corridor). The Occupational Therapist will then advise you on
                      some possible home modifications to make to minimize these risks, should there
                      be a concern.
                    </p>
                    <h2>HOME ENVIRONMENT (LIVING ROOM / HOME ENTRANCE)</h2>
                    <h3>1. Are your walkways free of cords and other clutter?</h3>
                    <p>
                      <b>Definition:</b> No cords / clutter that obstruct door opening / closing or
                      in the walkway. No items behind / in front of doors that prevent them from
                      opening fully
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ1'
                      label='geriOtQuestionnaireQ1'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ1}
                      row
                    />
                    <h3>2. Are your floor coverings in good condition?</h3>
                    <p>
                      <b>Definition:</b> Carpets / mats are flat on the ground. No cracked / missing
                      tiles including stair coverings
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ2'
                      label='geriOtQuestionnaireQ2'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ2}
                      row
                    />
                    <h4>Please specify:</h4>
                    <FastField
                      name='geriOtQuestionnaireQ33'
                      label='geriOtQuestionnaireQ33'
                      component={CustomTextField}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <h3>3. Are your floor surfaces non slip?</h3>
                    <p>
                      <b>Definition:</b> Score &quot;NO&quot; if kitchen, toilet are non-slip, Score &quot;YES&quot; if
                      kitchen, toilet are non-slip
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ3'
                      label='geriOtQuestionnaireQ3'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ3}
                      row
                    />
                    <h3>4. Are your loose mats securely fixed to the floor?</h3>
                    <p>
                      <b>Definition:</b> If backings of mats are safely taped/nailed to the ground
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ4'
                      label='geriOtQuestionnaireQ4'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ4}
                      row
                    />
                    <h3>5. Can you get in and out of bed easily and safely?</h3>
                    <p>
                      <b>Definition:</b> Bed is of adequate height and firmness, without the need to
                      pull self up with the aid of bedside furniture.
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ5'
                      label='geriOtQuestionnaireQ5'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ5}
                      row
                    />
                    <h3>6. Can you get up from your chair/sofa easily?</h3>
                    <p>
                      <b>Definition:</b> Chair / sofa is of adequate height, arm rests are
                      accessible to push from, and seat cushion not too soft or deep
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ6'
                      label='geriOtQuestionnaireQ6'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ6}
                      row
                    />
                    <h3>7. Are the lights at home bright enough for you to see clearly?</h3>
                    <p>
                      <b>Definition:</b> No shadows thrown across the room. No excessive glare
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ7'
                      label='geriOtQuestionnaireQ7'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ7}
                      row
                    />
                    <h3>8. Can you switch a light on easily from your bed?</h3>
                    <p>
                      <b>Definition: </b> Client does not need to get out of bed to switch on a
                      light. Has flashlight or bedside lamp
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ8'
                      label='geriOtQuestionnaireQ8'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ8}
                      row
                    />
                    <h3>
                      9. Are the paths, steps, entrances outside (at your corridor) well lit at
                      night?
                    </h3>
                    <p>
                      <b>Definition:</b> Light exists at the back and front of doors. Lift lobbies
                      and corridors have sufficient lighting to ambulate
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ9'
                      label='geriOtQuestionnaireQ9'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ9}
                      row
                    />
                    <h3>Notes (Q1 - 9, Living room/ Home entrance):</h3>
                    <FastField
                      name='geriOtQuestionnaireQ10'
                      label='geriOtQuestionnaireQ10'
                      component={CustomTextField}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <h2>HOME ENVIRONMENT (TOILET)</h2>
                    <h3>10. Are you able to get on and out of the toilet easily and safely?</h3>
                    <p>
                      <b>Definition:</b> Toilet seat is of adequate height, does not need to hold
                      onto sink / towel rail / toilet paper holder to stand. Grab bars are present
                      when needed
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ11'
                      label='geriOtQuestionnaireQ11'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ11}
                      row
                    />
                    <h3>11. Are you able to get in and out of the bath easily and safely?</h3>
                    <p>
                      <b>Definition:</b> Client is able to step over bathtub and lower themselves
                      without grabbing onto furniture
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ12'
                      label='geriOtQuestionnaireQ12'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ12}
                      row
                    />
                    <h3>
                      12. Are you able to walk in and out of the shower kerb / toilet kerb easily
                      and safely?
                    </h3>
                    <p>
                      <b>Definition:</b> Client can step over kerbs / recesses without the need to
                      hold onto anything
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ13'
                      label='geriOtQuestionnaireQ13'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ13}
                      row
                    />
                    <h3>
                      13. Are there stable grab bars / rails for you to hold in the shower / bath?
                    </h3>
                    <p>
                      <b>Definition:</b> Grab bars EXCLUDING towel rails, sink, toilet paper holder.
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ14'
                      label='geriOtQuestionnaireQ14'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ14}
                      row
                    />
                    <h3>14. Are there any non-slip mats in the shower area?</h3>
                    <p>
                      <b>Definition:</b> Well maintained slip resistant rubber mats / non slip
                      strips / non slip floor application on the floor / bathtub.
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ15'
                      label='geriOtQuestionnaireQ15'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ15}
                      row
                    />
                    <h3>15. Is the toilet close by / adjunct to the bedroom?</h3>
                    <p>
                      <b>Definition:</b> Less than 2 door distance away (including bathroom door)
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ16'
                      label='geriOtQuestionnaireQ16'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ16}
                      row
                    />
                    <h3>Notes (Q10 - 15, Toilet):</h3>
                    <FastField
                      name='geriOtQuestionnaireQ17'
                      label='geriOtQuestionnaireQ17'
                      component={CustomTextField}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <h2>HOME ENVIRONMENT (KITCHEN AND LIVING ROOM)</h2>
                    <h3>
                      16. Can you reach items in the kitchen that are used regularly without
                      climbing, bending or flexing your trunk such that you will not lose your
                      balance?
                    </h3>
                    <p>
                      <b>Definition:</b> Cupboards are accessible at shoulder and knee height -
                      without the need to use chairs / stepladders to reach items
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ18'
                      label='geriOtQuestionnaireQ18'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ18}
                      row
                    />
                    <h3>
                      17. Can you carry your meals from the kitchen to the dining table easily?
                    </h3>
                    <p>
                      <b>Definition:</b> Meals can be carried safely, transported using trolley to
                      wherever the client usually consumes meals
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ19'
                      label='geriOtQuestionnaireQ19'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ19}
                      row
                    />
                    <h3>
                      18. Does your house have any grab bars extending along the length of the steps
                      / kerbs?
                    </h3>
                    <p>
                      <b>Definition:</b> Grab bars must be easily gribbed, secure, robust throughout
                      the steps / kerbs
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ20'
                      label='geriOtQuestionnaireQ20'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ20}
                      row
                    />
                    <h3>
                      19. Does your apartment entrance have grab bars that extend the entire steps /
                      kerbs?
                    </h3>
                    <p>
                      <b>Definition:</b> Steps = more than 2 steps consecutively with a change in
                      floor level Definition: Grab bars must be easily gripped, firmly fixed, robust
                      and available for the full length of the steps or stairs
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ21'
                      label='geriOtQuestionnaireQ21'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ21}
                      row
                    />
                    <h3>
                      20. Can you easily and safely go up and down the steps in and outside your
                      house?
                    </h3>
                    <p>
                      <b>Definition:</b> Steps are not too high, narrow, uneven for feet to be
                      firmly placed.
                    </p>
                    <p>
                      <b>Definition:</b> Client will not be fatigued, breathless while using steps /
                      kerbs or any other medical condition that will impair ability to ascend the
                      stairs safely. Eg. Foot drop, loss of sensation in feet, impaired control of
                      movement.
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ22'
                      label='geriOtQuestionnaireQ22'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ22}
                      row
                    />
                    <h3>
                      21. Are the edges of the steps / stairs (inside and outside your house) easily
                      identified?
                    </h3>
                    <p>
                      <b>Definition:</b> No patterned floor coverings, tiles, that could obscure the
                      edge of step with sufficient lighting of the stairs / steps
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ23'
                      label='geriOtQuestionnaireQ23'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ23}
                      row
                    />
                    <h3>22. Can you use the entrance of doors safely and easily?</h3>
                    <p>
                      <b>Definition:</b> Locks and bolts can be used without the need to bend down
                      or over reach. There is a landing such that the client does not need to
                      balance on steps to open the door.
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ24'
                      label='geriOtQuestionnaireQ24'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ24}
                      row
                    />
                    <h3>
                      23. Are the paths in your house and outside your house in good condition and
                      free of clutter?
                    </h3>
                    <p>
                      <b>Definition:</b> No cracked / loose pathway / neighbors plants or furniture
                      on walkways
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ25'
                      label='geriOtQuestionnaireQ25'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ25}
                      row
                    />
                    <h3>24. Are you using non-slip / well fitting slippers/shoes at home?</h3>
                    <p>
                      <b>Definition:</b> Supportive, firmly fitting shoes / slippers with low heels
                      and non-slip soles.
                    </p>
                    No shoes = &quot;NO&quot;
                    <br />
                    <FastField
                      name='geriOtQuestionnaireQ26'
                      label='geriOtQuestionnaireQ26'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ26}
                      row
                    />
                    <h3>
                      25. If there are pets - can you care for them without bending down OR at risk
                      of falling over?
                    </h3>
                    <p>
                      <b>Definition:</b> &quot;YES&quot;  when client does NOT need to bend down to feed pets,
                      clean, refill bowls etc
                    </p>
                    <FastField
                      name='geriOtQuestionnaireQ27'
                      label='geriOtQuestionnaireQ27'
                      component={CustomRadioGroup}
                      options={formOptions.geriOtQuestionnaireQ27}
                      row
                    />
                    <h3>Notes (Q16 - 25, Kitchen and Living Environment):</h3>
                    <FastField
                      name='geriOtQuestionnaireQ28'
                      label='geriOtQuestionnaireQ28'
                      component={CustomTextField}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <h2>SCORING</h2>
                    <GetScores />
                    <br />

                    <ErrorNotification 
                      show={submitCount > 0 && Object.keys(errors || {}).length > 0}
                      message="Please fill in all required fields correctly."
                    />

                    <div>
                      {loading || isSubmitting ? (
                        <CircularProgress />
                      ) : (
                        <Button type='submit' variant='contained' color='primary'>
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>
              </Paper>
            </Grid>

            <Grid
              item
              xs={3}
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
                  {reg && reg.registrationQ3 instanceof Date ? (
                    <p className='blue'>Birthday: {reg.registrationQ3.toDateString()}</p>
                  ) : (
                    <p className='blue'>Birthday: nil</p>
                  )}

                  {reg && reg.registrationQ4 ? (
                    <p className='blue'>Age: {reg.registrationQ4}</p>
                  ) : (
                    <p className='blue'>Age: nil</p>
                  )}

                  {reg && reg.registrationQ5 ? (
                    <p className='blue'>Gender: {reg.registrationQ5}</p>
                  ) : (
                    <p className='blue'>Gender: nil</p>
                  )}

                  {triage && triage.triageQ11 ? (
                    <p className='blue'>Weight (in kg): {triage.triageQ11}</p>
                  ) : (
                    <p className='blue'>Weight (in kg): nil</p>
                  )}

                  {triage && triage.triageQ10 && triage.triageQ11 ? (
                    <p className='blue'>BMI: {formatBmi(triage.triageQ10, triage.triageQ11)}</p>
                  ) : (
                    <p className='blue'>BMI: nil</p>
                  )}

                  <h2>History</h2>
                  <p className='underlined'>Does patient currently smoke:</p>
                  {social && social.SOCIAL10 ? (
                    <p className='blue'>{social.SOCIAL10}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}

                  <p className='underlined'>How many pack-years:</p>
                  {social && social.SOCIALShortAns10 ? (
                    <p className='blue'>{social.SOCIALShortAns10}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}

                  <p className='underlined'>Does patient consume alcoholic drinks:</p>
                  {social && social.SOCIAL12 ? (
                    <p className='blue'>{social.SOCIAL12}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Formik>
  )
}

export default GeriOtQuestionnaireForm
