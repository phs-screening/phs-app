import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { SelectField, NumField, RadioField, LongTextField } from 'uniforms-material';

const schema = new SimpleSchema({
  hxCancerQ1: {
    type: Array, optional: false
  }, "hxCancerQ1.$": {
    type: String, allowedValues: ["Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)", "Cervical Cancer 子宫颈癌, (Please specify age of diagnosis): (Free text)", "Breast Cancer 乳癌, (Please specify age of diagnosis): (Free text)", "Colorectal Cancer 大肠癌, (Please specify age of diagnosis): (Free text)", "Others, (Please Specify condition and age of diagnosis): (Free text)", "No, I don\t have any of the above"]
  }, hxCancerQ2: {
    type: Array, optional: false
  }, "hxCancerQ2.$": {
    type: String, allowedValues: ["Cervical Cancer 子宫颈癌, (Please specify age of diagnosis):", "Breast Cancer 乳癌, (Please specify age of diagnosis):", "Colorectal Cancer 大肠癌, (Please specify age of diagnosis):", "Others, (Please Specify condition and age of diagnosis):", "No"]
  }, hxCancerQ3: {
    type: String, optional: true
  }, hxCancerQ4: {
    type: String, optional: false
  }, hxCancerQ5: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
  }, hxCancerQ6: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
  }, hxCancerQ7: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
  }, hxCancerQ8: {
    type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
  }, hxCancerQ9: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxCancerQ10: {
    type: String, optional: true
  }, hxCancerQ11: {
    type: Number, optional: false
  }, hxCancerQ12: {
    type: Number, optional: false
  }, hxCancerQ13: {
    type: Number, optional: false
  }, hxCancerQ14: {
    type: Number, optional: false
  }, hxCancerQ15: {
    type: Number, optional: true
  }, hxCancerQ16: {
    type: Number, optional: true
  }, hxCancerQ17: {
    type: Number, optional: false
  }, hxCancerQ18: {
    type: Number, optional: false
  }, hxCancerQ19: {
    type: Number, optional: false
  }, hxCancerQ20: {
    type: Number, optional: false
  }, hxCancerQ21: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxCancerQ22: {
    type: Array, optional: true
  }, "hxCancerQ22.$": {
    type: String, allowedValues: ["Yes"]
  }, hxCancerQ23: {
    type: Number, optional: true
  }, hxCancerQ24: {
    type: Array, optional: false
  }, "hxCancerQ24.$": {
    type: String, allowedValues: ["FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)", "WCE (40 and above, females only)", "Geriatrics (60 and above)", "Doctor\s Consultation (& Dietitian) - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)", "Social Service - As recommended by hx-taker (CHAS Application, Financial Support required, Social Support required)", "Oral Health Screening - participants aged 40-59 with poor dental hygiene", "Exhibition - recommended as per necessary"]
  }
}
)

class HxCancerForm extends Component {

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={console.log}
        //onSubmit={this.handleSubmit}
        onSubmitSuccess={() => {
          alert("Successful");
        }}
        onSubmitFailure={() => {
          alert('Unsuccessful')
        }}
      >

