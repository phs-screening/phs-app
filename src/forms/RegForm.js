import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

import { AutoForm } from 'uniforms'
import {
  SubmitField,
  ErrorsField,
  SelectField,
  RadioField,
  LongTextField,
  TextField,
  BoolField,
} from 'uniforms-material'
import CircularProgress from '@mui/material/CircularProgress'
import { submitForm, submitRegClinics } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getClinicSlotsCollection, getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import './forms.css'

const postalCodeToLocations = {
  600415: 'Pandan Clinic\nBIk 415, Pandan Gardens #01- 115, S600415',
  600130: 'Trinity Medical Clinic\nBIk 130, Jurong Gateway Road #02-205, S600130',
  129581: 'Frontier FMC\n3151 Commonwealth Ave West, #04-01 Grantral Mall, S129581',
  650207: 'Bukit Batok Medical\nBIk 207, Bukit Batok Street 21 #01- 114, S650207',
  650644: 'Kang An Clinic\nBIk 644 Bukit Batok Central #01-70 S650644',
  610064: 'Drs Tangs and Partner\nBIk 64, Yung Kuang Road, #01- 115, S610064',
  641518: 'Lakeside FMC\nBIk 518A, Jurong West Street 52 #01-02, S641518',
  640638:
    'Healthmark Pioneer MallClinic\nBIk 638, Jurong West Street 61 Pioneer Mall #02-08, S640638',
  640762:
    'Lee Family Clinic\nBIk 762 Jurong West Street 75, #02-262 Gek Poh Shopping Centre S640762',
  None: 'None',
}

export const defaultSlots = {
  600415: 35,
  600130: 35,
  129581: 35,
  650207: 35,
  650644: 35,
  610064: 35,
  641518: 35,
  640638: 35,
  640762: 35,
  None: 10000,
}

