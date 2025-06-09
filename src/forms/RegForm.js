import React, { useContext, useEffect, useState } from 'react'
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
  DateField,
} from 'uniforms-mui'
import CircularProgress from '@mui/material/CircularProgress'
import { submitForm, submitRegClinics } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import {
  getClinicSlotsCollection,
  getSavedData,
} from '../services/mongoDB'
import './fieldPadding.css'
import './forms.css'
import { useField } from 'uniforms'
import PopupText from 'src/utils/popupText.js'

const postalCodeToLocations = {
  648886:
    'Dr Koo & Loo Associate, +65 6792 2669: 1 Jurong West Central 2, 01-16a&b Jurong Point, S648886',
  610064:
    'Drs Tangs & Partner, +65 6265 6077: Blk 64, Yung Kuang Rd #01- 115, S610064',
  640638:
    'Healthmark Pionner Mall, +65 6861 3100: Blk 638, Jurong West St 61 Pioneer Mall #02-08, S640638',
  641518:
    'Lakeside FMC, +65 6262 6434: Blk 518A, Jurong West St 52 #01-02, S641518',
  640762:
    'Lee Family Clinic, +65 6794 0217: Blk 762 Jurong West St 75 #02-262 Gek Poh Shopping Ctr, S640762',
  None: 'None',
}

export const defaultSlots = {
  648886: 50,
  610064: 50,
  640638: 50,
  641518: 50,
  640762: 50,
  None: 10000,
}

