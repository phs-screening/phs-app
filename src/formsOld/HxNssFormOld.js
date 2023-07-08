import React, { Component, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { SelectField, RadioField, LongTextField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

import PopupText from '../utils/popupText'

const schema = new SimpleSchema({
  hxNssQ1: {
    type: Array,
    optional: false,
  },
  'hxNssQ1.$': {
    type: String,
    allowedValues: [
      'Hypertension\n(Please proceed to Q2)',
      'Diabetes\n(Please proceed to Q2)',
      'High Cholesterol\n(Please proceed to Q2)',
      'Stroke (including transient ischaemic attack) \n(Please proceed to Q2)',
      'Chronic Kidney Disease\n(Please proceed to Q2d)',
      "No, I don't have any of the above \n(Please proceed to Q2d)",
    ],
  },
  hxNssQ2: {
    type: String,
    allowedValues: ['Yes (please answer question below)', 'No', 'Not Applicable'],
    optional: false,
  },
  hxNssQ3: {
    type: Array,
    optional: true,
  },
  'hxNssQ3.$': {
    type: String,
    allowedValues: [
      'Yes, on current follow up with General Practioner (GP) \n(Please proceed to Q2c)',
      'Yes, on current follow up with Family Medicine Centre\n(Please proceed to Q2c)',
      'Yes, on current follow up with Polyclinic \n(Please proceed to Q2c)',
      'Yes, on current follow up with Specialist Outpatient Clinic (SOC)\n(Please proceed to Q2c)',
      'No, the last appointment was > 1 year ago (Please proceed to Q2b and 2c)',
    ],
  },
  hxNssQ4: {
    type: Array,
    optional: true,
  },
  'hxNssQ4.$': {
    type: String,
    allowedValues: [
      'Do not see the need for tests',
      'Challenging to make time to go for appointments',
      'Difficulties gtting to the clinics',
      'Financial issues',
      'Scared of doctor',
      'Others: (please specify reason)',
    ],
  },
  hxNssQ5: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: false,
  },
  hxNssQ6: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: false,
  },
  hxNssQ7: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: false,
  },
  hxNssQ8: {
    type: String,
    allowedValues: ['Yes', 'No', 'Not Applicable'],
    optional: false,
  },
  hxNssQ9: {
    type: String,
    allowedValues: ['Yes, (Please specify):', 'None'],
    optional: false,
  },
  hxNssQ10: {
    type: String,
    optional: true,
  },
  hxNssQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxNssQ12: {
    type: String,
    optional: true,
  },
  hxNssQ13: {
    type: Array,
    optional: false,
  },
  'hxNssQ13.$': {
    type: String,
    allowedValues: [
      'Cancer',
      'Coronary Heart disease (caused by narrowed blood vessels supplying the heart muscle) or Heart attack, (Please specify):',
      'Diabetes',
      'Hypertension',
      'High Cholesterol',
      'Stroke (including transient ischaemic attack)',
      'No, they do not have any of the above.',
    ],
  },
  hxNssQ14: {
    type: String,
    allowedValues: [
      'Yes, at least 1 cigarette (or equivalent) per day on average.',
      'Yes, occasionally, less than 1 cigarette (or equivalent) per day on average.',
      'No, I have never smoked.',
      'No, I have completely quit smoking.',
    ],
    optional: false,
  },
  hxNssQ15: {
    type: String,
    allowedValues: [
      'Less than 2 standard drinks per day on average.',
      'More than 2 standard drinks per day on average.',
      'No',
      'Quit Alcoholic Drinks',
    ],
    optional: false,
  },
  hxNssQ16: {
    type: Array,
    optional: false,
  },
  'hxNssQ16.$': {
    type: String,
    allowedValues: [
      'No (Skip to Q7)',
      'Yes (Proceed to answer below)',
      'Vegetables (1 serving/day)',
      'Vegetables (2 or more servings/day)',
      'Fruits (1 serving/day)',
      'Fruits (2 or more servings/day)',
      'Whole grain and cereals',
    ],
  },
  hxNssQ17: {
    type: String,
    allowedValues: [
      'Yes (At least 20 mins each time, for 3 or more days per week.)',
      'Yes (At least 20 mins each time, for less than 3 days per week.)',
      'No participation of at least 20 min each time.',
    ],
    optional: false,
  },
  hxNssQ18: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: false,
  },
  hxNssQ19: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: false,
  },
  hxNssQ20: {
    type: String,
    allowedValues: [
      '1 year ago or less',
      'More than 1 year to 2 years',
      'More than 2 years to 3 years',
      'More than 3 years to 4 years',
      'More than 4 years to 5 years',
      'More than 5 years',
      'Never been checked',
    ],
    optional: false,
  },
  hxNssQ21: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  hxNssQ22: {
    type: String,
    optional: true,
  },
  hxNssQ23: {
    type: String,
    optional: true,
  },
  hxNssQ24: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

