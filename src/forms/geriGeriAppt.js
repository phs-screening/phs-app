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
	geriGeriApptQ1: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriGeriApptQ2: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriGeriApptQ3: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriGeriApptQ4: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriGeriApptQ5: {
		type: Array, optional: true
		}, "geriGeriApptQ5.$": {
		type: String, allowedValues: ["Done"]
		}, geriGeriApptQ6: {
		type: String, allowedValues: ["Yes, requirement met.", "No, requirement not met."], optional: false
		}, geriGeriApptQ7: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: true
		}, geriGeriApptQ8: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>4. Geriatrics Appointment</h2>
		<h3>1. If visual acuity ≥ 6/12: </h3>
		1) Check if participant is a CHAS card holder (Needs to present CHAS card on site)
		<RadioField name="geriGeriApptQ1" label="Geri - Geri Appt Q1"/>
		2) Check if participant is a SWCDC Resident (Link: http://sis.pa-apps.sg/NASApp/sim/SearchResults.jsp)
		<RadioField name="geriGeriApptQ2" label="Geri - Geri Appt Q2"/>
		<h3>If YES to both, please give either SWCDC Eye Voucher OR Pearl's Optical Voucher:</h3>
		SWCDC Eye Voucher given? - to be given if qn 1 and 2 answers are BOTH 'Yes'
		<RadioField name="geriGeriApptQ3" label="Geri - Geri Appt Q3"/>
		Pearl's Optical Voucher given? - to be given if either qn 1 or qn 2 (or both) answers is 'No'
		<RadioField name="geriGeriApptQ4" label="Geri - Geri Appt Q4"/>
		<h3>2. If participant is recommended for social support:</h3>
		Persuade participant to go to social support booth and explain that AIC can help
		<SelectField name="geriGeriApptQ5" checkboxes="true" label="Geri - Geri Appt Q5" />
		<h3>3. Eligibility for SWCDC Safe and Bright Homes Programme </h3>
		1) Participants will be eligible for the SWCDC Safe and Bright Homes Programme if they meet the following criteria:<br />i) SWCDC Resident (Link: http://sis.pa-apps.sg/NASApp/sim/SearchResults.jsp)<br />ii) Requires home modification (determined by SAOT) - Refer to Form A<br />
		<RadioField name="geriGeriApptQ6" label="Geri - Geri Appt Q6"/>
		2) Do you wish to sign up for the SWCDC Safe and Bright Homes Programme?<br /><br />Persuade participant to sign up for SWCDC Safe and Bright Homes. <br />Description of the programme: “The Safe and Bright Homes programme aims to develop safer and more energy-efficient homes for senior citizens and persons with disabilities. Safety (e.g. bathroom grab bars, non-slip mats etc), energy and water conservation features (energy-saving bulbs, water thimbles and cistern bags etc) will be installed in selected homes of needy residents. Workshops will also be conducted to teach them how to troubleshoot common household problems. The programme will be spread out over 10 sessions, for about 10 months.”
		<RadioField name="geriGeriApptQ7" label="Geri - Geri Appt Q7"/>
		3) Sign up form for SWCDC filled in?
		<RadioField name="geriGeriApptQ8" label="Geri - Geri Appt Q8"/>
		
	</Fragment>

  )