import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import {
    SubmitField,
    ErrorsField,
    SelectField,
    RadioField,
    LongTextField,
    TextField,
    BoolField
} from 'uniforms-material';
import CircularProgress from '@material-ui/core/CircularProgress';
import { submitFormReg } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getReg18Counter, getSavedData} from "../services/mongoDB";
import './fieldPadding.css'


const formName = "registrationForm"
const RegForm = () => {
    const options = ["Bukit Batok Medical Clinic Blk 207 Bukit Batok Street 21, #01-114, S650207", "Drs Tang & Partners Pte. Ltd. Blk 64, Yung Kuang Road, #01-115, S610064", "Lai Medical Clinic Blk 213, Bukit Batok St. 21, #01-209, S650213", "Lakeside Family Medicine Clinic Blk 518A, Jurong West St. 52, #01-02, S641518", "Lee Family Clinic Pte. Ltd. Blk 762, Jurong West St 75, #02-262, S640762", "Mei Ling Clinic Blk 158, Mei Ling St, #01-80, S140158", "West Coast Clinic & Surgery Blk 772, Clementi West St. 2, #01-162, S120722" ]
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const navigate = useNavigate();
    const [saveData, setSaveData] = useState({})
    const [optionsQ10, setOptionsQ10] = useState([])

    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName, options);
        const counters = await getReg18Counter()
        if (counters !== null) {
            const seq = counters.seq
            const seqLimits = counters.seqLimits
            for (let i = 0; i < seq.length; i++) {
                seq[i] = seqLimits[i] - seq[i]
            }
            setOptionsQ10(seq)
        }
        setSaveData(savedData)
    }, [])

    const displayVacancy = optionsQ10.map((x, i) => {
        return <div>
            {options[i]}
            <b> Slots: {x}</b>
        </div>
    })

    const layout = (
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
            <p>GRC/SMC Subdivision <a href="https://www.parliament.gov.sg/mps/find-my-mp" target="_blank">[https://www.parliament.gov.sg/mps/find-my-mp]</a></p>
            <SelectField name="registrationQ6" />
            <br />
            CHAS Status 社保援助计划
            <SelectField name="registrationQ8" />
            <br />
            Pioneer Generation Status 建国一代配套
            <RadioField name="registrationQ9" />
            <br />
            <h2>Follow up at GP Clinics</h2>
            <p>Your Health Report & Blood Test Results (if applicable) will be mailed out to the GP you have selected <b>4-6 weeks</b> after the screening.</p>
            All results, included those that are normal, have to be collected from the GP clinic via an appointment
            <br/><br/>{displayVacancy}
            <RadioField name="registrationQ10" />
            <br />
            Preferred Language for Health Report
            <RadioField name="registrationQ11" />
            <br />
            <h2>Phlebotomy Eligibility</h2>
            Before entering our screening, do note the following eligibility criteria for Phlebotomy <br />1) Fasted for minimum 8 hours <br />          Note: Water is allowed, coffee/tea is not. Medications are fine. <br />2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.<br />3) Have not done a blood test within the past 3 years.<br /><br />Rationale: PHS aims to reach out to undiagnosed people. Patients that are already aware of their condition would have regular follow-ups with the GPs/polyclinics/hospitals. This information is available in our publicity material. Please approach our registration volunteers should you have any queries. We are happy to explain further. Thank you!<br /><br />抽血合格标准:<br />1) 十个小时内没有吃东西或喝饮料. 可以喝水, 吃药。不能喝咖啡, 喝茶。<br />2) 在过去的一年内沒有验过血。<br />3) 没有糖尿病, 高血压, 高胆固醇。
            <BoolField name="registrationQ12" />
            <br />
            <h2>Compliance to PDPA 同意书</h2>
            I hereby give my consent to the Public Health Service Executive Committee to collect my personal information for the purpose of participating in the Public Health Service (hereby called “PHS”) and its related events, and to contact me via calls, SMS, text messages or emails regarding the event and follow-up process.  <br /><br />Should you wish to withdraw your consent for us to contact you for the purposes stated above, please notify a member of the PHS Executive Committee at ask.phs@gmail.com in writing. We will then remove your personal information from our database. Please allow 3 business days for your withdrawal of consent to take effect. All personal information will be kept confidential, will only be disseminated to members of the PHS Executive Committee, and will be strictly used by these parties for the purposes stated.
            <BoolField name="registrationQ13" />

        </Fragment>
    )
    const form_layout = layout


    const schema = new SimpleSchema({
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
                type: String, allowedValues: ["Jurong", "Yuhua", "Bukit Batok", "Pioneer", "West Coast", "Hong Kah North", "Others"], optional: false
            }, registrationQ8: {
                type: String, allowedValues: ["CHAS Orange", "CHAS Green", "CHAS Blue", "No CHAS"], optional: false
            }, registrationQ9: {
                type: String, allowedValues: ["Pioneer generation card holder", "Merdeka generation card holder", "None"], optional: false
            }, registrationQ10: {
                type: String, allowedValues: options , optional: true
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
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))




    const newForm = () => (
      <AutoForm
        schema={form_schema}
        className="fieldPadding"
        onSubmit={async (model) => {
          isLoading(true)
          const response = await submitFormReg(model, patientId, options);
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
        {form_layout}
        <ErrorsField />
        <div>
          {loading ? <CircularProgress />
          : <SubmitField inputRef={(ref) => {}} />}
        </div>

        <br /><Divider />
      </AutoForm>
    );

    return (
      <Paper elevation={2} p={0} m={0}>
        {newForm()}
      </Paper>
    );
}

RegForm.contextType = FormContext;

export default function Regform(props) {
  const navigate = useNavigate();

  return <RegForm {...props} navigate={navigate} />;
}