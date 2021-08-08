import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { TextField, RadioField } from 'uniforms-material';

export const schema = new SimpleSchema({
	geriSppbQ1: {
		type: String, optional: true
		}, geriSppbQ2: {
		type: String, allowedValues: ["0       (If not able to complete 5 chair stands)", "1       (> 16.7s )", "2       (16.6 – 13.7s )", "3       (13.6 – 11.2s )", "4       (< 11.1s )"], optional: false
		}, geriSppbQ3: {
		type: String, optional: true
		}, geriSppbQ4: {
		type: String, optional: true
		}, geriSppbQ5: {
		type: String, optional: true
		}, geriSppbQ6: {
		type: String, allowedValues: ["0        (Side by side < 10s or unable)", "1       (Side by side 10s AND < 10s semi tandem)", "2       (Semi tandem 10s AND tandem < 3s)", "3       (Semi tandem 10s AND tandem < 10s but > 3s)", "4       (Tandem >= 10s)", "Refused to do"], optional: false
		}, geriSppbQ7: {
		type: String, optional: true
		}, geriSppbQ8: {
		type: String, allowedValues: ["0       (Could not do)", "1       (> 5.7s )", "2       (4.1 – 5.7s )", "3       (3.2 – 4.0s )", "4       (< 3.1s )"], optional: false
		}, geriSppbQ9: {
		type: String, optional: false
		}, geriSppbQ10: {
		type: String, allowedValues: ["High Falls Risk (score ≤ 6)", "Low Falls Risk (score > 6)"], optional: false
		}, geriSppbQ11: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>3.3a SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)</h2>
		1) REPEATED CHAIR STANDS<br />Time taken in seconds (only if 5 chair stands were completed):
		<TextField name="geriSppbQ1" label="Geri - SPPB Q1"/>
		Score for REPEATED CHAIR STANDS (out of 4):
		<RadioField name="geriSppbQ2" label="Geri - SPPB Q2"/>
		2a) BALANCE Side-by-side Stand <br />Time held for in seconds:
		<TextField name="geriSppbQ3" label="Geri - SPPB Q3"/>
		2b) BALANCE Semi-tandem Stand <br />Time held for in seconds:
		<TextField name="geriSppbQ4" label="Geri - SPPB Q4"/>
		2c) BALANCE Tandem Stand <br />Time held for in seconds:
		<TextField name="geriSppbQ5" label="Geri - SPPB Q5"/>
		Score for BALANCE (out of 4:
		<RadioField name="geriSppbQ6" label="Geri - SPPB Q6"/>
		3) 8’ WALK <br />Time taken in seconds:
		<TextField name="geriSppbQ7" label="Geri - SPPB Q7"/>
		Score for 8' WALK (out of 4):
		<RadioField name="geriSppbQ8" label="Geri - SPPB Q8"/>
		Sum up the scores of the sections highlighted In blue. Total score: (Max Score:12)
		<TextField name="geriSppbQ9" label="Geri - SPPB Q9"/>
		<h3>If total score ≤ 6, participant has a high falls risk.</h3>
		Falls Risk Level: 
		<RadioField name="geriSppbQ10" label="Geri - SPPB Q10"/>
		*Referral to Physiotherapist and Occupational Therapist Consult
		<RadioField name="geriSppbQ11" label="Geri - SPPB Q11"/>
		
	</Fragment>

  )