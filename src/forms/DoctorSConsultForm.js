import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { 
	TextField, 
	SelectField, 
	LongTextField } from 'uniforms-material';


const schema = new SimpleSchema({
	doctorSConsultQ1: {
		type: String, optional: true
		}, doctorSConsultQ2: {
		type: String, optional: true
		}, doctorSConsultQ3: {
		type: String, optional: true
		}, doctorSConsultQ4: {
		type: Array, optional: true
		}, "doctorSConsultQ4.$": {
		type: String, allowedValues: []
		}, doctorSConsultQ5: {
		type: String, optional: true
		}, doctorSConsultQ6: {
		type: Array, optional: true
		}, "doctorSConsultQ6.$": {
		type: String, allowedValues: []
		}, doctorSConsultQ7: {
		type: Array, optional: false
		}, "doctorSConsultQ7.$": {
		type: String, allowedValues: []
		}
	}
)

class DoctorSConsultForm extends Component {

    render() {
        const form_schema = new SimpleSchema2Bridge(schema)
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
            
            <Fragment>
            Doctor's Name:
            <TextField name="doctorSConsultQ1" label="Doctor's Consult Q1"/>
            <br/>
            MCR No.:
            <TextField name="doctorSConsultQ2" label="Doctor's Consult Q2"/>
            <br/>
            Doctor's Memo
            <LongTextField name="doctorSConsultQ3" label="Doctor's Consult Q3" />
            <br/>
            Refer to dietitian?
            <SelectField name="doctorSConsultQ4" checkboxes="true" label="Doctor's Consult Q4" />
            <br/>
            Reason for referral
            <TextField name="doctorSConsultQ5" label="Doctor's Consult Q5"/>
            <br/>
            Does patient require urgent follow up?
            <SelectField name="doctorSConsultQ6" checkboxes="true" label="Doctor's Consult Q6" />
            <br/>
            Completed Doctor’s Consult station. Please check that Form A is filled.
            <SelectField name="doctorSConsultQ7" checkboxes="true" label="Doctor's Consult Q7" />
              
            </Fragment>

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

export default DoctorSConsultForm;