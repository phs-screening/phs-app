import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';

export const schema = new SimpleSchema({
	geriPtConsultQ1: {
		type: String, optional: false
		}, geriPtConsultQ2: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriPtConsultQ3: {
		type: String, optional: true
		}, geriPtConsultQ4: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriPtConsultQ5: {
		type: String, optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.4a PT Consult</h2>
		Memo: 
		<LongTextField name="geriPtConsultQ1" label="Geri - PT Consult Q1" />
		To be referred for doctor's consult (PT)? 
		<RadioField name="geriPtConsultQ2" label="Geri - PT Consult Q2"/>
		Reasons for referral to Doctor's consult (PT):
		<LongTextField name="geriPtConsultQ3" label="Geri - PT Consult Q3" />
		To be referred for social support (For HDB EASE Sign-up) (PT):
		<RadioField name="geriPtConsultQ4" label="Geri - PT Consult Q4"/>
		Reasons for referral to social support (PT):
		<LongTextField name="geriPtConsultQ5" label="Geri - PT Consult Q5" />
		<h2>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON FORM A</h2>
		
	</Fragment>

  )