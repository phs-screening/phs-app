import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';

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

class SocialServiceForm extends Component {

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

export default SocialServiceForm;