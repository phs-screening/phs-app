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
	geriTugQ1: {
		type: Array, optional: true
		}, "geriTugQ1.$": {
		type: String, allowedValues: ["Walking frame", "Walking frame with wheels", "Crutches/ Elbow crutches", "Quadstick (Narrow/ Broad)", "Walking stick", "Umbrella", "Others (Please specify in textbox )"]
		}, geriTugQ2: {
		type: String, optional: true
		}, geriTugQ3: {
		type: String, optional: false
		}, geriTugQ4: {
		type: String, allowedValues: ["High Falls Risk (> 15sec)", "Low Falls Risk (≤ 15 sec)"], optional: false
		}, geriTugQ5: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.3b Time-Up and Go (TUG)</h2>
		Walking aid (if any): 
		<SelectField name="geriTugQ1" checkboxes="true" label="Geri - TUG Q1" />
		Please Specify for Others
		<TextField name="geriTugQ2" label="Geri - TUG Q2"/>
		Time taken (in seconds):
		<TextField name="geriTugQ3" label="Geri - TUG Q3"/>
		<h3>If > 15 seconds, participant has a high falls risk.</h3>
		Falls Risk Level: 
		<RadioField name="geriTugQ4" label="Geri - TUG Q4"/>
		*Referral to Physiotherapist and Occupational Therapist Consult
		<RadioField name="geriTugQ5" label="Geri - TUG Q5"/>
		
	</Fragment>

  )