import React, { useContext, useEffect, useState } from 'react'
import { Formik, FastField } from 'formik'
import * as Yup from 'yup'
import { Paper, CircularProgress, Button, Divider, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router'

import { submitForm } from '../../api/api.jsx'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'
import '../forms.css'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'

import PopupText from 'src/utils/popupText'

// This file is for the Gynae tab in the WCE station, not to be confused with the Gynae tab in the History Taking station

const validationSchema = Yup.object({
  GYNAE1: Yup.string().required(),
  GYNAE2: Yup.string(),
  GYNAEShortAns2: Yup.string().when('GYNAE2', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE3: Yup.string().required(),
  GYNAEShortAns3: Yup.string().when('GYNAE3', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE4: Yup.string().required(),
  GYNAEShortAns4: Yup.string().when('GYNAE4', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE5: Yup.string().required(),
  GYNAEShortAns5: Yup.string().when('GYNAE5', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE6: Yup.string().required(),
  GYNAEShortAns6: Yup.string().when('GYNAE6', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE7: Yup.string().required(),
  GYNAEShortAns7: Yup.string().when('GYNAE7', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE8: Yup.string().required(),
  GYNAEShortAns8: Yup.string().when('GYNAE8', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE9: Yup.string(),
  GYNAE10: Yup.string().required(),
  GYNAEShortAns10: Yup.string().when('GYNAE10', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE11: Yup.string().required(),
  GYNAEShortAns11: Yup.string().when('GYNAE11', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
  GYNAE13: Yup.string().required(),
  GYNAEShortAns13: Yup.string().when('GYNAE13', {
    is: 'Yes',
    then: (schema) => schema.required('Please specify'),
    otherwise: (schema) => schema,
  }),
})

const initialValues = {
  GYNAE1: '',
  GYNAE2: '',
  GYNAEShortAns2: '',
  GYNAE3: '',
  GYNAEShortAns3: '',
  GYNAE4: '',
  GYNAEShortAns4: '',
  GYNAE5: '',
  GYNAEShortAns5: '',
  GYNAE6: '',
  GYNAEShortAns6: '',
  GYNAE7: '',
  GYNAEShortAns7: '',
  GYNAE8: '',
  GYNAEShortAns8: '',
  GYNAE9: '',
  GYNAE10: '',
  GYNAEShortAns10: '',
  GYNAE11: '',
  GYNAEShortAns11: '',
  GYNAE13: '',
  GYNAEShortAns13: '',
}

const formOptions = {
  yesNo: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const GynaeForm = () => {
  const navigate = useNavigate()
  const { patientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [saveData, setSaveData] = useState(initialValues)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, 'gynaeForm')
      setSaveData({ ...initialValues, ...savedData })
    }
    fetchData()
  }, [patientId])

  return (
    <Formik
      initialValues={saveData}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        isLoading(true)
        const response = await submitForm(values, patientId, 'gynaeForm')
        setTimeout(() => {
          isLoading(false)
          setSubmitting(false)
          if (response.result) {
            alert('Successfully submitted form')
            navigate('/app/dashboard')
          } else {
            alert(`Unsuccessful. ${response.error}`)
          }
        }, 80)
      }}
      enableReinitialize
    >
      {({ handleSubmit, errors, submitCount }) => (
        <Paper elevation={2} p={0} m={0}>
          <form onSubmit={handleSubmit} className='form--div fieldPadding'>
            <h1>Gynecology</h1>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant='h6' component='h3' sx={{ color: 'error.main', fontWeight: 'bold' }}>
                Only ask if participant is female
              </Typography>
            </Alert>

            <FastField
              name='GYNAE1'
              label='Are you menopaused? (i.e. > 1 year from your last menstrual period)'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />

            <PopupText qnNo='GYNAE1' triggerValue='Yes'>
              <FastField
                name='GYNAE2'
                label='Do you have any postmenopausal bleeding? (bleeding after menopause)'
                component={CustomRadioGroup}
                options={formOptions.yesNo}
                row
              />
              <FastField
                name='GYNAEShortAns2'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE3'
              label='Do you have any abnormal per vaginal bleeding? e.g. bleeding between periods, prolonged menses, bleeding after intercourse'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE3' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns3'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE4'
              label='Do you have irregular period or less than 4 menstrual cycles a year?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE4' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns4'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE5'
              label='Do you have any menstrual concerns such as extremely heavy menses/severe pain during menses?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE5' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns5'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE6'
              label='Do you feel any abnormal abdominal masses?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE6' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns6'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE7'
              label='Do you have any new onset abdominal pain/bloatedness?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE7' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns7'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE8'
              label='Do you have any fertility concerns or any difficulties conceiving after trying for more than 1 year?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE8' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns8'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
              <FastField
                name='GYNAE9'
                label='If so, are you keen to investigate for the cause of subfertility and to pursue fertility treatment?'
                component={CustomRadioGroup}
                options={formOptions.yesNo}
                row
              />
            </PopupText>

            <FastField
              name='GYNAE10'
              label='Do you have any urinary symptoms such as urinary leakage, recurrent urinary infection, urgency or nocturia?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE10' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns10'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <FastField
              name='GYNAE11'
              label='Do you feel any lump in vagina or have any pelvic organ prolapse?'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE11' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns11'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <h3>
              Based on Advanced Gynae Screening, please kindly refer her to the following
              gynecological service for further evaluation:
            </h3>

            <FastField
              name='GYNAE13'
              label='Referral was given'
              component={CustomRadioGroup}
              options={formOptions.yesNo}
              row
            />
            <PopupText qnNo='GYNAE13' triggerValue='Yes'>
              <FastField
                name='GYNAEShortAns13'
                label='Please specify:'
                component={CustomTextField}
                multiline
                rows={3}
              />
            </PopupText>

            <ErrorNotification
              show={submitCount > 0 && Object.keys(errors || {}).length > 0}
              message="Please fill in all required fields correctly."
            />

            <div>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button type='submit' variant='contained' color='primary' disabled={loading}>
                  Submit
                </Button>
              )}
            </div>
            <Divider />
          </form>
        </Paper>
      )}
    </Formik>
  )
}

export default GynaeForm