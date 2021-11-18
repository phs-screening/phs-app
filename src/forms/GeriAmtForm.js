import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, RadioField } from 'uniforms-material';
import { useField } from 'uniforms';

const schema = new SimpleSchema({
	geriAmtQ1: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ2: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ3: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ4: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ5: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ6: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ7: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ8: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ9: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ10: {
		type: String, allowedValues: ["Yes (Answered correctly)", "No (Answered incorrectly)"], optional: false
		}, geriAmtQ11: {
		type: String, allowedValues: ["0 to 6 years of education", "More than 6 years of education"], optional: false
		}, geriAmtQ12: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}, geriAmtQ13: {
		type: String, allowedValues: ["Yes", "No"], optional: false
		}
	}
)

function GetScore(props) {
  let score = 0
  const [{ value: q1 }] = useField('geriAmtQ1', {});
  const [{ value: q2 }] = useField('geriAmtQ2', {});
  const [{ value: q3 }] = useField('geriAmtQ3', {});
  const [{ value: q4 }] = useField('geriAmtQ4', {});
  const [{ value: q5 }] = useField('geriAmtQ5', {});
  const [{ value: q6 }] = useField('geriAmtQ6', {});
  const [{ value: q7 }] = useField('geriAmtQ7', {});
  const [{ value: q8 }] = useField('geriAmtQ8', {});
  const [{ value: q9 }] = useField('geriAmtQ9', {});
  const [{ value: q10 }] = useField('geriAmtQ10', {});
  if (q1 === 'Yes (Answered correctly)')
    score += 1;
  if (q2 === 'Yes (Answered correctly)')
    score += 1;
  if (q3 === 'Yes (Answered correctly)')
    score += 1;
  if (q4 === 'Yes (Answered correctly)')
    score += 1;
  if (q5 === 'Yes (Answered correctly)')
    score += 1;
  if (q6 === 'Yes (Answered correctly)')
    score += 1;
  if (q7 === 'Yes (Answered correctly)')
    score += 1;
  if (q8 === 'Yes (Answered correctly)')
    score += 1;
  if (q9 === 'Yes (Answered correctly)')
    score += 1;
  if (q10 === 'Yes (Answered correctly)')
    score += 1;
  
  return score;
};

class GeriAmtForm extends Component {

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
              <img src='/images/geri-amt/q8.png' alt='Doctor' /> <br />
              Was Q8 answered correctly?
              <RadioField name="geriAmtQ8" />
              <h3>9) Count backwards from 20 to 1. 请您从二十开始，倒数到一。</h3>
              Was Q9 answered correctly?
              <RadioField name="geriAmtQ9" />
              <h3>10) Recall memory phase 请您把刚才我要您记住的地址重复一遍。</h3>
              Was Q10 answered correctly?
              <RadioField name="geriAmtQ10" />
              AMT Total Score: <GetScore />/10
              <br />
              <br />
              
              What is your education level?<br />
              <img src='/images/geri-amt/edu.png' alt='Education' /> <br />
              <RadioField name="geriAmtQ11" />
              Need referral to cognitive - 2nd Tier Screening ?
              <RadioField name="geriAmtQ12" />
              Referral to cognitive - 2nd Tier Screening
              <RadioField name="geriAmtQ13" />
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

export default GeriAmtForm;