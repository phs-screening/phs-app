import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

import PopupText from '../utils/popupText';

const schema = new SimpleSchema({
  hxHcsrQ1: {
    type: String, optional: false
  }, hxHcsrQ2: {
    type: String, optional: false
  }, hxHcsrQ3: {
    type: String, optional: false
  }, hxHcsrQ4: {
    type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
  }, hxHcsrQ5: {
    type: String, optional: true
  }, hxHcsrQ6: {
    type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
  }, hxHcsrQ7: {
    type: String, optional: true
  }, hxHcsrQ8: {
    type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
  }, hxHcsrQ9: {
    type: String, optional: true
  }, hxHcsrQ11: {
    type: String,
    allowedValues: ["Yes", "No"],
    optional: false
  }, hxHcsrQ12: {
    type: String,
    allowedValues: ["Yes", "No"],
    optional: false
  }
}
)

class HxHcsrForm extends Component {
  static contextType = FormContext

  render() {
    const form_schema = new SimpleSchema2Bridge(schema);
    const {patientId, updatePatientId} = this.context;
    const { changeTab, nextTab } = this.props;
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, "hxHcsrForm");
          if (!response.result) {
            alert(response.error);
          }
          const event = null; // not interested in this value
          changeTab(event, nextTab);
        }}
      >

        <Fragment>
          <h3 style={{ color: "red" }}>Please verify participant's identity using his/her NRIC before proceeding <br />
            A. S/N B. Surname followed by Initials C. Last 4 characters of Participant's NRIC</h3>
          <br />
          <h2>PARTICIPANT IDENTIFICATION</h2>
          <b>Booth number</b> and <b>History-taker's Name</b><br />
          <LongTextField name="hxHcsrQ1" label="Hx HCSR Q1" />
          <p style={{ color: "red" }}>**On Page 2 of Form A, under Doctor's Consultation (Hx-taking column, 1st row), please write down booth number and history taker's name. (Eg. Booth 18 David Choo Ah Beng = 18 David Choo A B)**</p>

          <br />

          <h2>HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW</h2>
          <b>TAKE 1ST BP READING NOW & RECORD ON FORM A.</b> Ensure participant is comfortable at rest before measuring their BP. <u>They should not have taken caffeine or smoked in the past 30 minutes either.</u>
          <p style={{ color: "red" }}><b>• IF SYSTOLIC  ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg, please take a second reading and ask for symptoms of malignant hypertension (severe headache, giddiness, numbness in extremities,blurred vision etc.)</b></p>

          <br />

          <h2>1. HEALTH CONCERNS</h2>
          If the participant has any <b>presenting complaints or concern(s)</b>, please take a <b>brief history. (Please write NIL if otherwise).<br />"Do you have any health issues that you are currently concerned about?"</b> "最近有没有哪里不舒服？”
          <br />
          <LongTextField name="hxHcsrQ2" label="Hx HCSR Q2" />
          <p><span style={{ color: "red" }}><b><u>Please advise that there will be no diagnosis or prescription made at our screening.</u></b></span> Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting treatment for their problems.</p>
          <br />
          Please tick to highlight if you feel <b>HEALTH CONCERNS</b> require closer scrutiny by doctors later or if <b>participant strongly insists.</b>

          <RadioField name="hxHcsrQ11" label="Hx HCSR Q11" />

          <PopupText qnNo="hxHcsrQ11" triggerValue="Yes">
            <br /><b>REFER TO DR CONSULT</b> under Form A if <b>worrying problems / participant strongly insists or if you feel 'Health Concerns' requires closer scrutiny by doctors later.</b><br />Indicate for Doctor's Consultation station under: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br />3) Please write relevant medical/social history of participant under history taking box
          </PopupText>

          <br /><br />

          <h2>2. SYSTEMS REVIEW</h2>
          <b>Below is a non-exhaustive list of possible red flags:</b>
          <br />- Constitutional Symptoms: LOA, LOW, Fever, Lethargy
          <br />- CVS: Chest pain, Palpitations
          <br />- Respi: SOB, Cough, Wheeze, Night Sweats, Sputum Production
          <br />- GI: change in BO habits, PR bleed, Haematemesis, Nausea/Vomiting
          <br />CNS: Headaches, Dizziness, Fainting, Weakness/Numbness
          <br /> - MSK: Frequent falls
          <br /><br />
          <b>Based on <span style={{ color: "red" }}><u>participants's health concerns,</u></span></b> please rule out red flags <b>(Please write NIL if otherwise)</b>
          <br />
          <LongTextField name="hxHcsrQ3" label="Hx HCSR Q3" />

          Please tick to highlight if you feel <b>SYSTEMS REVIEW</b> require closer scrutiny by doctors later or if <b>participant strongly insists.</b>
          <RadioField name="hxHcsrQ12" label="Hx HCSR Q12" />

          <PopupText qnNo="hxHcsrQ12" triggerValue="Yes">
            <b>REFER TO DR CONSULT</b> under Form A if <b>worrying problems / participant strongly insists or if you feel 'Health Concerns' requires closer scrutiny by doctors later.</b><br />Indicate for Doctor's Consultation station under: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation         Reasons for recommendation<br />3) Please write relevant medical/social history of participant under history taking box<br /><br />
          </PopupText>


          2a. Do you have any problems passing urine or motion? Please specify if yes.
          <RadioField name="hxHcsrQ4" label="Hx HCSR Q4" />
          Please specify:
          <LongTextField name="hxHcsrQ5" label="Hx HCSR Q5" />

          <PopupText qnNo="hxHcsrQ4" triggerValue="Yes, (Please specify):">
            <br /><b>REFER TO <span style={{ color: "red" }}>DR CONSULT</span> and <span style={{ color: "red" }}>EXHIBITION SFCS</span> booth under Form A</b><br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation <br />3) Pleae write relevant medical/social history of participant under history taking box <br /> 4) Page 2 of Form A, under Exhibition - Recommendation, tick renal and bladder health, write down SFCS booth<br /><br />

          </PopupText>

          2b. Do you have any vision problems? Please specify if yes. Exclude complaints like unspecific itchy eyes etc<br />

          <RadioField name="hxHcsrQ6" label="Hx HCSR Q6" />
          Please specify:
          <LongTextField name="hxHcsrQ7" label="Hx HCSR Q7" />

          <PopupText qnNo="hxHcsrQ6" triggerValue="Yes, (Please specify):">
            <b>REFER TO <span style={{ color: "red" }}>DR CONSULT</span> if have vision problems for 40-59. For 60 and above, indicate for Geriatrics - Geriatrics Functional Screening includes vision screening.</b><br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br /><br />
          </PopupText>


          2c. Do you have any hearing problems? Please specify if yes. <br />

          <RadioField name="hxHcsrQ8" label="Hx HCSR Q8" />
          Please specify:
          <LongTextField name="hxHcsrQ9" label="Hx HCSR Q9" />

          <PopupText qnNo="hxHcsrQ8" triggerValue="Yes, (Please specify):">
            <b>REFER TO <span style={{ color: "red" }}>DR CONSULT</span> if have hearing problem for <span style={{ color: "red" }}>40-59</span>. Please give the participant the PHS Hearing Questionnaire 2019, remind them to complete it by themselves before passing it to the doctors at doctor's consult. For 60 and above, indicate for Geriatrics - Geriatrics Functional Screening includes audiometry screening.</b><br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation<br />3) Please write relevant medical/social history of participant under history taking box<br /><br />
          </PopupText>


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

HxHcsrForm.contextType = FormContext;

export default function HxHcsrform(props) {
  return <HxHcsrForm {...props} />;
}