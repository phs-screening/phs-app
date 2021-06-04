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
	feedbackFormQ1: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ2: {
		type: Array, optional: false
		}, "feedbackFormQ2.$": {
		type: String, allowedValues: ["I am concerned about my health 我关心自己的健康", "I have never been screened before 我从未经过身体检查", "Friends/family told me to come 朋友/家人劝我应该参与", "There is a free health screening 这项身体检验是免费的", "There is a free goodie bag 活动有赠送礼包", "I was drawn by the exhibition booths 我被健康展览所吸引", "I was drawn by the carnival 我被嘉年华会所吸引", "I was drawn to the crowd 我被人群所吸引", "It is conveniently located 活动地点对我很方便", "It is at a convenient timing 活动时间对我很方便", "Others (please specify) 其他原因：(请注明)"]
		}, feedbackFormQ3: {
		type: String, optional: true
		}, feedbackFormQ4: {
		type: String, allowedValues: ["Yes 是", "No 否"], optional: false
		}, feedbackFormQ5: {
		type: String, allowedValues: ["NIL", "Only once (Today) 一次而已 （今天）", "Two Times 两次", "Thrice 三次", "Four Times 四次", "Five Times (五次）", "Six Times (六次）", "Seven or more times (七次以上）"], optional: false
		}, feedbackFormQ6: {
		type: String, allowedValues: ["Yes 是", "No 否"], optional: false
		}, feedbackFormQ7: {
		type: String, allowedValues: ["Not Applicable", "In the past month 这个月", "In the past year 今年内", "2-3 years ago 两到三年前", ">4 years ago 多过四年前"], optional: false
		}, feedbackFormQ8: {
		type: String, allowedValues: ["Never 没做过", "Infrequent 不经常", "1 in 3 years 三年一次", "1 in 2 years 两年一次", "Once a year 每年一次", "More than once a year 每年多于一次"], optional: false
		}, feedbackFormQ9: {
		type: String, allowedValues: ["No I am unaware of other screenings 没有", "Community Centre (CC) 民众俱乐部（CC）", "Polyclinic 综合诊疗所", "GP clinic 私人诊所", "Others (Pls specify) 其他（请注明）_____________"], optional: false
		}, feedbackFormQ10: {
		type: String, optional: true
		}, feedbackFormQ11: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ12: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ13: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ14: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ15: {
		type: Array, optional: false
		}, "feedbackFormQ15.$": {
		type: String, allowedValues: ["Expensive  太贵", "Too Far 太远", "Too time consuming 太费时间"]
		}, feedbackFormQ16: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ17: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ18: {
		type: String, optional: true
		}, feedbackFormQ19: {
		type: String, optional: true
		}, feedbackFormQ20: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意", "Not applicable 不适用"], optional: false
		}, feedbackFormQ21: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ22: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ23: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ24: {
		type: String, optional: true
		}, feedbackFormQ25: {
		type: String, optional: true
		}, feedbackFormQ26: {
		type: String, allowedValues: ["Strongly Agree 非常同意", "Agree 同意", "Disagree 不同意", "Strongly Disagree 非常不同意"], optional: false
		}, feedbackFormQ27: {
		type: Array, optional: false
		}, "feedbackFormQ27.$": {
		type: String, allowedValues: ["Happened to pass by 刚好经过", "Posters, banners 海报/旗帜", "PHS Facebook Page 公共健康服务官方脸书", "Community Centre (CC) 社区中心（CC）", "SMS Reminder (简讯）", "PHS Instagram 公共健康服务 Instagram", "Door-to-Door Publicity 义工上门宣传", "Lamp post banners 路灯上的海报", "PHS Website (www.publichealthservice.org) 公共健康服务官方网站", "Newspaper 报纸", "Others (Please specify) 其他（请注明）"]
		}, feedbackFormQ28: {
		type: String, optional: true
		}, feedbackFormQ29: {
		type: String, allowedValues: ["Yes", "No", "Did not receive brochure"], optional: true
		}, feedbackFormQ30: {
		type: String, optional: true
		}, feedbackFormQ31: {
		type: String, optional: true
		}
	}
)

