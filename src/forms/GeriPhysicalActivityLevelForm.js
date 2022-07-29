import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { LongTextField, RadioField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

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

const formName = "geriPhysicalActivityLevelForm"
const GeriPhysicalActivityLevelForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
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
          <h2>PHYSICAL ACTIVITY SECTION</h2>
          <h2>PHYSICAL ACTIVITY LEVELS</h2>
          <br/>
          1.     How often do you exercise in a week?<br />*If &lt; 3x/week and would like to start exercising more, suggest physiotherapist consultation
          <LongTextField name="geriPhysicalActivityLevelQ1" label="Geri - Physical Activity Level Q1" />
          <br />
          2.     How long do you exercise each time?<br />*If &lt; 30minutes per session and would like to increase, suggest physiotherapist consultation.
          <LongTextField name="geriPhysicalActivityLevelQ2" label="Geri - Physical Activity Level Q2" />
          <br />
          3.     What do you do for exercise?<br />*Take down salient points. <br />*Dangerous/ inappropriate exercises are defined to the participants as exercises that cause pain or difficulty to to the participant in performing.<br />*If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST CONSULATION.
          <LongTextField name="geriPhysicalActivityLevelQ3" label="Geri - Physical Activity Level Q3" />
          <br />
          4.     Using the following scale, can you rate the level of exertion when you exercise?<br />(Borg Scale – Rate Perceived Exertion (RPE))<br /><b>*If &lt;3, to suggest physiotherapist consultation. If &gt;7, to REFER FOR PHYSIOTHERAPIST CONSULATION. </b><br />
          <img src='/images/geri-physical-activity-level/borg-scale.png' alt='Borg Scale' /> <br />
          <RadioField name="geriPhysicalActivityLevelQ4" label="Geri - Physical Activity Level Q4" />
          <br />
          5.     Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?<br /><b>*If yes, to REFER FOR PHYSIOTHERAPIST CONSULATION</b>
          <RadioField name="geriPhysicalActivityLevelQ5" label="Geri - Physical Activity Level Q5" />
          <br />
          <span style={{color: "red"}}>*Referral to Physiotherapist Consult</span>
          <RadioField name="geriPhysicalActivityLevelQ6" label="Geri - Physical Activity Level Q6" />

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

GeriPhysicalActivityLevelForm.contextType = FormContext;

export default function GeriPhysicalActivityLevelform(props) {
  return <GeriPhysicalActivityLevelForm {...props} />;
}