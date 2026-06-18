import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Divider, 
  Paper, 
  Grid, 
  CircularProgress, 
  Box, 
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import allForms from '../forms.json'
import { submitForm } from '../../api/api.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'

import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'

const responses = [
  '1 - Hardly ever',
  '2 - Some of the time',
  '3 - Often',
]

const responsesValue = [
  { label: '1 - Hardly ever', value: '1 - Hardly ever' },
  { label: '2 - Some of the time', value: '2 - Some of the time' },
  { label: '3 - Often', value: '3 - Often' },
]

const validationSchema = Yup.object({
  InterQ1: Yup.string().oneOf(responses).required('Required'),
  InterQ2: Yup.string().oneOf(responses).required('Required'),
  InterQ3: Yup.string().oneOf(responses).required('Required'),
})

// Custom Radio Field Component
const RadioField = ({ field, form, options, label, ...props }) => {
  const { name } = field
  const hasError = form.touched[name] && form.errors[name]
  
  return (
    <FormControl component="fieldset" error={hasError} margin="normal" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup {...field} {...props}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {hasError && (
        <FormHelperText>{form.errors[name]}</FormHelperText>
      )}
    </FormControl>
  )
}

function getScore(values) {
  const points = {
    '1 - Hardly ever': 1,
    '2 - Some of the time': 2,
    '3 - Often': 3,
  }
  let score = 0
  for (let i = 1; i <= 3; i++) {
    score += points[values[`InterQ${i}`]] || 0
  }
  return score
}

const formName = 'geriInterForm'

const GeriInterForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [regi, setRegi] = useState({})
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    InterQ1: '',
    InterQ2: '',
    InterQ3: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setInitialValues({
        InterQ1: savedData.InterQ1 || '',
        InterQ2: savedData.InterQ2 || '',
        InterQ3: savedData.InterQ3 || '',
      })
      const regiData = await getSavedData(patientId, allForms.registrationForm)
      setRegi(regiData)
      setLoadingSidePanel(false)
    }
    fetchData()
  }, [patientId])

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true)
                const response = await submitForm(values, patientId, formName)
                setLoading(false)
                setSubmitting(false)
                if (response.result) {
                  setTimeout(async () => {
                    await showFormSubmitSuccess()
                    navigate('/app/dashboard')
                  }, 80)
                } else {
                  setTimeout(() => {
                    showFormSubmitError(`Unsuccessful. ${response.error}`)
                  }, 80)
                }
              }}
            >
              {({ values, isSubmitting }) => (
                <Form className='fieldPadding'>
                  <div className='form--div'>
                    <h1>INTERACTION</h1>
                    
                    <h3>How often do you feel that you lack companionship?</h3>
                    <Field 
                      name="InterQ1" 
                      component={RadioField} 
                      label="Lack companionship" 
                      options={responsesValue} 
                    />
                    
                    <h3>How often do you feel left out?</h3>
                    <Field 
                      name="InterQ2" 
                      component={RadioField} 
                      label="Feel left out" 
                      options={responsesValue} 
                    />
                    
                    <h3>How often do you feel isolated from others?</h3>
                    <Field 
                      name="InterQ3" 
                      component={RadioField} 
                      label="Feel isolated" 
                      options={responsesValue} 
                    />
                    
                    <h3>Score:</h3>
                    <p className='blue'>{getScore(values)} / 9</p>
                  </div>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    {loading || isSubmitting ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                    )}
                  </Box>

                  <br />
                  <Divider />
                </Form>
              )}
            </Formik>
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
              <p>Patient consented to being considered for participation in Long Term Follow-Up (LTFU)?
                (Patient has to sign and tick Form C)<br></br><strong>{regi.registrationQ20}</strong></p>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default GeriInterForm