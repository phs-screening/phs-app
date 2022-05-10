import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';

import { schema, layout } from './prereg.js';

import { preRegister } from '../api/api.js';
import { FormContext } from '../api/utils.js';

class PreregForm extends Component {
    render() {
        const {patientId, updatePatientId} = this.context;
        const { navigate } = this.props;
        const form_schema = new SimpleSchema2Bridge(schema)
        const form_layout = layout
        const newForm = () => (
          <AutoForm
            schema={form_schema}
            onSubmit={async (model) => {
              const response = await preRegister(model);
              console.log(response);
              if (response.result) {
                alert(`Successfully pre-registered patient with queue number ${response.data.patientId}.`);
                updatePatientId(response.data.patientId);
                // window.location = '/app/dashboard';
                navigate('/app/dashboard', { replace: true });
              } else {
                alert(`Unsuccessful. ${response.error}`);
              }
            }}
          >
            {form_layout}
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
PreregForm.contextType = FormContext;

export default function Preregform(props) {
  const navigate = useNavigate();

  return <PreregForm {...props} navigate={navigate} />;
}