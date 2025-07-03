import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import allForms from '../forms.json'

import { Divider, Paper, CircularProgress, FormControl, FormLabel, 
  FormControlLabel, RadioGroup, Radio, TextField, Button, Grid } from '@mui/material'

import { formatBmi, submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const formName = 'geriOtQuestionnaireForm'

const formOptions = {
  geriOtQuestionnaireQ1: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ2: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ3: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ4: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ5: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ6: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (client uses wheelchair constantly)',
      value: 'NA (client uses wheelchair constantly)',
    },
  ],
  geriOtQuestionnaireQ7: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ8: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ9: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (nil kerbs and steps - new BTO building)',
      value: 'NA (nil kerbs and steps - new BTO building)',
    },
  ],
  geriOtQuestionnaireQ11: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (client uses commode constantly)',
      value: 'NA (client uses commode constantly)',
    },
  ],
  geriOtQuestionnaireQ12: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (does not use bathtub, uses shower)',
      value: 'NA (does not use bathtub, uses shower)',
    },
  ],
  geriOtQuestionnaireQ13: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (nil shower at home, uses bathtub)',
      value: 'NA (nil shower at home, uses bathtub)',
    },
  ],
  geriOtQuestionnaireQ14: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ15: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ16: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ18: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ19: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ20: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (no steps / stairs at home - including toilet - new BTO building)',
      value: 'NA (no steps / stairs at home - including toilet - new BTO building)',
    },
  ],
  geriOtQuestionnaireQ21: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    { label: 'NA (nil steps / kerbs at entrance)', value: 'NA (nil steps / kerbs at entrance)' },
  ],
  geriOtQuestionnaireQ22: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (nil steps at home, lift landing, does not climb stairs)',
      value: 'NA (nil steps at home, lift landing, does not climb stairs)',
    },
  ],
  geriOtQuestionnaireQ23: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (nil steps at home, lift landing, does not climb stairs)',
      value: 'NA (nil steps at home, lift landing, does not climb stairs)',
    },
  ],
  geriOtQuestionnaireQ24: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ25: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    {
      label: 'NA (nil garden, path, corridor walkway)',
      value: 'NA (nil garden, path, corridor walkway)',
    },
  ],
  geriOtQuestionnaireQ26: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriOtQuestionnaireQ27: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
    { label: 'NA (nil pets / animals at home)', value: 'NA (nil pets / animals at home)' },
  ],
}

const validationSchema = Yup.object({
  geriOtQuestionnaireQ1: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ1.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ2: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ2.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ3: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ3.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ4: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ4.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ5: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ5.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ6: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ6.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ7: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ7.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ8: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ8.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ9: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ9.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ10: Yup.string(),
  geriOtQuestionnaireQ11: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ11.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ12: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ12.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ13: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ13.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ14: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ14.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ15: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ15.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ16: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ16.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ17: Yup.string(),
  geriOtQuestionnaireQ18: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ18.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ19: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ19.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ20: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ20.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ21: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ21.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ22: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ22.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ23: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ23.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ24: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ24.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ25: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ25.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ26: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ26.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ27: Yup.string().oneOf(formOptions.geriOtQuestionnaireQ27.map(opt => opt.value)).required(),
  geriOtQuestionnaireQ28: Yup.string(),
  geriOtQuestionnaireQ29: Yup.string().required(),
  geriOtQuestionnaireQ30: Yup.string().required(),
  geriOtQuestionnaireQ31: Yup.string().required(),
  geriOtQuestionnaireQ32: Yup.string().required(),
  geriOtQuestionnaireQ33: Yup.string(),
})

const isRequiredField = (schema, fieldName) => {
  try {
    const tests = schema.fields[fieldName]?.tests || []
    return tests.some((test) => test.OPTIONS?.name === 'required')
  } catch {
    return false
  }
}

const formatLabel = (name, schema) => {
  const match = name.match(/geriOtQuestionnaireQ(\d+)/i)
  const label = match ? `Geri - OT Questionnaire Q${match[1]}` : name
  return `${label}${isRequiredField(schema, name) ? ' *' : ''}`
}

const GeriOtQuestionnaireForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [initialValues, setInitialValues] = useState(() => {
    const values = {}
    for (let i = 1; i <= 33; i++) {
      values[`geriOtQuestionnaireQ${i}`] = ''
    }
    return values
  })
  
  const [reg, setReg] = useState({})
  const [social, setSocial] = useState({})
  const [triage, setTriage] = useState({})

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      isLoading(true)
      const response = await submitForm(values, patientId, formName)
      setTimeout(() => {
        isLoading(false)
        if (response.result) {
          const event = null // not interested in this value
          alert('Successfully submitted form')
          changeTab(event, nextTab)
        } else {
          alert(`Unsuccessful. ${response.error}`)
        }
      }, 80)
    }
  })

  const GetScores = () => {
    const score = [0, 0, 0] //yes , no , NA
    const arrayValues = []
    arrayValues[0] = formik.values['geriOtQuestionnaireQ1']
    arrayValues[1] = formik.values['geriOtQuestionnaireQ2']
    arrayValues[2] = formik.values['geriOtQuestionnaireQ3']
    arrayValues[3] = formik.values['geriOtQuestionnaireQ4']
    arrayValues[4] = formik.values['geriOtQuestionnaireQ5']
    arrayValues[5] = formik.values['geriOtQuestionnaireQ6']
    arrayValues[6] = formik.values['geriOtQuestionnaireQ7']
    arrayValues[7] = formik.values['geriOtQuestionnaireQ8']
    arrayValues[8] = formik.values['geriOtQuestionnaireQ9']
    arrayValues[9] = formik.values['geriOtQuestionnaireQ11']
    arrayValues[10] = formik.values['geriOtQuestionnaireQ12']
    arrayValues[11] = formik.values['geriOtQuestionnaireQ13']
    arrayValues[12] = formik.values['geriOtQuestionnaireQ14']
    arrayValues[13] = formik.values['geriOtQuestionnaireQ15']
    arrayValues[14] = formik.values['geriOtQuestionnaireQ16']
    arrayValues[15] = formik.values['geriOtQuestionnaireQ18']
    arrayValues[16] = formik.values['geriOtQuestionnaireQ19']
    arrayValues[17] = formik.values['geriOtQuestionnaireQ20']
    arrayValues[18] = formik.values['geriOtQuestionnaireQ21']
    arrayValues[19] = formik.values['geriOtQuestionnaireQ22']
    arrayValues[20] = formik.values['geriOtQuestionnaireQ23']
    arrayValues[21] = formik.values['geriOtQuestionnaireQ24']
    arrayValues[22] = formik.values['geriOtQuestionnaireQ25']
    arrayValues[23] = formik.values['geriOtQuestionnaireQ26']
    arrayValues[24] = formik.values['geriOtQuestionnaireQ27']
  
    const length = arrayValues.length
  
    const renderNumField = (name) => {
      return (
        <TextField
          {...formik.getFieldProps(name)}
          type="number"
          label={formatLabel(name, validationSchema)}
          fullWidth
          InputProps={{ inputProps: { step: 1 } }}
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name]}
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
            "& input[type=number]": { MozAppearance: "textfield" },
            mt: 1
          }}
        />
      )
    }   
  
    for (let i = 0; i < length; i++) {
      const current = (arrayValues[i] || '').toLowerCase().trim()
      if (current !== undefined) {
        if (current.substring(0, 3).trim().toLowerCase() === 'yes') {
          score[0] = score[0] + 1
        } else if (current.substring(0, 3).trim().toLowerCase() === 'no') {
          score[1] = score[1] + 1
        } else {
          score[2] = score[2] + 1
        }
      }
    }
  
    return (
      <div className='form--div'>
        <br />
        <b>Yes (calculated):</b> {score[0]}
        <br />
        <b>Yes :</b>
        {renderNumField('geriOtQuestionnaireQ29')}
        <b>No (calculated):</b> {score[1]}
        <br />
        <b>No :</b>
        {renderNumField('geriOtQuestionnaireQ30')}
        <b>NA (calculated):</b> {score[2]} <br />
        <b>NA :</b>
        {renderNumField('geriOtQuestionnaireQ31')}
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const regData = getSavedData(patientId, allForms.registrationForm)
      const triageData = getSavedData(patientId, allForms.triageForm)
      const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
      Promise.all([savedData, regData, triageData, hxSocialData]).then((result) => {
        setInitialValues(result[0])
        setReg(result[1])
        setTriage(result[2])
        setSocial(result[3])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

  const renderRadioGroup = (name, options = formOptions[name]) => (
    <FormControl sx = {{ mt: 1 }}>
      <FormLabel sx={{ color: 'text.secondary' }}>{formatLabel(name, validationSchema)}</FormLabel>
      <RadioGroup value={formik.values[name]} onChange={formik.handleChange} name={name}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={`${opt.label}${isRequiredField(validationSchema, name) ? ' *' : ''}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )

  const renderTextField = (name) => (
    <TextField
      name={name}
      label={formatLabel(name, validationSchema)}
      value={formik.values[name] || ''}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      fullWidth
      multiline
      sx={{ mt: 1 }}
    />
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            <form onSubmit={formik.handleSubmit} className='fieldPadding'>
              <div className='form--div'>
                <h1>HOME FALLS AND ACCIDENTS SCREENING TOOL (HOME FAST)</h1>
                <h4 className='red'>
                  Instructions: Please select either YES / NO / NA. Remember to fill up the total scoring
                </h4>
                <p>
                  The HOMEFAST assessment is a 25 question standardized assessment that aims to identify any
                  potential fall risks at home, and within your home environment (lift landing, corridor).
                  The Occupational Therapist will then advise you on some possible home modifications to
                  make to minimize these risks, should there be a concern.
                </p>
                <h2>HOME ENVIRONMENT (LIVING ROOM / HOME ENTRANCE)</h2>
                <h3>1. Are your walkways free of cords and other clutter?</h3>
                <p>
                  <b>Definition:</b> No cords / clutter that obstruct door opening / closing or in the
                  walkway. No items behind / in front of doors that prevent them from opening fully
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ1')}

                <h3>2. Are your floor coverings in good condition?</h3>
                <p>
                  <b>Definition:</b> Carpets / mats are flat on the ground. No cracked / missing tiles
                  including stair coverings
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ2')}

                <h4>Please specify:</h4>
                {renderTextField('geriOtQuestionnaireQ33')}

                <h3>3. Are your floor surfaces non slip?</h3>
                <p>
                  <b>Definition:</b> Score ‘NO” if kitchen, toilet are non-slip, Score “YES” if kitchen,
                  toilet are non-slip
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ3')}

                <h3>4. Are your loose mats securely fixed to the floor?</h3>
                <p>
                  <b>Definition:</b> If backings of mats are safely taped/nailed to the ground
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ4')}

                <h3>5. Can you get in and out of bed easily and safely?</h3>
                <p>
                  {' '}
                  <b>Definition:</b> Bed is of adequate height and firmness, without the need to pull self
                  up with the aid of bedside furniture.
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ5')}

                <h3>6. Can you get up from your chair/sofa easily?</h3>
                <p>
                  <b>Definition:</b> Chair / sofa is of adequate height, arm rests are accessible to push
                  from, and seat cushion not too soft or deep
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ6')}

                <h3>7. Are the lights at home bright enough for you to see clearly?</h3>
                <p>
                  <b>Definition:</b> No shadows thrown across the room. No excessive glare
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ7')}

                <h3>8. Can you switch a light on easily from your bed?</h3>
                <p>
                  <b>Definition: </b> Client does not need to get out of bed to switch on a light. Has
                  flashlight or bedside lamp{' '}
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ8')}

                <h3>9. Are the paths, steps, entrances outside (at your corridor) well lit at night?</h3>
                <p>
                  <b>Definition:</b> Light exists at the back and front of doors. Lift lobbies and corridors
                  have sufficient lighting to ambulate
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ9')} 

                <h3>Notes (Q1 - 9, Living room/ Home entrance):</h3>
                {renderTextField('geriOtQuestionnaireQ10')}

                <h2>HOME ENVIRONMENT (TOILET)</h2>
                <h3>10. Are you able to get on and out of the toilet easily and safely?</h3>
                <p>
                  <b>Definition:</b> Toilet seat is of adequate height, does not need to hold onto sink /
                  towel rail / toilet paper holder to stand. Grab bars are present when needed
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ11')} 

                <h3>11. Are you able to get in and out of the bath easily and safely?</h3>
                <p>
                  <b>Definition:</b> Client is able to step over bathtub and lower themselves without
                  grabbing onto furniture
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ12')}

                <h3>
                  12. Are you able to walk in and out of the shower kerb / toilet kerb easily and safely?
                </h3>
                <p>
                  <b>Definition:</b> Client can step over kerbs / recesses without the need to hold onto
                  anything{' '}
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ13')}

                <h3>13. Are there stable grab bars / rails for you to hold in the shower / bath?</h3>
                <p>
                  <b>Definition:</b> Grab bars EXCLUDING towel rails, sink, toilet paper holder.
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ14')}

                <h3>14. Are there any non-slip mats in the shower area?</h3>
                <p>
                  <b>Definition:</b> Well maintained slip resistant rubber mats / non slip strips / non slip
                  floor application on the floor / bathtub.
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ15')}

                <h3>15. Is the toilet close by / adjunct to the bedroom?</h3>
                <p>
                  <b>Definition:</b> Less than 2 door distance away (including bathroom door)
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ16')}

                <h3>Notes (Q10 - 15, Toilet):</h3>
                {renderTextField('geriOtQuestionnaireQ17')}

                <h2>HOME ENVIRONMENT (KITCHEN AND LIVING ROOM)</h2>
                <h3>
                  16. Can you reach items in the kitchen that are used regularly without climbing, bending
                  or flexing your trunk such that you will not lose your balance?
                </h3>
                <p>
                  <b>Definition:</b> Cupboards are accessible at shoulder and knee height - without the need
                  to use chairs / stepladders to reach items
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ18')}

                <h3>17. Can you carry your meals from the kitchen to the dining table easily?</h3>
                <p>
                  <b>Definition:</b> Meals can be carried safely, transported using trolley to wherever the
                  client usually consumes meals
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ19')} 

                <h3>
                  18. Does your house have any grab bars extending along the length of the steps / kerbs?
                </h3>
                <p>
                  <b>Definition:</b> Grab bars must be easily gribbed, secure, robust throughout the steps /
                  kerbs
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ20')}

                <h3>
                  19. Does your apartment entrance have grab bars that extend the entire steps / kerbs?
                </h3>
                <p>
                  <b>Definition:</b> Steps = more than 2 steps consecutively with a change in floor level
                  Definition: Grab bars must be easily gripped, firmly fixed, robust and available for the
                  full length of the steps or stairs
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ21')} 

                <h3>20. Can you easily and safely go up and down the steps in and outside your house?</h3>
                <p>
                  <b>Definition:</b> Steps are not too high, narrow, uneven for feet to be firmly placed.
                </p>
                <p>
                  <b>Definition:</b> Client will not be fatigued, breathless while using steps / kerbs or
                  any other medical condition that will impair ability to ascend the stairs safely. Eg. Foot
                  drop, loss of sensation in feet, impaired control of movement.
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ22')}

                <h3>
                  21. Are the edges of the steps / stairs (inside and outside your house) easily identified?
                </h3>
                <p>
                  <b>Definition:</b> No patterned floor coverings, tiles, that could obscure the edge of
                  step with sufficient lighting of the stairs / steps
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ23')}

                <h3>22. Can you use the entrance of doors safely and easily?</h3>
                <p>
                  <b>Definition:</b> Locks and bolts can be used without the need to bend down or over
                  reach. There is a landing such that the client does not need to balance on steps to open
                  the door.
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ24')}

                <h3>
                  23. Are the paths in your house and outside your house in good condition and free of
                  clutter?
                </h3>
                <p>
                  <b>Definition:</b> No cracked / loose pathway / neighbors plants or furniture on walkways
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ25')}

                <h3>24. Are you using non-slip / well fitting slippers/shoes at home?</h3>
                <p>
                  <b>Definition:</b> Supportive, firmly fitting shoes / slippers with low heels and non-slip
                  soles.
                </p>
                No shoes = &quot;NO&quot;
                <br />
                {renderRadioGroup('geriOtQuestionnaireQ26')}

                <h3>
                  25. If there are pets - can you care for them without bending down OR at risk of falling
                  over?
                </h3>
                <p>
                  <b>Definition: </b> “YES” when client does NOT need to bend down to feed pets, clean,
                  refill bowls etc
                </p>
                {renderRadioGroup('geriOtQuestionnaireQ27')} 

                <h3>Notes (Q16 - 25, Kitchen and Living Environment):</h3>
                {renderTextField('geriOtQuestionnaireQ28')}

                <h2>SCORING</h2>
                <GetScores /> <br />
                <h3 className='remove-top-margin'>
                  Total (Record it as &quot;YES&quot; / 25 - &quot;NA&quot;)
                </h3>
                {renderTextField('geriOtQuestionnaireQ32')}

              </div>

              <br />
              <div> 
                {loading ? <CircularProgress /> : <Button type='submit' variant='contained' color='primary'>Submit</Button>}
              </div>

              <br />
              <Divider />

            </form>
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
  )
}

export default GeriOtQuestionnaireForm
