import React, { Component, Fragment } from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { TextField, RadioField, LongTextField } from 'uniforms-material';
import { useField } from 'uniforms';
import PopupText from 'src/utils/popupText';

const schema = new SimpleSchema({
  geriEbasDepQ1: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ2: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ3: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ4: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ5: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ6: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ7: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ8: {
    type: String, allowedValues: ["1 (Abnormal)", "0 (Normal)"], optional: false
  }, geriEbasDepQ9: {
    type: Number, optional: false
  }, geriEbasDepQ10: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriEbasDepQ11: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriEbasDepQ12: {
    type: String, optional: true, custom: function () {
      if (this.field('geriEbasDepQ11').isSet && this.field('geriEbasDepQ11').value === "Yes") {
        if (!this.isSet || this.value.length === 0) {
          return SimpleSchema.ErrorTypes.REQUIRED
        }
      }
    }
  }
}
)

function GetScore(props) {
  var score = 0
  const [{ value: q1 }] = useField('geriEbasDepQ1', {});
  const [{ value: q2 }] = useField('geriEbasDepQ2', {});
  const [{ value: q3 }] = useField('geriEbasDepQ3', {});
  const [{ value: q4 }] = useField('geriEbasDepQ4', {});
  const [{ value: q5 }] = useField('geriEbasDepQ5', {});
  const [{ value: q6 }] = useField('geriEbasDepQ6', {});
  const [{ value: q7 }] = useField('geriEbasDepQ7', {});
  const [{ value: q8 }] = useField('geriEbasDepQ8', {});

  if (q1 === '1 (Abnormal)')
    score += 1;
  if (q2 === '1 (Abnormal)')
    score += 1;
  if (q3 === '1 (Abnormal)')
    score += 1;
  if (q4 === '1 (Abnormal)')
    score += 1;
  if (q5 === '1 (Abnormal)')
    score += 1;
  if (q6 === '1 (Abnormal)')
    score += 1;
  if (q7 === '1 (Abnormal)')
    score += 1;
  if (q8 === '1 (Abnormal)')
    score += 1;
  
  return score;
};

class GeriEbasDepForm extends Component {

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
          <h2>1.2 EBAS-DEP </h2>
          <h3>The 8 items of this schedule require raters to make a judgement as to whether the proposition under “Assessment” is satisfied or not. Each question must be asked exactly as shown but follow-up or subsidiary questions may be used to clarify the initial answer.
          <br />Select 1 = Fits the assessment criteria; Select 0 = Does not fit the criteria; participant is well.</h3>
          
          1. Do you worry? In the past month? 过去一个月内你曾经有担心过吗？<br />
          Assessment: Admits to worrying in past month
          <RadioField name="geriEbasDepQ1" label="Geri - EBAS-DEP Q1" />
          
          2. Have you been sad or depressed in the past month? 过去一个月内你曾经伤心或忧郁过吗？<br />
          Assessment: Has had sad or depressed mood during the past month
          <RadioField name="geriEbasDepQ2" label="Geri - EBAS-DEP Q2" />
          
          3. During the past month have you ever felt that life was not worth living? 近一个月来你曾经觉得生活毫无意义（无价值）吗？<br />
          Assessment: Has felt that life was not worth living at some time during the past month
          <RadioField name="geriEbasDepQ3" label="Geri - EBAS-DEP Q3" />

          4. How do you feel about your future? What are your hopes for the future? 你觉得自己的前途怎样？你对前途有何希望？<br />
          Assessment: Pessimistic about the future or has empty expectations (i.e. nothing to look forward to)
          <RadioField name="geriEbasDepQ4" label="Geri - EBAS-DEP Q4" />

          5. Do you enjoy things as much as you used to - say like you did a year ago? 你对东西的喜爱是否与往常一样，比如说与一年前一样？<br />
          Assessment: Less enjoyment in activities than a year previously
          <RadioField name="geriEbasDepQ5" label="Geri - EBAS-DEP Q5" />

          <h3>If question 5 rated 0, then automatically rate 0 for question 6 and skip to question 7. If question 5 rated 1, proceed to question 6.</h3>

          6. Is it because you are depressed or nervous that you don't enjoy things as much? 是不是因为你的忧郁或者精神紧张使得你对东西的喜爱大不如前？<br />
          Assessment: Loss of enjoyment because of depression/nervousness
          <RadioField name="geriEbasDepQ6" label="Geri - EBAS-DEP Q6" />

          7. In general, how happy are you? (Read out) <br />Are you - very happy - fairly happy - not very happy or not happy at all? 
          <br />一般来说，你有何等的快乐? 
          <br />你是 :  很快乐   快乐   不很快乐 或   毫无快乐？
          <br />Assessment: Not very happy or not happy at all / 不很快乐 或   毫无快乐
          <RadioField name="geriEbasDepQ7" label="Geri - EBAS-DEP Q7" />

          8. During the past month have you ever felt that you would rather be dead? 过去一个月内，你曾有时觉得生不如死？ <br />
          Assessment: Has wished to be dead at any time during past month
          <RadioField name="geriEbasDepQ8" label="Geri - EBAS-DEP Q8" />

            <h3>
              EBAS Total Score: <GetScore />/8
            </h3>
          
          <br />
          <h3>A score of 3 or greater indicates the probable presence of a depressive disorder which may need treatment and the patient should be assessed in more detail. Please refer to Social Support if score is 3 OR GREATER.</h3>
          To be referred for social support (failed EBAS-DEP) - from Geriatrics EBAS
          <br />
          <RadioField name="geriEbasDepQ10" label="Geri - EBAS-DEP Q10" />
          To be referred for social support (for potential financial/ family difficulties) - from Geriatrics EBAS
          <RadioField name="geriEbasDepQ11" label="Geri - EBAS-DEP Q11" />

          <PopupText qnNo="geriEbasDepQ11" triggerValue="Yes">
            <Fragment>
              Reasons for referral to social support - from Geriatrics EBAS:
              <LongTextField name="geriEbasDepQ12" label="Geri - EBAS-DEP Q12" />
            </Fragment>
          </PopupText>

          <font color="red"><h2>IF THE PATIENT NEEDS TO GO TO SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE INDICATE ON FORM A.</h2></font>

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

export default GeriEbasDepForm;