const formName = 'registrationForm'
const RegForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [slots, setSlots] = useState(defaultSlots)

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)

    const phlebCountersCollection = getClinicSlotsCollection()
    const phlebCounters = await phlebCountersCollection.find()
    const temp = { ...defaultSlots }
    for (const { postalCode, counterItems } of phlebCounters) {
      if (postalCode && counterItems) {
        temp[postalCode] -= counterItems.length
      }
    }
    setSlots(temp)

    setSaveData(savedData)
  }, [])

  const displayVacancy = Object.entries(slots).map(([postalCode, n], i) => {
    return (
      <div key={i} className='paragraph--text'>
        {postalCodeToLocations[postalCode]}
        <b> Slots: {n}</b>
      </div>
    )
  })

  const displayLocations = () => {
    const result = []
    Object.values(postalCodeToLocations).map((item) => {
      result.push({ label: item, value: item })
    })
    return result
  }
  const formOptions = {
    registrationQ1: [
      { label: 'Mr', value: 'Mr' },
      { label: 'Ms', value: 'Ms' },
      { label: 'Mrs', value: 'Mrs' },
      { label: 'Dr', value: 'Dr' },
    ],
    registrationQ3: [
      { label: 'Singapore Citizen 新加坡公民', value: 'Singapore Citizen 新加坡公民' },
      {
        label: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
        value: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
      },
    ],
    registrationQ4: [
      { label: 'Single 单身', value: 'Single 单身' },
      { label: 'Married 已婚', value: 'Married 已婚' },
      { label: 'Widowed 已寡', value: 'Widowed 已寡' },
      { label: 'Separated 已分居', value: 'Separated 已分居' },
      { label: 'Divorced 已离婚', value: 'Divorced 已离婚' },
    ],
    registrationQ6: [
      { label: 'Jurong', value: 'Jurong' },
      { label: 'Yuhua', value: 'Yuhua' },
      { label: 'Bukit Batok', value: 'Bukit Batok' },
      { label: 'Pioneer', value: 'Pioneer' },
      { label: 'West Coast', value: 'West Coast' },
      { label: 'Hong Kah North', value: 'Hong Kah North' },
      { label: 'Others', value: 'Others' },
    ],
    registrationQ8: [
      { label: 'CHAS Orange', value: 'CHAS Orange' },
      { label: 'CHAS Green', value: 'CHAS Green' },
      { label: 'CHAS Blue', value: 'CHAS blue' },
      { label: 'No CHAS', value: 'No CHAS' },
    ],
    registrationQ9: [
      { label: 'Pioneer generation card holder', value: 'Pioneer generation card holder' },
      { label: 'Merdeka generation card holder', value: 'Merdeka generation card holder' },
      { label: 'None', value: 'None' },
    ],
    registrationQ11: [
      { label: 'English', value: 'English' },
      { label: 'Mandarin', value: 'Mandarin' },
      { label: 'Malay', value: 'Malay' },
      { label: 'Tamil', value: 'Tamil' },
    ],
  }

  const layout = (
    <div className='form--div'>
      <h2>Registration</h2>
      <h3>Salutation 称谓</h3>
      <SelectField name='registrationQ1' options={formOptions.registrationQ1} />
      <h3>Race 种族</h3>
      <RadioField name='registrationQ11' options={formOptions.registrationQ11} />
      <LongTextField name='registrationQ14' />
      <h3>Nationality 国籍</h3>
      <p className='paragraph--title'>
        Please Note: Non Singapore Citizens/ Non-PRs are unfortunately not eligible for this health
        screening
      </p>
      <RadioField name='registrationQ3' options={formOptions.registrationQ3} />
      <h3>Marital Status 婚姻状况</h3>
      <SelectField name='registrationQ4' options={formOptions.registrationQ4} />
      <h3>Occupation 工作</h3>
      <TextField name='registrationQ5' />
      <h3>
        GRC/SMC Subdivision{' '}
        <a href='https://www.parliament.gov.sg/mps/find-my-mp' target='_blank' rel='noreferrer'>
          [https://www.parliament.gov.sg/mps/find-my-mp]
        </a>
      </h3>
      <SelectField name='registrationQ6' options={formOptions.registrationQ6} />
      <h3>CHAS Status 社保援助计划</h3>
      <SelectField name='registrationQ8' options={formOptions.registrationQ8} />
      <h2>Follow up at GP Clinics</h2>
      <p>
        Your Health Report & Blood Test Results (if applicable) will be mailed out to the GP you
        have selected <b>4-6 weeks</b> after the screening.
      </p>
      <h4 className='paragraph--title'>
        All results, included those that are normal, have to be collected from the GP clinic via an
        appointment
      </h4>
      {displayVacancy}
      <RadioField name='registrationQ10' options={displayLocations()} />
      <h3> Pioneer Generation Status 建国一代配套</h3>
      <RadioField name='registrationQ9' options={formOptions.registrationQ9} />
      <h3>Preferred Language for Health Report</h3>
      <RadioField name='registrationQ11' options={formOptions.registrationQ11} />
      <h2>Phlebotomy Eligibility</h2>
      <p className='paragraph--title'>
        Before entering our screening, do note the following eligibility criteria for Phlebotomy:
        <ol type='A'>
          <li>NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.</li>
          <li>Have not done a blood test within the past 3 years.</li>
        </ol>
      </p>
      <p className='paragraph--title'>
        Rationale: PHS aims to reach out to undiagnosed people. Patients that are already aware of
        their condition would have regular follow-ups with the GPs/polyclinics/hospitals. This
        information is available in our publicity material. Please approach our registration
        volunteers should you have any queries. We are happy to explain further. Thank you!
      </p>
      <p className='paragraph--title'>
        抽血合格标准:
        <br />
        1) 在过去的三年内沒有验过血。
        <br />
        2) 没有糖尿病, 高血压, 高胆固醇。
      </p>
      <BoolField name='registrationQ12' />
      <br />
      <h2>Compliance to PDPA 同意书</h2>
      <p>
        I hereby give consent to having photos and/or videos taken of me for publicity purposes. I
        hereby give my consent to the Public Health Service Executive Committee to collect my
        personal information for the purpose of participating in the Public Health Service (hereby
        called “PHS”) and its related events, and to contact me via calls, SMS, text messages or
        emails regarding the event and follow-up process.
      </p>
      <p>
        Should you wish to withdraw your consent for us to contact you for the purposes stated
        above, please notify a member of the PHS Executive Committee at &nbsp;
        <a href='mailto:ask.phs@gmail.com'>ask.phs@gmail.com</a> &nbsp; in writing. We will then
        remove your personal information from our database. Please allow 3 business days for your
        withdrawal of consent to take effect. All personal information will be kept confidential,
        will only be disseminated to members of the PHS Executive Committee, and will be strictly
        used by these parties for the purposes stated.
      </p>
      <BoolField name='registrationQ13' />
    </div>
  )
  const form_layout = layout

  const schema = new SimpleSchema({
    registrationQ1: {
      defaultValue: 'Mr',
      type: String,
      allowedValues: ['Mr', 'Ms', 'Mrs', 'Dr'],
      optional: false,
    },
    registrationQ2: {
      type: String,
      allowedValues: [
        'Chinese 华裔',
        'Malay 巫裔',
        'Indian 印裔',
        'Eurasian 欧亚裔',
        'Others 其他',
      ],
      optional: false,
    },
    registrationQ3: {
      type: String,
      allowedValues: [
        'Singapore Citizen 新加坡公民',
        'Singapore Permanent Resident (PR) \n新加坡永久居民',
      ],
      optional: false,
    },
    registrationQ4: {
      type: String,
      allowedValues: [
        'Single 单身',
        'Married 已婚',
        'Widowed 已寡',
        'Separated 已分居',
        'Divorced 已离婚',
      ],
      optional: false,
    },
    registrationQ5: {
      type: String,
      optional: false,
    },
    registrationQ6: {
      type: String,
      allowedValues: [
        'Jurong',
        'Yuhua',
        'Bukit Batok',
        'Pioneer',
        'West Coast',
        'Hong Kah North',
        'Others',
      ],
      optional: false,
    },
    registrationQ8: {
      type: String,
      allowedValues: ['CHAS Orange', 'CHAS Green', 'CHAS Blue', 'No CHAS'],
      optional: false,
    },
    registrationQ9: {
      type: String,
      allowedValues: ['Pioneer generation card holder', 'Merdeka generation card holder', 'None'],
      optional: false,
    },
    registrationQ10: {
      type: String,
      allowedValues: Object.values(postalCodeToLocations),
      optional: true,
    },
    registrationQ11: {
      type: String,
      allowedValues: ['English', 'Mandarin', 'Malay', 'Tamil'],
      optional: false,
    },
    registrationQ12: {
      type: Boolean,
      label:
        'I have read and acknowledged the eligibility criteria for Phlebotomy. 我知道抽血的合格标准。',
      optional: false,
    },
    registrationQ13: {
      type: Boolean,
      label: 'I agree and consent to the above.',
      optional: false,
    },
    registrationQ14: {
      type: String,
      optional: true,
    },
  })
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)

        // Note: Q10 is optional
        const location = model.registrationQ10
        if (location) {
          const postalCode =
            model.registrationQ10 === 'None' ? 'None' : model.registrationQ10.trim().slice(-6)

          // Note we check on the backend if no slots left
          const counterResponse = await submitRegClinics(postalCode, patientId)
          // Update counters by checking previous selection
          if (!counterResponse.result) {
            isLoading(false)
            setTimeout(() => {
              alert(`Unsuccessful. ${counterResponse.error}`)
            }, 80)
            isLoading(false)
            return
          }
        }

        // If counters updated successfully, submit the new form information
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }

        isLoading(false)
      }}
      model={saveData}
    >
      {form_layout}
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

      <br />
      <Divider />
    </AutoForm>
  )

  return (
    <Paper elevation={2} p={0} m={0}>
      {newForm()}
    </Paper>
  )
}

export default RegForm
