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
	fitQ1: {
		type: String, allowedValues: ["Every 6 months", "Every year", "Once every 2 years", "Once every 3 years", "Once every 4 years", "Never", "Others, (Please specify):"], optional: false
		}, fitQ2: {
		type: String, optional: true
		}, fitQ3: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, fitQ4: {
		type: String, allowedValues: ["Every 6 months", "Every year", "Once every 2 years", "Once every 3 years", "Once every 4 years", "Never", "Others, (Please specify):"], optional: false
		}, fitQ5: {
		type: String, optional: true
		}, fitQ6: {
		type: String, allowedValues: ["Every 6 months", "Every year", "Once every 2 years", "Once every 3 years", "Once every 4 years", "Once every 5 years", "Once every 10 years", "Never", "Others, (Please specify):"], optional: false
		}, fitQ7: {
		type: String, optional: true
		}, fitQ8: {
		type: String, allowedValues: ["Every 6 months", "Every year", "Once every 2 years", "Once every 3 years", "Once every 4 years", "Once every 5 years", "Once every 10 years", "Never", "Others, (Please specify):"], optional: false
		}, fitQ9: {
		type: String, optional: true
		}, fitQ10: {
		type: String, allowedValues: ["Every 6 months", "Every year", "Once every 2 years", "Once every 3 years", "Once every 4 years", "Once every 5 years", "Once every 10 years", "Never", "Others, (Please specify):"], optional: false
		}, fitQ11: {
		type: String, optional: true
		}, fitQ12: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, fitQ13: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>PARTICIPANT IDENTIFICATION</h2>
		<h3>Please verify participant's identity using his/her NRIC before proceeding <br />A. S/N B. Surname followed by Initials C. Last 4 digits of Participant's NRIC and Letter</h3>
		<h2>1. SCREENING AWARENESS SURVEY</h2>
		1. How often do you think you should go for health check-up for chronic diseases? (i.e. HTN, DM, HLD)
		<RadioField name="fitQ1" label="FIT Q1"/>
		Please specify:
		<TextField name="fitQ2" label="FIT Q2"/>
		2. Do you know what is a FIT kit?
		<RadioField name="fitQ3" label="FIT Q3"/>
		3. How often should people above 50 years old utilize a FIT kit?
		<RadioField name="fitQ4" label="FIT Q4"/>
		Please specify:
		<TextField name="fitQ5" label="FIT Q5"/>
		4. How often should people go for a colonoscopy?
		<RadioField name="fitQ6" label="FIT Q6"/>
		Please specify:
		<TextField name="fitQ7" label="FIT Q7"/>
		5. How often should women go for a HPV test?
		<RadioField name="fitQ8" label="FIT Q8"/>
		Please specify:
		<TextField name="fitQ9" label="FIT Q9"/>
		6. How often should women go for a mammogram?
		<RadioField name="fitQ10" label="FIT Q10"/>
		Please specify:
		<TextField name="fitQ11" label="FIT Q11"/>
		<h2>2. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
		1. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a blood stool test? (A blood stool test is a test to determine whether the stool contains blood.)
		<SelectField name="fitQ12" label="FIT Q12" />
		2. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a tube is inserted in the rectum to view the colon for signs of cancer or other health problems.)
		<SelectField name="fitQ12" label="FIT Q12" />
		<h3>Please encourage participants to go for FIT every year if participant is above 50, asymptomatic and no positive family history of colorectal cancer in first degree relatives. </h3>
		Does participant has a history of cancer or his/her family history requires further scrutiny by doctors? (If indicated 'Yes', please refer to doctor's consult by following the steps below.)
		<RadioField name="fitQ12" label="FIT Q12"/>
		<h3>REFER TO DR CONSULT by indicating on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation </h3>
		3. Was participant issued 2 FIT kits?
		<RadioField name="fitQ13" label="FIT Q13"/>
		
	</Fragment>

  )