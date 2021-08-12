import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';

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
    type: String, allowedValues: ["HDB EASE", "SWCDC Safe and Bright Homes", "Own Vendors"], optional: true
  }
}
)

class GeriOtConsultForm extends Component {

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
          <RadioField name="geriOtConsultQ6" label="Geri - OT Consult Q6" />
          <h2>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</h2>

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

export default GeriOtConsultForm;