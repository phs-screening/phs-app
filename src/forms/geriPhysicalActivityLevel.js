import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { TextField, RadioField } from 'uniforms-material';

export const schema = new SimpleSchema({
	geriPhysicalActivityLevelQ1: {
		type: String, optional: false
		}, geriPhysicalActivityLevelQ2: {
		type: String, optional: false
		}, geriPhysicalActivityLevelQ3: {
		type: String, optional: false
		}, geriPhysicalActivityLevelQ4: {
		type: String, allowedValues: ["0 (Nothing at all)", "1 (Very light)", "2 (Fairly light)", "3 (Moderate)", "4 (Somewhat hard)", "5 (Hard)", "6.0", "7 (Very Hard)", "8.0"], optional: false
		}, geriPhysicalActivityLevelQ5: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriPhysicalActivityLevelQ6: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.1 PHYSICAL ACTIVITY SECTION</h2>
		<h2>3.1.2. PHYSICAL ACTIVITY LEVELS</h2>
		1.     How often do you exercise in a week?<br />*If &lt 3x/week and would like to start exercising more, suggest physiotherapist consultation
		<TextField name="geriPhysicalActivityLevelQ1" label="Geri - Physical Activity Level Q1"/>
		2.     How long do you exercise each time?<br />*If &lt 30minutes per session and would like to increase, suggest physiotherapist consultation. 
		<TextField name="geriPhysicalActivityLevelQ2" label="Geri - Physical Activity Level Q2"/>
		3.     What do you do for exercise?<br />*Take down salient points. <br />*Dangerous/ inappropriate exercises are defined to the participants as  exercises that cause pain or difficulty to to the participant in performing.<br />*If exercises are dangerous or deemed inappropriate, to REFER FOR PHYSIOTHERAPIST CONSULATION. 
		<TextField name="geriPhysicalActivityLevelQ3" label="Geri - Physical Activity Level Q3"/>
		4.     Using the following scale, can you rate the level of exertion when you exercise?<br />(Borg Scale – Rate Perceived Exertion (RPE))<br />*If &lt3, to suggest physiotherapist consultation. If &gt7, to REFER FOR PHYSIOTHERAPIST CONSULATION. <br /><br /><br />
		<RadioField name="geriPhysicalActivityLevelQ4" label="Geri - Physical Activity Level Q4"/>
		5.     Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?<br />*If yes, to REFER FOR PHYSIOTHERAPIST CONSULATION
		<RadioField name="geriPhysicalActivityLevelQ5" label="Geri - Physical Activity Level Q5"/>
		*Referral to Physiotherapist Consult
		<RadioField name="geriPhysicalActivityLevelQ6" label="Geri - Physical Activity Level Q6"/>
		
	</Fragment>

  )