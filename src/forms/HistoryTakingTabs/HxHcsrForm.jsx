import { Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { submitForm } from '../../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from 'src/utils/popupText'

const formName = 'hxHcsrForm'

const initialValues = {
  hxHcsrQ1: '',
  hxHcsrQ2: '',
  hxHcsrQ3: '',
  hxHcsrShortAnsQ3: '',
  hxHcsrQ4: '',
  hxHcsrShortAnsQ4: '',
  hxHcsrQ5: '',
  hxHcsrQ6: '',
  hxHcsrQ7: '',
  hxHcsrShortAnsQ7: '',
  hxhcsrQ8: '',
}

const validationSchema = Yup.object({
  hxHcsrQ1: Yup.string().required('Required'),
  hxHcsrQ2: Yup.string().required('Required'),
  hxHcsrQ3: Yup.string().required('Required'),
  hxHcsrQ6: Yup.string().required('Required'),
  hxHcsrQ7: Yup.string().required('Required'),
})

const formOptions = {
  hxHcsrQ3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  hxHcsrQ4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  hxHcsrQ6: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  hxHcsrQ5: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not Applicable (under 60)', value: 'Not Applicable (under 60)' },
  ],
  hxHcsrQ7: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

export default function HxHcsrForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...res })
    }

    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      await showFormSubmitSuccess()
      changeTab(null, nextTab)
    } else {
      showFormSubmitError(`Unsuccessful. ${response.error}`)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitCount, errors }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>PARTICIPANT IDENTIFICATION</strong>
          </Typography>
          <Typography gutterBottom>
            <span style={{ color: 'error', fontWeight: 'bold' }}>
              Please verify participant&apos;s identity using:
              <ol type='A'>
                <li>APP ID on wristband</li>
                <li>INITIALS</li>
              </ol>
            </span>{' '}
          </Typography>

          <Typography variant='h4' fontWeight='bold'>
            Please enter History-taker&apos;s surname followed by initials (e.g. Tan J J)
          </Typography>
          <FastField
            name='hxHcsrQ1'
            label='hxHcsrQ1'
            component={CustomTextField}
            fullWidth
            multiline
          />

          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW
            <br />
            1. HEALTH CONCERNS
          </Typography>

          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            If the participant has any <u>presenting complaints or concern(s)</u>, please take a
            brief history. (Please write NIL if otherwise).
          </Typography>
          <Typography gutterBottom variant='h4' fontWeight='bold' sx={{ mt: 4 }}>
            &quot;Do you have any health issues that you are currently concerned about?&quot;
            <br />
            &quot;最近有没有哪里不舒服&quot;
          </Typography>
          <FastField
            name='hxHcsrQ2'
            label='hxHcsrQ2'
            component={CustomTextField}
            fullWidth
            multiline
          />

          <Typography variant='subtitle1' fontWeight='bold' color='error'>
            Please advise that there will be no diagnosis or prescription made at our screening.
            <br />
            Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting
            treatment for their problems.
          </Typography>

          <Typography variant='h4' fontWeight='bold' sx={{ mt: 4 }}>
            Do you have any vision problems? Please specify if yes. Exclude complaints like
            unspecific itchy eyes etc.
          </Typography>
          <FastField
            name='hxHcsrQ3'
            label='hxHcsrQ3'
            component={CustomRadioGroup}
            options={formOptions.hxHcsrQ3}
            row
          />

          <PopupText qnNo='hxHcsrQ3' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='hxHcsrShortAnsQ3'
              label='hxHcsrShortAnsQ3'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='h4' fontWeight='bold'>
            Do you have any hearing problems? Please specify if yes.
          </Typography>
          <FastField
            name='hxHcsrQ4'
            label='hxHcsrQ4'
            component={CustomRadioGroup}
            options={formOptions.hxHcsrQ4}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Please specify:
          </Typography>
          <FastField
            name='hxHcsrShortAnsQ4'
            label='hxHcsrShortAnsQ4'
            component={CustomTextField}
            fullWidth
            multiline
            sx={{ mb: 3, mt: 1 }}
          />

          <Typography variant='h4' fontWeight='bold'>
            If you are 60 and above, do you currently use hearing aids/have been detected to require
            hearing aids?
          </Typography>
          <FastField
            name='hxHcsrQ5'
            label='hxHcsrQ5'
            component={CustomRadioGroup}
            options={formOptions.hxHcsrQ5}
            row
          />

          <Typography variant='h4' fontWeight='bold'>
            Please tick to highlight if you feel SYSTEMS REVIEW require closer scrutiny by doctors
            later or if participant strongly insists.
          </Typography>
          <FastField
            name='hxHcsrQ6'
            label='hxHcsrQ6'
            component={CustomRadioGroup}
            options={formOptions.hxHcsrQ6}
            row
          />

          <Typography variant='h4' fontWeight='bold'>
            Please indicate if you feel that HEALTH CONCERNS require closer scrutiny by doctors
            later or if participant strongly insists.
          </Typography>
          <FastField
            name='hxHcsrQ7'
            label='hxHcsrQ7'
            component={CustomRadioGroup}
            options={formOptions.hxHcsrQ7}
            row
          />

          <PopupText qnNo='hxHcsrQ7' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              Please specify:
            </Typography>
            <FastField
              name='hxHcsrShortAnsQ7'
              label='hxHcsrShortAnsQ7'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='h4' fontWeight='bold'>
            Below is a non-exhaustive list of possible red flags:
          </Typography>
          <ul>
            <li>
              <u>Constitutional Symptoms:</u> LOA, LOW, Fever
            </li>
            <li>
              <u>CVS:</u> Chest pain, Palpitations
            </li>
            <li>
              <u>Respi:</u> SOB, Haemoptysis, Night Sweat, Cough
            </li>
            <li>
              <u>GI:</u> change in BO habits, PR bleed, Haematemesis
            </li>
            <li>Frequent falls</li>
          </ul>

          <Typography variant='subtitle1' fontWeight='bold'>
            Based on&nbsp;
            <span style={{ color: 'red', textDecoration: 'underline' }}>
              participant&apos;s health concerns,
            </span>
            &nbsp;please rule out red flags <b>(Please write NIL if otherwise)</b>
          </Typography>
          <FastField
            name='hxhcsrQ8'
            label='hxhcsrQ8'
            component={CustomTextField}
            fullWidth
            multiline
            sx={{ mb: 3, mt: 1 }}
          />

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

          <br />
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
