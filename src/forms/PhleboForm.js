import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { BoolField } from 'uniforms-material';
import {getSavedData} from "../services/mongoDB";

const schema = new SimpleSchema({
  phlebotomyQ1: {
    type: Boolean, label: "Yes", optional: true
  }, phlebotomyQ2: {
    type: Boolean, label: "Yes", optional: true
  }
}
)

const formName = "phlebotomyForm"
const PhleboForm = () => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState(null)
  const navigate = useNavigate();

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    setSaveData(savedData)
  }, [])

    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, formName);
          navigate('/app/dashboard', { replace: true });
        }}
        model={saveData}
      >
        <Fragment>
          Blood sample collected?
          <BoolField name="phlebotomyQ1" />
          Circled 'Completed' under Phlebotomy on Form A?
          <BoolField name="phlebotomyQ2" />

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

PhleboForm.contextType = FormContext;

export default function Phleboform(props) {
  const navigate = useNavigate();

  return <PhleboForm {...props} navigate={navigate} />;
}