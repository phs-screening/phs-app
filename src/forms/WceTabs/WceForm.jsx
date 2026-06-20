import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Formik, useFormikContext, Field } from 'formik'
import * as Yup from 'yup'

import { Divider, Paper, Grid, CircularProgress, Button } from '@mui/material'

import { submitForm } from '../../api/formHelpers.jsx'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/patientData'
import '../fieldPadding.css'
import allForms from '../forms.json'

import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import ErrorNotification from '../../components/form-components/ErrorNotification'

const formName = 'wceForm'

const formOptions = {
  wceQ3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not Applicable', value: 'Not Applicable' },
  ],
  wceQ4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Not Applicable', value: 'Not Applicable' },
  ],
}

const validationSchema = Yup.object({
  wceQ3: Yup.string().required(),
  wceQ4: Yup.string().required(),
})

const initialValues = {
  wceQ3: '',
  wceQ4: '',
}

// HPV Eligibility Checker Component
function CheckHpvEligibility() {
  const { values } = useFormikContext()
  const { wceQ8, wceQ9, wceQ10, wceQ11, wceQ12 } = values

  if (
    (wceQ8 === '5 years or longer' || wceQ8 === 'Never before') &&
    wceQ9 === 'Yes' &&
    wceQ10 === 'No' &&
    (wceQ11 === '3 years or longer' || wceQ11 === 'Never before')
  ) {
    if (wceQ12 === 'Yes') {
      return (
        <Fragment>
          <p className='blue'>
            Patient is eligibile for HPV Test at both off-site clinic site and on-site
          </p>
        </Fragment>
      )
    } else if (wceQ12 === 'No') {
      return (
        <Fragment>
          <p className='blue'>Patient is eligibile for HPV Test only at off-site clinic site</p>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <p className='red'>ERROR</p>
        </Fragment>
      )
    }
  } else {
    return (
      <Fragment>
        <p className='blue'>Patient is not eligibile for HPV Test</p>
      </Fragment>
    )
  }
}

const WceForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, isLoading] = useState(false)
  const [loadingSidePanel, isLoadingSidePanel] = useState(true)
  const [saveData, setSaveData] = useState(initialValues)
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [hxFamily, setHxFamily] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const savedData = getSavedData(patientId, formName)
      const regData = getSavedData(patientId, allForms.registrationForm)
      const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
      const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm)
      const reg = await getSavedData(patientId, 'registrationForm')
      if (reg?.registrationQ5 === 'Male') {
        alert('This patient is not female. Are you sure you want to proceed with the HPV form?')
      }

      Promise.all([savedData, regData, hxSocialData, hxFamilyData]).then((result) => {
        setSaveData({ ...initialValues, ...result[0] })
        setReg(result[1])
        setHxSocial(result[2])
        setHxFamily(result[3])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

  return (
    <Formik
      initialValues={saveData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        isLoading(true)
        const response = await submitForm(values, patientId, formName)
        setTimeout(() => {
          isLoading(false)
          setSubmitting(false)
          if (response.result) {
            alert('Successfully submitted form')
            changeTab(null, nextTab)
          } else {
            alert(`Unsuccessful. ${response.error}`)
          }
        }, 80)
      }}
    >
      {({ handleSubmit, errors, submitCount }) => (
        <Paper elevation={2} p={0} m={0}>
          <Grid display='flex' flexDirection='row'>
            <Grid xs={9} width='50%'>
              <Paper>
                <form onSubmit={handleSubmit} className='fieldPadding'>
                  <div className='form--div'>
                    <h1>WCE</h1>

                    <h3>Completed Breast Self Examination station?</h3>
                    <Field
                      name='wceQ3'
                      label='WCE Q3'
                      options={formOptions.wceQ3}
                      component={CustomRadioGroup}
                    />

                    <h3>Completed Cervical Education station?</h3>
                    <Field
                      name='wceQ4'
                      label='WCE Q4'
                      options={formOptions.wceQ4}
                      component={CustomRadioGroup}
                    />

                    <h3>HPV Test Eligibility</h3>
                    <CheckHpvEligibility />
                  </div>

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
                </form>
              </Paper>
            </Grid>

            <Grid
              p={1}
              width='40%'
              display='flex'
              flexDirection='column'
              alignItems={loadingSidePanel ? 'center' : 'left'}
            >
              {loadingSidePanel ? (
                <CircularProgress />
              ) : (
                <div className='summary--question-div'>
                  <h2>Social Support</h2>
                  <p className='underlined'>CHAS Status 社保援助计划:</p>
                  {reg && reg.registrationQ12 ? (
                    <p className='blue'>{reg.registrationQ12}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}

                  <p className='underlined'>Pioneer Generation Status 建国一代配套:</p>
                  {reg && reg.registrationQ13 ? (
                    <p className='blue'>{reg.registrationQ13}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}

                  <p className='underlined'>
                    Patient on any other Government Financial Assistance, other than CHAS and PG:
                  </p>
                  {hxSocial && hxSocial.SOCIAL3 ? (
                    <p className='blue'>{hxSocial.SOCIAL3}</p>
                  ) : (
                    <p className='blue'>nil</p>
                  )}
                  {hxSocial && hxSocial.SOCIALShortAns3 ? (
                    <p className='blue'>{hxSocial.SOCIALShortAns3}</p>
                  ) : null}

                  <h2>Family History</h2>
                  <p className='underlined'>
                    Is there positive family history{' '}
                    <span className='red'>(AMONG FIRST DEGREE RELATIVES)</span> for the following
                    cancers?:
                  </p>
                  {hxFamily && Array.isArray(hxFamily.FAMILY2) && hxFamily.FAMILY2.length > 0 ? (
                    hxFamily.FAMILY2.map((item, idx) => (
                      <p className='blue' key={idx}>
                        {item}
                      </p>
                    ))
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

WceForm.contextType = FormContext

export default WceForm