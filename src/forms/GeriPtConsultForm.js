import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import AutoForm from 'uniforms-material/AutoForm';
import SubmitField from 'uniforms-material/SubmitField';
import ErrorsField from 'uniforms-material/ErrorsField';

import { schema, layout } from './geriPtConsult';

class GeriPtConsultForm extends Component {

    render() {
        const form_schema = schema
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

export default GeriPtConsultForm;