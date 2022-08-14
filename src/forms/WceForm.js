import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, SelectField, RadioField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

import '../Snippet.css';
import PopupText from 'src/utils/popupText';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'
import allForms from './forms.json'
import {blueText} from "../theme/commonComponents";

const schema = new SimpleSchema({
  wceQ1: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, wceQ2: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ3: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ4: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ5: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ6: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }
}
)


const formName = "wceForm"
const WceForm = (props) =>  {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const navigate = useNavigate();
    const [saveData, setSaveData] = useState({})
  const [reg, setReg] = useState({})
  const [hxSocial, setHxSocial] = useState({})
  const [hxCancer, setHxCancer] = useState({})

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName);
    const regData = getSavedData(patientId, allForms.registrationForm)
    const hxSocialData = getSavedData(patientId, allForms.hxSocialForm)
    const hxCancerData = getSavedData(patientId, allForms.hxCancerForm)

    Promise.all([savedData, regData, hxSocialData, hxCancerData]).then(result => {
      setSaveData(result[0])
      setReg(result[1])
      setHxSocial(result[2])
      setHxCancer(result[3])
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
            isLoading(false);
            setTimeout(() => {
              alert("Successfully submitted form");
              navigate('/app/dashboard', { replace: true });
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
      <h2>PARTICIPANT IDENTIFICATION</h2>
      <h3><font color="red">Please verify participant's identity using his/her
          <br/>A. APP ID on wristband  AND
          <br/>B. INITIALS </font></h3> <br/>
      <h2>1. FINANCIAL STATUS<br /></h2>
      <font color="red"><b>Please refer to page 1 of Form A for following questions.</b></font>
          <br/>
      1. Current CHAS status?
          {reg && reg.registrationQ8 ? blueText(reg.registrationQ8) : blueText("nil")}
          <br/>
      2. Pioneer / Merdeka Generation Card?
          {reg && reg.registrationQ9? blueText(reg.registrationQ9) : blueText("nil")}
          <br/>
      3. Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
          {hxSocial && hxSocial.hxSocialQ1? blueText(hxSocial.hxSocialQ1) : blueText("nil")}
          {hxSocial && hxSocial.hxSocialQ2? blueText(hxSocial.hxSocialQ2) : blueText("nil")}
          <br/><br/>
      <h2>2. CANCER SCREENING </h2> <br/>
          <p>1.<font color="red"><b>For female respondent aged 40 and above only.</b></font><br />When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast to look for breast cancer.) </p>
          {hxCancer && hxCancer.hxCancerQ7 ? blueText(hxCancer.hxCancerQ7) : blueText("nil")}
          <br />
          <p>2.<font color="red"><b>For female respondent aged 25 and above, who have/had a husband/boyfriend and not had their womb completely surgically removed only. </b></font><br />When was the last time you had a PAP smear test? (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the womb, to check for changes in the cells of your cervix, which may develop into cancer later.) </p>
          {hxCancer && hxCancer.hxCancerQ8 ? blueText(hxCancer.hxCancerQ8) : blueText("nil")}
          <br />
      <font color="red"><b>For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and above, seek doctor's advice.<br />Please encourage participants to go for HPV test every 5 years.</b></font> <br />
      3.Does participant has a history of cancer or his/her family history requires further scrutiny by doctors? <font color="red"><b>(If indicated 'Yes', please refer to doctor's consult by following the steps below.)</b></font>
      <RadioField name="wceQ1" label="WCE Q1"/>
      <PopupText qnNo="wceQ1" triggerValue="Yes">
          <b>REFER TO DR CONSULT by indicating on:</b> <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation <br />
      </PopupText>
          <br/> <br />
      <h2>3. FOLLOW UP PLAN</h2>
          <br/>
      1. Completed Breast Self Examination station?
      <RadioField name="wceQ2" label="WCE Q2"/>
          <br/>
      2. Completed Cervical Education station?
      <RadioField name="wceQ3" label="WCE Q3"/>
          <br/>
      3. Indicated interest for HPV Test under SCS?
      <RadioField name="wceQ4" label="WCE Q4"/>
          <br/>
      4. Indicated interest for Mammogram under SCS?
      <RadioField name="wceQ5" label="WCE Q5"/>
          <br/>
      5. Registered for Mammogram under NHGD?
      <RadioField name="wceQ6" label="WCE Q6" />
      
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
      <snippet-container>

        <Paper className="snippet-item" elevation={2} p={0} m={0}>
          {newForm()}
        </Paper>


        {/*<Paper className="snippet-item" elevation={2} p={0} m={0}>*/}
        {/*  <h2>Snippets appear here</h2>*/}
        {/*</Paper>*/}

      </snippet-container>
    );
}

WceForm.contextType = FormContext;

export default function Wceform(props) {
  const navigate = useNavigate();

  return <WceForm {...props} navigate={navigate} />;
}