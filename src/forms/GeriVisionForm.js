import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { LongTextField, SelectField, RadioField, NumField } from 'uniforms-material';
import PopupText from 'src/utils/popupText';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  geriVisionQ1: {
    type: String, allowedValues: ["Yes (Specify in textbox )", "No"], optional: false
  }, geriVisionQ2: {
    type: String, optional: true
  }, geriVisionQ3: {
    type: String, optional: false
  }, geriVisionQ4: {
    type: String, optional: false
  }, geriVisionQ5: {
    type: String, optional: true
  }, geriVisionQ6: {
    type: String, optional: true
  }, geriVisionQ7: {
    type: String, allowedValues: ["CF2M", "CF1M", "HM", "LP", "NLP", "NIL"], optional: true
  }, geriVisionQ8: {
    type: Array, optional: true
  }, "geriVisionQ8.$": {
    type: String, allowedValues: ["Referred to OT Consult"]
  }, geriVisionQ9: {
    type: Array, optional: true
  }, "geriVisionQ9.$": {
    type: String, allowedValues: ["Referred to Doctor's Consult"]
  }
}
)


const formName = "geriVisionForm"
const GeriVisionForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props;
  const [saveData, setSaveData] = useState(null)

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
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
        model={saveData}
      >
        <Fragment>
          <h2>2. VISION SCREENING</h2>
          1. Previous eye condition or surgery
          <RadioField name="geriVisionQ1" label="Geri - Vision Q1" />
          <PopupText qnNo="geriVisionQ1" triggerValue="Yes (Specify in textbox )">
            <Fragment>
              Explanation
              <LongTextField name="geriVisionQ2" label="Geri - Vision Q2" />
            </Fragment>
          </PopupText>
          
          2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__ <br />
          <NumField name="geriVisionQ3" label="Geri - Vision Q3" /> <br />
          3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__ <br />
          <NumField name="geriVisionQ4" label="Geri - Vision Q4" /> <br />
          4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__ <br />
          <NumField name="geriVisionQ5" label="Geri - Vision Q5" /> <br />
          5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__ <br />
          <NumField name="geriVisionQ6" label="Geri - Vision Q6" /> <br />
          6. Eye Functional Test *only applicable if vision is worse than 6/60
          <RadioField name="geriVisionQ7" label="Geri - Vision Q7" />
          <br />Please <b>refer to Occupational Therapist Consult</b> if visual acuity is <b>≥ 6/12</b>
          <br /><SelectField name="geriVisionQ8" checkboxes="true" label="Geri - Vision Q8" />
          <br />Please <b>refer to L2 Eye Screening (Eye Bus/ NUHS)</b> if pinhole visual acuity <u><b>is > 6/12</b></u><br />
          If participant is required to go for L2 Eye Screening, encourage participant to go to Eye Bus/ NUHS after Screening Review.
          <br /><RadioField name="geriVisionQ9" label="Geri - Vision Q9" />
          
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

GeriVisionForm.contextType = FormContext;

export default function GeriVisionform(props) {
  return <GeriVisionForm {...props} />;
}