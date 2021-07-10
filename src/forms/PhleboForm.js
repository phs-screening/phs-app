import React, { Component } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';

import { schema, layout } from './phlebo.js';

class PhleboForm extends Component {

    render() {
        const form_schema = new SimpleSchema2Bridge(schema)
        const form_layout = layout
        const newForm = () => (
          <AutoForm
            schema={form_schema}
            onSubmit={console.log}
            //onSubmit={this.handleSubmit}
            onSubmitSuccess={() => {
                alert("Successful");
              }}
            onSubmitFailure={() => {
                alert('Unsuccessful')
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

export default PhleboForm;