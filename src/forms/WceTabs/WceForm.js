import React from 'react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { Formik, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'

import {
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from '@mui/material';

import { submitFormSpecial } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'

import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'
import allForms from '../forms.json'

// Yup validation schema
const validationSchema = Yup.object({
  wceQ3: Yup.string()
    .oneOf(['Yes', 'No', 'Not Applicable'], 'Invalid selection'),
  wceQ4: Yup.string()
    .oneOf(['Yes', 'No', 'Not Applicable'], 'Invalid selection'),
  wceQ5: Yup.string()
    .oneOf(['Yes', 'No', 'Not Applicable'], 'Invalid selection'),
  wceQ7: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid selection'),
  wceQ8: Yup.string()
    .oneOf(['Never before', 'Less than 5 years', '5 years or longer'], 'Invalid selection'),
  wceQ9: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid selection'),
  wceQ10: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid selection'),
  wceQ11: Yup.string()
    .oneOf(['Never before', 'Within the last 3 years', '3 years or longer'], 'Invalid selection'),
  wceQ12: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid selection')
})

// Initial values
const initialValues = {
  wceQ3: '',
  wceQ4: '',
  wceQ5: '',
  wceQ7: '',
  wceQ8: '',
  wceQ9: '',
  wceQ10: '',
  wceQ11: '',
  wceQ12: ''
}

// Custom Radio Field Component
const RadioField = ({ name, label, options, ...props }) => {
  const { values, errors, touched, setFieldValue } = useFormikContext()
  
  return (
    <FormControl error={touched[name] && !!errors[name]} {...props}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        value={values[name] || ''}
        onChange={(e) => setFieldValue(name, e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel 
            key={option.value}
            value={option.value} 
            control={<Radio />} 
            label={option.label} 
          />
        ))}
      </RadioGroup>
      {touched[name] && errors[name] && (
        <FormHelperText>{errors[name]}</FormHelperText>
      )}
    </FormControl>
  )
}

