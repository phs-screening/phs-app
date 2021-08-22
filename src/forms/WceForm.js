import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, SelectField, RadioField } from 'uniforms-material';

import '../Snippet.css';
import PopupText from 'src/utils/popupText';

const schema = new SimpleSchema({
  wceQ1: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, wceQ2: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ3: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ4: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ5: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }, wceQ6: {
    type: String, allowedValues: ["Yes", "No", "Not Applicable"], optional: false
  }
}
)

class WceForm extends Component {

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={console.log}
        //onSubmit={this.handleSubmit}
        onSubmitSuccess={() => {
          alert("Successful");
        }}
        onSubmitFailure={() => {
          alert('Unsuccessful')
        }}
      >
        <Fragment>
      <h2>PARTICIPANT IDENTIFICATION</h2>
      <h3><font color="red">Please verify participant's identity using his/her NRIC before proceeding <br />A. S/N B. Surname followed by Initials C. Last 4 characters of Participant's NRIC and Letter</font></h3>
      <h2>1. FINANCIAL STATUS<br /></h2>
      <font color="red"><b>Please refer to page 1 of Form A for following questions.</b></font>
      1. Current CHAS status?
      <h2><font color="green">DISPLAY INFO FROM REG</ font></h2>
      2. Pioneer / Merdeka Generation Card? 
      <h2><font color="green">DISPLAY INFO FROM REG
      </ font></h2>
      3. Are you currently on any other Government Financial Assistance, other than CHAS and PG (e.g. Public Assistance Scheme)?
      <h2><font color="green">
        DISPLAY INFO FROM HX SOCIAL
      </font></h2>
      <h2>2. NSS CANCER SCREENING PRACTICES SURVEY.</h2>
      1. <font color="red"><b>For female respondent aged 40 and above only.</b></font><br />When was the last time you had your last mammogram? (A mammogram is an x-ray of each breast to look for breast cancer.)
      <h2><font color="green">DISPLAY INFO FROM HX CANCER</font></h2>
      2. <font color="red"><b></b>For female respondent aged 25 and above, who have/had a husband/boyfriend and not had their womb completely surgically removed only.</font><br />When was the last time you had a PAP smear test? (A PAP smear test is a simple test involving the scrapping of cells fom the mouth of the womb, to check for changes in the cells of your cervix, which may develop into cancer later.)
      <h2><font color="green">DISPLAY INFO FROM HX CANCER</font></h2>
      <font color="red"><b>For women 40-49, advise yearly mammogram. 50-69, advise mammogram every 2 years. 70 and above, seek doctor's advice.<br />Please encourage participants to go for HPV test every 5 years.</b></font> <br />
      Does participant has a history of cancer or his/her family history requires further scrutiny by doctors? <font color="red"><b>(If indicated 'Yes', please refer to doctor's consult by following the steps below.)</b></font>
      <RadioField name="wceQ1" label="WCE Q1"/>
      <PopupText qnNo="wceQ1" triggerValue="Yes">
          <b>REFER TO DR CONSULT by indicating on:</b> <br />1) Tick eligibility, Circle interested 'Y' on Page 1 of Form A under Doctor's Consultation row<br />2) Write reasons on Page 2 of Form A Doctor's Consultation - Reasons for Recommendation <br />
      </PopupText>
      <h2>3. FOLLOW UP PLAN</h2>
      1. Completed Breast Self Examination station?
      <RadioField name="wceQ2" label="WCE Q2"/>
      2. Completed Cervical Education station?
      <RadioField name="wceQ3" label="WCE Q3"/>
      3. Indicated interest for HPV Test under SCS?
      <RadioField name="wceQ4" label="WCE Q4"/>
      4. Indicated interest for Mammogram under SCS?
      <RadioField name="wceQ5" label="WCE Q5"/>
      5. Registered for Mammogram under NHGD?
      <RadioField name="wceQ6" label="WCE Q6" />
      
    </Fragment>
        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => this.formRef = ref} />
        </div>

        <br /><Divider />
      </AutoForm>
    );

    return (
      <snippet-container>

        <Paper className="snippet-item" elevation={2} p={0} m={0}>
          {newForm()}
        </Paper>


        <Paper className="snippet-item" elevation={2} p={0} m={0}>
          <h2>Snippets appear here</h2>
        </Paper>

      </snippet-container>
    );
  }
}

export default WceForm;