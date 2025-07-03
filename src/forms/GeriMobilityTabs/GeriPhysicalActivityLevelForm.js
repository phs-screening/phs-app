import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, CircularProgress, FormControl, FormLabel, Box, 
  FormControlLabel, Checkbox, RadioGroup, Radio, TextField, Button } from '@mui/material'

import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const formName = 'geriPhysicalActivityLevelForm'

const formOptions = {
  geriPhysicalActivityLevelQ1: [
    {
      label: 'Nil',
      value: 'Nil',
    },
    { label: '1-2x/ week', value: '1-2x/ week' },
    { label: '3-4x/ week', value: '3-4x/ week' },
    { label: '5x/ week or more', value: '5x/ week or more' },
  ],
  geriPhysicalActivityLevelQ2: [
    {
      label: 'Nil',
      value: 'Nil',
    },
    { label: '<15 min', value: '<15 min' },
    { label: '< 15-30 min', value: '< 15-30 min' },
    { label: '30 min or more', value: '30 min or more' },
  ],
  geriPhysicalActivityLevelQ4: [
    {
      label: 'Light Intensity',
      value: 'Light Intensity',
    },
    { label: 'Moderate Intensity', value: 'Moderate Intensity' },
    { label: 'Vigorous Intensity', value: 'Vigorous Intensity' },
    { label: 'Unsure', value: 'Unsure' },
  ],
  geriPhysicalActivityLevelQ5: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
  geriPhysicalActivityLevelQ6: [
    {
      label: '< 150min of mod intensity per week',
      value: '< 150min of mod intensity per week',
    },
    { label: 'unsure about qns 1-4', value: 'unsure about qns 1-4' },
    { label: 'yes to qn 5', value: 'yes to qn 5' },
    { label: 'nil - regular advice', value: 'nil - regular advice' },
  ],
  geriPhysicalActivityLevelQ8: [
    {
      label: 'No fall',
      value: 'No fall',
    },
    { label: '1 fall', value: '1 fall' },
    { label: '2 or more falls', value: '2 or more falls' },
  ],
  geriPhysicalActivityLevelQ9: [
    {
      label: 'Yes',
      value: 'Yes',
    },
    { label: 'No', value: 'No' },
  ],
}

const validationSchema = Yup.object({
  geriPhysicalActivityLevelQ1: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ1.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ2: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ2.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ3: Yup.string().required(),
  geriPhysicalActivityLevelQ4: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ4.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ5: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ5.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ6: Yup.array().of(Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ6.map(opt => opt.value))).min(1).required(),
  geriPhysicalActivityLevelQ8: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ8.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ9: Yup.string().oneOf(formOptions.geriPhysicalActivityLevelQ9.map(opt => opt.value)).required(),
  geriPhysicalActivityLevelQ10: Yup.string(),
  geriPhysicalActivityLevelQ7: Yup.string(),
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
  const match = name.match(/geriPhysicalActivityLevelQ(\d+)/i)
  const label = match ? `Geri - Physical Activity Level Q${match[1]}` : name
  return `${label}${isRequiredField(schema, name) ? ' *' : ''}`
}

const GeriPhysicalActivityLevelForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    geriPhysicalActivityLevelQ1: '',
    geriPhysicalActivityLevelQ2: '',
    geriPhysicalActivityLevelQ3: '',
    geriPhysicalActivityLevelQ4: '',
    geriPhysicalActivityLevelQ5: '',
    geriPhysicalActivityLevelQ6: [],
    geriPhysicalActivityLevelQ7: '',
    geriPhysicalActivityLevelQ8: '',
    geriPhysicalActivityLevelQ9: '',
    geriPhysicalActivityLevelQ10: ''
  })

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

  useEffect(() => {
    const fetchData = async () => {
      const saved = await getSavedData(patientId, formName)
      setInitialValues(saved)
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

  const renderCheckboxGroup = (name, options = formOptions[name].map(o => o.value)) => (
    <FormControl sx = {{ mt: 1 }}>
      <FormLabel sx={{ color: 'text.secondary' }}>{formatLabel(name, validationSchema)}</FormLabel>
      <Box display='flex' flexDirection='column'>
        {options.map((val) => (
          <FormControlLabel
            key={val}
            control={
              <Checkbox
                name={name}
                checked={(formik.values[name] || []).includes(val)}
                onChange={(e) => {
                  const checked = e.target.checked
                  const newArr = checked
                    ? [...(formik.values[name] || []), val]
                    : (formik.values[name] || []).filter((v) => v !== val)
                  formik.setFieldValue(name, newArr)
                }}
              />
            }
            label={`${val}${isRequiredField(validationSchema, name) ? ' *' : ''}`}
          />
        ))}
      </Box>
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
      <form onSubmit={formik.handleSubmit} className='fieldPadding'>
        <div className='form--div'>
          <h1>PHYSICAL ACTIVITY SECTION</h1>
          <h2>PHYSICAL ACTIVITY LEVELS</h2>

          <h3>1. How often do you exercise in a week?</h3>
          If &lt; 3x/week and would like to start exercising more, suggest physiotherapist consultation.
          <br />
          {renderRadioGroup('geriPhysicalActivityLevelQ1')}

          <h3>2. How long do you exercise each time?</h3>
          If &lt; 30minutes per session and would like to increase, suggest physiotherapist consultation.
          <br />
          {renderRadioGroup('geriPhysicalActivityLevelQ2')}

          <h3>3. What do you do for exercise?</h3>
          <ul className='decrease-left-margin'>
          <li>Take down salient points. </li>
          <li>
            Dangerous/ inappropriate exercises are defined to the participants as exercises that cause pain or difficulty to to the participant in performing.
          </li>
          <li>
            If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST CONSULATION.
          </li>
        </ul>
          {renderTextField('geriPhysicalActivityLevelQ3')}

          <h3>4. Using the following scale, can you rate the level of exertion when you exercise?</h3>
          <div>
            <b>PT to note:</b>
            <br />
            if participant:
            <ol>
              <li>Achieves less than 150 min moderate intensity per week OR</li>
              <li>
                Unsure about any of the 4 questions above. <br />
              </li>
            </ol>
          </div>
          <img src='/images/geri-physical-activity-level/intensity.jpg' alt='Intensity Scale' style={{ maxWidth: '100%' }} />
          {renderRadioGroup('geriPhysicalActivityLevelQ4')}

          <h3>5. Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?</h3>
          If yes, to{' '}
          <b>
            REFER FOR <span className='red'>PHYSIOTHERAPIST CONSULATION</span>
          </b>
          <br /> 
          {renderRadioGroup('geriPhysicalActivityLevelQ5')}

          <h3>6. Do you have any history of falls in the past 1 year? If yes, how many falls?</h3>
          {renderRadioGroup('geriPhysicalActivityLevelQ8')}

          <h3>7. If yes, were any of the falls injurious?</h3>
          If participant had 2 or more falls, or 1 fall with injury,{' '}
          <b>
            REFER TO <span className='red'>DOCTOR&apos;S CONSULTATION</span>
          </b>
          <br />
          {renderRadioGroup('geriPhysicalActivityLevelQ9')}

          <h4>Please elaborate below on the injuries and whether there was medical treatment e.g. seeing Dr/ED dept.</h4>
          {renderTextField('geriPhysicalActivityLevelQ10')}

          <h4>Notes:</h4>
          {renderTextField('geriPhysicalActivityLevelQ7')}

          <h3 className='red'>Referral to Physiotherapist Consult</h3>
          {renderCheckboxGroup('geriPhysicalActivityLevelQ6')}
        </div>

        <div> 
          {loading ? <CircularProgress /> : <Button type='submit' variant='contained' color='primary'>Submit</Button>}
        </div>
        
        <br />
        <Divider />
      </form>
    </Paper>
  )
}

export default GeriPhysicalActivityLevelForm
