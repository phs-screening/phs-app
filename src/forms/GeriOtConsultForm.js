import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import {AutoForm, useField} from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField, SelectField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'
import allForms from './forms.json'
import Grid from "@material-ui/core/Grid";
import {blueText, title, underlined} from "../theme/commonComponents";
import {blue} from "@material-ui/core/colors";

const schema = new SimpleSchema({
  geriOtConsultQ1: {
    type: String, optional: false
  }, geriOtConsultQ2: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtConsultQ3: {
    type: String, optional: true
  }, geriOtConsultQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriOtConsultQ5: {
    type: String, optional: true
  }, geriOtConsultQ6: {
    type: Array, optional: true
  }, "geriOtConsultQ6.$": {
    type: String, allowedValues: ["HDB EASE", "SWCDC Safe and Bright Homes"],
  }, geriOtConsultQ7: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  },geriOtConsultQ8: {
    type: String, optional: true
  }
}
)

function GetSppbScore(q2, q6, q8) {
  let score = 0;
  if (q2 !== undefined) {
    score += parseInt(q2.slice(0))
  }
  if (q6 !== undefined) {
    const num = parseInt(q6.slice(0))
    if (!Number.isNaN(num)) {
      score += num
    }
  }
  if (q8 !== undefined) {
    score += parseInt(q8.slice(0))
  }
  return score;
}

