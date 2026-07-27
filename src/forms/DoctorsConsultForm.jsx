import { FastField, Form, Formik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import { Button, CircularProgress, Divider, Grid, Paper, Typography } from '@mui/material'

import { submitForm } from '../api/formHelpers.jsx'
import { showFormSubmitError, showFormSubmitSuccess } from 'src/components/form-components/FormSubmitStatusHost'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/patientData'
import { addToDocPdfQueue } from '../services/printQueues'
import './fieldPadding.css'
import allForms from './forms.json'

import CustomTextField from 'src/components/form-components/CustomTextField'
import ErrorNotification from 'src/components/form-components/ErrorNotification'
import PopupText from '../utils/popupText'
import CustomRadioGroup from 'src/components/form-components/CustomRadioGroup.jsx'

const initialValues = {
  doctorSConsultQ1: '',
  doctorSConsultQ2: '',
  doctorSConsultQ3: '',
  doctorSConsultQ4: '',
  doctorSConsultQ5: '',
  doctorSConsultQ6: '',
  doctorSConsultQ7: '',
  doctorSConsultQ8: '',
  doctorSConsultQ9: '',
  doctorSConsultQ10: '',
  doctorSConsultQ11: '',
  doctorSConsultQ12: '',
  doctorSConsultQ13: '',
}

const validationSchema = Yup.object().shape({
  doctorSConsultQ1: Yup.string().required('This field is required'),
  doctorSConsultQ2: Yup.string().required('This field is required'),
  doctorSConsultQ3: Yup.string().required('This field is required'),
  doctorSConsultQ4: Yup.string().required('This field is required'),
  doctorSConsultQ5: Yup.string().when('doctorSConsultQ4', {
    is: 'Yes',
    then: (schema) => schema.required('Reason is required when referral is selected'),
    otherwise: (schema) => schema.notRequired(),
  }),
  doctorSConsultQ6: Yup.string().required('This field is required'),
  doctorSConsultQ7: Yup.string().when('doctorSConsultQ6', {
    is: 'Yes',
    then: (schema) => schema.required('Reason is required when referral is selected'),
    otherwise: (schema) => schema.notRequired(),
  }),
  doctorSConsultQ13: Yup.string().required('This field is required'),
  doctorSConsultQ8: Yup.string().required('This field is required'),
  doctorSConsultQ9: Yup.string().when('doctorSConsultQ8', {
    is: 'Yes',
    then: (schema) => schema.required('Reason is required when referral is selected'),
    otherwise: (schema) => schema.notRequired(),
  }),
  doctorSConsultQ10: Yup.string().required('This field is required'),
  doctorSConsultQ11: Yup.string().required('This field is required'),
  doctorSConsultQ12: Yup.string().required('This field is required'),
})

const formOptions = {
  doctorSConsultYESNO: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  doctorSConsultQ11: [{ label: 'Yes', value: 'Yes' }],
}

const formName = 'doctorConsultForm'

const DoctorsConsultForm = () => {
  const { patientId } = useContext(FormContext)
  const [loading, setLoading] = useState(false)
  const [loadingSidePanel, setLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState(initialValues)

  // forms to retrieve for side panel
  const [hcsr, setHcsr] = useState({})
  const [ophthal, setOphthal] = useState({})
  const [audio, setAudio] = useState({})
  const [geriPHQ, setPHQ] = useState({})
  const [lung, setLung] = useState({})
  const [triage, setTriage] = useState({})
  const [pmhx, setPMHX] = useState({})
  const [social, setSocial] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setSaveData({ ...initialValues, ...savedData })

      const loadPastForms = async () => {
        const hcsrData = getSavedData(patientId, allForms.hxHcsrForm)
        const ophthalData = getSavedData(patientId, allForms.ophthalForm)
        const audioData = getSavedData(patientId, allForms.audiometryForm)
        const lungData = getSavedData(patientId, allForms.lungForm)
        const PHQDATA = getSavedData(patientId, allForms.geriPhqForm)
        const triageData = getSavedData(patientId, allForms.triageForm)
        const pmhxData = getSavedData(patientId, allForms.hxNssForm)
        const socialData = getSavedData(patientId, allForms.hxSocialForm)

        Promise.all([
          hcsrData,
          ophthalData,
          audioData,
          lungData,
          PHQDATA,
          triageData,
          pmhxData,
          socialData,
        ]).then((result) => {
          setHcsr(result[0])
          setOphthal(result[1])
          setAudio(result[2])
          setLung(result[3])
          setPHQ(result[4])
          setTriage(result[5])
          setPMHX(result[6])
          setSocial(result[7])
          setLoadingSidePanel(false)
        })
      }
      loadPastForms()
    }
    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    try {
      const response = await submitForm(values, patientId, formName)

      if (response.result) {
        if (values.doctorSConsultQ12 === 'Yes') {
          await addToDocPdfQueue(patientId, values.doctorSConsultQ1)
        }

        setTimeout(async () => {
          await showFormSubmitSuccess()
          navigate('/app/dashboard')
        }, 80)
      } else {
        setTimeout(() => {
          showFormSubmitError(`Unsuccessful. ${response.error}`)
        }, 80)
      }
    } catch (error) {
      showFormSubmitError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={saveData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, isSubmitting, submitCount }) => (
        <Form className='fieldPadding'>
          <div className='form--div'>
            <h1>Doctor&apos;s Station</h1>
            <Typography variant='h4' fontWeight='bold'>
              Doctor&apos;s Name
            </Typography>
            <FastField
              name='doctorSConsultQ1'
              label='doctorQ1'
              component={CustomTextField}
              fullWidth
              multiline
            />
            <Typography variant='h4' fontWeight='bold'>
              Clinical Findings
            </Typography>
            <FastField
              name='doctorSConsultQ2'
              label='doctorQ2'
              component={CustomTextField}
              fullWidth
              multiline
              minRows={4}
            />
            <Typography variant='h4' fontWeight='bold'>
              Doctor&apos;s Memo
            </Typography>
            <FastField
              name='doctorSConsultQ3'
              label='doctorQ3'
              component={CustomTextField}
              fullWidth
              multiline
              minRows={6}
            />
            <h3>Refer to dietitian?</h3>
            <FastField
              name='doctorSConsultQ4'
              label='doctorQ4'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
            <PopupText qnNo='doctorSConsultQ4' triggerValue='Yes'>
              <Typography variant='h6' component='h3' gutterBottom>
                Reason for Dietitian referral
              </Typography>
              <FastField
                name='doctorSConsultQ5'
                label='doctorQ5'
                component={CustomTextField}
                fullWidth
                multiline
                minRows={2}
              />
            </PopupText>
            <h3>Refer to Social Support?</h3>
            <FastField
              name='doctorSConsultQ6'
              label='doctorQ6'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
            <PopupText qnNo='doctorSConsultQ6' triggerValue='Yes'>
              <Typography variant='h6' component='h3' gutterBottom>
                Reason for Social Support Rreferral
              </Typography>
              <FastField
                name='doctorSConsultQ7'
                label='doctorQ7'
                component={CustomTextField}
                fullWidth
                multiline
                minRows={2}
              />
            </PopupText>
            <h3>Refer to Mental Health? (and indicated on Form A)</h3>
            <FastField
              name='doctorSConsultQ13'
              label='doctorQ13'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
            <h3>Refer to Dental?</h3>
            <FastField
              name='doctorSConsultQ8'
              label='doctorQ8'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
            <PopupText qnNo='doctorSConsultQ8' triggerValue='Yes'>
              <Typography variant='h6' component='h3' gutterBottom>
                Reason for Dental referral
              </Typography>
              <FastField
                name='doctorSConsultQ9'
                label='doctorQ9'
                component={CustomTextField}
                fullWidth
                multiline
                minRows={2}
              />
            </PopupText>

            <h3>Does patient require urgent follow up</h3>
            <FastField
              name='doctorSConsultQ10'
              label='doctorQ10'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
            <h3>Completed Doctor&apos;s station. Please check that Form A is filled.</h3>
            <FastField
              name='doctorSConsultQ11'
              label='doctorQ11'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultQ11}
            />

            <h3>Does this patient need a memo to be printed?</h3>
            <FastField
              name='doctorSConsultQ12'
              label='doctorQ12'
              component={CustomRadioGroup}
              options={formOptions.doctorSConsultYESNO}
              row
            />
          </div>

          <ErrorNotification
            show={Object.keys(errors).length > 0 && submitCount > 0}
            message='Please correct the errors above before submitting.'
          />

          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Submit
              </Button>
            )}
          </div>
          <Divider />
        </Form>
      )}
    </Formik>
  )

  const renderSidePanel = () => (
    <div className='summary--question-div'>
      <h2>Patient Requires Referrals For: </h2>
      <ul>
        {!geriPHQ ? <p className='red'>nil geriPHQ data!</p> : <></>}
        <li>
          {geriPHQ && geriPHQ.PHQ10 ? (
            <p>
              Patient scores <strong>{geriPHQ.PHQ10}</strong> in the PHQ.
            </p>
          ) : (
            <p className='red'>nil PHQ10 data!</p>
          )}
          <ul>
            <li>
              {geriPHQ && geriPHQ.PHQ9 ? (
                <p>
                  The patient answered: <strong>{geriPHQ.PHQ9}</strong> to &apos;Thoughts that you
                  would be better off dead or hurting yourself in some way&apos;.
                </p>
              ) : (
                <p className='red'>nil PHQ9 data!</p>
              )}
            </li>
            <li>
              {geriPHQ && geriPHQ.PHQextra9 ? (
                <p>
                  When asked &apos;Do you want to take your life now&apos;, patient said{' '}
                  <strong>{geriPHQ.PHQextra9}</strong>
                </p>
              ) : (
                <p className='red'>nil PHQextra9 data!</p>
              )}
            </li>
          </ul>
        </li>

        {!triage ? <p className='red'>nil triage data!</p> : <></>}
        {triage.triageQ9 ? (
          <li>
            <p>
              Patient had blood pressure of{' '}
              <strong>
                {triage.triageQ7}/{triage.triageQ8}
              </strong>
            </p>
          </li>
        ) : null}

        {!ophthal ? <p className='red'>nil ophthal data!</p> : <></>}
        {ophthal.OphthalQ11 ? (
          <li>
            <p>Visual Check Results.</p>
            <ul>
              <li>
                <p>Visual Acuity</p>
                <table
                  style={{
                    border: '1px solid black',
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '60%',
                  }}
                >
                  <tr style={{ border: '1px solid black' }}>
                    <th style={{ border: '1px solid black' }}></th>
                    <th style={{ border: '1px solid black' }}>Right Eye</th>
                    <th style={{ border: '1px solid black' }}>Left Eye</th>
                  </tr>
                  <tr style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black' }}>Without Pinhole Occluder</td>
                    <td style={{ border: '1px solid black' }}>6/{ophthal.OphthalQ3}</td>
                    <td style={{ border: '1px solid black' }}>6/{ophthal.OphthalQ4}</td>
                  </tr>
                  <tr style={{ border: '1px solid black' }}>
                    <td style={{ border: '1px solid black' }}>With Pinhole Occluder</td>
                    <td style={{ border: '1px solid black' }}>6/{ophthal.OphthalQ5}</td>
                    <td style={{ border: '1px solid black' }}>6/{ophthal.OphthalQ6}</td>
                  </tr>
                </table>
              </li>
              <li>
                <p>
                  Type of vision error, if any: <strong>{ophthal.OphthalQ10}</strong>
                </p>
                <p>
                  Previous eye surgery or condition:{' '}
                  <strong>
                    {ophthal.OphthalQ1}. {ophthal.OphthalQ2}
                  </strong>
                </p>
                <p>
                  Is currently on any eye review/ consulting any eye specialist:{' '}
                  <strong>{ophthal.OphthalQ8}</strong>
                </p>
                <p>
                  <strong>{ophthal.OphthalQ9}</strong>
                </p>
                {hcsr ? (
                  <p>
                    Patient&apos;s history indication of hearing problems:{' '}
                    <strong>{hcsr.hxHcsrQ3}</strong>
                  </p>
                ) : (
                  <p className='red'>nil hcsr data!</p>
                )}
              </li>
            </ul>
          </li>
        ) : null}

        {!audio ? <p className='red'>nil audio data!</p> : <></>}
        {audio ? (
          <li>
            <p>Patient&apos;s audiometry results:</p>
            <ul>
              <li>
                <p>
                  <strong>{audio.AudiometryQ13}</strong>
                </p>
                <p>
                  Details: <strong>{audio.AudiometryQ12}</strong>
                </p>
                {hcsr ? (
                  <p>
                    Patient&apos;s indication of hearing problems: <strong>{hcsr.hxHcsrQ4}</strong>
                  </p>
                ) : (
                  <p className='red'>nil hcsr data!</p>
                )}
              </li>
            </ul>
          </li>
        ) : null}

        <h2>Patient&apos;s Relevant History: </h2>
        {triage ? (
          <li>
            <p>Biodata</p>
            <ul>
              <li>
                <p>
                  BMI: <strong>{triage.triageQ12}</strong>
                </p>
              </li>
              <li>
                <p>
                  Waist Circumference: <strong>{triage.triageQ13}</strong>
                </p>
              </li>
            </ul>
          </li>
        ) : (
          <p className='red'>nil triage data!</p>
        )}

        {hcsr ? (
          <li>
            <p>Presenting Complaints</p>
            <ul>
              <li>
                <p>
                  Health Concerns: <strong>{hcsr.hxHcsrQ7}</strong>
                  <br></br>
                  <strong>{hcsr.hxHcsrShortAnsQ7}</strong>
                </p>
              </li>
              <li>
                <p>
                  Red Flags: <strong>{hcsr.hxhcsrQ8}</strong>
                </p>
              </li>
            </ul>
          </li>
        ) : (
          <p className='red'>nil hcsr data!</p>
        )}

        {pmhx ? (
          <li>
            <p>Past Medical History</p>
            <ul>
              <li>
                <p>
                  Chronic conditions: <strong>{pmhx.PMHX1}</strong>
                </p>
              </li>
              <li>
                <p>
                  Long term medications and compliance: <strong>{pmhx.PMHX2}</strong>
                </p>
              </li>
              <li>
                <p>
                  Drug allergies: <strong>{pmhx.PMHX3}</strong>
                  <br></br>
                  <strong>{pmhx.PMHXShortAns3}</strong>
                </p>
              </li>
              <li>
                <p>
                  Alternative medicine: <strong>{pmhx.PMHX4}</strong>
                  <br></br>
                  <strong>{pmhx.PMHXShortAns4}</strong>
                </p>
              </li>
              <li>
                <p>
                  Regular screening: <strong>{pmhx.PMHX6}</strong>
                </p>
              </li>
              <li>
                <p>
                  Reason for referral: <strong>{pmhx.PMHXShortAns7}</strong>
                </p>
              </li>
            </ul>
          </li>
        ) : (
          <p className='red'>nil pmhx data!</p>
        )}

        {social ? (
          <li>
            <p>Social History</p>
            <ul>
              <li>
                <p>
                  Currently Smoking: <strong>{social.SOCIAL10}</strong>
                  <br></br>
                  <strong>{social.SOCIALShortAns10} pack-years</strong>
                </p>
                <p>
                  Past Smoking: <strong>{social.SOCIAL11}</strong>
                  <br></br>
                  <strong>{social.SOCIALShortAns11}</strong>
                </p>
              </li>
              <li>
                <p>
                  Alcohol: <strong>{social.SOCIAL12}</strong>
                </p>
              </li>
              <li>
                <p>
                  Exercise: <strong>{social.SOCIAL14}</strong>
                </p>
              </li>
            </ul>
          </li>
        ) : (
          <p className='red'>nil social data!</p>
        )}
      </ul>
    </div>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid container>
        <Grid item xs={9}>
          <Paper elevation={2} p={0} m={0}>
            {renderForm()}
          </Paper>
        </Grid>
        <Grid
          item
          xs={3}
          p={1}
          display='flex'
          flexDirection='column'
          alignItems={loadingSidePanel ? 'center' : 'left'}
        >
          {loadingSidePanel ? <CircularProgress /> : renderSidePanel()}
        </Grid>
      </Grid>
    </Paper>
  )
}

DoctorsConsultForm.contextType = FormContext

export default function DoctorsConsultform(props) {
  const navigate = useNavigate()
  return <DoctorsConsultForm {...props} navigate={navigate} />
}
