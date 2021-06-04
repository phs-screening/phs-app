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
	hxSocialQ1: {
		type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
		}, hxSocialQ2: {
		type: String, optional: true
		}, hxSocialQ3: {
		type: String, allowedValues: ["1200 and below per month", "1,201 - 2,000 per month", "2,001 - 3,999 per month", "4,000 - 5,999 per month", "6,000 - 9,999 per month", "10,000 & above", "NIL"], optional: false
		}, hxSocialQ4: {
		type: String, optional: false
		}, hxSocialQ5: {
		type: String, allowedValues: ["Yes, (Please specify):", "No, I do not qualify", "No, I qualify but...(Please specify the reasons for not applying if you qualify):"], optional: false
		}, hxSocialQ6: {
		type: String, optional: true
		}, hxSocialQ7: {
		type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
		}, hxSocialQ8: {
		type: String, optional: true
		}, hxSocialQ9: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, hxSocialQ10: {
		type: String, allowedValues: ["Yes", "No"], optional: true
		}, hxSocialQ11: {
		type: String, allowedValues: ["Yes", "No"], optional: true
		}, hxSocialQ12: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, hxSocialQ13: {
		type: String, allowedValues: ["Healthy", "Moderate", "Poor"], optional: false
		}, hxSocialQ14: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>HISTORY TAKING PART 3: SOCIAL HISTORY</h2>
		<h2>1. DIET AND EXERCISE<br />(Taken in NSS Questionnaire portion earlier on)</h2>
		<h2>2. FINANCIAL STATUS<br />Please refer to page 1 of Form A for following questions.</h2>
		1. Current CHAS status?
		<TextField name="hxSocialQ1" label="Hx Social Q1" />
		2. For participants born before 1949. Pioneer Generation Card? 
		<TextField name="hxSocialQ1" label="Hx Social Q1" />
		3. Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
		<RadioField name="hxSocialQ1" label="Hx Social Q1"/>
		Please specify
		<LongTextField name="hxSocialQ2" label="Hx Social Q2" />
		<h3>PLEASE REFER TO PAGE 2 OF NSS FORM FOR RESPONSES. PLEASE ASK MORE as NECESSARY. </h3>
		4a. What is the average earnings of participant's household per month? (Refer to NSS Form Page 2, Put 'NIL' if participant unable to provide)
		<RadioField name="hxSocialQ3" label="Hx Social Q3"/>
		4b. Number of household members (including yourself): 
		<TextField name="hxSocialQ4" label="Hx Social Q4"/>
		4c. Do you want to apply for CHAS card? (if you are currently not on CHAS but qualify) 
		<RadioField name="hxSocialQ5" label="Hx Social Q5"/>
		Please specify
		<TextField name="hxSocialQ6" label="Hx Social Q6"/>
		5. Do you need advice on financial schemes that are available in Singapore or require further financial assistance?
		<RadioField name="hxSocialQ7" label="Hx Social Q7"/>
		Please specify
		<TextField name="hxSocialQ8" label="Hx Social Q8"/>
		<h3>REFER TO SOCIAL SERVICE  STATION if participant is in need of financial aid.  <br />Indicate for Social Service station on:  <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons for referral on the right column<br /><br />Note the following criteria for your assessment: (wef from 1st Nov 2019)<br />Per-capita monthly income for CHAS: Green Card: Above $2000; Orange Card: $1201- $2000; Blue Card: $1200 and below</h3>
		<h2>3. SOCIAL ISSUES</h2>
		1. Are you caring for a loved one?
		<RadioField name="hxSocialQ9" label="Hx Social Q9"/>
		2. If you are caring for a loved one, do you need training?
		<RadioField name="hxSocialQ10" label="Hx Social Q10"/>
		3. Do you need assistance? (eg funds to hire a helper / funds to offset caretaking costs, subsidies for home healthcare items, arranging for short term care in nursing homes/senior care centres)
		<RadioField name="hxSocialQ11" label="Hx Social Q11"/>
		4. Do you require social support?
		<RadioField name="hxSocialQ12" label="Hx Social Q12"/>
		<h3>REFER TO SOCIAL SERVICE STATION if participant has social issues that require further consult.<br />Indicate for Social Service station on:  <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons for referral on the right column</h3>
		<h2>4. ORAL ISSUES</h2>
		<h3>Please do a quick inspection of participant's oral health status: <br />1. Lips, Tongue, Gums & Tissues (Healthy - pink and moist)<br />2. Natural Teeth, Oral Cleanliness & Dentures (Tooth/Root decay, no cracked/broken dentures, No food particles/tartar in mouth)<br />3. Saliva status (free-flowing) and Any dental pain </h3>
		1. How is the participant's Oral Health?
		<RadioField name="hxSocialQ13" label="Hx Social Q13"/>
		2. Would you like to go through free Oral Health screening by NUS Dentistry dentists and students?
		<RadioField name="hxSocialQ14" label="Hx Social Q14"/>
		<h3>REFER TO NUS DENTISTRY ORAL SCREENING if participant has poor dental hygiene and interested to go through dental screening for participants aged 40-59. For participants 60 and above, functional screening includes oral screening.<br />Indicate for Dentistry on:  <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons for referral on the right column</h3>
		
	</Fragment>

  )