import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { LongTextField, RadioField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

const schema = new SimpleSchema({
  geriPhysicalActivityLevelQ1: {
    type: String, optional: false
  }, geriPhysicalActivityLevelQ2: {
    type: String, optional: false
  }, geriPhysicalActivityLevelQ3: {
    type: String, optional: false
  }, geriPhysicalActivityLevelQ4: {
    type: String, allowedValues: ["0 (Nothing at all)", "1 (Very light)", "2 (Fairly light)", "3 (Moderate)", "4 (Somewhat hard)", "5 (Hard)", "6.0", "7 (Very Hard)", "8.0"], optional: false
  }, geriPhysicalActivityLevelQ5: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriPhysicalActivityLevelQ6: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }
}
)

class GeriPhysicalActivityLevelForm extends Component {
  static contextType = FormContext;

  render() {
    const form_schema = new SimpleSchema2Bridge(schema);
    const {patientId, updatePatientId} = this.context;
    const { changeTab, nextTab } = this.props;

    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, "geriPhysicalActivityLevelForm");
          if (!response.result) {
            alert(response.error);
          }
          const event = null; // not interested in this value
          changeTab(event, nextTab);
        }}
      >

        <Fragment>
          <h2>3.1 PHYSICAL ACTIVITY SECTION</h2>
          <h2>3.1.2. PHYSICAL ACTIVITY LEVELS</h2>
          1.     How often do you exercise in a week?<br />*If &lt; 3x/week and would like to start exercising more, suggest physiotherapist consultation
          <LongTextField name="geriPhysicalActivityLevelQ1" label="Geri - Physical Activity Level Q1" />
          2.     How long do you exercise each time?<br />*If &lt; 30minutes per session and would like to increase, suggest physiotherapist consultation.
          <LongTextField name="geriPhysicalActivityLevelQ2" label="Geri - Physical Activity Level Q2" />
          3.     What do you do for exercise?<br />*Take down salient points. <br />*Dangerous/ inappropriate exercises are defined to the participants as exercises that cause pain or difficulty to to the participant in performing.<br />*If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST CONSULATION.
          <LongTextField name="geriPhysicalActivityLevelQ3" label="Geri - Physical Activity Level Q3" />
          4.     Using the following scale, can you rate the level of exertion when you exercise?<br />(Borg Scale – Rate Perceived Exertion (RPE))<br /><b>*If &lt;3, to suggest physiotherapist consultation. If &gt;7, to REFER FOR PHYSIOTHERAPIST CONSULATION. </b><br />
          <img src='/images/geri-physical-activity-level/borg-scale.png' alt='Borg Scale' /> <br />
          <RadioField name="geriPhysicalActivityLevelQ4" label="Geri - Physical Activity Level Q4" />
          5.     Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?<br /><b>*If yes, to REFER FOR PHYSIOTHERAPIST CONSULATION</b>
          <RadioField name="geriPhysicalActivityLevelQ5" label="Geri - Physical Activity Level Q5" />
          <span style={{color: "red"}}>*Referral to Physiotherapist Consult</span>
          <RadioField name="geriPhysicalActivityLevelQ6" label="Geri - Physical Activity Level Q6" />

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

GeriPhysicalActivityLevelForm.contextType = FormContext;

export default function GeriPhysicalActivityLevelform(props) {
  return <GeriPhysicalActivityLevelForm {...props} />;
}