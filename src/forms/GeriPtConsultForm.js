import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';

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

class GeriPtConsultForm extends Component {

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

export default GeriPtConsultForm;