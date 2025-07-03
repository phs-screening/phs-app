import React, { useContext, useEffect, useState } from 'react'
import {
  Paper, Divider, Typography, CircularProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel,
  Radio, TextField, Button
} from '@mui/material'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/mongoDB'
import { submitForm } from '../../api/api.js'
import PopupText from 'src/utils/popupText.js'
import '../fieldPadding.css'
import '../forms.css'

const formName = 'gynaeForm'

const RadioGroupField = ({ name, label, values }) => (
  <FormControl fullWidth sx={{ mb: 3 }}>
    <FormLabel><Typography variant="subtitle1" fontWeight="bold">{label}</Typography></FormLabel>
    <Field name={name}>
      {({ field }) => (
        <RadioGroup {...field} row>
          {values.map((val) => (
            <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
          ))}
        </RadioGroup>
      )}
    </Field>
    <ErrorMessage name={name} component="div" style={{ color: 'red' }} />
  </FormControl>
)

export default function HxGynaeForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedValues, setSavedValues] = useState({})
  const [loading, setLoading] = useState(false)

  const initialValues = {
    GYNAE1: '', GYNAE2: '', GYNAEShortAns2: '', GYNAE3: '', GYNAEShortAns3: '',
    GYNAE4: '', GYNAEShortAns4: '', GYNAE5: '', GYNAEShortAns5: '',
    GYNAE6: '', GYNAEShortAns6: '', GYNAE7: '', GYNAEShortAns7: '',
    GYNAE8: '', GYNAEShortAns8: '', GYNAE9: '', GYNAE10: '', GYNAEShortAns10: '',
    GYNAE11: '', GYNAEShortAns11: '', GYNAE13: '', GYNAEShortAns13: '',
  }

  const validationSchema = Yup.object({
    GYNAE1: Yup.string().required('Required'),
  })

  useEffect(() => {
    getSavedData(patientId, formName).then((res) => {
      setSavedValues({ ...initialValues, ...res })
    })
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      alert('Successfully submitted form')
      changeTab(null, nextTab)
    } else {
      alert(`Unsuccessful. ${response.error}`)
    }
  }

  return (
    <Paper elevation={2}>
      <Formik
        initialValues={savedValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="fieldPadding">
            <Typography variant="h6" gutterBottom>GYNECOLOGY</Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="error">Only ask if participant is female:</Typography>

            <Typography variant="subtitle1" fontWeight="bold">Are you menopaused?</Typography>
            <Typography variant="body2">i.e. &gt; 1 year from your last menstrual period</Typography>
            <RadioGroupField name="GYNAE1" label="GYNAE1" values={["Yes", "No"]} />

            <PopupText qnNo='GYNAE1' triggerValue='Yes'>
              <Typography variant="subtitle1" fontWeight="bold">Do you have any postmenopausal bleeding?</Typography>
              <RadioGroupField name="GYNAE2" label="GYNAE2" values={["Yes", "No"]} />
              <Typography variant="subtitle2">Please specify:</Typography>
              <Field name="GYNAEShortAns2" as={TextField} label="GYNAEShortAns2" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
              <ErrorMessage name="GYNAEShortAns2" component="div" style={{ color: 'red' }} />
            </PopupText>

            <Typography variant="subtitle1" fontWeight="bold">Do you have any abnormal per vaginal bleeding?</Typography>
            <Typography variant="body2">e.g. bleeding between periods, prolonged menses, bleeding after intercourse</Typography>
            <RadioGroupField name="GYNAE3" label="GYNAE3" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns3" as={TextField} label="GYNAEShortAns3" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns3" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have irregular period or less than 4 menstrual cycles a year?</Typography>
            <RadioGroupField name="GYNAE4" label="GYNAE4" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns4" as={TextField} label="GYNAEShortAns4" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns4" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have any menstrual concerns?</Typography>
            <RadioGroupField name="GYNAE5" label="GYNAE5" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns5" as={TextField} label="GYNAEShortAns5" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns5" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you feel any abnormal abdominal masses?</Typography>
            <RadioGroupField name="GYNAE6" label="GYNAE6" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns6" as={TextField} label="GYNAEShortAns6" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns6" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have any new onset abdominal pain/bloatedness?</Typography>
            <RadioGroupField name="GYNAE7" label="GYNAE7" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns7" as={TextField} label="GYNAEShortAns7" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns7" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you have fertility concerns?</Typography>
            <RadioGroupField name="GYNAE8" label="GYNAE8" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns8" as={TextField} label="GYNAEShortAns8" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns8" component="div" style={{ color: 'red' }} />

            <PopupText qnNo='GYNAE8' triggerValue='Yes'>
              <Typography variant="subtitle1" fontWeight="bold">Are you keen to investigate for subfertility?</Typography>
              <RadioGroupField name="GYNAE9" label="GYNAE9" values={["Yes", "No"]} />
            </PopupText>

            <Typography variant="subtitle1" fontWeight="bold">Do you have any urinary symptoms?</Typography>
            <RadioGroupField name="GYNAE10" label="GYNAE10" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns10" as={TextField} label="GYNAEShortAns10" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns10" component="div" style={{ color: 'red' }} />

            <Typography variant="subtitle1" fontWeight="bold">Do you feel any lump in vagina or pelvic organ prolapse?</Typography>
            <RadioGroupField name="GYNAE11" label="GYNAE11" values={["Yes", "No"]} />
            <Typography variant="subtitle2">Please specify:</Typography>
            <Field name="GYNAEShortAns11" as={TextField} label="GYNAEShortAns11" fullWidth multiline sx={{ mb: 3, mt: 1 }} />
            <ErrorMessage name="GYNAEShortAns11" component="div" style={{ color: 'red' }} />

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              {loading || isSubmitting ? <CircularProgress /> : (
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
            <br />
            <Divider />
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
