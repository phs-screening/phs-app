import React, { Component, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField } from 'uniforms-material';
import { SubmitField, ErrorsField } from 'uniforms-material';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import PopupText from '../utils/popupText';

const schema = new SimpleSchema({
    fitQ1: {
        type: String, allowedValues: ["Yes", "No"], optional: false
    }, fitQ2: {
        type: String, allowedValues: ["Yes", "No"], optional: false
    }
}
)

class FitForm extends Component {
    static contextType = FormContext

    render() {
        const form_schema = new SimpleSchema2Bridge(schema);
        const {patientId, updatePatientId} = this.context;
        const { navigate } = this.props;
        const newForm = () => (
            <AutoForm
                schema={form_schema}
                onSubmit={async (model) => {
                    const response = await submitForm(model, patientId, "fitForm");
                    navigate('/app/dashboard', { replace: true });
                  }}
            >
                <Fragment>
                    <h2>PARTICIPANT IDENTIFICATION</h2>
                    <h3><span style={{color: "red"}}>Please verify participant's identity using his/her NRIC before proceeding <br />A. S/N B. Surname followed by Initials C. Last 4 characters of Participant's NRIC and Letter</span></h3>
                    <h2>1. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
                    1. <span style={{color: "red"}}><b>For respondent aged 50 and above only,</b></span> unless positive family history for colorectal cancer.<br />When was the last time you had a blood stool test? (A blood stool test is a test to determine whether the stool contains blood.)

                    <br/> <span style={{color: "green"}}>HERE IS TO PULL INFO FROM PREV QN </span><br/>

                    <br/>
                    2. <span style={{color: "red"}}><b>For respondent aged 50 and above only,</b></span> unless positive family history for colorectal cancer.<br />When was the last time you had a colonoscopy? (A colonoscopy is an examination in which a tube is inserted in the rectum to view the colon for signs of cancer or other health problems.)

                    <br/> <span style={{color: "green"}}>HERE IS TO PULL INFO FROM PREV QN </span><br/>
                    
                    <br/>
                    <h3><span style={{color: "red"}}>Please encourage participants to go for FIT every year if participant is above 50, asymptomatic and no positive family history of colorectal cancer in first degree relatives.</span> </h3>
                    <br/>
                    Does participant have a history of cancer or his/her family history requires further scrutiny by doctors? <span style={{color: "red"}}><b>(If indicated 'Yes', please refer to doctor's consult by following the steps below.)</b></span>
                    <RadioField name="fitQ1" label="FIT Q1" />
                    <PopupText qnNo="fitQ1" triggerValue="Yes"> 
                        <b>REFER TO DR CONSULT</b> by indicating on: <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation
                    </PopupText>
                    3. Was participant issued 2 FIT kits?
                    <RadioField name="fitQ2" label="FIT Q2" />

                </Fragment>

                <ErrorsField />
                <div>
                    <SubmitField inputRef={(ref) => this.formRef = ref} />
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
}

FitForm.contextType = FormContext;

export default function Fitform(props) {
  const navigate = useNavigate();

  return <FitForm {...props} navigate={navigate} />;
}
