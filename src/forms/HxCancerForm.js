import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { SelectField, NumField, RadioField, LongTextField, BoolField } from 'uniforms-material';
import { useField } from 'uniforms';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import PopupText from 'src/utils/popupText';
import {getSavedData} from "../services/mongoDB";

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
    type: Number, optional: true
  }, hxCancerQ22: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxCancerQ23: {
    type: Boolean, label: "Yes", optional: true
  }, hxCancerQ24: {
    type: Number, optional: true
  }, hxCancerQ25: {
    type: Array, optional: false
  }, "hxCancerQ25.$": {
    type: String, allowedValues: ["FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)", "WCE (40 and above, females only)", "Geriatrics (60 and above)", "Doctor\s Consultation (& Dietitian) - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)", "Social Service - As recommended by hx-taker (CHAS Application, Financial Support required, Social Support required)", "Oral Health Screening - participants aged 40-59 with poor dental hygiene", "Exhibition - recommended as per necessary"]
  }, hxCancerQ26: {
    type: String, optional: true
  }, hxCancerQ27: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

const loadDataHxCancer = (savedData) => {
  return savedData ? new SimpleSchema({
        hxCancerQ1: {
          defaultValue : savedData.hxCancerQ1,
          type: Array, optional: false
        }, "hxCancerQ1.$": {
          type: String, allowedValues: ["Ischaemic Heart Disease (Including Coronary Artery Diseases) 缺血性心脏病（包括心脏血管阻塞)", "Cervical Cancer 子宫颈癌, (Please specify age of diagnosis): (Free text)", "Breast Cancer 乳癌, (Please specify age of diagnosis): (Free text)", "Colorectal Cancer 大肠癌, (Please specify age of diagnosis): (Free text)", "Others, (Please Specify condition and age of diagnosis): (Free text)", "No, I don\t have any of the above"]
        }, hxCancerQ2: {
          defaultValue : savedData.hxCancerQ2,
          type: Array, optional: false
        }, "hxCancerQ2.$": {
          type: String, allowedValues: ["Cervical Cancer 子宫颈癌, (Please specify age of diagnosis):", "Breast Cancer 乳癌, (Please specify age of diagnosis):", "Colorectal Cancer 大肠癌, (Please specify age of diagnosis):", "Others, (Please Specify condition and age of diagnosis):", "No"]
        }, hxCancerQ3: {
          defaultValue : savedData.hxCancerQ3,
          type: String, optional: true
        }, hxCancerQ4: {
          defaultValue : savedData.hxCancerQ4,
          type: String, optional: false
        }, hxCancerQ5: {
          defaultValue : savedData.hxCancerQ5,
          type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
        }, hxCancerQ6: {
          defaultValue : savedData.hxCancerQ6,
          type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
        }, hxCancerQ7: {
          defaultValue : savedData.hxCancerQ7,
          type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
        }, hxCancerQ8: {
          defaultValue : savedData.hxCancerQ8,
          type: String, allowedValues: ["1 year ago or less", "More than 1 year to 2 years", "More than 2 years to 3 years", "More than 3 years to 4 years", "More than 4 years to 5 years", "More than 5 years", "Never been checked"], optional: true
        }, hxCancerQ9: {
          defaultValue : savedData.hxCancerQ9,
          type: String, allowedValues: ["Yes", "No"], optional: false
        }, hxCancerQ10: {
          defaultValue : savedData.hxCancerQ10,
          type: String, optional: true
        }, hxCancerQ11: {
          defaultValue : savedData.hxCancerQ11,
          type: Number, optional: false
        }, hxCancerQ12: {
          defaultValue : savedData.hxCancerQ12,
          type: Number, optional: false
        }, hxCancerQ13: {
          defaultValue : savedData.hxCancerQ13,
          type: Number, optional: false
        }, hxCancerQ14: {
          defaultValue : savedData.hxCancerQ14,
          type: Number, optional: false
        }, hxCancerQ15: {
          defaultValue : savedData.hxCancerQ15,
          type: Number, optional: true
        }, hxCancerQ16: {
          defaultValue : savedData.hxCancerQ16,
          type: Number, optional: true
        }, hxCancerQ17: {
          defaultValue : savedData.hxCancerQ17,
          type: Number, optional: false
        }, hxCancerQ18: {
          defaultValue : savedData.hxCancerQ18,
          type: Number, optional: false
        }, hxCancerQ19: {
          defaultValue : savedData.hxCancerQ19,
          type: Number, optional: false
        }, hxCancerQ20: {
          defaultValue : savedData.hxCancerQ20,
          type: Number, optional: false
        }, hxCancerQ21: {
          defaultValue : savedData.hxCancerQ21,
          type: Number, optional: true
        }, hxCancerQ22: {
          defaultValue : savedData.hxCancerQ22,
          type: String, allowedValues: ["Yes", "No"], optional: false
        }, hxCancerQ23: {
          defaultValue : savedData.hxCancerQ23,
          type: Boolean, label: "Yes", optional: true
        }, hxCancerQ24: {
          defaultValue : savedData.hxCancerQ24,
          type: Number, optional: true
        }, hxCancerQ25: {
          defaultValue : savedData.hxCancerQ25,
          type: Array, optional: false
        }, "hxCancerQ25.$": {
          type: String, allowedValues: ["FIT (50 and above, FIT not done in past 1 year, Colonoscopy not done in past 10 years, Not diagnosed with colorectal cancer)", "WCE (40 and above, females only)", "Geriatrics (60 and above)", "Doctor\s Consultation (& Dietitian) - As recommended by hx-taker, undiagnosed or non-compliant cases (HTN, DM, Vision Impairment, Hearing Impairment, Urinary Incontinence, Any other pertinent medical issues)", "Social Service - As recommended by hx-taker (CHAS Application, Financial Support required, Social Support required)", "Oral Health Screening - participants aged 40-59 with poor dental hygiene", "Exhibition - recommended as per necessary"]
        }, hxCancerQ26: {
          defaultValue : savedData.hxCancerQ26,
          type: String, optional: true
        }, hxCancerQ27: {
          defaultValue : savedData.hxCancerQ27,
          type: String, allowedValues: ["Yes", "No"], optional: false
        }
      }
      )
      : schema
}

