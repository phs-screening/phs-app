import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { SelectField, RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

import PopupText from '../utils/popupText';
import {getSavedData} from "../services/mongoDB";
import "./fieldPadding.css"


// Formerly NSS, renamed to PMHX as of PHS 2022. Forms not renamed, only tabe name
const schema = new SimpleSchema({
  hxNssQ1: {
    type: String, allowedValues: ["Yes, (Please specify):", "None"], optional: false
  }, hxNssQ2: {
        type: String, optional: true
  }, hxNssQ3: {
    type: String, optional: true
  }, hxNssQ4: {
    type: Array, optional: true
  }, "hxNssQ4.$": {
    type: String, allowedValues: ["Do not see the need for tests", "Challenging to make time to go for appointments", "Difficulties gtting to the clinics", "Financial issues", "Scared of doctor", "Others: (please specify reason)"]
  }, hxNssQ5: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: true
  }, hxNssQ6: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: true
  }, hxNssQ7: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: true
  }, hxNssQ8: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: true
  }, hxNssQ9: {
    type: String, allowedValues: ["Yes, (Please specify):", "None"], optional: false
  }, hxNssQ10: {
    type: String, optional: true
  }, hxNssQ11: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxNssQ12: {
    type: String, optional: true
  }, hxNssQ13: {
    type: Array, optional: true
  }, "hxNssQ13.$": {
    type: String, allowedValues: ["Cancer", "Coronary Heart disease (caused by narrowed blood vessels supplying the heart muscle) or Heart attack, (Please specify):", "Diabetes", "Hypertension", "High Cholesterol", "Stroke (including transient ischaemic attack)", "No, they do not have any of the above."]
  }, hxNssQ14: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxNssQ15: {
    type: String, allowedValues: ["Less than 2 standard drinks per day on average.", "More than 2 standard drinks per day on average.", "No", "Quit Alcoholic Drinks"], optional: false
  }, hxNssQ16: {
    type: Array, optional: false
  }, "hxNssQ16.$": {
    type: String, allowedValues: ["No (Skip to Q7)", "Yes (Proceed to answer below)", "Vegetables (1 serving/day)", "Vegetables (2 or more servings/day)", "Fruits (1 serving/day)", "Fruits (2 or more servings/day)", "Whole grain and cereals"]
  }, hxNssQ17: {
    type: String, allowedValues: ["Yes (At least 20 mins each time, for 3 or more days per week.)", "Yes (At least 20 mins each time, for less than 3 days per week.)", "No participation of at least 20 min each time."], optional: false
  }, hxNssQ18: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: false
  }, hxNssQ19: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: false
  }, hxNssQ20: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: false
  }, hxNssQ21: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxNssQ22: {
    type: String, optional: true
  }, hxNssQ23: {
    type: String, optional: true
  }, hxNssQ24: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

