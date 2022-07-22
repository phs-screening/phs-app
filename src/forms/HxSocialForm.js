import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

import PopupText from 'src/utils/popupText';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'
import allForms from "./forms.json";
import {blueText} from "../theme/commonComponents";

const schema = new SimpleSchema({
  hxSocialQ1: {
    type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
  }, hxSocialQ2: {
    type: String, optional: true
  }, hxSocialQ3: {
    type: String, allowedValues: ["1200 and below per month", "1,201 - 2,000 per month", "2,001 - 3,999 per month", "4,000 - 5,999 per month", "6,000 - 9,999 per month", "10,000 & above", "NIL"], optional: false
  }, hxSocialQ4: {
    type: String, optional: false
  }, hxSocialQ5: {
    type: String, allowedValues: ["Yes, (Please specify):", "No, I do not qualify", "No, I qualify but...(Please specify the reasons for not applying if you qualify):"], optional: false
  }, hxSocialQ6: {
    type: String, optional: true
  }, hxSocialQ7: {
    type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
  }, hxSocialQ8: {
    type: String, optional: true
  }, hxSocialQ9: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxSocialQ10: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, hxSocialQ11: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, hxSocialQ12: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, hxSocialQ13: {
    type: String, allowedValues: ["Healthy", "Moderate", "Poor"], optional: false
  }, hxSocialQ14: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

const formName = "hxSocialForm"
const HxSocialForm = (props) => {
  const [loading, isLoading] = useState(false);
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props;
  const [saveData, setSaveData] = useState(null)
  const [regForm, setRegForm] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName);
    const regFormData = getSavedData(patientId, allForms.registrationForm)
    Promise.all([savedData, regFormData]).then(result => {
      setSaveData(result[0])
      setRegForm(result[1])
    })

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
          <font color="blue"><h2>THE FOLLOWING QUESTIONS ARE NOT PART OF NSS QUESTIONNAIRE. PLEASE ASK THE PARTICIPANT ACCORDINGLY. </h2></font>

          <h2>HISTORY TAKING PART 3: SOCIAL HISTORY</h2>
          <h3>1. FINANCIAL STATUS
            <span style={{ color: "red" }}><br />Please refer to page 1 of Form A for following questions.</span></h3>




          1. Current CHAS status?<br />
          {regForm && regForm.registrationQ8 ? blueText(regForm.registrationQ8) : blueText("nil")}
          <br/>
          2. Pioneer / Merderka Generation Card?<br />
          {regForm && regForm.registrationQ9 ? blueText(regForm.registrationQ9) : blueText("nil")}
          <br/>
          3. Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
          <RadioField name="hxSocialQ1" label="Hx Social Q1" />

          Please specify
          <LongTextField name="hxSocialQ2" label="Hx Social Q2" />

          <br/> <br/>
          4a. What is the average earnings of participant's household per month?
          <RadioField name="hxSocialQ3" label="Hx Social Q3" /><br /><br />
          4b. Number of household members (including yourself):
          <LongTextField name="hxSocialQ4" label="Hx Social Q4" /><br /><br />
          4c. Do you want to apply for CHAS card? (if you are currently not on CHAS but qualify) <br />
          <img src='/images/hx/chas.jpg' alt='CHAS' /> <br />
          <RadioField name="hxSocialQ5" label="Hx Social Q5" />
          Please specify
          <LongTextField name="hxSocialQ6" label="Hx Social Q6" />
          < br/><br/>
          5. Do you need advice on financial schemes that are available in Singapore or require further financial assistance?
          <RadioField name="hxSocialQ7" label="Hx Social Q7" />

          Please specify
          <LongTextField name="hxSocialQ8" label="Hx Social Q8" />

          <br /><br />
          <PopupText qnNo="hxSocialQ5" triggerValue="Yes, (Please specify):">
            <PopupText qnNo="hxSocialQ7" triggerValue="Yes, (Please specify):">
              <p><b>REFER TO SOCIAL SERVICE STATION</b> if participant is in need of <b>financial aid.</b>  </p>
              <br />Indicate for Social Service station on:  
              <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A
              <br />2) Write reasons for referral on the right column<br />
              <br />Note the following criteria for your assessment: (wef from 1st Nov 2019)
              <br />Per-capita monthly income for CHAS: <b>Green Card: Above $2000; Orange Card: $1201- $2000; Blue Card: $1200 and below</b>
            </PopupText>
          </PopupText>
          <br /><br />
          


          <h2>3. SOCIAL ISSUES</h2>
          1. Are you caring for a loved one?
          <RadioField name="hxSocialQ9" label="Hx Social Q9" /><br /><br />
          <PopupText qnNo="hxSocialQ9" triggerValue="Yes">
            2. If you are caring for a loved one, do you need training?
            <RadioField name="hxSocialQ10" label="Hx Social Q10" /><br /><br />
            3. Do you need assistance? (eg funds to hire a helper / funds to offset caretaking costs, subsidies for home healthcare items, arranging for short term care in nursing homes/senior care centres)
            <RadioField name="hxSocialQ11" label="Hx Social Q11" /><br /><br />
          </PopupText>
          4. Do you require social support?
          <RadioField name="hxSocialQ12" label="Hx Social Q12" />
          <PopupText qnNo="hxSocialQ12" triggerValue="Yes">
            <b>REFER TO SOCIAL SERVICE STATION if participant has social issues that require further consult.<br />Indicate for Social Service station on:  </b>1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons for referral on the right column
          </PopupText>

          <br /><br />
          <h2>4. ORAL ISSUES</h2>
          <b>Please do a quick inspection of participant's oral health status:</b> 1. Lips, Tongue, Gums & Tissues (Healthy - pink and moist)<br />2. Natural Teeth, Oral Cleanliness & Dentures (Tooth/Root decay, no cracked/broken dentures, No food particles/tartar in mouth)<br />3. Saliva status (free-flowing) and Any dental pain <br />
          <br />
          1. How is the participant's Oral Health?
          <RadioField name="hxSocialQ13" label="Hx Social Q13" />
          <br />
          2. Would you like to go through free Oral Health screening by NUS Dentistry dentists and students?
          <RadioField name="hxSocialQ14" label="Hx Social Q14" />
          <PopupText qnNo="hxSocialQ14" triggerValue="Yes">
            <b>REFER TO NUS DENTISTRY ORAL SCREENING if participant has <mark>poor dental hygiene</mark> and <mark>interested</mark> to go through dental screening for participants aged <mark>40-59</mark>. <span style={{ color: "red" }}>For participants 60 and above, functional screening includes oral screening.</span>
            <br />Indicate for Dentistry on: </b> 
            1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A
            <br />2) Write reasons for referral on the right column<br /><br />
          </PopupText>
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

HxSocialForm.contextType = FormContext;

export default function HxSocialform(props) {
  return <HxSocialForm {...props} />;
}