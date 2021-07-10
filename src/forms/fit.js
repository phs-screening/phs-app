import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';
import { useField } from 'uniforms';

import { AutoForm } from 'uniforms';
import { RadioField } from 'uniforms-material';


const conditional_text = <h3>REFER TO DR CONSULT by indicating on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation </h3>

function DisplayIf() {
	//const [showConditional, setShowConditional] = useState(false)
	const [{ value: fitQ12 }] = useField('fitQ12', {});
	const showConditional = fitQ12 === 'Yes';
	return <div>{showConditional && <conditional_text />}</div>;
}

export const schema = new SimpleSchema({
	fitQ12: {
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
		<h2>1. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
		1. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a blood stool test? (A blood stool test is a test to determine whether the stool contains blood.)

		2. For respondent aged 50 and above only, unless positive family history for colorectal cancer.<br />When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a tube is inserted in the rectum to view the colon for signs of cancer or other health problems.)

		<h3>Please encourage participants to go for FIT every year if participant is above 50, asymptomatic and no positive family history of colorectal cancer in first degree relatives. </h3>
		Does participant has a history of cancer or his/her family history requires further scrutiny by doctors? (If indicated 'Yes', please refer to doctor's consult by following the steps below.)
		<RadioField name="fitQ12" label="FIT Q12"/>
		<DisplayIf />
		
		3. Was participant issued 2 FIT kits?
		<RadioField name="fitQ13" label="FIT Q13"/>
		
	</Fragment>

  )