export const layout = (
    <Fragment>
		<h2>PHS 2019 Screening Feedback Form <br />公共健康服务 2019 检验反馈表</h2>
		<h3>We would like to know how you felt about our health screening, as well as how you came to know about it :) Your feedback will go a long way in helping us improve our event!<br /> 我们想寻求您对我们公共健康服务 2019 的感受，并且告诉我们您在什么情况下得知这活动的详情! </h3>
		1. I have had a good experience at the PHS 2019 screening.<br /> 我在公共健康服务 2019 中有良好的体验。
		<RadioField name="feedbackFormQ1" label="Feedback Form Q1"/>
		<h3>2. We would like to find out some of the reasons why you came for the PHS 2019 screening. Select all that apply. <br />我们想寻求一些关于您参与此活动的原因</h3>
		a. I came for PHS 2019 because<br /> 我会参与此活动因为
		<SelectField name="feedbackFormQ2" checkboxes="true" label="Feedback Form Q2" />
		Please Specify for "Others" 请注明:
		<TextField name="feedbackFormQ3" label="Feedback Form Q3"/>
		3a.Have you been to PHS before? <br />您是否来过公共健康服务？
		<RadioField name="feedbackFormQ4" label="Feedback Form Q4"/>
		b. If yes, how many times have you been to PHS screening? (including this year) <br />若有，您来过几次？(包括今年）
		<RadioField name="feedbackFormQ5" label="Feedback Form Q5"/>
		4. Have you been to other health screenings/checkups before? <br />您有没有参加过其他的健康检查？
		<RadioField name="feedbackFormQ6" label="Feedback Form Q6"/>
		5. When was your last screening/checkup done? <br />您最近的健康检查是几时做的？
		<RadioField name="feedbackFormQ7" label="Feedback Form Q7"/>
		6. How often do you have a health screening?  <br />您多久会进行一次健康检查？
		<RadioField name="feedbackFormQ8" label="Feedback Form Q8"/>
		7. Are you aware of other screening programmes in your community?<br /> 您是否对社区里的其他健康检查有所认识？
		<RadioField name="feedbackFormQ9" label="Feedback Form Q9"/>
		Please Specify for "Others" 请注明:
		<TextField name="feedbackFormQ10" label="Feedback Form Q10"/>
		<h3>8. We would like to find out more about your health beliefs and knowledge. <br />我们想寻求关于您的健康价值观以及健康知识。</h3>
		a. I think I am at risk of getting cancer (colorectal/ breast/ cervical)<br />我认为我有可能患上癌症（大肠癌/乳癌/子宫颈癌）
		<RadioField name="feedbackFormQ11" label="Feedback Form Q11"/>
		b. I think I am at risk of getting chronic diseases <br />我认为我有可能患上慢性疾病 
		<RadioField name="feedbackFormQ12" label="Feedback Form Q12"/>
		c. It is important to me to detect chronic diseases and cancer early <br />我认为早期发现慢性疾病与癌症很重要
		<RadioField name="feedbackFormQ13" label="Feedback Form Q13"/>
		d. I think that health screening is essential to detect chronic diseases and cancer early <br />为了早期发现慢性疾病/癌症，参加健康检查是必须的
		<RadioField name="feedbackFormQ14" label="Feedback Form Q14"/>
		e. I think that going for health screening is (can tick >1 option)<br /> 我认为参加健康检查... （可以选择>1个选项）
		<SelectField name="feedbackFormQ15" checkboxes="true" label="Feedback Form Q15" />
		<h3>9. We would like to find out more about how you felt about our student volunteers.<br /> 您对我们学生义工们的表现有所看法？</h3>
		a. The student volunteers attended to my needs <br />学生义工们有做足我的需求
		<RadioField name="feedbackFormQ16" label="Feedback Form Q16"/>
		b. The student volunteers were well-trained <br />学生义工们有受够专业训练
		<RadioField name="feedbackFormQ17" label="Feedback Form Q17"/>
		c. Others (Please specify) <br />其他意见（请注明）
		<LongTextField name="feedbackFormQ18" label="Feedback Form Q18" />
		10. Do you have any suggestions on how our student volunteers can improve? <br />您有没有建议让我们的学生义工进步？
		<LongTextField name="feedbackFormQ19" label="Feedback Form Q19" />
		<h3>11. Do let us know how you felt about the operational aspects of the screening<br />. 您对此健康检查的执行方式有任何评语？</h3>
		a. The SMS system at the queue was beneficial to me<br /> 排队时使用的简讯系统对我有所帮助
		<RadioField name="feedbackFormQ20" label="Feedback Form Q20"/>
		b. The waiting time to enter the screening was reasonable<br /> 我对等候参与身体检查的时间感到合理
		<RadioField name="feedbackFormQ21" label="Feedback Form Q21"/>
		c. The waiting time for each station was reasonable<br /> 我对身体检查中各检查站的等候时间感到合理
		<RadioField name="feedbackFormQ22" label="Feedback Form Q22"/>
		d. The flow of the screening was easy to follow <br />身体检查的流程易人遵循
		<RadioField name="feedbackFormQ23" label="Feedback Form Q23"/>
		e. Others (Please specify) <br />其他意见（请注明）
		<TextField name="feedbackFormQ24" label="Feedback Form Q24"/>
		12. What else do you think PHS should screen for? <br />您认为公共健康服务还可以检查那些其他的疾病？
		<TextField name="feedbackFormQ25" label="Feedback Form Q25"/>
		13. I would recommend my family and/or friends to come for the PHS 2019 screening. <br />我会推荐家人与朋友来参与公共健康服务 2019 的身体检查。
		<RadioField name="feedbackFormQ26" label="Feedback Form Q26"/>
		14. How did you come to know of the PHS 2019 screening? Select all that apply. <br />您如何认知此活动的智讯？（请在所有适当的空格中打勾）<br />
		<SelectField name="feedbackFormQ27" checkboxes="true" label="Feedback Form Q27" />
		Please Specify for "Others" 请注明:
		<TextField name="feedbackFormQ28" label="Feedback Form Q28"/>
		15. If you have been contacted for Door-to-Door Publicity, did you learn about healthy ageing/metabolic syndrome through our volunteers/brochure? <br />若您有遇见义工上门宣传您是否从义工们/健康宣传册中学到更多关于健康老龄化/代谢综合症的相关知识？
		<RadioField name="feedbackFormQ29" label="Feedback Form Q29"/>
		16. What else do you want to learn more about through PHS?<br />您还有什么想更加了解/更深入学习的东西吗？
		<TextField name="feedbackFormQ30" label="Feedback Form Q30"/>
		17. Any other feedback? <br />您有其他的意见吗？
		<LongTextField name="feedbackFormQ31" label="Feedback Form Q31" />
		<h2>Thank you for completing this survey! :) <br />谢谢您为我们提供您宝贵的意见！</h2>
		
	</Fragment>

  )