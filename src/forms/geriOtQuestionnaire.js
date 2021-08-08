import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { TextField, SelectField, RadioField } from 'uniforms-material';


export const schema = new SimpleSchema({
	geriOtQuestionnaireQ1: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriOtQuestionnaireQ2: {
		type: String, allowedValues: ["Yes (Please specify : __________)", "No"], optional: false
		}, geriOtQuestionnaireQ3: {
		type: String, optional: true
		}, geriOtQuestionnaireQ4: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriOtQuestionnaireQ5: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriOtQuestionnaireQ6: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriOtQuestionnaireQ7: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriOtQuestionnaireQ8: {
		type: Array, optional: true
		}, "geriOtQuestionnaireQ8.$": {
		type: String, allowedValues: ["Referred to Doctor\s Consult"]
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.2 OT Questionnaire SECTION</h2>
		1. Have you fallen or had a near fall in the last year?
		<RadioField name="geriOtQuestionnaireQ1" label="Geri - OT Questionnaire Q1"/>
		<h3>If yes, refer occupational therapist consultation</h3>
		2. Has any medication you've taken caused you drowsiness/ giddiness?
		<RadioField name="geriOtQuestionnaireQ2" label="Geri - OT Questionnaire Q2"/>
		Explanation
		<TextField name="geriOtQuestionnaireQ3" label="Geri - OT Questionnaire Q3"/>
		<h3>If yes, refer occupational therapist consultation</h3>
		3. Do you use anything to support yourself (e.g. walking aid, umbrella) when moving about your daily activities?
		<RadioField name="geriOtQuestionnaireQ4" label="Geri - OT Questionnaire Q4"/>
		<h3>If yes, refer occupational therapist consultation</h3>
		4. Do you frequently experience dizziness when standing up from a seated or laid down position?
		<RadioField name="geriOtQuestionnaireQ5" label="Geri - OT Questionnaire Q5"/>
		<h3>If yes, refer occupational therapist consultation and doctor’s consult</h3>
		5. Do you experience urinary incontinence or nocturia (go toilet 3 or more times at night)?
		<RadioField name="geriOtQuestionnaireQ6" label="Geri - OT Questionnaire Q6"/>
		<h3>If yes, refer occupational therapist consultation and doctor’s consult</h3>
		*Referral to Occupational Therapist Consult
		<RadioField name="geriOtQuestionnaireQ7" label="Geri - OT Questionnaire Q7"/>
		 *Referral to Doctor’s Consult
		<SelectField name="geriOtQuestionnaireQ8" checkboxes="true" label="Geri - OT Questionnaire Q8" />
		<h2>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON FORM A.</h2>
		
	</Fragment>

  )