import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';

import { schema, layout } from './prereg.js';

import { preRegister } from '../api/api.js';


class PreregForm extends Component {

    render() {
        const form_schema = new SimpleSchema2Bridge(schema)
        const form_layout = layout
        const newForm = () => (
          <AutoForm
            schema={form_schema}
            onSubmit={async (model) => {
              const response = await preRegister(model);
              console.log(response);
              if (response.result) {
                alert(`Successfully pre-registered patient with id ${response.data.patient_id}.`);
                // TODO: update state with user id on success
                window.location = '/app/dashboard';
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

export default PreregForm;