import React, { useContext, useEffect, useState } from 'react'
import {
  Divider,
  Paper,
  CircularProgress,
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'
import '../forms.css'
import { geriWhFormQuestionText } from '../questions/GeriWhFormQuestions'

const validationSchema = Yup.object({
  WH1: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  WH2shortAns: Yup.string().notRequired(),
})

// Custom Radio Field Component
const RadioField = ({ field, form, options, label, ...props }) => {
  const { name } = field
  const hasError = form.touched[name] && form.errors[name]

  return (
    <FormControl component='fieldset' error={hasError} margin='normal'>
      <FormLabel component='legend'>{label}</FormLabel>
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
      {hasError && <FormHelperText>{form.errors[name]}</FormHelperText>}
    </FormControl>
  )
}

const formName = 'geriWhForm'

const GeriWhForm = (props) => {
  const { patientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const { changeTab, nextTab } = props
  const [initialValues, setInitialValues] = useState({
    WH1: '',
    WH2shortAns: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setInitialValues({
        WH1: savedData.WH1 || '',
        WH2shortAns: savedData.WH2shortAns || '',
      })
    }
    fetchData()
  }, [patientId])

  const radioOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ]

  return (
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
            const event = null
            setTimeout(async () => {
              await showFormSubmitSuccess()
              changeTab(event, nextTab)
            }, 80)
          } else {
            setTimeout(() => {
              showFormSubmitError(`Unsuccessful. ${response.error}`)
            }, 80)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className='fieldPadding'>
            <div className='form--div'>
              <h1>Whispering Hearts</h1>

              <h3>{geriWhFormQuestionText.WH1}</h3>
              <Field
                name='WH1'
                component={RadioField}
                label={geriWhFormQuestionText.WH1Label}
                options={radioOptions}
              />

              <h3>{geriWhFormQuestionText.WH2shortAns}</h3>
              <Field
                as={TextField}
                name='WH2shortAns'
                label={geriWhFormQuestionText.WH2shortAns}
                fullWidth
                variant='outlined'
                margin='normal'
                multiline
                rows={3}
                error={touched.WH2shortAns && !!errors.WH2shortAns}
                helperText={touched.WH2shortAns && errors.WH2shortAns}
              />
            </div>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? (
                <CircularProgress />
              ) : (
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  size='large'
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
  )
}

export default GeriWhForm
