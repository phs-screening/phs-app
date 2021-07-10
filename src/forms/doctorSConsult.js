import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { 
	TextField, 
	SelectField, 
	LongTextField } from 'uniforms-material';


export const schema = new SimpleSchema({
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

export const layout = (
    <Fragment>
		Doctor's Name:
		<TextField name="doctorSConsultQ1" label="Doctor's Consult Q1"/>
		MCR No.:
		<TextField name="doctorSConsultQ2" label="Doctor's Consult Q2"/>
		Doctor's Memo
		<LongTextField name="doctorSConsultQ3" label="Doctor's Consult Q3" />
		Refer to dietitian?
		<SelectField name="doctorSConsultQ4" checkboxes="true" label="Doctor's Consult Q4" />
		Reason for referral
		<TextField name="doctorSConsultQ5" label="Doctor's Consult Q5"/>
		Does patient require urgent follow up 
		<SelectField name="doctorSConsultQ6" checkboxes="true" label="Doctor's Consult Q6" />
		Completed Doctor’s Consult station. Please check that Form A is filled.
		<SelectField name="doctorSConsultQ7" checkboxes="true" label="Doctor's Consult Q7" />
		
	</Fragment>

  )