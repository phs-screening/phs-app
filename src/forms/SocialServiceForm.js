import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { title, underlined, blueText } from '../theme/commonComponents';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

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
  const [loadingSidePanel, isLoadingSidePanel] = useState(true);
  const navigate = useNavigate();
  const [saveData, setSaveData] = useState(null)
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
    isLoadingSidePanel(false);
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
        <Grid display="flex" flexDirection="row" >
          <Grid xs={9}>  
            <Paper elevation={2} p={0} m={0}>
              {newForm()}
            </Paper>
          </Grid>
          <Grid
              p={1}
              width="30%"
              display="flex"
              flexDirection="column"
              alignItems={loadingSidePanel ? "center" : "left"}>
          {loadingSidePanel ? <CircularProgress />
            : 
            <div>
              {title("Financial Status")}
              {title("CHAS Card Application")}
              {title("Financial Assistance")}
              {title("Social Issues")}
              {title("Referral from DC")}
              {title("Geriatrics EBAS")}
              {title("OT consult")}
              {title("PT consult")}
            </div>
          }
          </Grid>
        </Grid>
      </Paper>
    );
}

SocialServiceForm.contextType = FormContext;

export default function SeocialServiceform(props) {
  const navigate = useNavigate();

  return <SocialServiceForm {...props} navigate={navigate} />;
}