        <Fragment>
          <h2>HISTORY TAKING PART 4: CANCER SCREENING</h2>
          <h2>1. HISTORY OF CANCER & FAMILY HISTORY</h2>
          1. Has a doctor ever told you that you have the following conditions? Do be sensitive when asking for personal history of cancer. (please select all that apply)
          <SelectField name="hxCancerQ1" checkboxes="true" label="Hx Cancer Q1" />
          2. Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following cancers?
          <SelectField name="hxCancerQ2" checkboxes="true" label="Hx Cancer Q2" />
          Please specify:
          <LongTextField name="hxCancerQ3" label="Hx Cancer Q3" />
          3. Any other significant family history? Indicate 'NIL' if none.
          <LongTextField name="hxCancerQ4" label="Hx Cancer Q4" />
          Counsel for screening if positive family history of cancer or chronic disease. <br /><br />Based on participant family hx, please recommend FIT/WCE and Doctor's Consultation (if applicable) <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A  <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation   <br />3) Recommend relevant exhibition booths on Page 2 of Form A Exhibition - Recommendation<br />
          <h3>CONTINUE REFERRING TO NSS QUESTIONNAIRE. </h3>
          <h2>2. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
          1. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a blood stool test? (A blood stool test is a test to determine whether the stool contains blood.)
          <RadioField name="hxCancerQ5" label="Hx Cancer Q5" />
          2. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a tube is inserted in the rectum to view the colon for signs of cancer or other health problems.)
          <RadioField name="hxCancerQ6" label="Hx Cancer Q6" />
          Please encourage participants to go for FIT every year if participant is above 50, asymptomatic and no positive family history of colorectal cancer in first degree relatives. <br />If deemed to be in high risk (positive family history of colorectal cancer in first degree relatives, counsel for colonoscopy every 3 years), refer to risk categorization given.<br />
          3. For female respondent aged 40 and above only.<br />When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast to look for breast cancer.)
          <RadioField name="hxCancerQ7" label="Hx Cancer Q7" />
          4. For female respondent aged 25 and above, who have/had a husband/boyfriend and not had their womb completely surgically removed only.<br />When was the last time you had a PAP smear test? (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the womb, to check for changes in the cells of your cervix, which may develop into cancer later.)
          <RadioField name="hxCancerQ8" label="Hx Cancer Q8" />
          <h2>For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and above and if interested, refer to WCE.<br />Please encourage participants to go for HPV test every 5 years. <br />Refer to WCE: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A  </h2>
          If participant has a history of cancer or if participant's family history requires further scrutiny by doctors, refer to doctor's consult. (If indicated 'Yes', please complete the question below.)
          <RadioField name="hxCancerQ9" label="Hx Cancer Q9" />
          <h2>Only complete Q6 if you are referring participant to Doctor's Consultation station.</h2>
          6. Based on participant's history taken thus far, please summarise his/her RELEVANT Family History briefly for the doctors to refer to during doctors consultation.<br /><br />1) Participant's history of Cancers (if any)<br />2) Positive family history of medical conditions in first-degree relatives:<br />3) Positive family history of Cancers (Cervical, Breast, Colorectal)
          <LongTextField name="hxCancerQ10" label="Hx Cancer Q10" />
          <h2>3. VITALS</h2>
          <h3>Please fill in the participant's BP and BMI based on what you earlier recorded on Form A and copy to NSS form too.</h3>
          1) BLOOD PRESSURE (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last 30 minutes.)<br />
          1st Reading Systolic (units in mmHg)
          <NumField name="hxCancerQ11" label="Hx Cancer Q11" />
          1st Reading Diastolic (units in mmHg)
          <NumField name="hxCancerQ12" label="Hx Cancer Q12" />
          2nd Reading Systolic (units in mmHg)
          <NumField name="hxCancerQ13" label="Hx Cancer Q13" />
          2nd Reading Diastolic (units in mmHg)
          <NumField name="hxCancerQ14" label="Hx Cancer Q14" />
		3rd Reading Systolic (ONLY if 1st and 2nd systolic reading differ by >5mmHg)
          <NumField name="hxCancerQ15" label="Hx Cancer Q15" />
		3rd Reading Diastolic (ONLY if 1st and 2nd systolic reading differ by >5mmHg)
          <NumField name="hxCancerQ16" label="Hx Cancer Q16" />
          Average Reading Systolic (average of closest 2 readings)
          <NumField name="hxCancerQ17" label="Hx Cancer Q17" />
          Average Reading Diastolic (average of closest 2 readings)
          <NumField name="hxCancerQ18" label="Hx Cancer Q18" />
          Hypertension criteria:<br />○ Younger participants: > 140/90<br />○ Participants > 80 years old: > 150/90 <br />○ CKD w proteinuria (mod to severe albuminuria): > 130/80<br />○ DM: > 130/80<br /> <br />REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)<br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A  <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation   <br /><br />HYPERTENSIVE EMERGENCY<br />• SYSTOLIC  ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg AND SYMPTOMATIC (make sure pt has rested and 2nd reading was taken)<br />o ASK THE DOCTOR TO COME AND REVIEW!<br /> <br />HYPERTENSIVE URGENCY<br />• SYSTOLIC  ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg AND ASYMPTOMATIC (make sure pt has rested and 2nd reading was taken)<br />o ESCORT TO DC DIRECTLY!<br />o Follow the patient, continue clerking the patient afterward if doctor acknowledges patient is well enough to continue the screening<br /><br />RISK OF HYPERTENSIVE CRISIS<br />• IF SYSTOLIC between 160 - 180 mmHg <br />• IF ASYMPTOMATIC, continue clerking. <br />• IF SYMPTOMATIC, ESCORT TO DC DIRECTLY!<br /><br />If systolic between 140 - 160 mmHg:<br />o Ask for:<br />- Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN diagnosis)<br />- If diagnosed before, ask about compliance and whether he/she goes for regular follow up? If non-compliant or not on regular follow-up, refer to DC (chronic HTN, uncontrolled).<br />
          <h2>2) BMI</h2>
          Height (in cm)
          <NumField name="hxCancerQ19" label="Hx Cancer Q19" />
          Weight (in kg)
          <NumField name="hxCancerQ20" label="Hx Cancer Q20" />
          BMI
          <NumField name="hxCancerQ21" label="Hx Cancer Q21" />
          2a. Has a doctor ever told you that you are overweight or obese before?
          <RadioField name="hxCancerQ21" label="Hx Cancer Q21" />
          2b. Please tick to highlight if you feel BMI or BP requires closer scrutiny by doctors and dietitians later.
          <SelectField name="hxCancerQ22" checkboxes="true" label="Hx Cancer Q22" />
          REFER TO DR CONSULT at: <br />1) Doctor's Consultation station, tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation, <br />IF BMI IS:<br />≥ 23 as overweight (if positive for other risk factors) and ≥ 27.5 as obese, write reasons under dietitian referral on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br />
          <h3>3) Waist Circumference (taken only if cannot measure BMI e.g. wheelchair, prosthetic legs)</h3>
          Waist Circumference (in cm)
          <NumField name="hxCancerQ23" label="Hx Cancer Q23" />
          <h2>HISTORY TAKING PART 5: REFERRALS/MEGA SORTING STATION </h2>
          1. REFERRALS<br />Please reference page 1 of form A for various criteria.
          <SelectField name="hxCancerQ24" checkboxes="true" label="Hx Cancer Q24" />

        </Fragment>

        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => this.formRef = ref} />
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
}

export default HxCancerForm;