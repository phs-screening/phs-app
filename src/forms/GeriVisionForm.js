import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, SelectField, RadioField } from 'uniforms-material';

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
    type: String, allowedValues: ["Referred to Doctor\s Consult"]
  }
}
)

class GeriVisionForm extends Component {

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={console.log}
        //onSubmit={this.handleSubmit}
        onSubmitSuccess={() => {
          alert("Successful");
        }}
        onSubmitFailure={() => {
          alert('Unsuccessful')
        }}
      >
        <Fragment>
          <h2>2. VISION SCREENING</h2>
          1. Previous eye condition or surgery
          <RadioField name="geriVisionQ1" label="Geri - Vision Q1" />
          Explanation
          <TextField name="geriVisionQ2" label="Geri - Vision Q2" />
          2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__
          <TextField name="geriVisionQ3" label="Geri - Vision Q3" />
          3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__
          <TextField name="geriVisionQ4" label="Geri - Vision Q4" />
          4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__
          <TextField name="geriVisionQ5" label="Geri - Vision Q5" />
          5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__
          <TextField name="geriVisionQ6" label="Geri - Vision Q6" />
          6. Eye Functional Test *only applicable if vision is worse than 6/60
          <RadioField name="geriVisionQ7" label="Geri - Vision Q7" />
          Please refer to Occupational Therapist Consult if visual acuity is ≥ 6/12
          <SelectField name="geriVisionQ8" checkboxes="true" label="Geri - Vision Q8" />
          Please refer to Doctor’s Consult if pinhole visual acuity is ≥ 6/12
          <SelectField name="geriVisionQ9" checkboxes="true" label="Geri - Vision Q9" />
          <h2>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</h2>

        </Fragment>
        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => this.formRef = ref} />
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
}

export default GeriVisionForm;