import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';


export const schema = new SimpleSchema({
	hxHcsrQ1: {
		type: String, optional: false
		}, hxHcsrQ2: {
		type: String, optional: false
		}, hxHcsrQ3: {
		type: String, optional: false
		}, hxHcsrQ4: {
		type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
		}, hxHcsrQ5: {
		type: String, optional: true
		}, hxHcsrQ6: {
		type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
		}, hxHcsrQ7: {
		type: String, optional: true
		}, hxHcsrQ8: {
		type: String, allowedValues: ["Yes, (Please specify):", "No"], optional: false
		}, hxHcsrQ9: {
		type: String, optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>PARTICIPANT IDENTIFICATION</h2>
		<h3>Please verify participant's identity using his/her NRIC before proceeding <br />A. S/N B. Surname followed by Initials C. Last 4 digits of Participant's NRIC and Letter</h3>
		Booth number and History-taker's Surname followed by Initials<br />**On Page 2 of Form A, under Doctor's Consultation (Hx-taking column, 1st row), please write down booth number and history taker's name.**<br />(Eg. Booth 18 David Choo Ah Beng = 18 David Choo A B)
		<LongTextField name="hxHcsrQ1" label="Hx HCSR Q1" />
		<h2>HISTORY TAKING PART 1: HEALTH CONCERNS AND SYSTEMS REVIEW</h2>
		<h3>TAKE 1ST BP READING NOW & RECORD ON FORM A. Ensure participant is comfortable at rest before measuring their BP. They should not have taken caffeine or smoked in the past 30 minutes either. </h3>
		<h3>• IF SYSTOLIC  ≥ 180 AND/OR DIASTOLIC ≥ 110 mmHg, please take a second reading and ask for symptoms of malignant hypertension (severe headache, giddiness, numbness in extremities,blurred vision etc.)</h3>
		<h2>1. HEALTH CONCERNS</h2>
		<h3>If the participant has any presenting complaints or concern(s), please take a brief history. (Please write NIL if otherwise).<br />E.g."Do you have any health issues that you are currently concerned about?" "最近有没有哪里不舒服？”<br /> <br />Please advise that there will be no diagnosis or prescription made at our screening. Kindly advise the participant to see a GP/polyclinic instead if he/she is expecting treatment for their problems.<br /> <br />REFER TO DR CONSULT under Form A if worrying problems / participant strongly insists or if you feel 'Health Concerns' requires closer scrutiny by doctors later.<br />Indicate for Doctor's Consultation station under: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation </h3>
		Reasons for recommendation
		<LongTextField name="hxHcsrQ2" label="Hx HCSR Q2" />
		<h2>2. SYSTEMS REVIEW</h2>
		<h3>Please rule out red flags based on participants's health concerns. (Please write NIL if otherwise)<br /><br />Below is a non-exhaustive list of possible red flags:<br />- Constitutional Symptoms: LOA, LOW, Fever<br />- CVS: Chest pain, Palpitations<br />- Respi: SOB, Haemoptysis, Night Sweat, Cough<br />- GI: change in BO habits, PR bleed, Haematemesis<br />- Frequent falls<br /><br />REFER TO DR CONSULT under Form A if worrying problems / participant strongly insists or if you feel 'Health Concerns' requires closer scrutiny by doctors later.<br />Indicate for Doctor's Consultation station under: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation </h3>
		Reasons for recommendation
		<LongTextField name="hxHcsrQ3" label="Hx HCSR Q3" />
		2a. Do you have any problems passing urine or motion? Please specify if yes. <br />REFER TO DR CONSULT and EXHIBITION SFCS booth if have urinary/bowel problem. Indicate on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation <br />3) Page 2 of Form A, under Exhibition - Recommendation, tick renal and bladder health, write down SFCS booth. 
		<RadioField name="hxHcsrQ4" label="Hx HCSR Q4"/>
		Please specify:
		<LongTextField name="hxHcsrQ5" label="Hx HCSR Q5" />
		2b. Do you have any vision problems? Please specify if yes. Exclude complaints like unspecific itchy eyes etc<br />REFER TO DR CONSULT if have vision problems for 40-59. For 60 and above, indicate for Geriatrics - Geriatrics Functional Screening includes vision screening. <br />Indicate on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation 
		<RadioField name="hxHcsrQ6" label="Hx HCSR Q6"/>
		Please specify:
		<LongTextField name="hxHcsrQ7" label="Hx HCSR Q7" />
		2c. Do you have any hearing problems? Please specify if yes. <br />REFER TO DR CONSULT if have hearing problem for 40-59. Please give the participant the PHS Hearing Questionnaire 2019, remind them to complete it by themselves before passing it to the doctors at doctor's consult. For 60 and above, indicate for Geriatrics - Geriatrics Functional Screening includes audiometry screening.<br />Indicate on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A <br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation 
		<RadioField name="hxHcsrQ8" label="Hx HCSR Q8"/>
		Please specify:
		<LongTextField name="hxHcsrQ9" label="Hx HCSR Q9" />
		
	</Fragment>

  )