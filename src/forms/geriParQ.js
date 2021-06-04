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
	geriParQQ1: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ2: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ3: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ4: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ5: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ6: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ7: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriParQQ8: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.1 PHYSICAL ACTIVITY SECTION</h2>
		<h3>3.1.1. PHYSICAL ACTIVITY READINESS QUESTIONNAIRE (PAR-Q) <br />* If you have answered ‘Yes’ to one or more questions above, you should talk with your doctor BEFORE you start becoming much more physically active. </h3>
		1.     Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?
		<RadioField name="geriParQQ1" label="Geri - PAR-Q Q1"/>
		2.     Do you feel pain in your chest when you do physical activity?
		<RadioField name="geriParQQ2" label="Geri - PAR-Q Q2"/>
		3.     In the past month, have you had chest pain when you were not doing physical activity?
		<RadioField name="geriParQQ3" label="Geri - PAR-Q Q3"/>
		4.     Do you lose your balance because of dizziness or do you ever lose consciousness?
		<RadioField name="geriParQQ4" label="Geri - PAR-Q Q4"/>
		5.     Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?<br />(If yes, refer to PT consult)
		<RadioField name="geriParQQ5" label="Geri - PAR-Q Q5"/>
		6.     Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?    <br />(If yes, refer to PT consult)
		<RadioField name="geriParQQ6" label="Geri - PAR-Q Q6"/>
		7.     Do you know of any other reason why you should not do physical activity?<br />(If yes, refer to PT consult)
		<RadioField name="geriParQQ7" label="Geri - PAR-Q Q7"/>
		*Referral to Physiotherapist Consult
		<RadioField name="geriParQQ8" label="Geri - PAR-Q Q8"/>
		
	</Fragment>

  )