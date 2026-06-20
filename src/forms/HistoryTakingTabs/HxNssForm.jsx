import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import PopupText from 'src/utils/popupText.jsx'
import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import { FormContext } from '../../api/utils.js'
import CustomTextField from 'src/components/form-components/CustomTextField.jsx'
import CustomCheckboxGroup from '../../components/form-components/CustomCheckboxGroup'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import { getSavedData } from '../../services/patientData'
import allForms from '../forms.json'

// IMPORTANT: Formerly NSS, renamed to PMHX as of PHS 2022. MongoDB forms not renamed, only tab name
const formName = 'hxNssForm'

const initialValues = {
  PMHX1: '',
  PMHX2: '',
  PMHX3: '',
  PMHXShortAns3: '',
  PMHX4: '',
  PMHXShortAns4: '',
  PMHX5: [],
  PMHXShortAns5: '',
  PMHX6: '',
  PMHX7: '',
  PMHXShortAns7: '',
  PMHX8: '',
  PMHXShortAns8: '',
  PMHX9: '',
  PMHXShortAns9: '',
}

const validationSchema = Yup.object({
  PMHX1: Yup.string().required('Required'),
  PMHX2: Yup.string().required('Required'),
  PMHX3: Yup.string().required('Required'),
  PMHX4: Yup.string().required('Required'),
  PMHX6: Yup.string().required('Required'),
  PMHX7: Yup.string().required('Required'),
})

const formOptions = {
  PMHX3: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not answered', value: 'No' },
  ],
  PMHX4: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX5: [
    { label: 'Kidney Disease', value: 'Kidney Disease' },
    { label: 'Hypertension', value: 'Hypertension' },
    { label: 'Hyperlipidemia', value: 'Hyperlipidemia' },
    { label: 'Diabetes/Pre-Diabetic', value: 'Diabetes/Pre-Diabetic' },
    {
      label:
        'Heart disease (includes heart attack, heart failure, heart valve disease, stroke, blood vessel/vascular disease)',
      value: 'Heart disease',
    },
    { label: 'Others (eg. Fatty liver / respiratory problems)', value: 'Others' },
  ],
  PMHX7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX8: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX9: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  PMHX10: [
    { label: 'Yes, please specify', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not answered', value: 'No' },
  ],
}