class HxNssForm extends Component {
  static contextType = FormContext

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const { patientId, updatePatientId } = this.context
    const { changeTab, nextTab } = this.props
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, 'hxNssForm')
          if (!response.result) {
            alert(response.error)
          }
          const event = null // not interested in this value
          changeTab(event, nextTab)
        }}
      >
        <Fragment>
          <h2>HISTORY TAKING PART 2: PAST MEDICAL HISTORY</h2>
          <h3 style={{ color: 'red' }}>Please go through NSS Questionnaire now.</h3>
          <br />
          <br />
          <h2>1. Past Medical History</h2>
          1a. Has a doctor ever told you that you have the following condition? Please tick the
          appropriate box(es) if the answer is "Yes" to any of the conditions listed below, or tick
          the last box if you have none.
          <br />
          <SelectField name='hxNssQ1' checkboxes='true' label='Hx NSS Q1' />
          <br />
          <br />
          <p style={{ color: 'red' }}>
            <b>
              For respondent with known hypertension, diabetes, high cholesterol and stroke only.
            </b>
          </p>
          <br />
          2a. Are you currently on follow up with a doctor for the existing conditions you have
          indicated?
          <br />
          <RadioField name='hxNssQ2' label='Hx NSS Q2' />
          <PopupText qnNo='hxNssQ2' triggerValue='Yes (please answer question below)'>
            (Only proceed when answered "Yes" to the previous question)
            <RadioField name='hxNssQ3' checkboxes='true' label='Hx NSS Q3' />
            <PopupText
              qnNo='hxNssQ3'
              triggerValue='No, the last appointment was > 1 year ago (Please proceed to Q2b and 2c)'
            >
              <br />
              <p>
                2b. What is the reason that you are not following up with your doctor for your
                existing conditions such as diabetes, high cholesterol, high blood pressure and
                stroke?
              </p>
              <SelectField name='hxNssQ4' checkboxes='true' label='Hx NSS Q4' />
              <br />
              <LongTextField name='hxNssQ22' label='Hx NSS Q22' />
            </PopupText>
          </PopupText>
          <br />
          2c. Are you currently being prescribed any medication for any of the conditions below?
          Hypertension** (High Blood Pressure)
          <RadioField name='hxNssQ5' label='Hx NSS Q5' />
          Diabetes** (High Blood Sugar)
          <RadioField name='hxNssQ6' label='Hx NSS Q6' />
          High Cholesterol**
          <RadioField name='hxNssQ7' label='Hx NSS Q7' />
          Stroke**{' '}
          <span style={{ color: 'blue' }}>
            <b>(including transient ischaemic attack)</b>
          </span>
          <RadioField name='hxNssQ8' label='Hx NSS Q8' />
          <h3>
            PLEASE TAKE 2ND BP READING NOW AND RECORD ON FORM A.
            <br />
            <br />
          </h3>
          Hypertension criteria:
          <br />○ Younger participants: > 140/90
          <br />○ Participants > 80 years old: > 150/90 <br />○ CKD w proteinuria (mod to severe
          albuminuria): > 130/80
          <br />○ DM: > 130/80
          <br /> Please tick to highlight if you feel <b>BLOOD PRESSURE</b> requires closer scrutiny
          by doctors later <br />
          <br />
          <RadioField name='hxNssQ24' label='Hx NSS Q24' />
          <PopupText qnNo='hxNssQ24' triggerValue='Yes'>
            <br />

            <Fragment>
              <b>
                REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)
                <br />
                1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A
                <br />
                2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for
                Recommendation
                <br />
                <br />
                <span style={{ color: 'red' }}>
                  <u>HYPERTENSIVE EMERGENCY</u>
                  <br />• SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND{' '}
                  <mark>
                    <u>SYMPTOMATIC</u>
                  </mark>{' '}
                  (make sure pt has rested and 2nd reading was taken)
                  <br />
                  <mark>o ASK THE DOCTOR TO COME AND REVIEW!</mark>
                  <br />
                  <br />
                  <u>HYPERTENSIVE URGENCY</u>
                  <br />• SYSTOLIC <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND{' '}
                  <mark>ASYMPTOMATIC</mark> (make sure pt has rested and 2nd reading was taken)
                  <br />o ESCORT TO DC DIRECTLY!
                  <br />o Follow the patient, continue clerking the patient afterward if doctor
                  acknowledges patient is well enough to continue the screening
                  <br />
                  <br />
                  <u>RISK OF HYPERTENSIVE CRISIS</u>
                  <br />• IF SYSTOLIC between <mark>160 - 180 mmHg</mark>
                  <br />• IF <mark>ASYMPTOMATIC</mark>, continue clerking.
                  <br />• IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!
                  <br />
                  <br />
                  <u>If systolic between 140 - 160 mmHg: </u>
                </span>
                <br />o Ask for:
                <br />- Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN
                diagnosis)
                <br />- If diagnosed before, ask about compliance and whether he/she goes for
                regular follow up?
              </b>
            </Fragment>
          </PopupText>
          <br />
          <br />
          <span style={{ color: 'blue' }}>
            <h3>
              THE FOLLOWING QUESTIONS ARE NOT PART OF NSS QUESTIONNAIRE. PLEASE ASK THE PARTICIPANT
              ACCORDINGLY.{' '}
            </h3>
          </span>
          <br />
          <br />
          <span style={{ color: 'blue' }}>
            <b>
              2d. Are you on any types of medications not listed above? (includes use of traditional
              medicine)
            </b>
          </span>
          <RadioField name='hxNssQ9' label='Hx NSS Q9' />
          Please specify:
          <LongTextField name='hxNssQ10' label='Hx NSS Q10' />
          <span style={{ color: 'blue' }}>
            <b>
              2e. Please tick to highlight if you feel 'Past Medical History' requires closer
              scrutiny by doctors later. (If indicated 'Yes', please complete the question below.)
            </b>
          </span>
          <RadioField name='hxNssQ11' label='Hx NSS Q11' />
          <PopupText qnNo='hxNssQ11' triggerValue='Yes'>
            <br />

            <Fragment>
              <h2>
                Only complete Q2f if you are referring participant to Doctor's Consultation station.
              </h2>
              <span style={{ color: 'blue' }}>
                <b>
                  2f. Based on <u>participant's history taken thus far</u>, please summarise his/her{' '}
                  <mark>RELEVANT</mark> Past Medical History briefly for the doctors to refer to
                  during doctors consultation.
                  <br />
                  1) Conditions
                  <br />
                  2) Duration
                  <br />
                  3) Control
                  <br />
                  4) Compliance
                  <br />
                  5) Complications
                  <br />
                  6) Follow up route (specifiy whether GP/Polyclinic/FMC/SOC)
                </b>
              </span>
              <br />
              <br />
              If participant is not engaged with any follow-up, ask "what is the reason that you're
              not following up with your doctor for your existing conditions?"
              <br />- e.g. do not see the purpose for tests, busy/ no time, lack of access e.g.
              mobility issues, financial issues, fear of doctors/ clinics/ hospitals etc
              <br />
              <br />
              If a participant is not compliant to medications, do probe further on his/her reasons
              for not consuming medications as prescribed.
              <br />- Medication not effective? Can be managed without medication? Forget to take?
              Lost/Ran out of medication?
              <LongTextField name='hxNssQ12' label='Hx NSS Q12' />
              <br />
              <br />
            </Fragment>
          </PopupText>
          <b>Based on participant medical hx, please recommend relevant stations:</b>
          <br />
          1) Doctor's Consultation station, tick eligibility, Circle interested 'Y' on Page 1 of
          Form A
          <br />
          2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation
          <br />
          3) Relevant exhibition booths on page 2 of form A. Indicate accordingly for past history
          of DM / CVS Disease (including HTN, HLD, IHD) / CVA.
          <br />
          <br />
          For participant with DM, refer to DC if:
          <br />• Symptomatic, and non-compliant <br />• Asymptomatic, but non-compliant
          <br />
          Also, refer to DC if participant has not been diagnosed with DM, but has signs of DM
          (polyuria, polydipsia, periphery neuropathy, blurring of vision etc)
          <br />
          <span style={{ color: 'red' }}>
            <h3>CONTINUE REFERRING TO NSS QUESTIONNAIRE. </h3>
          </span>
          3. Have your immediate family members (parents/ siblings/ children) ever been diagnosed/
          told by a doctor that they have any of the chronic condition(s) listed below? Please tick
          if the answer is "Yes" to any of the conditions. You may select more than one. Please tick
          the last box if they have none.
          <SelectField name='hxNssQ13' checkboxes='true' label='Hx NSS Q13' />
          <br />
          Please specify:
          <LongTextField name='hxNssQ23' label='Hx NSS Q23' />
          <br />
          <br />
          4. Do you smoke?
          <RadioField name='hxNssQ14' label='Hx NSS Q14' />
          <PopupText
            qnNo='hxNssQ14'
            triggerValue='Yes, at least 1 cigarette (or equivalent) per day on average.'
          >
            <h3>
              If participant is a smoker, recommend HPB iQuit exhibition booth on Page 2 of Form A.
            </h3>
          </PopupText>
          <PopupText
            qnNo='hxNssQ14'
            triggerValue='Yes, occasionally, less than 1 cigarette (or equivalent) per day on average.'
          >
            <h3>
              If participant is a smoker, recommend HPB iQuit exhibition booth on Page 2 of Form A.
            </h3>
          </PopupText>
          5. Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor, a
          can or bottle of beer, or a glass of wine.)
          <RadioField name='hxNssQ15' label='Hx NSS Q15' />
          <br />
          <br />
          6. Do you consciously try to eat more fruits, vegetables, whole grain and cereals? Please
          tick where applicable.
          <br />
          <SelectField name='hxNssQ16' checkboxes='true' label='Hx NSS Q16' />
          <br />
          7. Do you exercise or participate in any form of moderate physical activity for at least
          150 minutes OR intense physical activity at least 75 minutes throughout the week? Note:
          Examples of physical activity includes exercising, walking, playing sports, washing your
          car, lifting/ moving moderately heavy luggage and doing housework.
          <RadioField name='hxNssQ17' label='Hx NSS Q17' />
          <b>
            Counsel for positive diet and lifestyle modification if deemed necessary. Refer to{' '}
            <span style={{ color: 'red' }}>dietitian</span> at Doctor's Consultation station,
            Indicate:
          </b>
          <br />
          1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A<br />
          2) Write reasons under dietitian referral on Page 2 of Form A Doctor's Consultation -
          Reasons for Recommendation
          <br />
          <br />
          Indicate Smoking/Alcohol Consumption on Page 2 of Form A for exhibition ambassadors if
          applicable. Smoking cessation engagement by HPB iQuit.
          <br />
          Recommend for lifestyle follow up on Page 2 of Form A if you deem necessary.
          <br />
          <br />
          8. When was the last time you had a blood test to check for hypertension, diabetes and
          cholesterol? Please answer all.
          <br />
          Hypertension
          <RadioField name='hxNssQ18' label='Hx NSS Q18' />
          Diabetes
          <RadioField name='hxNssQ19' label='Hx NSS Q19' />
          High Cholesterol
          <RadioField name='hxNssQ20' label='Hx NSS Q20' />
          <span style={{ color: 'red' }}>
            <h3>
              Please encourage participants to go for Phlebotomy screening every 3 years if relevant
              risk factors absent. If present, counsel for yearly screening.
            </h3>
          </span>
          <br />
          9. Has your doctor told you that the blood vessels to your limbs are diseased and have
          become narrower (periphery artery disease) or that any other major blood vessels in your
          body have weakened walls that have "ballooned out" (aneurysm)?
          <RadioField name='hxNssQ21' label='Hx NSS Q21' />
          <h3>PLEASE TAKE 3RD BP READING (IF MORE THAN 5MMHG) AND RECORD ON FORM A.</h3>
        </Fragment>

        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => (this.formRef = ref)} />
        </div>

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
}

HxNssForm.contextType = FormContext

export default function HxNssform(props) {
  return <HxNssForm {...props} />
}
