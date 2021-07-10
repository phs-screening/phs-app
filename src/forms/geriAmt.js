import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { TextField, RadioField } from 'uniforms-material';


export const schema = new SimpleSchema({
	geriAmtQ1: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ2: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ3: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ4: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ5: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ6: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ7: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ8: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ9: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ10: {
		type: Boolean, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ11: {
		type: String, allowedValues: ["0 to 6 years of education", "More than 6 years of education"], optional: false
		}, geriAmtQ12: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}, geriAmtQ13: {
		type: Boolean, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

export const layout = (
    <Fragment>
		<h2>1.1 ABBREVIATED MENTAL TEST (for dementia)</h2>
		<h3>Please select ‘Yes’ if participant answered correctly or ‘No’ if participant answered incorrectly.</h3>
		<h3>1) What is the year? 请问今是什么年份？</h3>
		Was Q1 answered correctly?
		<RadioField name="geriAmtQ1" />
		<h3>2) About what time is it? (within 1 hour) 请问现在大约是几点钟 （一在一个小时之内）？</h3>
		Was Q2 answered correctly?
		<RadioField name="geriAmtQ2" />
		<h3>Ask volunteer to memorise memory phase: “ 37 Bukit Timah Road ”<br />请您记住以下这个地址，<br />我将在数分钟后要您重复一遍：37 号， 武吉支马路<br /></h3>
		<h3>3) What is your age? 请问您今年几岁？</h3>
		Was Q3 answered correctly?
		<RadioField name="geriAmtQ3" />
		<h3>4) What is your date of birth?  请问您的出生日期或生日？ • 几月 • 几号</h3>
		Was Q4 answered correctly?
		<RadioField name="geriAmtQ4" />
		<h3>5) What is your home address?<br />请问您的（住家）地址是在什么地方？<br />(1) 门牌;(2)几楼或哪一层; (3)大牌; (4)路名</h3>
		Was Q5 answered correctly?
		<RadioField name="geriAmtQ5" />
		<h3>6) Where are we now? (The name of building or the nature of the building e.g. hospital, day centre etc)<br />请问我们现在正在什么地方？（例：建筑名称或用途）</h3>
		Was Q6 answered correctly?
		<RadioField name="geriAmtQ6" />
		<h3>7) Who is our country’s Prime Minister?<br />请问新加坡现任总理是哪位？</h3>
		Was Q7 answered correctly?
		<RadioField name="geriAmtQ7" />
		<h3>8) What is his/her job? (show picture)<br />请问图片里的人士很有可能是从事哪种行业？</h3>
		Was Q8 answered correctly?
		<RadioField name="geriAmtQ8" />
		<h3>9) Count backwards from 20 to 1. 请您从二十开始，倒数到一。</h3>
		Was Q9 answered correctly?
		<RadioField name="geriAmtQ9" />
		<h3>10) Recall memory phase 请您把刚才我要您记住的地址重复一遍。</h3>
		Was Q10 answered correctly?
		<RadioField name="geriAmtQ10" />
		AMT Total Score: __/10 <TextField name="geriAmtQ11"/>
		What is your education level?
		<RadioField name="geriAmtQ11" />
		Need referral to cognitive - 2nd Tier Screening ?
		<RadioField name="geriAmtQ12" />
		Referral to cognitive - 2nd Tier Screening
		<RadioField name="geriAmtQ13" />
	</Fragment>

  )