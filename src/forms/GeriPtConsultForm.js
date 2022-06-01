import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  geriPtConsultQ1: {
    type: String, optional: false
  }, geriPtConsultQ2: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriPtConsultQ3: {
    type: String, optional: true
  }, geriPtConsultQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriPtConsultQ5: {
    type: String, optional: true
  }
}
)
const loadDataGeriPt = (savedData) => {
  return savedData ? new SimpleSchema({
        geriPtConsultQ1: {
          defaultValue : savedData.geriPtConsultQ1,
          type: String, optional: false
        }, geriPtConsultQ2: {
      defaultValue : savedData.geriPtConsultQ2,
          type: String, allowedValues: ["Yes", "No"], optional: false
        }, geriPtConsultQ3: {
      defaultValue : savedData.geriPtConsultQ3,
          type: String, optional: true
        }, geriPtConsultQ4: {
      defaultValue : savedData.geriPtConsultQ4,
          type: String, allowedValues: ["Yes", "No"], optional: false
        }, geriPtConsultQ5: {
      defaultValue : savedData.geriPtConsultQ5,
          type: String, optional: true
        }
      }
  ):schema
}

const formName = "geriPtConsultForm"
const GeriPtConsultForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props;
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    const getSchema = savedData ? await loadDataGeriPt(savedData) : schema
    setForm_schema(new SimpleSchema2Bridge(getSchema))
  }, [])
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, formName);
          if (!response.result) {
            alert(response.error);
          }
          const event = null; // not interested in this value
          changeTab(event, nextTab);
        }}
      >
        <Fragment>
          <h2>3.4a PT Consult</h2>
          Memo:
          <LongTextField name="geriPtConsultQ1" label="Geri - PT Consult Q1" />
          To be referred for doctor's consult (PT)?
          <RadioField name="geriPtConsultQ2" label="Geri - PT Consult Q2" />
          Reasons for referral to Doctor's consult (PT):
          <LongTextField name="geriPtConsultQ3" label="Geri - PT Consult Q3" />
          To be referred for social support (For HDB EASE Sign-up) (PT):
          <RadioField name="geriPtConsultQ4" label="Geri - PT Consult Q4" />
          Reasons for referral to social support (PT):
          <LongTextField name="geriPtConsultQ5" label="Geri - PT Consult Q5" />
          <h2><span style={{color: "red"}}>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON FORM A</span></h2>

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

GeriPtConsultForm.contextType = FormContext;

export default function GeriPtConsultform(props) {
  return <GeriPtConsultForm {...props} />;
}