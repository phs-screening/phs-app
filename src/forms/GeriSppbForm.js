import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import {SubmitField, ErrorsField, LongTextField} from 'uniforms-material';
import { RadioField, NumField } from 'uniforms-material';
import { submitForm, calculateSppbScore } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { useField } from 'uniforms';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriSppbQ1: {
    type: Number, optional: true
  }, geriSppbQ13: {
    type: Number, optional: true
  }, geriSppbQ2: {
    type: String, allowedValues: ["0       (If not able to complete 5 chair stands)", "1       (> 16.7s )", "2       (16.6 – 13.7s )", "3       (13.6 – 11.2s )", "4       (< 11.1s )"], optional: false
  }, geriSppbQ3: {
    type: Number, optional: true
  }, geriSppbQ4: {
    type: Number, optional: true
  }, geriSppbQ5: {
    type: Number, optional: true
  }, geriSppbQ6: {
    type: String, allowedValues: ["0        (Side by side < 10s or unable)", "1       (Side by side 10s AND < 10s semi tandem)", "2       (Semi tandem 10s AND tandem < 3s)", "3       (Semi tandem 10s AND tandem < 10s but > 3s)", "4       (Tandem >= 10s)", "Refused to do"], optional: false
  }, geriSppbQ7: {
    type: Number, optional: true
  }, geriSppbQ8: {
    type: String, allowedValues: ["0       (Could not do)", "1       (> 6.52s )", "2       (4.66 – 6.52s )", "3       (3.62 – 4.65s )", "4       (< 3.62s )"], optional: false
  // There is no Q9???
  // }, geriSppbQ9: {
  //   type: String, optional: false
  }, geriSppbQ10: {
    type: String, allowedValues: ["High Fall Risk (0-3)", "Moderate Fall Risk (4-9)", "Low Fall Risk (10-12)"], optional: false
  }, geriSppbQ11: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriSppbQ12: {
    type: String, optional: true
  }
}
)

function GetSppbScore() {
  const [{ value: q2 }] = useField('geriSppbQ2', {});
  const [{ value: q6 }] = useField('geriSppbQ6', {});
  const [{ value: q8 }] = useField('geriSppbQ8', {});
  return calculateSppbScore(q2, q6, q8);
}

const formName = "geriSppbForm"
const GeriSppbForm = (props) => {
  const {patientId, isAdmin} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props;
  const [saveData, setSaveData] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
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
      <h2>SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)</h2>
          <br />
      1) REPEATED CHAIR STANDS<br />Time taken in seconds (only if 5 chair stands were completed):
      <NumField name="geriSppbQ1" label="Geri - SPPB Q1"/>
          <br />
      Number of chairs completed:
      <NumField name="geriSppbQ13" label="Geri - SPPB Q13"/>
          <br />
      <font color="blue"><b>
        Score for REPEATED CHAIR STANDS (out of 4):
        <RadioField name="geriSppbQ2" label="Geri - SPPB Q2"/>
      </b></font>
          <br />
      2a) BALANCE Side-by-side Stand <br />Time held for in seconds:
      <NumField name="geriSppbQ3" label="Geri - SPPB Q3"/>
          <br />
      2b) BALANCE Semi-tandem Stand <br />Time held for in seconds:
      <NumField name="geriSppbQ4" label="Geri - SPPB Q4"/>
          <br />
      2c) BALANCE Tandem Stand <br />Time held for in seconds:
      <NumField name="geriSppbQ5" label="Geri - SPPB Q5"/>
          <br />
      <font color="blue"><b>
        Score for BALANCE (out of 4):
        <RadioField name="geriSppbQ6" label="Geri - SPPB Q6"/>
      </b></font>
          <br />
      3) 3m WALK <br />Time taken in seconds:
      <NumField name="geriSppbQ7" label="Geri - SPPB Q7"/>
          <br />
      <font color="blue"><b>
        Score for 3m WALK (out of 4):
        <RadioField name="geriSppbQ8" label="Geri - SPPB Q8"/>
      </b></font>
          <br />
        <h3>
          <font color="blue">Total score (Max Score: 12): 
            <GetSppbScore />
          </font>
        </h3>
          <br />
      
      Fall Risk Level: 
      <RadioField name="geriSppbQ10" label="Geri - SPPB Q10"/>
          <br />
      <font color="red">*Referral to Physiotherapist and Occupational Therapist Consult</font>
      <RadioField name="geriSppbQ11" label="Geri - SPPB Q11"/>
          <br />
          Notes:
          <LongTextField name="geriSppbQ12" label="Geri - SPPB Q12" />

          <br/>
      
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

GeriSppbForm.contextType = FormContext;

export default function GeriSppbform(props) {
  return <GeriSppbForm {...props} />;
}