import React, {Fragment} from 'react';
import SimpleSchema from 'simpl-schema';

//import { AutoForm } from 'uniforms';
import {
	TextField,
	SelectField,
	RadioField,
	BoolField,
	LongTextField
  } from 'uniforms-material';

export const schema = new SimpleSchema({
	registrationQ1: {
		defaultValue: "Mr",
	type: String, allowedValues: ["Mr", "Ms", "Mrs", "Dr"], optional: false,
	}, registrationQ2: {
	type: String, allowedValues: ["Chinese 华裔", "Malay 巫裔", "Indian 印裔", "Eurasian 欧亚裔", "Others 其他"], optional: false
	}, registrationQ3: {
	type: String, allowedValues: ["Singapore Citizen 新加坡公民", "Singapore Permanent Resident (PR) \n新加坡永久居民"], optional: false
	}, registrationQ4: {
	type: String, allowedValues: ["Single 单身", "Married 已婚", "Widowed 已寡", "Separated 已分居", "Divorced 已离婚"], optional: false
	}, registrationQ5: {
	type: String, optional: false
	}, registrationQ6: {
	type: String, allowedValues: ["Buki Batok East", "Clementi", "Yuhua", "Central Jurong", "Taman Jurong", "Jurong Spring", "Others"], optional: false
	}, registrationQ7: {
	type: String, allowedValues: ["Below 1,100 per month (少于 1,100)", "1,100 - 1,799 per month (每月1,100 - 1,799)", "1,800 - 2,799 per month (每月1,800 - 2,799)", "2,800 & above (2,800 或以上)"], optional: false
	}, registrationQ8: {
	type: String, allowedValues: ["CHAS Orange", "CHAS Green", "CHAS Blue", "No CHAS"], optional: false
	}, registrationQ9: {
	type: String, allowedValues: ["Pioneer generation card holder", "Merdeka generation card holder"], optional: false
	}, registrationQ10: {
	type: String, allowedValues: ["Bukit Batok Medical Clinic \nBlk 207 Bukit Batok Street 21, #01-114", "Kang An Clinic\nBlk 644 Bukit Batok Central,\xa0#01-70", "Lai Medical Clinic\nBlk 213 Bukit Batok Street 21, #01-209", "Lakeside Family Clinic\n518A Jurong West St 52 # 01-02", "Boon Lay Corporation Clinic\nBlk 350 Jurong East Ave 1, #01-1225", "EJ. Tan Clinic & Surgery\nBlk 104 Jurong East Street 13, #01-100", "Frontier Family Medicine Clinic\n#04-01 Grantral Mall @ Clementi\n3151 Commonwealth Ave West"], optional: true
	}, registrationQ11: {
	type: String, allowedValues: ["English", "Mandarin", "Malay", "Tamil"], optional: false
	}, registrationQ12: {
	type: Boolean, label: "I have read and acknowledged the eligibility criteria for Phlebotomy. 我知道抽血的合格标准。", optional: false
	}, registrationQ13: {
	type: Boolean, label: "I agree and consent to the above.", optional: false
	}, registrationQ14: {
	type: String, optional: true
	}
	}
)

export const layout = (
    <Fragment>
		<h2>Registration</h2>
		<br />
		Salutation 称谓
		<SelectField name="registrationQ1"/>
		<br />
		Race 种族
		<RadioField name="registrationQ2"/>
		<LongTextField name="registrationQ14" />
		<br />
		Nationality 国籍 <br />Please Note: Non Singapore Citizens/ Non-PRs are unfortunately not eligible for this health screening
		<RadioField name="registrationQ3" />
		<br/>
		Marital Status 婚姻状况
		<SelectField name="registrationQ4" />
		<br />
		Occupation 工作
		<TextField name="registrationQ5" />
		<br />
		GRC/SMC Subdivision [https://www.parliament.gov.sg/mps/find-my-mp]
		<SelectField name="registrationQ6" />
		<br/>
		Household Income Per Capita
		<SelectField name="registrationQ7" />
		<br />
		CHAS Status 社保援助计划
		<SelectField name="registrationQ8" />
		<br />
		Pioneer Generation Status 建国一代配套
		<RadioField name="registrationQ9" />
		<br />
		<h2>Follow up at GP Clinics</h2>
		Your Health Report & Blood Test Results (if applicable) will be mailed out about 4-6 weeks after the screening.  Depending on your results, our team may shortlist you for further follow-up.<br />Scenario 1: If no follow-up is required, the report will be mailed directly to you.<br />Scenario 2: If follow-up is required, you will need to visit a GP clinic to collect your report. <br />Please choose a preferred GP Clinic from the following list in case of Scenario 2.
		<RadioField name="registrationQ10" />
		<br />
		Preferred Language for Health Report
		<RadioField name="registrationQ11" />
		<br />
		<h2>Phlebotomy Eligibility</h2>
		Before entering our screening, do note the following eligibility criteria for Phlebotomy <br />1) Fasted for minimum 10 hours <br />          Note: Water is allowed, coffee/tea is not. Medications are fine. <br />2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.<br />3) Have not done a blood test within 1 year.<br /><br />Rationale: PHS aims to reach out to undiagnosed people. Patients that are already aware of their condition would have regular follow-ups with the GPs/polyclinics/hospitals. This information is available in our publicity material. Please approach our registration volunteers should you have any queries. We are happy to explain further. Thank you!<br /><br />抽血合格标准:<br />1) 十个小时内没有吃东西或喝饮料. 可以喝水, 吃药。不能喝咖啡, 喝茶。<br />2) 在过去的一年内沒有验过血。<br />3) 没有糖尿病, 高血压, 高胆固醇。
		<BoolField name="registrationQ12" />
		<br />
		<h2>Compliance to PDPA 同意书</h2>
		I hereby give my consent to the Public Health Service Executive Committee to collect my personal information for the purpose of participating in the Public Health Service (hereby called “PHS”) and its related events, and to contact me via calls, SMS, text messages or emails regarding the event and follow-up process.  <br /><br />Should you wish to withdraw your consent for us to contact you for the purposes stated above, please notify a member of the PHS Executive Committee at ask.phs@gmail.com in writing. We will then remove your personal information from our database. Please allow 3 business days for your withdrawal of consent to take effect. All personal information will be kept confidential, will only be disseminated to members of the PHS Executive Committee, and will be strictly used by these parties for the purposes stated. 
		<BoolField name="registrationQ13" />
		
	</Fragment>
  )