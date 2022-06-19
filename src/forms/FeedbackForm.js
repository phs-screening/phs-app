import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import {
  TextField,
  SelectField,
  RadioField,
  LongTextField
} from 'uniforms-material';
import { calculateBMI, submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { getSavedData, getSavedPatientData } from "../services/mongoDB";
import allForms from "./forms.json";
import { bold, underlined, blueText, underlinedWithBreak } from 'src/theme/commonComponents.js';

const schema = new SimpleSchema({
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

const formName = "feedbackForm"
const FeedbackForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [loadingPrevData, isLoadingPrevData] = useState(true);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState(null);

  // All the forms 
  const [details, setDetails] = useState({})
  const [hcsr, setHcsr] = useState({})
  const [nss, setNss] = useState({})
  const [social, setSocial] = useState({})
  const [vision, setVision] = useState({})
  const [cancer, setCancer] = useState({})
  const [fit, setFit] = useState({})
  const [wce, setWce] = useState({})
  const [patients, setPatients] = useState({})
  const [geriPtConsult, setGeriPtConsult] = useState({})
  const [geriOtConsult, setGeriOtConsult] = useState({})
  const [socialService, setSocialService] = useState({})
  const [doctorSConsult, setDoctorSConsult] = useState({})

  const navigate = useNavigate();
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName);
    const loadPastForms = async () => {
        const hcsrData = await getSavedData(patientId, allForms.hxHcsrForm);
        const nssData = await getSavedData(patientId, allForms.hxNssForm);
        const socialData = await getSavedData(patientId, allForms.hxSocialForm);
        const cancerData = await getSavedData(patientId, allForms.hxCancerForm);
		const visionData = await getSavedData(patientId, allForms.geriVisionForm)
		const fitData = await getSavedData(patientId, allForms.fitForm)
		const wceData = await getSavedData(patientId, allForms.wceForm)
		const patientsData = await getSavedPatientData(patientId, 'patients')
		const geriPtConsultData = await getSavedData(patientId, allForms.geriPtConsultForm)
		const geriOtConsultData = await getSavedData(patientId, allForms.geriOtConsultForm)
		const socialServiceData = await getSavedData(patientId, allForms.socialServiceForm)
		const doctorConsultData = await getSavedData(patientId, allForms.doctorConsultForm)

        setHcsr(hcsrData)
        setNss(nssData)
		setVision(visionData)
        setSocial(socialData)
        setCancer(cancerData)
		setFit(fitData)
		setWce(wceData)
		setPatients(patientsData)
		setGeriPtConsult(geriPtConsultData)
		setGeriOtConsult(geriOtConsultData)
		setSocialService(socialServiceData)
		setDoctorSConsult(doctorConsultData)

        isLoadingPrevData(false);
    }
    setSaveData(savedData)
    loadPastForms();
  }, [])
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          isLoading(true);
          const response = await submitForm(model, patientId, formName);
          if (response.result) {
            isLoading(false);
            setTimeout(() => {
              alert("Successfully submitted form");
              navigate('/app/dashboard', { replace: true });
            }, 80);
          } else {
            isLoading(false);
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`);
            }, 80);
          }
        }}
        model={saveData}
      >

        <Fragment>
          <h2>PHS 2022 Screening Feedback Form
            <br />公共健康服务 2021 检验反馈表</h2>
          <h3>We would like to know how you felt about our health screening, as well as how you came to know about it :) Your feedback will go a long way in helping us improve our event!
            <br /> 我们想寻求您对我们公共健康服务 2019 的感受，并且告诉我们您在什么情况下得知这活动的详情! </h3>
          1. I have had a good experience at the PHS 2019 screening.<br /> 我在公共健康服务 2019 中有良好的体验。
          <RadioField name="feedbackFormQ1" label="Feedback Form Q1" />
          <h3>2. We would like to find out some of the reasons why you came for the PHS 2019 screening. Select all that apply.
            <br />我们想寻求一些关于您参与此活动的原因</h3>
          a. I came for PHS 2019 because
          <br /> 我会参与此活动因为
          <br />
          <SelectField name="feedbackFormQ2" checkboxes="true" label="Feedback Form Q2" />
          <br />
          Please Specify for "Others" 请注明:
          <TextField name="feedbackFormQ3" label="Feedback Form Q3" />
          3a.Have you been to PHS before?
          <br />您是否来过公共健康服务？
          <RadioField name="feedbackFormQ4" label="Feedback Form Q4" />
          b. If yes, how many times have you been to PHS screening? (including this year)
          <br />若有，您来过几次？(包括今年）
          <RadioField name="feedbackFormQ5" label="Feedback Form Q5" />
          4. Have you been to other health screenings/checkups before?
          <br />您有没有参加过其他的健康检查？
          <RadioField name="feedbackFormQ6" label="Feedback Form Q6" />
          5. When was your last screening/checkup done?
          <br />您最近的健康检查是几时做的？
          <RadioField name="feedbackFormQ7" label="Feedback Form Q7" />
          6. How often do you have a health screening?
          <br />您多久会进行一次健康检查？
          <RadioField name="feedbackFormQ8" label="Feedback Form Q8" />
          7. Are you aware of other screening programmes in your community?
          <br /> 您是否对社区里的其他健康检查有所认识？
          <RadioField name="feedbackFormQ9" label="Feedback Form Q9" />
          Please Specify for "Others" 请注明:
          <TextField name="feedbackFormQ10" label="Feedback Form Q10" />
          <h3>8. We would like to find out more about your health beliefs and knowledge.
            <br />我们想寻求关于您的健康价值观以及健康知识。</h3>
          a. I think I am at risk of getting cancer (colorectal/ breast/ cervical)
          <br />我认为我有可能患上癌症（大肠癌/乳癌/子宫颈癌）
          <RadioField name="feedbackFormQ11" label="Feedback Form Q11" />
          b. I think I am at risk of getting chronic diseases
          <br />我认为我有可能患上慢性疾病
          <RadioField name="feedbackFormQ12" label="Feedback Form Q12" />
          c. It is important to me to detect chronic diseases and cancer early
          <br />我认为早期发现慢性疾病与癌症很重要
          <RadioField name="feedbackFormQ13" label="Feedback Form Q13" />
          d. I think that health screening is essential to detect chronic diseases and cancer early
          <br />为了早期发现慢性疾病/癌症，参加健康检查是必须的
          <RadioField name="feedbackFormQ14" label="Feedback Form Q14" />
		      e. I think that going for health screening is (can tick >1 option)
          <br /> 我认为参加健康检查... （可以选择>1个选项）
          <br />
          <SelectField name="feedbackFormQ15" checkboxes="true" label="Feedback Form Q15" />
          <h3>9. We would like to find out more about how you felt about our student volunteers.
            <br /> 您对我们学生义工们的表现有所看法？</h3>
          a. The student volunteers attended to my needs
          <br />学生义工们有做足我的需求
          <RadioField name="feedbackFormQ16" label="Feedback Form Q16" />
          b. The student volunteers were well-trained
          <br />学生义工们有受够专业训练
          <RadioField name="feedbackFormQ17" label="Feedback Form Q17" />
          c. Others (Please specify)
          <br />其他意见（请注明）
          <LongTextField name="feedbackFormQ18" label="Feedback Form Q18" />
          10. Do you have any suggestions on how our student volunteers can improve?
          <br />您有没有建议让我们的学生义工进步？
          <LongTextField name="feedbackFormQ19" label="Feedback Form Q19" />
          <h3>11. Do let us know how you felt about the operational aspects of the screening.
            <br />您对此健康检查的执行方式有任何评语？</h3>
          a. The SMS system at the queue was beneficial to me
          <br /> 排队时使用的简讯系统对我有所帮助
          <RadioField name="feedbackFormQ20" label="Feedback Form Q20" />
          b. The waiting time to enter the screening was reasonable
          <br /> 我对等候参与身体检查的时间感到合理
          <RadioField name="feedbackFormQ21" label="Feedback Form Q21" />
          c. The waiting time for each station was reasonable
          <br /> 我对身体检查中各检查站的等候时间感到合理
          <RadioField name="feedbackFormQ22" label="Feedback Form Q22" />
          d. The flow of the screening was easy to follow
          <br />身体检查的流程易人遵循
          <RadioField name="feedbackFormQ23" label="Feedback Form Q23" />
          e. Others (Please specify) <br />其他意见（请注明）
          <TextField name="feedbackFormQ24" label="Feedback Form Q24" />
          12. What else do you think PHS should screen for?
          <br />您认为公共健康服务还可以检查那些其他的疾病？
          <TextField name="feedbackFormQ25" label="Feedback Form Q25" />
          13. I would recommend my family and/or friends to come for the PHS 2019 screening.
          <br />我会推荐家人与朋友来参与公共健康服务 2019 的身体检查。
          <RadioField name="feedbackFormQ26" label="Feedback Form Q26" />
          14. How did you come to know of the PHS 2019 screening? Select all that apply.
          <br />您如何认知此活动的智讯？（请在所有适当的空格中打勾）
          <br />
          <SelectField name="feedbackFormQ27" checkboxes="true" label="Feedback Form Q27" />
          <br />Please Specify for "Others" 请注明:
          <TextField name="feedbackFormQ28" label="Feedback Form Q28" />
          15. If you have been contacted for Door-to-Door Publicity, did you learn about healthy ageing/metabolic syndrome through our volunteers/brochure?
          <br />若您有遇见义工上门宣传您是否从义工们/健康宣传册中学到更多关于健康老龄化/代谢综合症的相关知识？
          <RadioField name="feedbackFormQ29" label="Feedback Form Q29" />
          16. What else do you want to learn more about through PHS?
          <br />您还有什么想更加了解/更深入学习的东西吗？
          <TextField name="feedbackFormQ30" label="Feedback Form Q30" />
          17. Any other feedback?
          <br />您有其他的意见吗？
          <LongTextField name="feedbackFormQ31" label="Feedback Form Q31" />
          <h2>Thank you for completing this survey! :)
            <br />谢谢您为我们提供您宝贵的意见！</h2>
          <br />

        </Fragment>


        <ErrorsField />
        <div>
          {loading ? <CircularProgress />
          : <SubmitField inputRef={(ref) => {}} />}
        </div>

        <br /><Divider />
      </AutoForm>
    );

    return (
      <Paper elevation={2} pt={0} m={0}>
		{loadingPrevData ? <CircularProgress/>
		:
		<Box m={6} pt={3}>
		<div>
			{bold("Form Summary")}
			{bold("Please make sure that the information is correct.")}

			<br></br>
			{bold("1. Personal Particulars")}
			{underlined("Name")}
			{patients ? blueText(patients.initials) : '-'}
			<br></br>
			{underlined("Gender")}
			{patients ? blueText(patients.gender) : '-'}
			<br></br>
			{underlined("NRIC")}
			{patients ? blueText(patients.abbreviatedNric) : '-'}

			<br></br>
			{bold("2. Health Concerns")}
			{underlined("Participant's presenting complaints/concerns (if any)")}
			{hcsr ? blueText(hcsr.hxHcsrQ2) : '-'}

			<br></br>
			{bold("3. Blood Pressure")}
			{underlined("Average Blood Pressure (Systolic)")}
			{cancer ? blueText(cancer.hxCancerQ17) : '-'}
			<br></br>
			{underlined("Average Blood Pressure (Diastolic)")}
			{cancer ? blueText(cancer.hxCancerQ18) : '-'}

			<br></br>
			{bold("4. BMI")}
			{underlined("BMI")}
			{cancer ? blueText(calculateBMI(Number(cancer.hxCancerQ19), Number(cancer.hxCancerQ20))) : '-'}

			<br></br>
			{bold("5. Hx Taking")}
			{underlined("Height (in cm)")}
			{cancer ? blueText(cancer.hxCancerQ19) : '-'}
			<br></br>
			{underlined("Weight (in kg)")}
			{cancer ? blueText(cancer.hxCancerQ20) : '-'}
			<br></br>
			{underlined("Waist circumferences (in cm)")}
			{cancer ? blueText(cancer.hxCancerQ24) : '-'}

			<br></br>
			{bold("6. Incontinence")}
			{underlined("Do you have any problem passing urine or motion? Please specify if yes.")}
			{hcsr ? blueText(hcsr.hxHcsrQ4) : '-'}
			{hcsr ? blueText(hcsr.hxHcsrQ5) : '-'}

			<br></br>
			{bold("7. Vision")}
			{underlined("Do you have any vision problems? Please specify if yes")}
			{hcsr ? blueText(hcsr.hxHcsrQ6) : '-'}
			{hcsr ? blueText(hcsr.hxHcsrQ7) : '-'}

			<br></br>
			{bold("8. Geriatrics")}
			{underlined("Visual acuity (w/o pinhole occluder) - Right Eye 6/" + blueText(vision.geriVisionQ3))}
			<br></br>
			{underlined("Visual acuity (w/o pinhole occluder) - Left Eye 6/" + blueText(vision.geriVisionQ4))}
			<br></br>
			{underlined("Visual acuity (with pinhole occluder) - Right Eye 6/" + blueText(vision.geriVisionQ5))}
			<br></br>
			{underlined("Visual acuity (with pinhole occluder) - Left Eye 6/" + blueText(vision.geriVisionQ6))}

			<br></br>
			{bold("9. Hearing")}
			{underlined("Do you have any hearing problems? Please specify if yes.")}
			{hcsr ? blueText(hcsr.hxHcsrQ8) : '-'}
			{hcsr ? blueText(hcsr.hxHcsrQ9) : '-'}

			<br></br>
			{bold("10. Past Medical History")}
			{underlined("Summary of participant's past medical history")}
			{nss ? blueText(nss.hxNssQ12) : '-'}
			
			<br></br>
			{bold("11. Social History")}
			{underlined("Do you smoke?")}
			{nss ? blueText(nss.hxNssQ14) : '-'}
			<br></br>
			{underlined("Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor, a can or bottle of beer, or a glass of wine.)")}
			{nss ? blueText(nss.hxNssQ15) : '-'}

			<br></br>
			{bold("12. FIT kits")}
			{underlined("Was the participant isseud 2 FIT kits")}
			{fit ? blueText(fit.wceQn2) : '-'}

			<br></br>
			{bold("13. WCE Station")}
			{underlined("Indicated interest for HPV Test under SCS?")}
			{wce ? blueText(wce.wceQ4) : '-'}
			<br></br>
			{underlined("Indicated interest for Mammogram under SCS?")}
			{wce ? blueText(wce.wceQ5) : '-'}
			<br></br>
			{underlined("Registered for Mammogram under NHGD?")}
			{wce ? blueText(wce.wceQ6) : '-'}

			<br></br>
			{bold("14. Geriatrics")}
			{underlined("Was the participant referred for Social Service? (PT):")}
			{geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ4) : '-'}
			<br></br>
			{underlined("Reasons for referral to social service (PT):")}
			{geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ5) : '-'}
			<br></br>
			{underlined("Was the participant referred for Social Service? (OT):")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ4) : '-'}
			<br></br>
			{underlined("Reasons for referral to social support exhibition booth/ AIC (OT):")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ5) : '-'}
			<br></br>
			{underlined("Which of the programmes did the OT recommend for the participant to go? (if applicable)")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ6) : '-'}

			<br></br>
			{bold("15. Social Service")}
			{underlined("Did the participant visit the social service station?")}
			{socialService ? blueText(socialService.socialServiceQ1) : '-'}

			<br></br>
			{bold("16. Doctor's Consult")}
			{underlined("Did this patient consult an on-site doctor today?")}
			{doctorSConsult ? (doctorSConsult.doctorSConsultQ11 ? blueText("True") : blueText("False")) : '-'}
			<br></br>
			{underlined("Does this patient require urgent follow-up?")}
			{doctorSConsult ? (doctorSConsult.doctorSConsultQ10 ? blueText("True") : blueText("False")) : '-'}
			<br></br>
			{underlined("Doctor's memo (if applicable):")}
			{doctorSConsult ? (doctorSConsult.doctorSConsultQ3 ? blueText("True") : blueText("False")) : '-'}
			<br></br>
			{underlined("Was the patient referred to the dietitian?")}
			{doctorSConsult ? (doctorSConsult.doctorSConsultQ4 ? blueText("True") : blueText("False")) : '-'}
			<br></br>

		</div>
		</Box>
		}
        {newForm()}
      </Paper>
    );
}

FeedbackForm.contextType = FormContext;

export default function Feedbackform(props) {
  const navigate = useNavigate();
  return <FeedbackForm {...props} navigate={navigate} />;
}