import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';
import { useField } from 'uniforms';

import { AutoForm } from 'uniforms';
import { RadioField, SelectField, NumField } from 'uniforms-material';


export const schema = new SimpleSchema({
	geriFrailScaleQ1: {
        type: String, allowedValues: ["1", "0"], optional: false
      }, geriFrailScaleQ2: {
        type: String, allowedValues: ["1", "0"], optional: false
      }, geriFrailScaleQ3: {
        type: String, allowedValues: ["1", "0"], optional: false
      }, geriFrailScaleQ4: {
        type: Array, optional: false
      }, "geriFrailScaleQ4.$": {
        type: String, allowedValues: ["Hypertension", "Diabetes", "Cancer (other than a minor skin cancer)", "Chronic lung disease", "Heart attack", "Congestive heart failure", "Angina", "Asthma", "Arthritis", "Stroke", "Kidney disease", "NIL"]
      }, geriFrailScaleQ5: {
        type: Number, optional: false
      }, geriFrailScaleQ6: {
        type: String, allowedValues: ["Yes", "No"], optional: false
      }, geriFrailScaleQ7: {
        type: Number, optional: true
      }
	}
)


export const layout = (
    <Fragment>
      <h2>3.1 PHYSICAL ACTIVITY SECTION</h2>
      <h2>3.1.3. FRAIL SCALE</h2>
      <h3>For each for the following question, assign a score of 1 or 0 depending on the participant's answer.</h3>
      1. Fatigue: How much of the time during the past 4 weeks did you feel tired?<br />1 = All of the time<br />2 = Most of the time<br />3 = Some of the time<br />4 = A little of the time<br />5 = None of the time<br /><br />Responses of “1” or “2” are scored as 1 and all others as 0.<br />
      <RadioField name="geriFrailScaleQ1" label="Geri - Frail Scale Q1"/>
      2. Resistance: By yourself and not using aids, do you have any difficulty walking up 10 steps without resting?<br />1 = Yes<br />0 = No <br />
      <RadioField name="geriFrailScaleQ2" label="Geri - Frail Scale Q2"/>
      3. Ambulation: By yourself and not using aids, do you have any difficulty walking several hundred yards? (approx. > 300m)<br />1 = Yes<br />0 = No <br /><br />
      <RadioField name="geriFrailScaleQ3" label="Geri - Frail Scale Q3"/>
      4. Illnesses: For 11 illnesses, participants are asked, “Did a doctor ever tell you that you have [illness]?” <br />The illnesses include hypertension, diabetes, cancer (other than a minor skin cancer), chronic lung disease, heart attack, congestive heart failure, angina, asthma, arthritis, stroke, and kidney disease.<br /><br />The total illnesses (0–11) are recorded as <br />0–4 = 0 and 5–11 = 1.<br />
      <SelectField name="geriFrailScaleQ4" checkboxes="true" label="Geri - Frail Scale Q4" />
      5. Loss of weight: How much do you weigh with your clothes on but without shoes? [current weight] <br />One year ago, in October 2018, how much did you weigh without your shoes and with your clothes on? [weight 1 year ago]. <br /><br />Percent weight change is computed as: <br />[[weight 1 year ago - current weight]/weight 1 year ago]] * 100.<br />What is the percentage (%) weight change?<br /><br />Percent change > 5 (representing a 5% loss of weight) is scored as 1 and &lt; 5 as 0.<br /><br />If participant cannot remember his/her weight, ask if there was any significant loss in weight the past year.<br />
      <NumField name="geriFrailScaleQ5" label="Geri - Frail Scale Q5"/>
      <h3><br />Frail scale scores range from 0-5 (i.e. 1 point for each component; 0 = best to 5 = worst) and represent frail (3-5), pre-frail (1-2), and robust (0) health status.<br />For score of 1 and above, REFER TO PHYSIOTHERAPIST CONSULT. <br /></h3>
      
      <font color="red">*Referral to Physiotherapist Consult</font>
      <RadioField name="geriFrailScaleQ6" label="Geri - Frail Scale Q6"/>
      
    </Fragment>

  )