function CalcBMI() {
  const [{ value: height_cm }] = useField("hxCancerQ19", {});
  const [{ value: weight }] = useField("hxCancerQ20", {});
  if (height_cm && weight) {
    const height = height_cm / 100;
    return ((weight/height)/height).toFixed(1);
  }
  return null;
}

function IsHighBP(props) {
  const [{ value: sys }] = useField(props.systolic_qn, {});
  const [{ value: dias }] = useField(props.diastolic_qn, {});
  if (sys>140 && dias>90) {
    return (<Fragment>
      <font color="red"><b>BP HIGH!</b></font> <br />
    </Fragment>);
  }
  return null;
}

const formName = "hxCancerForm"
const HxCancerForm = () => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate();
  const [saveData, setSaveData] = useState(null)
  const displayArray = (item) => {
    return item !== undefined ? item.map((x, index) => <p key={index}> {index + 1 + ". " + x} </p>) : "None"
  }

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
    const getSchema = savedData ? await loadDataHxCancer(savedData) : schema
    setForm_schema(new SimpleSchema2Bridge(getSchema))
  }, [])

    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, formName );
          if (!response.result) {
            alert(response.error);
          }
          navigate('/app/dashboard', { replace: true });
        }}
      >

        <Fragment>
          <h2>HISTORY TAKING PART 4: CANCER SCREENING</h2>
          <h2>1. HISTORY OF CANCER & FAMILY HISTORY</h2>
          <b><font color="blue">1. Has a doctor ever told you that you have the following conditions?</font> Do be sensitive when asking for personal history of cancer. (please select all that apply)</b><br />
          <h2> {saveData !== null ? "ORIGINAL Q1: "  : ""}</h2>
          <h2> {saveData !== null ? displayArray(saveData.hxCancerQ1) : ""}</h2>
          <SelectField name="hxCancerQ1" checkboxes="true" label="Hx Cancer Q1" /><br /><br />

          Please specify:
          <LongTextField name="hxCancerQ26" label="Hx Cancer Q26" /><br /><br />

          <b><font color="blue">2. Is there positive family history (AMONG FIRST DEGREE RELATIVES) for the following cancers?</font></b>
          <h2> {saveData !== null ? "ORIGINAL Q2: " : ""}</h2>
          <h2> {saveData !== null ? displayArray(saveData.hxCancerQ2) : ""}</h2>
          <SelectField name="hxCancerQ2" checkboxes="true" label="Hx Cancer Q2" /><br /><br />

          Please specify:
          <LongTextField name="hxCancerQ3" label="Hx Cancer Q3" /><br /><br />

          <b><font color="blue">3. Any other significant family history?</font></b> Indicate 'NIL' if none.
          <LongTextField name="hxCancerQ4" label="Hx Cancer Q4" /><br /><br />

          <b>Counsel for screening if positive family history of cancer or chronic disease. <br /><br />

            Based on participant family hx, please recommend FIT/WCE and Doctor's Consultation (if applicable)</b> <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A  <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation   <br />3) Recommend relevant exhibition booths on Page 2 of Form A Exhibition - Recommendation<br /><br /><br />

          <font color="red"><h3>CONTINUE REFERRING TO NSS QUESTIONNAIRE. </h3></font>
          <h2>2. NSS CANCER SCREENING PRACTICES SURVEY.</h2><br /><br />
          <font color="red"><b>1. For respondent aged 50 and above only,</b></font> unless positive family history for colorectal cancer.<br />When was the last time you had a blood stool test? (A blood stool test is a test to determine whether the stool contains blood.)
          <RadioField name="hxCancerQ5" label="Hx Cancer Q5" /><br /><br />
          <font color="red"><b>2. For respondent aged 50 and above only,</b></font> unless positive family history for colorectal cancer.<br />When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a tube is inserted in the rectum to view the colon for signs of cancer or other health problems.)
          <RadioField name="hxCancerQ6" label="Hx Cancer Q6" />
          <font color="red"><b>Please encourage participants to go for FIT every year if participant is above 50, asymptomatic and no positive family history of colorectal cancer in first degree relatives. <br />If deemed to be in high risk (positive family history of colorectal cancer in first degree relatives, counsel for colonoscopy every 3 years), refer to risk categorization given.</b></font><br /><br /><br /><br />
          <font color="red"><b>3. For <u>female</u> respondent aged 40 and above only.</b></font><br />When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast to look for breast cancer.)
          <RadioField name="hxCancerQ7" label="Hx Cancer Q7" /><br /><br />
          <font color="red"><b>4. For <u>female</u> respondent aged 25 and above, who have/had a husband/boyfriend and not had their womb completely surgically removed only.</b></font><br />When was the last time you had a PAP smear test? (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the womb, to check for changes in the cells of your cervix, which may develop into cancer later.)
          <RadioField name="hxCancerQ8" label="Hx Cancer Q8" />
          <b><font color="red">For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and above and if interested, refer to WCE.<br />Please encourage participants to go for HPV test every 5 years. <br />Refer to WCE: </font><br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A</b><br /><br /><br /><br />
          <b>If participant has a <mark>history of cancer</mark> or if <mark>participant's family history</mark> requires further scrutiny by doctors, refer to doctor's consult. <font color="red">(If indicated 'Yes', please complete the question below.)</font></b>
          <RadioField name="hxCancerQ9" label="Hx Cancer Q9" />
          <PopupText qnNo="hxCancerQ9" triggerValue="Yes">
            <h2>Only complete Q6 if you are referring participant to Doctor's Consultation station.</h2>
            <b><font color="blue">6. Based on participant's history taken thus far, please summarise his/her RELEVANT Family History briefly for the doctors to refer to during doctors consultation.</font><br /><br />1) Participant's history of Cancers (if any)<br />2) Positive family history of medical conditions in first-degree relatives:<br />3) Positive family history of Cancers (Cervical, Breast, Colorectal)</b>
            <LongTextField name="hxCancerQ10" label="Hx Cancer Q10" />
          </PopupText>
          <br />
          <h2>3. VITALS</h2>
          <h3>Please fill in the participant's BP and BMI based on what you earlier recorded on Form A and copy to <font color="red">NSS form too.</font></h3>
          <b><u>1) BLOOD PRESSURE</u></b> (Before measuring BP: ensure no caffeine, anxiety, running and smoking in the last 30 minutes.)<br />
          1st Reading Systolic (units in mmHg) <br />
          <NumField name="hxCancerQ11" label="Hx Cancer Q11" /> <br />
          1st Reading Diastolic (units in mmHg) <br />
          <NumField name="hxCancerQ12" label="Hx Cancer Q12" /> <br />

          <IsHighBP systolic_qn="hxCancerQ11" diastolic_qn="hxCancerQ12" />
          <br />
          2nd Reading Systolic (units in mmHg) <br />
          <NumField name="hxCancerQ13" label="Hx Cancer Q13" /> <br />
          2nd Reading Diastolic (units in mmHg) <br />
          <NumField name="hxCancerQ14" label="Hx Cancer Q14" /> <br />

          <IsHighBP systolic_qn="hxCancerQ13" diastolic_qn="hxCancerQ14" />
          <br />
          3rd Reading Systolic (ONLY if 1st and 2nd systolic reading differ by <b>>5mmHg</b>) <br />
          <NumField name="hxCancerQ15" label="Hx Cancer Q15" /> <br />
          3rd Reading Diastolic (ONLY if 1st and 2nd systolic reading differ by >5mmHg) <br />
          <NumField name="hxCancerQ16" label="Hx Cancer Q16" /> <br />
          
          <IsHighBP systolic_qn="hxCancerQ15" diastolic_qn="hxCancerQ16" />
          <br />

          Average Reading Systolic (average of closest 2 readings): <br />
          <NumField name="hxCancerQ17" label="Hx Cancer Q17" /> <br />
          Average Reading Diastolic (average of closest 2 readings): <br />
          <NumField name="hxCancerQ18" label="Hx Cancer Q18" /> <br />
          Hypertension criteria:<br />○ Younger participants: > 140/90<br />○ Participants > 80 years old: > 150/90 <br />○ CKD w proteinuria (mod to severe albuminuria): > 130/80<br />○ DM: > 130/80<br /> <br />
          Please tick to highlight if you feel <b>BLOOD PRESSURE</b> require closer scrutiny by docors later.<br /><br />
          <RadioField name="hxCancerQ27" label="Hx Cancer Q27" />
          <PopupText qnNo="hxCancerQ27" triggerValue="Yes">
              <b>REFER TO DR CONSULT: (FOR THE FOLLOWING SCENARIOS)
                <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A  
                <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation   
                <br /><br /><font color="red"><u>HYPERTENSIVE EMERGENCY</u>
                <br />• SYSTOLIC  <mark>≥ 180</mark> AND/OR DIASTOLIC ≥ <mark>110 mmHg</mark> AND <mark><u>SYMPTOMATIC</u></mark> (make sure pt has rested and 2nd reading was taken)
                <br />o <mark>ASK THE DOCTOR TO COME AND REVIEW!</mark><br /> 
                <br /><u>HYPERTENSIVE URGENCY</u>
                <br />• SYSTOLIC  <mark>≥ 180</mark> AND/OR DIASTOLIC <mark>≥ 110 mmHg</mark> AND <mark>ASYMPTOMATIC</mark> (make sure pt has rested and 2nd reading was taken)
                <br />o ESCORT TO DC DIRECTLY!
                <br />o Follow the patient, continue clerking the patient afterward if doctor acknowledges patient is well enough to continue the screening<br />
                <br /><u>RISK OF HYPERTENSIVE CRISIS</u>
                <br />• IF SYSTOLIC between <mark>160 - 180 mmHg</mark> 
                <br />• IF <mark>ASYMPTOMATIC</mark>, continue clerking. 
                <br />• IF <mark>SYMPTOMATIC</mark>, ESCORT TO DC DIRECTLY!<br />
                <br /><u>If systolic between 140 - 160 mmHg:</u></font>
                <br />o Ask for:
                <br />- Has hypertension been pre-diagnosed? If not, refer to DC (possible new HTN diagnosis)
                <br />- If diagnosed before, ask about compliance and whether he/she goes for regular follow up? If non-compliant or not on regular follow-up, refer to DC (chronic HTN, uncontrolled).<br /></b>
          </PopupText>
          <h2><u>2) BMI</u></h2>
          Height (in cm) <br />
          <NumField name="hxCancerQ19" label="Hx Cancer Q19" /> <br />
          Weight (in kg) <br />
          <NumField name="hxCancerQ20" label="Hx Cancer Q20" /> <br />
          
          <h3>
            BMI: <CalcBMI/>
          </h3>


          <br />
          2a. Has a doctor ever told you that you are overweight or obese before?
          <RadioField name="hxCancerQ22" label="Hx Cancer Q22" />
          2b. Please tick to highlight if you feel BMI or BP requires closer scrutiny by doctors and dietitians later.
          <BoolField name="hxCancerQ23" />
          <PopupText qnNo="hxCancerQ23" triggerValue={true}>
              <b>REFER TO DR CONSULT at:</b> <br />1) <font color="red">Doctor's Consultation station</font>, tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation, <br />IF BMI IS:<br />≥ 23 as overweight (if positive for other risk factors) and ≥ 27.5 as obese, write reasons under dietitian referral on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br />
          </PopupText>
          <h3><u>3) Waist Circumference</u> (taken only if cannot measure BMI e.g. wheelchair, prosthetic legs)</h3>
          Waist Circumference (in cm) <br />
          <NumField name="hxCancerQ24" label="Hx Cancer Q24" /> <br />
          <h2>HISTORY TAKING PART 5: REFERRALS/MEGA SORTING STATION </h2>
          1. REFERRALS<br />Please reference page 1 of form A for various criteria.
          <h2> {saveData !== null ? "ORIGINAL Q25: ": ""}</h2>
          <h2> {saveData !== null ? displayArray(saveData.hxCancerQ25) : ""}</h2>
          <SelectField name="hxCancerQ25" checkboxes="true" label="Hx Cancer Q25" />

        </Fragment>

        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => {}} />
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

HxCancerForm.contextType = FormContext;

export default function HxCancerform(props) {
  const navigate = useNavigate();

  return <HxCancerForm {...props} navigate={navigate} />;
}