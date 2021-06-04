import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import AutoForm from 'uniforms-material/AutoForm';
import AutoField from 'uniforms-material/AutoField';
import TextField from 'uniforms-material/TextField';
import SubmitField from 'uniforms-material/SubmitField';
import SelectField from 'uniforms-material/SelectField';
import HiddenField from 'uniforms-material/HiddenField';
import NumField from 'uniforms-material/NumField';
import ListField from 'uniforms-material/ListField';
import DateField from 'uniforms-material/DateField';
import RadioField from 'uniforms-material/RadioField';
import BoolField from 'uniforms-material/BoolField';
import LongTextField from 'uniforms-material/LongTextField';

import BaseField from 'uniforms/BaseField';
import nothing from 'uniforms/nothing';
import {Children} from 'react';
import { Radio } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


export const schema = new SimpleSchema({
	geriVisionQ1: {
		type: Boolean, allowedValues: ["Yes (Specify in textbox )", "No"], optional: false
		}, geriVisionQ2: {
		type: String, optional: true
		}, geriVisionQ3: {
		type: String, optional: false
		}, geriVisionQ4: {
		type: String, optional: false
		}, geriVisionQ5: {
		type: String, optional: true
		}, geriVisionQ6: {
		type: String, optional: true
		}, geriVisionQ7: {
		type: String, allowedValues: ["CF2M", "CF1M", "HM", "LP", "NLP", "NIL"], optional: true
		}, geriVisionQ8: {
		type: Array, optional: true
		}, "geriVisionQ8.$": {
		type: String, allowedValues: ["Referred to OT Consult"]
		}, geriVisionQ9: {
		type: Array, optional: true
		}, "geriVisionQ9.$": {
		type: String, allowedValues: ["Referred to Doctor\s Consult"]
		}
	}
)

export const layout = (
    <Fragment>
		<h2>2. VISION SCREENING</h2>
		1. Previous eye condition or surgery
		<RadioField name="geriVisionQ1" label="Geri - Vision Q1"/>
		Explanation
		<TextField name="geriVisionQ2" label="Geri - Vision Q2"/>
		2. Visual acuity (w/o pinhole occluder) - Right Eye 6/__
		<TextField name="geriVisionQ3" label="Geri - Vision Q3"/>
		3. Visual acuity (w/o pinhole occluder) - Left Eye 6/__
		<TextField name="geriVisionQ4" label="Geri - Vision Q4"/>
		4. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__
		<TextField name="geriVisionQ5" label="Geri - Vision Q5"/>
		5. Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__
		<TextField name="geriVisionQ6" label="Geri - Vision Q6"/>
		6. Eye Functional Test *only applicable if vision is worse than 6/60
		<RadioField name="geriVisionQ7" label="Geri - Vision Q7"/>
		 Please refer to Occupational Therapist Consult if visual acuity is ≥ 6/12
		<SelectField name="geriVisionQ8" checkboxes="true" label="Geri - Vision Q8" />
		 Please refer to Doctor’s Consult if pinhole visual acuity is ≥ 6/12
		<SelectField name="geriVisionQ9" checkboxes="true" label="Geri - Vision Q9" />
		<h2>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</h2>
		
	</Fragment>

  )