// HPV Eligibility Checker Component
function CheckHpvEligibility() {
  const { values } = useFormikContext()
  const { wceQ8, wceQ9, wceQ10, wceQ11, wceQ12 } = values

  if (
    (wceQ8 === '5 years or longer' || wceQ8 === 'Never before') &&
    (wceQ9 === 'Yes') &&
    (wceQ10 === 'No') &&
    (wceQ11 === '3 years or longer' || wceQ11 === 'Never before')
  ) {
    if (wceQ12 === 'Yes') {
      return (
        <Fragment>
          <p className='blue'>Patient is eligibile for HPV Test at both off-site clinic site and on-site</p>
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

const formName = 'wceForm'

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

      Promise.all([savedData, regData, hxSocialData, hxFamilyData]).then((result) => {
        // Merge saved data with initial values to ensure all fields are present
        setSaveData({ ...initialValues, ...result[0] })
        setReg(result[1])
        setHxSocial(result[2])
        setHxFamily(result[3])
        isLoadingSidePanel(false)
      })
    }
    fetchData()
  }, [])

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
    wceQ5: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
      { label: 'Not Applicable', value: 'Not Applicable' },
    ],
    wceQ7: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    wceQ8: [
      { label: 'Never before', value: 'Never before' },
      { label: 'Less than 5 years', value: 'Less than 5 years' },
      { label: '5 years or longer', value: '5 years or longer' },
    ],
    wceQ9: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    wceQ10: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    wceQ11: [
      { label: 'Never before', value: 'Never before' },
      { label: 'Within the last 3 years', value: 'Within the last 3 years' },
      { label: '3 years or longer', value: '3 years or longer' },
    ],
    wceQ12: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const handleSubmit = async (values) => {
    isLoading(true)
    const response = await submitFormSpecial(values, patientId, formName)
    if (response.result) {
      isLoading(false)
      setTimeout(() => {
        alert('Successfully submitted form')
        changeTab(event, nextTab)
      }, 80)
    } else {
      isLoading(false)
      setTimeout(() => {
        alert(`Unsuccessful. ${response.error}`)
      }, 80)
    }
  }

  return (
    <Paper elevation={2} p={0} m={0}>
      <Grid display='flex' flexDirection='row'>
        <Grid xs={9}>
          <Paper elevation={2} p={0} m={0}>
            <Formik
              initialValues={saveData}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {()  => (
                <Form>
                  <div className='form--div fieldPadding'>
                    <h1>WCE</h1>
                    
                    <h3>Completed Breast Self Examination station?</h3>
                    <RadioField 
                      name='wceQ3' 
                      label='WCE Q3' 
                      options={formOptions.wceQ3} 
                    />

                    <h3>Completed Cervical Education station?</h3>
                    <RadioField 
                      name='wceQ4' 
                      label='WCE Q4' 
                      options={formOptions.wceQ4} 
                    />

                    <h3>
                      When, if any, was the last hpv test you have taken? (Please verify on health hub) (HPV is different from Pap Smear, answer Pap Smear in the next question)
                    </h3>
                    <RadioField 
                      name='wceQ8' 
                      label='WCE Q8' 
                      options={formOptions.wceQ8} 
                    />

                    <h3>
                      When if any, was the last Pap Smear test you have taken? (Please verify on health hub)
                    </h3>
                    <RadioField 
                      name='wceQ11' 
                      label='WCE Q11' 
                      options={formOptions.wceQ11} 
                    />

                    <h3>
                      I am asking the next few questions to check your eligibility for a Pap Smear. This question may be sensitive, but could I ask if you have engaged in sexual intercourse before?
                    </h3>
                    <RadioField 
                      name='wceQ9' 
                      label='WCE Q9' 
                      options={formOptions.wceQ9} 
                    />

                    <h3>Are you pregnant?</h3>
                    <RadioField 
                      name='wceQ10' 
                      label='WCE Q10' 
                      options={formOptions.wceQ10} 
                    />

                    <h3>
                      Was your last menstrual period within the window where the first day falls between 29 July and 5 August 2024? If you are post-menopausal or use contraception, please indicate &apos;yes&apos;
                    </h3>
                    <RadioField 
                      name='wceQ12' 
                      label='WCE Q12' 
                      options={formOptions.wceQ12} 
                    />

                    <h3>Indicated interest for HPV Test under SCS?</h3>
                    <RadioField 
                      name='wceQ5' 
                      label='WCE Q5' 
                      options={formOptions.wceQ5} 
                    />

                    <h3>
                      Is patient indicated for on-site testing? Please circle On-Site Testing on Form A as well
                    </h3>
                    <RadioField 
                      name='wceQ7' 
                      label='WCE Q7' 
                      options={formOptions.wceQ7} 
                    />

                    <h3>HPV Test Eligibility</h3>
                    <CheckHpvEligibility />
                  </div>

                  <div style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button 
                        type='submit' 
                        variant='contained' 
                        color='primary'
                        disabled={loading}
                      >
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

              <p className='underlined'>Patient on any other Government Financial Assistance, other than CHAS and PG:</p>
              {hxSocial && hxSocial.SOCIAL3 ? (
                <p className='blue'>{hxSocial.SOCIAL3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              {hxSocial && hxSocial.SOCIALShortAns3 ? (
                <p className='blue'>{hxSocial.SOCIALShortAns3}</p>
              ) : (
                <p className='blue'>nil</p>
              )}

              <h2>Family History</h2>
              <p className='underlined'>Is there positive family history{' '}
                <span className='red'>(AMONG FIRST DEGREE RELATIVES)</span> for the following cancers?:</p>
              {hxFamily && hxFamily.FAMILY1 ? (
                <p className='blue'>{hxFamily.FAMILY1}</p>
              ) : (
                <p className='blue'>nil</p>
              )}
              <p className='underlined'>Age of diagnosis:</p>
              {hxFamily && hxFamily.FAMILYShortAns1 ? (
                <p className='blue'>{hxFamily.FAMILYShortAns1}</p>
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

WceForm.contextType = FormContext

export default WceForm