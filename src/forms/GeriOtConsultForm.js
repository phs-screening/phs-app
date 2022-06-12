import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField, SelectField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  geriOtConsultQ1: {
    type: String, optional: false
  }, geriOtConsultQ2: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtConsultQ3: {
    type: String, optional: true
  }, geriOtConsultQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtConsultQ5: {
    type: String, optional: true
  }, geriOtConsultQ6: {
    type: Array, optional: true
  }, "geriOtConsultQ6.$": {
    type: String, allowedValues: ["HDB EASE", "SWCDC Safe and Bright Homes", "Own Vendors"],
  }
}
)

const formName = "geriOtConsultForm"
const GeriOtConsultForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState(null)
  const { changeTab, nextTab } = props;

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
          <h2>3.4b OT Consult</h2>
          Memo:
          <LongTextField name="geriOtConsultQ1" label="Geri - OT Consult Q1" />
          To be referred for doctor's consult (OT)?
          <RadioField name="geriOtConsultQ2" label="Geri - OT Consult Q2" />
          Reasons for referral to Doctor's consult (OT):
          <LongTextField name="geriOtConsultQ3" label="Geri - OT Consult Q3" />
          To be referred for social support (For HDB EASE Sign-up) (OT):
          <RadioField name="geriOtConsultQ4" label="Geri - OT Consult Q4" />
          Reasons for referral to social support (OT):
          <LongTextField name="geriOtConsultQ5" label="Geri - OT Consult Q5" />
          Which of the following programmes would you recommend the participant for? (Please select the most appropriate programme)
          <SelectField name="geriOtConsultQ6" checkboxes="true" label="Geri - OT Consult Q6" />
          <h2><span style={{color: "red"}}>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</span></h2>

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

GeriOtConsultForm.contextType = FormContext;

export default function GeriOtConsultform(props) {
  return <GeriOtConsultForm {...props} />;
}