const formName = 'registrationForm'
const RegForm = () => {
  const { patientId, updatePatientId, updatePatientInfo } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const navigate = useNavigate()
  const [saveData, setSaveData] = useState({})
  const [birthday, setBirthday] = useState(new Date())
  const [slots, setSlots] = useState(defaultSlots)
  const [patientAge, setPatientAge] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      console.log('Patient ID: ' + patientId) //patientID == -1, if registration of new patient
      const savedData = await getSavedData(patientId, formName)

      const phlebCountersCollection = getClinicSlotsCollection()
      const phlebCounters = await phlebCountersCollection.find()
      const temp = { ...defaultSlots }
      for (const { postalCode, counterItems } of phlebCounters) {
        if (postalCode && counterItems) {
          temp[postalCode] -= counterItems.length
        }
      }
      if (patientId == -1) {
        // only when registration of new patient
        savedData.registrationQ3 = birthday
      }
      setSlots(temp)
      setSaveData(savedData)
    }
    fetchData()
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

  const GetAge = () => {
    const [{ value: birthday }] = useField('registrationQ3', {})
    const today = new Date()
    if (birthday) {
      var age = today.getFullYear() - birthday.getFullYear()
      setBirthday(birthday)
      setPatientAge(age)
      return <p className='blue'>{age}</p>
    }
    return null
  }
  const formOptions = {
    registrationQ1: [
      { label: 'Mr', value: 'Mr' },
      { label: 'Ms', value: 'Ms' },
      { label: 'Mrs', value: 'Mrs' },
      { label: 'Dr', value: 'Dr' },
    ],
    registrationQ5: [
      {
        label: 'Male',
        value: 'Male',
      },
      { label: 'Female', value: 'Female' },
    ],
    registrationQ6: [
      {
        label: 'Chinese 华裔',
        value: 'Chinese 华裔',
      },
      { label: 'Malay 巫裔', value: 'Malay 巫裔' },
      { label: 'Indian 印裔', value: 'Indian 印裔' },
      { label: 'Eurasian 欧亚裔', value: 'Eurasian 欧亚裔' },
      { label: 'Others 其他', value: 'Others 其他' },
    ],
    registrationQ7: [
      { label: 'Singapore Citizen 新加坡公民', value: 'Singapore Citizen 新加坡公民' },
      {
        label: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
        value: 'Singapore Permanent Resident (PR) \n新加坡永久居民',
      },
    ],
    registrationQ8: [
      { label: 'Single 单身', value: 'Single 单身' },
      { label: 'Married 已婚', value: 'Married 已婚' },
      { label: 'Widowed 已寡', value: 'Widowed 已寡' },
      { label: 'Separated 已分居', value: 'Separated 已分居' },
      { label: 'Divorced 已离婚', value: 'Divorced 已离婚' },
    ],
    registrationQ10: [
      { label: 'Jurong', value: 'Jurong' },
      { label: 'Yuhua', value: 'Yuhua' },
      { label: 'Bukit Batok', value: 'Bukit Batok' },
      { label: 'Pioneer', value: 'Pioneer' },
      { label: 'West Coast', value: 'West Coast' },
      { label: 'Hong Kah North', value: 'Hong Kah North' },
      { label: 'Others', value: 'Others' },
    ],
    registrationQ11: [
      {
        label: 'Yes',
        value: 'Yes',
      },
      { label: 'No', value: 'No' },
      { label: 'Unsure', value: 'Unsure' },
    ],
    registrationQ12: [
      { label: 'CHAS Orange', value: 'CHAS Orange' },
      { label: 'CHAS Green', value: 'CHAS Green' },
      { label: 'CHAS Blue', value: 'CHAS Blue' },
      { label: 'No CHAS', value: 'No CHAS' },
    ],
    registrationQ13: [
      { label: 'Pioneer generation card holder', value: 'Pioneer generation card holder' },
      { label: 'Merdeka generation card holder', value: 'Merdeka generation card holder' },
      { label: 'None', value: 'None' },
    ],
    registrationQ14: [
      { label: 'English', value: 'English' },
      { label: 'Mandarin', value: 'Mandarin' },
      { label: 'Malay', value: 'Malay' },
      { label: 'Tamil', value: 'Tamil' },
    ],
    registrationQ15: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ19: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    registrationQ20: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  }

  const layout = (
    <div className='form--div'>
      <h2>Registration</h2>
      <h3>Salutation 称谓</h3>
      <SelectField name='registrationQ1' options={formOptions.registrationQ1} />
      <h3>Initials (e.g Chen Ren Ying - Chen R Y, Christie Tan En Ning - Christie T E N)</h3>
      <LongTextField name='registrationQ2' />
      <h3>Birthday</h3>
      <DateField name='registrationQ3' type='date' />
      <h3>Age</h3>
      <GetAge />
      <h3>Gender</h3>
      <RadioField name='registrationQ5' options={formOptions.registrationQ5} />
      <h3>Race 种族</h3>
      <RadioField name='registrationQ6' options={formOptions.registrationQ6} />
      <PopupText qnNo='registrationQ6' triggerValue='Others 其他'>
        <LongTextField name='registrationShortAnsQ6' />
      </PopupText>
      <h3>Nationality 国籍</h3>
      <p>
        Please Note: Non Singapore Citizens/ Non-PRs are unfortunately not eligible for this health
        screening
      </p>
      <RadioField name='registrationQ7' options={formOptions.registrationQ7} />
      <h3>Marital Status 婚姻状况</h3>
      <SelectField name='registrationQ8' options={formOptions.registrationQ8} />
      <h3>Occupation 工作</h3>
      <TextField name='registrationQ9' />
      <h3>
        GRC/SMC Subdivision{' '}
        <a href='https://www.parliament.gov.sg/mps/find-my-mp' target='_blank' rel='noreferrer'>
          [https://www.parliament.gov.sg/mps/find-my-mp]
        </a>
      </h3>
      <SelectField name='registrationQ10' options={formOptions.registrationQ10} />
      <h3>Are you currently part of HealthierSG?</h3>
      <RadioField name='registrationQ11' options={formOptions.registrationQ11} />
      <h3>CHAS Status 社保援助计划</h3>
      <SelectField name='registrationQ12' options={formOptions.registrationQ12} />
      <h3> Pioneer Generation Status 建国一代配套</h3>
      <RadioField name='registrationQ13' options={formOptions.registrationQ13} />
      <h3>Preferred Language for Health Report</h3>
      <RadioField name='registrationQ14' options={formOptions.registrationQ14} />
      <h2>Going for Phlebotomy?</h2>
      <h3>
        Conditions:
        <br />
        1) Singaporeans ONLY
        <br />
        2) Not enrolled under HealthierSG
        <br />
        3) Have not undergone a government screening for the past 3 years
        <br />
        4) Have not been diagnosed with diabetes, hyperlipidemia or high blood pressure
      </h3>
      <RadioField name='registrationQ15' options={formOptions.registrationQ15} />
      <PopupText qnNo='registrationQ15' triggerValue='Yes'>
        <h2>Phlebotomy Eligibility</h2>{' '}
        <p>
          {' '}
          Before entering our screening, do note the following eligibility criteria for Phlebotomy:
          <ol type='A'>
            <li>NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.</li>
            <li>Have not done a blood test within the past 3 years.</li>
          </ol>
        </p>
        <p>
          Rationale: PHS aims to reach out to undiagnosed people. Patients that are already aware of
          their condition would have regular follow-ups with the GPs/polyclinics/hospitals. This
          information is available in our publicity material. Please approach our registration
          volunteers should you have any queries. We are happy to explain further. Thank you!
        </p>
        <p>
          抽血合格标准:
          <br />
          1) 在过去的三年内沒有验过血。
          <br />
          2) 没有糖尿病, 高血压, 高胆固醇。
        </p>
        <BoolField name='registrationQ16' />
      </PopupText>
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
      <BoolField name='registrationQ17' />
      <h2>Follow up at GP Clinics</h2>
      <p>
        Your Health Report & Blood Test Results (if applicable) will be mailed out to the GP you
        have selected <b>4-6 weeks</b> after the screening.
      </p>
      <h4>
        All results, included those that are normal, have to be collected from the GP clinic via an
        appointment
      </h4>
      <br />
      {displayVacancy}
      <RadioField name='registrationQ18' options={displayLocations()} />
      <h3>
        Patient consented to being considered for participation in Long Term Follow-Up (LTFU)?
        (Patient has to sign and tick Form C)
      </h3>
      <RadioField name='registrationQ19' options={formOptions.registrationQ19} />
      <h3>
        Participant consent to participation in Research? (Participant has to sign IRB Consent Form)
      </h3>
      <RadioField name='registrationQ20' options={formOptions.registrationQ20} />
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
      optional: false,
    },
    registrationQ3: {
      defaultValue: new Date(),
      type: Date,
      optional: false,
    },
    registrationQ4: {
      defaultValue: patientAge,
      type: Number,
      optional: true,
    },
    registrationQ5: {
      type: String,
      allowedValues: ['Male', 'Female'],
      optional: false,
    },
    registrationQ6: {
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
    registrationQ7: {
      type: String,
      allowedValues: [
        'Singapore Citizen 新加坡公民',
        'Singapore Permanent Resident (PR) \n新加坡永久居民',
      ],
      optional: false,
    },
    registrationQ8: {
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
    registrationQ9: {
      type: String,
      optional: false,
    },
    registrationQ10: {
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
    registrationQ11: {
      type: String,
      allowedValues: ['Yes', 'No', 'Unsure'],
      optional: false,
    },
    registrationQ12: {
      type: String,
      allowedValues: ['CHAS Orange', 'CHAS Green', 'CHAS Blue', 'No CHAS'],
      optional: false,
    },
    registrationQ13: {
      type: String,
      allowedValues: ['Pioneer generation card holder', 'Merdeka generation card holder', 'None'],
      optional: false,
    },
    //locations
    registrationQ18: {
      type: String,
      allowedValues: Object.values(postalCodeToLocations),
      optional: true,
    },
    registrationQ14: {
      type: String,
      allowedValues: ['English', 'Mandarin', 'Malay', 'Tamil'],
      optional: false,
    },
    registrationQ15: {
      type: String,
      allowedValues: ['Yes', 'No'],
      optional: false,
    },
    registrationQ16: {
      type: Boolean,
      label:
        'I have read and acknowledged the eligibility criteria for Phlebotomy. 我知道抽血的合格标准。',
      optional: true,
    },
    registrationQ17: {
      type: Boolean,
      label: 'I agree and consent to the above.',
      optional: false,
    },
    //race: other
    registrationShortAnsQ6: {
      type: String,
      optional: true,
    },
    registrationQ19: {
      type: String,
      allowedValues: ['Yes', 'No'],
      optional: false,
    },
    registrationQ20: {
      type: String,
      allowedValues: ['Yes', 'No'],
      optional: false,
    },
  })
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        model.registrationQ4 = patientAge

        // Note: Q10 is optional
        const location = model.registrationQ18
        if (location) {
          const postalCode =
            model.registrationQ18 === 'None' ? 'None' : model.registrationQ18.trim().slice(-6)

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

        console.log('Patient ID: ' + patientId)
        // If counters updated successfully, submit the new form information
        const response = await submitForm(model, patientId, formName)

        console.log('test  _' + response.result + ' ' + patientAge)
        if (response.result) {
          setTimeout(() => {
            console.log('response data: ' + response.qNum)
            alert('Successfully submitted form')
            console.log('Successfully submitted form')
            updatePatientInfo(response.data)
            updatePatientId(response.qNum)
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            console.log('Form submission failed')
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }

        isLoading(false)
      }}
      model={saveData}
    >
      {form_layout}
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={() => { }} />}</div>

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
