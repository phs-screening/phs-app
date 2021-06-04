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
	socialServiceQ1: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, socialServiceQ2: {
		type: String, optional: false
		}, socialServiceQ3: {
		type: String, optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>Social Service Station</h2>
		1. Has the participant visited the social service station?
		<RadioField name="socialServiceQ1" label="Social Service Q1"/>
		2. Brief summary of the participant's concerns
		<LongTextField name="socialServiceQ2" label="Social Service Q2" />
		3. Brief summary of what will be done for the participant (Eg name of scheme participant wants to apply for)
		<LongTextField name="socialServiceQ3" label="Social Service Q3" />
		
	</Fragment>

  )