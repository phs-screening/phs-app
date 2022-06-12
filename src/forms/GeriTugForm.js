import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, SelectField, RadioField, NumField } from 'uniforms-material';
import { useField } from 'uniforms';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  geriTugQ1: {
    type: Array, optional: true
  }, "geriTugQ1.$": {
    type: String, allowedValues: ["Walking frame", "Walking frame with wheels", "Crutches/ Elbow crutches", "Quadstick (Narrow/ Broad)", "Walking stick", "Umbrella", "Others (Please specify in textbox )"]
  }, geriTugQ2: {
    type: String, optional: true
  }, geriTugQ3: {
    type: Number, optional: false
  }, geriTugQ4: {
    type: String, allowedValues: ["High Falls Risk (> 15sec)", "Low Falls Risk (≤ 15 sec)"], optional: false
  }, geriTugQ5: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

function PopupText(props) {
  const [{ value: qnValue }] = useField(props.qnNo, {});
  if (qnValue.includes(props.triggerValue)) {
    return (
      <Fragment>
        {props.children}
      </Fragment>
    );
  }
  return null;
}

const formName = "geriTugForm"
const GeriTugForm = (props) => {
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
          <h2>3.3b Time-Up and Go (TUG)</h2>
          Walking aid (if any):
          <br />
          <SelectField name="geriTugQ1" checkboxes="true" label="Geri - TUG Q1" />
          <br />
          <PopupText qnNo="geriTugQ1" triggerValue="Others (Please specify in textbox )">
            Please Specify Walking Aid
            <TextField name="geriTugQ2" label="Geri - TUG Q2" />
          </PopupText>
          Time taken (in seconds):
          <NumField name="geriTugQ3" label="Geri - TUG Q3" />
          <h3>If > 15 seconds, participant has a high falls risk.</h3>
          <br/>Falls Risk Level:
          <RadioField name="geriTugQ4" label="Geri - TUG Q4" />
          <br/>*Referral to Physiotherapist and Occupational Therapist Consult
          <RadioField name="geriTugQ5" label="Geri - TUG Q5" />

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

GeriTugForm.contextType = FormContext;

export default function GeriTugform(props) {
  return <GeriTugForm {...props} />;
}