import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import CircularProgress from '@material-ui/core/CircularProgress';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {schema, layout, loadDataReg} from './reg.js';
import {getSavedData} from "../services/mongoDB";
const formName = "registrationForm"
const RegForm = () => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false)
    const navigate = useNavigate();
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const form_layout = layout

    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName);
        const getSchema = savedData ? await loadDataReg(savedData) : schema
        setForm_schema(new SimpleSchema2Bridge(getSchema))
    }, [])


    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          isLoading(true)
          const response = await submitForm(model, patientId, formName);
          // TODO: error handling
          // if (response.result) {
          //   alert(`Successfully pre-registered patient with queue number ${response.data.patientId}.`);
          //   updatePatientId(response.data.patientId);
          //   navigate('/app/dashboard', { replace: true });
          // } else {
          //   alert(`Unsuccessful. ${response.error}`);
          // }
          isLoading(false)
          alert("Successfully submitted form")
          navigate('/app/dashboard', { replace: true });
        }}
      >
        {form_layout}
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

RegForm.contextType = FormContext;

export default function Regform(props) {
  const navigate = useNavigate();

  return <RegForm {...props} navigate={navigate} />;
}