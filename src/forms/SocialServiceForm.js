import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  socialServiceQ1: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, socialServiceQ2: {
    type: String, optional: false
  }, socialServiceQ3: {
    type: String, optional: false
  }
}
)

const formName = "socialServiceForm"
const SocialServiceForm = (props) => {
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
          <h2>Social Service Station</h2>
          1. Has the participant visited the social service station?
          <RadioField name="socialServiceQ1" label="Social Service Q1" />
          2. Brief summary of the participant's concerns
          <LongTextField name="socialServiceQ2" label="Social Service Q2" />
          3. Brief summary of what will be done for the participant (Eg name of scheme participant wants to apply for)
          <LongTextField name="socialServiceQ3" label="Social Service Q3" />

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

SocialServiceForm.contextType = FormContext;

export default function SeocialServiceform(props) {
  const navigate = useNavigate();

  return <SocialServiceForm {...props} navigate={navigate} />;
}