import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import {SubmitField, ErrorsField, LongTextField} from 'uniforms-material';
import { RadioField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriParQQ1: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ2: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ3: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ5: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ6: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ7: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriParQQ8: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  },geriParQQ9 : {
        type: String, optional: true
      }
}
)

const formName = "geriParQForm"
const GeriParQForm = (props) => {
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
          <h2> PHYSICAL ACTIVITY SECTION</h2>
          <h3> PHYSICAL ACTIVITY READINESS QUESTIONNAIRE (PAR-Q) <br />* If you have answered ‘Yes’ to one or more questions above, you should talk with your doctor BEFORE you start becoming much more physically active. </h3>
          <br />
          1.     Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?
          <RadioField name="geriParQQ1" label="Geri - PAR-Q Q1" />
          <br />
          2.     Do you feel pain in your chest when you do physical activity?
          <RadioField name="geriParQQ2" label="Geri - PAR-Q Q2" />
          <br />
          3.     In the past month, have you had chest pain when you were not doing physical activity?
          <RadioField name="geriParQQ3" label="Geri - PAR-Q Q3" />
          <br />
          4.     Do you lose your balance because of dizziness or do you ever lose consciousness?
          <RadioField name="geriParQQ4" label="Geri - PAR-Q Q4" />
          <br />
          5.     Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?<br />(If yes, refer to PT consult)
          <RadioField name="geriParQQ5" label="Geri - PAR-Q Q5" />
          <br />
          6.     Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?    <br />(If yes, refer to PT consult)
          <RadioField name="geriParQQ6" label="Geri - PAR-Q Q6" />
          <br />
          7.     Do you know of any other reason why you should not do physical activity?<br />(If yes, refer to PT consult)
          <RadioField name="geriParQQ7" label="Geri - PAR-Q Q7" />
          <br />
          Notes:
          <LongTextField name="geriParQQ9" label="Geri - PAR-Q Q9" />
          <br/>
          <span style={{color: "red"}}>*Referral to Physiotherapist Consult</span>
          <RadioField name="geriParQQ8" label="Geri - PAR-Q Q8" />
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

GeriParQForm.contextType = FormContext;

export default function GeriParQform(props) {
  return <GeriParQForm {...props} />;
}