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
	wceQ1: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, wceQ2: {
		type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
		}, wceQ3: {
		type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
		}, wceQ4: {
		type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
		}, wceQ5: {
		type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
		}, wceQ6: {
		type: Array, optional: false
		}, "wceQ6.$": {
		type: String, allowedValues: ["Yes, (Please specify date of appointment if given):", "No", "Not Applicable"]
		}, wceQ7: {
		type: String, optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>PARTICIPANT IDENTIFICATION</h2>
		<h3>Please verify participant's identity using his/her NRIC before proceeding <br />A. S/N B. Surname followed by Initials C. Last 4 digits of Participant's NRIC and Letter</h3>
		<h2>1. FINANCIAL STATUS<br />Please refer to page 1 of Form A for following questions.</h2>
		1. Current CHAS status?
		<TextField name="wceQ1" label="WCE Q1" />
		2. For participants born before 1949. Pioneer Generation Card? 
		<TextField name="wceQ1" label="WCE Q1" />
		3. Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
		<TextField name="wceQ1" label="WCE Q1" />
		<h2>2. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
		1. For female respondent aged 40 and above only.<br />When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast to look for breast cancer.)
		<TextField name="wceQ1" label="WCE Q1" />
		2. For female respondent aged 25 and above, who have/had a husband/boyfriend and not had their womb completely surgically removed only.<br />When was the last time you had a PAP smear test? (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the womb, to check for changes in the cells of your cervix, which may develop into cancer later.)
		<TextField name="wceQ1" label="WCE Q1" />
		For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and above, seek doctor's advice.<br />Please encourage participants to go for HPV test every 5 years. <br />
		Does participant has a history of cancer or his/her family history requires further scrutiny by doctors? (If indicated 'Yes', please refer to doctor's consult by following the steps below.)
		<RadioField name="wceQ1" label="WCE Q1"/>
		REFER TO DR CONSULT by indicating on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation <br />
		<h2>3. FOLLOW UP PLAN</h2>
		1. Completed Breast Self Examination station?
		<RadioField name="wceQ2" label="WCE Q2"/>
		2. Completed Cervical Education station?
		<RadioField name="wceQ3" label="WCE Q3"/>
		3. Indicated interest for HPV Test under SCS?
		<RadioField name="wceQ4" label="WCE Q4"/>
		4. Indicated interest for Mammogram under SCS?
		<RadioField name="wceQ5" label="WCE Q5"/>
		5. Registered for Mammogram under NHGD?
		<SelectField name="wceQ6" checkboxes="true" label="WCE Q6" />
		Please specify date:
		<TextField name="wceQ7" label="WCE Q7"/>
		
	</Fragment>

  )