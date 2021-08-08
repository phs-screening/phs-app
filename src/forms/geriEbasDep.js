import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { TextField, RadioField, LongTextField } from 'uniforms-material';


export const schema = new SimpleSchema({
	geriEbasDepQ1: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ2: {
		type: String, optional: false
		}, geriEbasDepQ3: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ4: {
		type: String, optional: false
		}, geriEbasDepQ5: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ6: {
		type: String, optional: false
		}, geriEbasDepQ7: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ8: {
		type: String, optional: false
		}, geriEbasDepQ9: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ10: {
		type: String, optional: false
		}, geriEbasDepQ11: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ12: {
		type: String, optional: false
		}, geriEbasDepQ13: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ14: {
		type: String, optional: false
		}, geriEbasDepQ15: {
		type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
		}, geriEbasDepQ16: {
		type: String, optional: false
		}, geriEbasDepQ17: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriEbasDepQ18: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriEbasDepQ19: {
		type: String, optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>1.2 EBAS-DEP </h2>
		<h3>The 8 items of this schedule require raters to make a judgement as to whether the proposition under “Assessment” is satisfied or not. Each question must be asked exactly as shown but follow-up or subsidiary questions may be used to clarify the initial answer.<br />Select 1 = Fits the assessment criteria; Select 0 = Does not fit the criteria; participant is well.</h3>
		1. Do you worry? In the past month? 过去一个月内你曾经有担心过吗？<br /><br />Assessment: Admits to worrying in past month
		<RadioField name="geriEbasDepQ1" label="Geri - EBAS-DEP Q1"/>
		Answer for Q1: 
		<TextField name="geriEbasDepQ2" label="Geri - EBAS-DEP Q2"/>
		2. Have you been sad or depressed in the past month? 过去一个月内你曾经伤心或忧郁过吗？<br /><br /><br />Assessment: Has had sad or depressed mood during the past month 
		<RadioField name="geriEbasDepQ3" label="Geri - EBAS-DEP Q3"/>
		Answer for Q2: 
		<TextField name="geriEbasDepQ4" label="Geri - EBAS-DEP Q4"/>
		3. During the past month have you ever felt that life was not worth living? 近一个月来你曾经觉得生活毫无意义（无价值）吗？<br /><br />Assessment: Has felt that life was not worth living at some time during the past month 
		<RadioField name="geriEbasDepQ5" label="Geri - EBAS-DEP Q5"/>
		Answer for Q3: 
		<TextField name="geriEbasDepQ6" label="Geri - EBAS-DEP Q6"/>
		4. How do you feel about your future? What are your hopes for the future? 你觉得自己的前途怎样？你对前途有何希望？<br /><br /><br />Assessment: Pessimistic about the future or has empty expectations (i.e. nothing to look forward to)
		<RadioField name="geriEbasDepQ7" label="Geri - EBAS-DEP Q7"/>
		Answer for Q4: 
		<TextField name="geriEbasDepQ8" label="Geri - EBAS-DEP Q8"/>
		5. Do you enjoy things as much as you used to - say like you did a year ago? 你对东西的喜爱是否与往常一样，比如说与一年前一样？<br /><br />Assessment: Less enjoyment in activities than a year previously 
		<RadioField name="geriEbasDepQ9" label="Geri - EBAS-DEP Q9"/>
		Answer for Q5: 
		<TextField name="geriEbasDepQ10" label="Geri - EBAS-DEP Q10"/>
		<h3>If question 5 rated 0, then automatically rate 0 for question 6 and skip to question 7. If question 5 rated 1, proceed to question 6.</h3>
		6. Is it because you are depressed or nervous that you don't enjoy things as much? 是不是因为你的忧郁或者精神紧张使得你对东西的喜爱大不如前？<br /><br />Assessment: Loss of enjoyment because of depression/nervousness 
		<RadioField name="geriEbasDepQ11" label="Geri - EBAS-DEP Q11"/>
		Answer for Q6: 
		<TextField name="geriEbasDepQ12" label="Geri - EBAS-DEP Q12"/>
		7. In general, how happy are you? (Read out) <br />Are you - very happy - fairly happy - not very happy or not happy at all? <br />一般来说，你有何等的快乐? <br />你是 :  很快乐   快乐   不很快乐 或   毫无快乐？<br /><br />Assessment: Not very happy or not happy at all / 不很快乐 或   毫无快乐
		<RadioField name="geriEbasDepQ13" label="Geri - EBAS-DEP Q13"/>
		Answer for Q7: 
		<TextField name="geriEbasDepQ14" label="Geri - EBAS-DEP Q14"/>
		8. During the past month have you ever felt that you would rather be dead? 过去一个月内，你曾有时觉得生不如死？ <br /><br />Assessment: Has wished to be dead at any time during past month 
		<RadioField name="geriEbasDepQ15" label="Geri - EBAS-DEP Q15"/>
		Answer for Q8: 
		<TextField name="geriEbasDepQ16" label="Geri - EBAS-DEP Q16"/>
		<h3>A score of 3 or greater indicates the probable presence of a depressive disorder which may need treatment and the patient should be assessed in more detail. Please refer to Social Support if score is 3 OR GREATER.</h3>
		To be referred for social support (failed EBAS-DEP) - from Geriatrics EBAS
		<RadioField name="geriEbasDepQ17" label="Geri - EBAS-DEP Q17"/>
		To be referred for social support (for potential financial/ family difficulties) - from Geriatrics EBAS
		<RadioField name="geriEbasDepQ18" label="Geri - EBAS-DEP Q18"/>
		Reasons for referral to social support - from Geriatrics EBAS:
		<LongTextField name="geriEbasDepQ19" label="Geri - EBAS-DEP Q19" />
		<h2>IF THE PATIENT NEEDS TO GO TO SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</h2>
		
	</Fragment>

  )