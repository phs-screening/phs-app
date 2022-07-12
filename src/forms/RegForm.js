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
import {schema, layout} from './reg.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

const formName = "registrationForm"
const RegForm = () => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const navigate = useNavigate();
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const [saveData, setSaveData] = useState(null)
    const form_layout = layout

    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName);
        setSaveData(savedData)
    }, [])


    const newForm = () => (
      <AutoForm
        schema={form_schema}
        className="fieldPadding"
        onSubmit={async (model) => {
          isLoading(true)
          const response = await submitForm(model, patientId, formName);
          if (response.result) {
            isLoading(false);
            setTimeout(() => {
              alert("Successfully submitted form");
              navigate('/app/dashboard', { replace: true });
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