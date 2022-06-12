import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { SelectField, RadioField, BoolField } from 'uniforms-material';
import PopupText from 'src/utils/popupText';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  // geriGeriApptQ1: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ2: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ3: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  //},
  // Q1 - 3 missing
  geriGeriApptQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriGeriApptQ5: {
    type: Boolean, label: "Done", optional: true
  }, geriGeriApptQ6: {
    type: String, allowedValues: ["Yes, requirement met.", "No, requirement not met."], optional: false
  }, geriGeriApptQ7: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, geriGeriApptQ8: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }
}
)

const formName = "geriGeriApptForm"
const GeriGeriApptForm = (props) => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const navigate = useNavigate();
    const [saveData, setSaveData] = useState(null)
    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName);
        setSaveData(savedData)
    }, [])
    const newForm = () => (
      <AutoForm
        schema={form_schema}
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
          <h2>4. Geriatrics Appointment</h2>
          {/*<DisplayIf condition={() => (
        (typeof(info["Geri - Vision"]) !== "undefined" && info["Geri - Vision"].geriVisionQ3 >= 12) ||
        (typeof(info["Geri - Vision"]) !== "undefined" && info["Geri - Vision"].geriVisionQ4 >= 12)
      )}>*/}
      <span style={{color: "green"}}>THE BELOW APPEARS WHEN GERI VISION FORM MEETS CRITERIA (WIP)</span>
          <Fragment>
            <h3>Visual acuity is ≥ 6/12: </h3>
            Pearl's Optical Voucher given?
            <RadioField name="geriGeriApptQ4" label="Geri - Geri Appt Q4" />
          </Fragment>

          <span style={{color: "green"}}>THE BELOW APPEARS WHEN GERI EBAS-DEP, PT CONSULT, OT CONSULT MEET CRITERIA (WIP)</span>
          {/*<DisplayIf condition={() => (
        (typeof(info["Geri - EBAS-DEP"]) !== "undefined" && info["Geri - EBAS-DEP"].geriEbasDepQ10 === "Yes") ||
        (typeof(info["Geri - EBAS-DEP"]) !== "undefined" && info["Geri - EBAS-DEP"].geriEbasDepQ11 === "Yes") ||
        (typeof(info["Geri - PT Consult"]) !== "undefined" && info["Geri - PT Consult"].geriPtConsultQ4 === "Yes") ||
        (typeof(info["Geri - OT Consult"]) !== "undefined" && info["Geri - OT Consult"].geriOtConsultQ4 === "Yes")
      )}>*/}
          <Fragment>
            <h3>Participant is recommended for social support:</h3>
            Persuade participant to go to social support booth and explain that AIC can help
            <BoolField name="geriGeriApptQ5" />
          </Fragment>


          <h3>3. Eligibility for SWCDC Safe and Bright Homes Programme </h3>
          1) Participants will be eligible for the SWCDC Safe and Bright Homes Programme if they meet the following criteria:<br />i) SWCDC Resident (Link: <a href="https://sis.pa-apps.sg/NASApp/sim/AdvancedSearch.aspx">https://sis.pa-apps.sg/NASApp/sim/AdvancedSearch.aspx</a>)<br />ii) Requires home modification (determined by SAOT) - Refer to Form A<br />
          <RadioField name="geriGeriApptQ6" label="Geri - Geri Appt Q6" />
          <PopupText qnNo="geriGeriApptQ6" triggerValue="Yes, requirement met.">
            2) Do you wish to sign up for the SWCDC Safe and Bright Homes Programme?<br /><br />Persuade participant to sign up for SWCDC Safe and Bright Homes. <br />Description of the programme: “The Safe and Bright Homes programme aims to develop safer and more energy-efficient homes for senior citizens and persons with disabilities. Safety (e.g. bathroom grab bars, non-slip mats etc), energy and water conservation features (energy-saving bulbs, water thimbles and cistern bags etc) will be installed in selected homes of needy residents. Workshops will also be conducted to teach them how to troubleshoot common household problems. The programme will be spread out over 10 sessions, for about 10 months.”
            <RadioField name="geriGeriApptQ7" label="Geri - Geri Appt Q7" />
            3) Sign up form for SWCDC filled in?
            <RadioField name="geriGeriApptQ8" label="Geri - Geri Appt Q8" />
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

GeriGeriApptForm.contextType = FormContext;

export default function HxCancerform(props) {
  const navigate = useNavigate();

  return <GeriGeriApptForm {...props} navigate={navigate} />;
}