const formName = "geriOtConsultForm"
const GeriOtConsultForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const [geriVision, setGeriVision] = useState({})
  const [geriOtQ, setGeriOtQ] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true);
  const { changeTab, nextTab } = props;

  useEffect(async () => {
    const savedData = getSavedData(patientId, formName);
    const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
    const geriOtQData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
    const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
    const geriTugData = getSavedData(patientId, allForms.geriTugForm)

    Promise.all([savedData, geriVisionData, geriOtQData, geriSppbData, geriTugData]).then(result => {
      setSaveData(result[0])
      setGeriVision(result[1])
      setGeriOtQ(result[2])
      setGeriSppb(result[3])
      setGeriTug(result[4])
      isLoadingSidePanel(false)
    })


  }, [])
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        className='fieldPadding'
        onSubmit={async (model) => {
          isLoading(true);
          const response = await submitForm(model, patientId, formName);
          if (response.result) {
            const event = null; // not interested in this value
            isLoading(false);
            setTimeout(() => {
              alert("Successfully submitted form");
              changeTab(event, nextTab);
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
          <h2>OT Consult</h2>
          <br/>
          Memo (for participant):
          <LongTextField name="geriOtConsultQ1" label="Geri - OT Consult Q1" />
          <br/>
          To be referred for doctor's consult (OT)?
          <RadioField name="geriOtConsultQ2" label="Geri - OT Consult Q2" />
          Reasons for referral to Doctor's consult (OT):
          <LongTextField name="geriOtConsultQ3" label="Geri - OT Consult Q3" />
          <br/>
          To be referred to Geriatric Appointment (For HDB EASE Sign-up) (PT):
          <RadioField name="geriOtConsultQ7" label="Geri - OT Consult Q7" />
          Reasons for referral (PT):
          <LongTextField name="geriOtConsultQ8" label="Geri - OT Consult Q8" />
          <br/>
          To be referred for social support (OT):
          <RadioField name="geriOtConsultQ4" label="Geri - OT Consult Q4" />
          Reasons for referral to social support (OT):
          <LongTextField name="geriOtConsultQ5" label="Geri - OT Consult Q5" />
          <br/>
          Which of the following programmes would you recommend the participant for? (Please select the most appropriate programme)
          <SelectField name="geriOtConsultQ6" checkboxes="true" label="Geri - OT Consult Q6" />
          <h2><span style={{color: "red"}}>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON THE MSS TAB UNDER 'REGISTRATION'.</span></h2>
          <br/>
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
        <Paper elevation={2} p={0} m={0}>
          <Grid display="flex" flexDirection="row" >
            <Grid xs={9}>
              <Paper elevation={2} p={0} m={0}>
                {newForm()}
              </Paper>
            </Grid>
            <Grid
                p={1}
                width="30%"
                display="flex"
                flexDirection="column"
                alignItems={loadingSidePanel ? "center" : "left"}>
              {loadingSidePanel ? <CircularProgress />
                  :
                  <div>
                    {title("Vision - Snellen's Test Results ")}
                    {underlined("Previous eye condition or surgery:")}
                    {geriVision && geriVision.geriVisionQ1 ? blueText(geriVision.geriVisionQ1) : blueText("nil")}
                    {geriVision && geriVision.geriVisionQ2 ? blueText(geriVision.geriVisionQ2) : blueText("nil")}
                    {underlined("Visual acuity (w/o pinhole occluder) - Right Eye 6/__")}
                    {geriVision && geriVision.geriVisionQ3 ? blueText(geriVision.geriVisionQ3) : blueText("nil")}
                    {underlined("Visual acuity (w/o pinhole occluder) - Left Eye 6/__")}
                    {geriVision && geriVision.geriVisionQ4 ? blueText(geriVision.geriVisionQ4) : blueText("nil")}
                    {underlined("Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Right Eye 6/__")}
                    {geriVision && geriVision.geriVisionQ5 ? blueText(geriVision.geriVisionQ5) : blueText("nil")}
                    {underlined("Visual acuity (with pinhole) *only if VA w/o pinhole is ≥ 6/12 - Left Eye 6/__")}
                    {geriVision && geriVision.geriVisionQ6 ? blueText(geriVision.geriVisionQ6) : blueText("nil")}
                    {underlined("Eye Functional Test *only applicable if vision is worse than 6/60")}
                    {geriVision && geriVision.geriVisionQ7 ? blueText(geriVision.geriVisionQ7) : blueText("nil")}
                    {title("OT Questionnaire Results")}
                    {underlined("Have you fallen or had a near fall in the last year?")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ1 ? blueText(geriOtQ.geriOtQuestionnaireQ1) : blueText("nil")}
                    {underlined("Has any medication you've taken caused you drowsiness/ giddiness?")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ2 ? blueText(geriOtQ.geriOtQuestionnaireQ2) : blueText("nil")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ3 ? blueText(geriOtQ.geriOtQuestionnaireQ3) : blueText("nil")}
                    {underlined("Do you use anything to support yourself (e.g. walking aid, umbrella) when moving about your daily activities?")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ4 ? blueText(geriOtQ.geriOtQuestionnaireQ4) : blueText("nil")}
                    {underlined("Do you frequently experience dizziness when standing up from a seated or laid down position?")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ5 ? blueText(geriOtQ.geriOtQuestionnaireQ5) : blueText("nil")}
                    {underlined("Do you experience urinary incontinence or nocturia (go toilet 3 or more times at night)?")}
                    {geriOtQ && geriOtQ.geriOtQuestionnaireQ6 ? blueText(geriOtQ.geriOtQuestionnaireQ6) : blueText("nil")}
                    {title("SPPB Scores")}
                    {underlined("1) REPEATED CHAIR STANDS: " +
                        "Time taken in seconds (only if 5 chair stands were completed):")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ1) : blueText("nil")}
                    {underlined("Score for REPEATED CHAIR STANDS (out of 4):")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ2) : blueText("nil")}
                    {underlined("2a) BALANCE Side-by-side Stand \n" +
                        "Time held for in seconds:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ3) : blueText("nil")}
                    {underlined("2b) BALANCE Semi-tandem Stand \n" +
                        "Time held for in seconds:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ4) : blueText("nil")}
                    {underlined("2b) BALANCE Semi-tandem Stand \n" +
                        "Time held for in seconds:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ5) : blueText("nil")}
                    {underlined("2c) BALANCE Tandem Stand Time held for in seconds:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ6) : blueText("nil")}
                    {underlined("Score for BALANCE (out of 4:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ7) : blueText("nil")}
                    {underlined("3) 8’ WALK \n" +
                        "Time taken in seconds:")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ8) : blueText("nil")}
                    {underlined("Sum up the scores of the sections highlighted In blue. Total score: (Max Score:12)")}
                    {geriSppb ? blueText(GetSppbScore(geriSppb.geriSppbQ2, geriSppb.geriSppbQ6, geriSppb.geriSppbQ8)) : blueText("nil")}
                    {underlined("Falls Risk Level: ")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ11) : blueText("nil")}
                    {title("TUG Results")}
                    {underlined("Walking aid (if any): ")}
                    {geriTug ? blueText(geriTug.geriTugQ1) : blueText("nil")}
                    {underlined("Time taken (in seconds):")}
                    {geriTug ? blueText(geriTug.geriTugQ3) : blueText("nil")}
                    {underlined("Falls Risk Level: ")}
                    {geriTug ? blueText(geriTug.geriTugQ4) : blueText("nil")}
                  </div>
              }
            </Grid>
          </Grid>
        </Paper>
    );
}

GeriOtConsultForm.contextType = FormContext;

export default function GeriOtConsultform(props) {
  return <GeriOtConsultForm {...props} />;
}