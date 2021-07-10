import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';


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