const formName = "hxNssForm"
const HxNssForm = (props) => {
  const [loading, isLoading] = useState(false);
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const { changeTab, nextTab } = props;

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
  }, [])
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        className='fieldPadding'
        onSubmit={async (model) => {
          isLoading(true);
          const response = await submitForm(model, patientId, formName);
          if (response.result) {
            const event = null; // not interested in this value
            isLoading(false);
            setTimeout(() => {
              alert("Successfully submitted form");
              changeTab(event, nextTab);
            }, 80);
          } else {
            isLoading(false);
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`);
            }, 80);
          }
        }}
        model={saveData}
      >

        <Fragment>
          <h2>HISTORY TAKING PART 2: PAST MEDICAL HISTORY</h2>
          <br /><br />
          <h2>1. Past Medical History</h2>
          <br/>


          <h3>PLEASE TAKE 2ND BP READING NOW AND RECORD ON FORM A.<br /></h3>
          Hypertension criteria:<br />○ Younger participants: > 140/90<br />○ Participants > 80 years old: > 150/90 <br />○ CKD w proteinuria (mod to severe albuminuria): > 130/80<br />○ DM: > 130/80<br /><br/> <p>Please tick to highlight if you feel <b>BLOOD PRESSURE</b> requires closer scrutiny by doctors later </p>
          <RadioField name="hxNssQ24" label="Hx NSS Q24" />


          <PopupText qnNo="hxNssQ24" triggerValue="Yes">
            <br />

            <Fragment>
              <b>REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)
                <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A
                <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation
                <br /><br />
                <span style={{ color: "red" }}><u>HYPERTENSIVE EMERGENCY</u>
                  <br />• SYSTOLIC  <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND <mark><u>SYMPTOMATIC</u></mark> (make sure pt has rested and 2nd reading was taken)
                  <br /><mark>o ASK THE DOCTOR TO COME AND REVIEW!</mark><br />
                  <br />
                  <u>HYPERTENSIVE URGENCY</u>
                  <br />• SYSTOLIC  <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND <mark>ASYMPTOMATIC</mark> (make sure pt has rested and 2nd reading was taken)
                  <br />o ESCORT TO DC DIRECTLY!
                  <br />o Follow the patient, continue clerking the patient afterward if doctor acknowledges patient is well enough to continue the screening<br /><br />
                  <u>RISK OF HYPERTENSIVE CRISIS</u>
                  <br />• IF SYSTOLIC between <mark>160 - 180 mmHg</mark>
                  <br />• IF <mark>ASYMPTOMATIC</mark>, continue clerking.
                  <br />• IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!
                  <br /><br />
                  <u>If systolic between 140 - 160 mmHg: </u></span>
                <br />o Ask for:
                <br />- Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN diagnosis)
                <br />- If diagnosed before, ask about compliance and whether he/she goes for regular follow up?</b>
            </Fragment>
          </PopupText>
          <br />
          <br />
          <span style={{ color: "black" }}><b>Do you have any drug allergies?</b></span>
          <RadioField name="hxNssQ1" label="Hx NSS Q1" />
          Please specify:
          <LongTextField name="hxNssQ2" label="Hx NSS Q2" />

          <br />
          <br />
          <span style={{ color: "black" }}><b>Are you on any alternative medicine including traditional chinese medications, homeopathy etc?</b></span>
          <RadioField name="hxNssQ9" label="Hx NSS Q9" />
          Please specify:
          <LongTextField name="hxNssQ10" label="Hx NSS Q10" />
          <br />

          <Fragment>
            <span style={{ color: "blue" }}><b>Please summarise his/her <mark>RELEVANT</mark> Past Medical History briefly for the doctors to refer to during doctors consultation.
              <br />1) Conditions
              <br />2) Duration
              <br />3) Control
              <br />4) Compliance
              <br />5) Complications
              <br />6) Follow up route (specifiy whether GP/Polyclinic/FMC/SOC)</b></span>
            <br />If participant is not engaged with any follow-up, ask "what is the reason that you're not following up with your doctor for your existing conditions?"
            <br />- e.g. do not see the purpose for tests, busy/ no time, lack of access e.g. mobility issues, financial issues, fear of doctors/ clinics/ hospitals etc
            <br /><br />If a participant is not compliant to medications, do probe further on his/her reasons for not consuming medications as prescribed.
            <br />- Medication not effective? Can be managed without medication? Forget to take? Lost/Ran out of medication?
            <LongTextField name="hxNssQ12" label="Hx NSS Q12" /><br /><br />
          </Fragment>


          <span style={{ color: "black" }}><b>Please tick to highlight if you feel 'Past Medical History' requires closer scrutiny by doctors later</b></span>
          <RadioField name="hxNssQ11" label="Hx NSS Q11" />

          <br />

          <b>Based on participant medical hx, please recommend relevant stations:</b>
          1) Doctor's Consultation station, tick eligibility, Circle interested 'Y' on Page 1 of Form A
          <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation
          <br />3) Relevant exhibition booths on page 2 of form A. Indicate accordingly for past history of DM / CVS Disease (including HTN, HLD, IHD) / CVA.<br /><br />
          <b>For participant with DM, refer to DC if:</b>• Symptomatic, and non-compliant <br />• Asymptomatic, but non-compliant<br />Also, refer to DC if participant has not been diagnosed with DM, but has signs of DM (polyuria, polydipsia, periphery neuropathy, blurring of vision etc)
          <br />

          <br />
          Do you smoke?
          <RadioField name="hxNssQ14" label="Hx NSS Q14" />
          Roughly, how many pack-years?
          <LongTextField name="hxNssQ3" label="Hx NSS Q3" />
          <br/>

          Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor, a can or bottle of beer, or a glass of wine.)
          <RadioField name="hxNssQ15" label="Hx NSS Q15" />
          <br /><br />
          Do you consciously try to eat more fruits, vegetables, whole grain and cereals? Please tick where applicable.<br />
          <SelectField name="hxNssQ16" checkboxes="true" label="Hx NSS Q16" />
          <br /><br/>
          Do you exercise or participate in any form of moderate physical activity for at least 150 minutes OR intense physical activity at least 75 minutes throughout the week? Note: Examples of physical activity includes exercising, walking, playing sports, washing your car, lifting/ moving moderately heavy luggage and doing housework.
          <RadioField name="hxNssQ17" label="Hx NSS Q17" /> <br />
          <b>Counsel for positive diet and lifestyle modification if deemed necessary. Refer to <span style={{ color: "red" }}>dietitian</span> at Doctor's Consultation station, Indicate:</b>
          1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A<br />2) Write reasons under dietitian referral on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br /><br />

          <br />
          When was the last time you had a blood test to check for hypertension, diabetes and cholesterol? Please answer all.
          <br />
          Hypertension
          <RadioField name="hxNssQ18" label="Hx NSS Q18" />
          Diabetes
          <RadioField name="hxNssQ19" label="Hx NSS Q19" />
          High Cholesterol
          <RadioField name="hxNssQ20" label="Hx NSS Q20" />

          <span style={{ color: "red" }}><h3>Please encourage participants to go for Phlebotomy screening every 3 years if relevant risk factors absent. If present, counsel for yearly screening.</h3></span>
          <br />
          Has your doctor told you that the blood vessels to your limbs are diseased and have become narrower (periphery artery disease) or that any other major blood vessels in your body have weakened walls that have "ballooned out" (aneurysm)?
          <RadioField name="hxNssQ21" label="Hx NSS Q21" />
          <h3>PLEASE TAKE 3RD BP READING (IF MORE THAN 5MMHG) AND RECORD ON FORM A.</h3>

        </Fragment>

        <ErrorsField />
        <div>
          {loading ? <CircularProgress />
          : <SubmitField inputRef={(ref) => {}} />}
        </div>

        <br /><Divider />
      </AutoForm>
    );

    return (
      <Paper elevation={2} p={0} m={0}>
        {newForm()}
      </Paper>
    );
}

HxNssForm.contextType = FormContext;

export default function HxNssform(props) {
  return <HxNssForm {...props} />;
}