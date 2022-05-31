import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import CircularProgress from '@material-ui/core/CircularProgress';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { schema, layout } from './reg.js';

class RegForm extends Component {
    static contextType = FormContext

    constructor(props) {
      super(props);
      this.state = {
        loading: false
      };
    }

    render() {
        const {patientId, updatePatientId} = this.context;
        const { navigate } = this.props;
        const form_schema = new SimpleSchema2Bridge(schema)
        const form_layout = layout
        const newForm = () => (
          <AutoForm
            schema={form_schema}
            onSubmit={async (model) => {
              this.setState({
                loading: true
              });
              const response = await submitForm(model, patientId, "registrationForm");
              // TODO: error handling
              // if (response.result) {
              //   alert(`Successfully pre-registered patient with queue number ${response.data.patientId}.`);
              //   updatePatientId(response.data.patientId);
              //   navigate('/app/dashboard', { replace: true });
              // } else {
              //   alert(`Unsuccessful. ${response.error}`);
              // }
              this.setState({
                loading: false
              });
              alert("Successfully submitted form")
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {form_layout}
            <ErrorsField />
            <div>
              {this.state.loading ? <CircularProgress />
              : <SubmitField inputRef={(ref) => this.formRef = ref} />}
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

RegForm.contextType = FormContext;

export default function Regform(props) {
  const navigate = useNavigate();

  return <RegForm {...props} navigate={navigate} />;
}