import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { LongTextField, RadioField } from 'uniforms-material';
import PopupText from 'src/utils/popupText';

const schema = new SimpleSchema({
  geriOtQuestionnaireQ1: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtQuestionnaireQ2: {
    type: String, allowedValues: ["Yes (Specify in textbox )", "No"], optional: false
  }, geriOtQuestionnaireQ3: {
    type: String, optional: true, custom: function () {
      if (this.field('geriOtQuestionnaireQ2').isSet && this.field('geriOtQuestionnaireQ2').value === "Yes (Specify in textbox )") {
        if (!this.isSet || this.value.length === 0) {
          return SimpleSchema.ErrorTypes.REQUIRED
        }
      }
    }
  }, geriOtQuestionnaireQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtQuestionnaireQ5: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtQuestionnaireQ6: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtQuestionnaireQ7: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtQuestionnaireQ8: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

class GeriOtQuestionnaireForm extends Component {

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
          <h2>3.2 OT Questionnaire SECTION</h2>
          1. Have you fallen or had a near fall in the last year?
          <RadioField name="geriOtQuestionnaireQ1" label="Geri - OT Questionnaire Q1" />
          <h4>If yes, refer occupational therapist consultation</h4>
          2. Has any medication you've taken caused you drowsiness/ giddiness?
          <RadioField name="geriOtQuestionnaireQ2" label="Geri - OT Questionnaire Q2" />
          <PopupText qnNo="geriOtQuestionnaireQ2" triggerValue="Yes (Specify in textbox )">
              Please Specify:
              <LongTextField name="geriOtQuestionnaireQ3" label="Geri - OT Questionnaire Q3" />
          </PopupText>
          <h4>If yes, refer occupational therapist consultation</h4>
          3. Do you use anything to support yourself (e.g. walking aid, umbrella) when moving about your daily activities?
          <RadioField name="geriOtQuestionnaireQ4" label="Geri - OT Questionnaire Q4" />
          <h4>If yes, refer occupational therapist consultation</h4>
          4. Do you frequently experience dizziness when standing up from a seated or laid down position?
          <RadioField name="geriOtQuestionnaireQ5" label="Geri - OT Questionnaire Q5" />
          <h4>If yes, refer occupational therapist consultation and doctor’s consult</h4>
          5. Do you experience urinary incontinence or nocturia (go toilet 3 or more times at night)?
          <RadioField name="geriOtQuestionnaireQ6" label="Geri - OT Questionnaire Q6" />
          <h4>If yes, refer occupational therapist consultation and doctor’s consult</h4>
          <span style={{color: "red"}}>*Referral to Occupational Therapist Consult</span>
          <RadioField name="geriOtQuestionnaireQ7" label="Geri - OT Questionnaire Q7" />
          *Referral to Doctor’s Consult
          <RadioField name="geriOtQuestionnaireQ8" checkboxes="true" label="Geri - OT Questionnaire Q8" />
          <h2><span style={{color: "red"}}>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON FORM A.</span></h2>

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

export default GeriOtQuestionnaireForm;