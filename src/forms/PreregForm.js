import React, { Component } from 'react';
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
                console.log(model);
                const preRegResponse = await preRegister(model);
                console.log(preRegResponse);
            }}
            onSubmitSuccess={() => {
                alert("Successful");
              }}
            onSubmitFailure={() => {
                alert('Unsuccessful');
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