export default function HxNssForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [regForm, setRegForm] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      const regData = await getSavedData(patientId, allForms.registrationForm)
      setSavedData({ ...initialValues, ...res })
      setRegForm(regData)
    }

    fetchData()
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

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>PAST MEDICAL HISTORY</strong>
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Do you have any chronic conditions? Take a short chronic history summarizing:
          </Typography>
          <Typography component='ol'>
            <li>Conditions</li>
            <li>Duration</li>
            <li>Control</li>
            <li>Compliance</li>
            <li>Complications</li>
            <li>Follow up route (specify whether GP/Polyclinic/FMC/SOC)</li>
          </Typography>
          <FastField
            name='PMHX1'
            component={CustomTextField}
            label='PMHX1'
            sx={{ mb: 5 }}
            multiline
          />

          <Typography variant='subtitle1' color='error' fontWeight='bold' gutterBottom>
            If participant is not engaged with any follow-up, ask:
          </Typography>
          <Typography gutterBottom>
            &quot;What is the reason that you&apos;re not following up with your doctor for your
            existing conditions?&quot;
            <br />
            e.g. do not see the purpose for tests, busy/no time, lack of access
            <br />
            e.g. mobility issues, financial issues, fear of doctors/clinics/hospitals etc
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you on any long term medications? Are you compliant to your medications?
          </Typography>
          <FastField
            name='PMHX2'
            component={CustomTextField}
            label='PMHX2'
            fullWidth
            multiline
            sx={{ mb: 5 }}
          />

          <Typography variant='subtitle1' color='error' fontWeight='bold' gutterBottom>
            If a participant is not compliant to medications, do probe further on his/her reasons
            for not consuming medications as prescribed.
          </Typography>
          <Typography gutterBottom>
            e.g. Medication not effective? Can be managed without medication? Forget to take?
            Lost/Ran out of medication?
          </Typography>

          <Typography variant='subtitle1' fontWeight='bold'>
            Do you have any food allergies? If yes, please specify.
          </Typography>
          <FastField
            name='PMHX3'
            label='PMHX3'
            component={CustomRadioGroup}
            options={formOptions.PMHX3}
            row
          />
          <PopupText qnNo='PMHX3' triggerValue='Yes'>
            <Typography fontWeight='bold'>Please specify:</Typography>
            <FastField
              name='PMHXShortAns3'
              label='PMHXShortAns3 (Specify food allergies here)'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography fontWeight='bold'>
            Do you have any drug allergies? If yes, please specify.
          </Typography>
          <FastField
            name='PMHX10'
            label='PMHX10'
            component={CustomRadioGroup}
            options={formOptions.PMHX10}
            row
          />
          <PopupText qnNo='PMHX10' triggerValue='Yes'>
            <Typography fontWeight='bold'>Please specify:</Typography>
            <FastField
              name='PMHXShortAns10'
              label='PMHXShortAns10 (Specify drug allergies here)'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography variant='subtitle1' fontWeight='bold'>
            Are you on any alternative medicine including traditional chinese medications,
            homeopathy etc?
          </Typography>
          <FastField
            name='PMHX4'
            label='PMHX4'
            component={CustomRadioGroup}
            options={formOptions.PMHX4}
            row
          />
          <PopupText qnNo='PMHX4' triggerValue='Yes'>
            <Typography fontWeight='bold'>Please specify:</Typography>
            <FastField
              name='PMHXShortAns4'
              component={CustomTextField}
              label='PMHXShortAns4 (Specify alternative medicine here)'
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          <Typography variant='subtitle1' fontWeight='bold'>
            Tick if you have these conditions:
          </Typography>

          {/* Check if this works in Mongo */}
          <FastField
            name='PMHX5'
            component={CustomCheckboxGroup}
            options={formOptions.PMHX5}
            label='PMHX5'
            row
          />
          {/* <PopupText qnNo='PMHX5' triggerValue='Others'> */}
          <Typography fontWeight='bold'>Please specify if others:</Typography>
          <FastField
            name='PMHXShortAns5'
            component={CustomTextField}
            label='PMHXShortAns5 (Specify other conditions here)'
            fullWidth
            multiline
            sx={{ mb: 3 }}
          />
          {/* </PopupText> */}

          <Typography variant='subtitle1' fontWeight='bold'>
            If a participant does not elicit any Past Medical History, indicate if they:
            <ol>
              <li>Regularly go for screening/blood tests etc.</li>
              <li>If no, ask why.</li>
            </ol>
          </Typography>
          <FastField name='PMHX6' component={CustomTextField} label='PMHX6' fullWidth multiline />

          <Typography variant='subtitle1' fontWeight='bold'>
            Please tick to highlight if you feel Past Medical History requires closer scrutiny by
            doctors later. Explain reasons for recommendation.
          </Typography>
          <Typography variant='subtitle1' fontWeight='bold'>
            For participant with DM, refer to Doctor&apos;s Station if:
          </Typography>
          <ul>
            <li>Symptomatic, and non-compliant</li>
            <li>Asymptomatic, and non-compliant</li>
          </ul>
          <Typography>
            Also refer to Doctor&apos;s Station if participant has not been diagnosed with DM, but
            has signs of DM (polyuria, polydipsia, periphery neuropathy, blurring of vision etc.)
          </Typography>

          <FastField
            name='PMHX7'
            label='PMHX7'
            component={CustomRadioGroup}
            options={formOptions.PMHX7}
            row
          />

          <PopupText qnNo='PMHX7' triggerValue='Yes'>
            <FastField
              name='PMHXShortAns7'
              component={CustomTextField}
              label="PMHXShortAns7 (Explain reasons for recommendation to Doctor's Station)"
              fullWidth
              multiline
              sx={{ mb: 3 }}
            />
          </PopupText>

          {/* For participants who are 60 and above, show PMHX8 and PMHX9 */}
          {regForm.registrationQ4 >= 60 && (
            <>
              <Typography variant='subtitle1' fontWeight='bold'>
                <span style={{ color: '#d32f2f' }}>For geriatric participants,</span> has the senior
                seen an ENT specialist before?
              </Typography>
              <FastField
                name='PMHX8'
                component={CustomRadioGroup}
                label='PMHX8'
                options={formOptions.PMHX8}
                row
              />
              <PopupText qnNo='PMHX8' triggerValue='Yes'>
                <FastField
                  name='PMHXShortAns8'
                  component={CustomTextField}
                  label='PMHXShortAns8 (Please specify)'
                  fullWidth
                  multiline
                  sx={{ mb: 3 }}
                />
              </PopupText>

              <Typography variant='subtitle1' fontWeight='bold'>
                <span style={{ color: '#d32f2f' }}>For geriatric participants,</span> did he/she
                answer yes to any of the following questions?
              </Typography>
              <Typography component='ol' type='a'>
                <li>Have you had your hearing aids for more than 5 years?</li>
                <li>
                  Has it been 3 years or more since you used your hearing aids (i.e. did not use the
                  hearing aids for more than 3 years)?
                </li>
                <li>Are your hearing aids spoilt/not working?</li>
              </Typography>
              <FastField
                name='PMHX9'
                label='PMHX9'
                component={CustomRadioGroup}
                options={formOptions.PMHX9}
                row
              />
              <PopupText qnNo='PMHX9' triggerValue='Yes'>
                <FastField
                  name='PMHXShortAns9'
                  component={CustomTextField}
                  label='PMHXShortAns9 (Please specify which questions the patient answered yes to)'
                  fullWidth
                  multiline
                  sx={{ mb: 3 }}
                />
              </PopupText>
            </>
          )}

          <ErrorNotification
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message='Please fill in all required fields correctly.'
          />

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {loading || isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            )}
          </div>
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
