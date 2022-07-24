import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { RadioField, LongTextField } from 'uniforms-material';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'
import allForms from './forms.json'
import Grid from "@material-ui/core/Grid";
import {blueText, title, underlined} from "../theme/commonComponents";

const schema = new SimpleSchema({
  geriPtConsultQ1: {
    type: String, optional: false
  }, geriPtConsultQ2: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriPtConsultQ3: {
    type: String, optional: true
  }, geriPtConsultQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriPtConsultQ5: {
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

const getTotalFrailScaleScore = (doc) => {
  let sum = 0;
  try {
    if (doc.geriFrailScaleQ1 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ1)
    }
    if (doc.geriFrailScaleQ2 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ2)
    }

    if (doc.geriFrailScaleQ3 !== undefined) {
      sum += parseInt(doc.geriFrailScaleQ3)
    }

    if (doc.geriFrailScaleQ4 !== undefined) {
      const length = doc.geriFrailScaleQ4.length
      const score = length > 4 ? 1 : 0
      sum += score
    }

    if (doc.geriFrailScaleQ5 !== undefined) {
      const weightPercent = parseInt(doc.geriFrailScaleQ5)
      const score = weightPercent > 5 ? 1 : 0
      sum += score
    }
    return sum
  } catch (e) {
    return "error calculating score"
  }


}

const formName = "geriPtConsultForm"
const GeriPtConsultForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loading, isLoading] = useState(false);
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props;
    const [saveData, setSaveData] = useState(null)
  const [geriParq, setGeriParq] = useState({})
  const [geriPhysicalActivity, setGeriPhysicalActivity] = useState({})
  const [geriFrailScale, setGeriFrailScale] = useState({})
  const [geriSppb, setGeriSppb] = useState({})
  const [geriTug, setGeriTug] = useState({})
  const [loadingSidePanel, isLoadingSidePanel] = useState(true);


  useEffect(async () => {
    const savedData = getSavedData(patientId, formName);
    const geriParqData = getSavedData(patientId, allForms.geriParQForm)
    const geriPhysicalActivityData = getSavedData(patientId, allForms.geriPhysicalActivityLevelForm)
    const geriFrailScaleData = getSavedData(patientId, allForms.geriFrailScaleForm)
    const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
    const geriTugData = getSavedData(patientId, allForms.geriTugForm)

    Promise.all([savedData, geriParqData, geriPhysicalActivityData, geriFrailScaleData, geriSppbData, geriTugData]).then(result => {
      setSaveData(result[0])
      setGeriParq(result[1])
      setGeriPhysicalActivity(result[2])
      setGeriFrailScale(result[3])
      setGeriSppb(result[4])
      setGeriTug(result[5])
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
          <h2>3.4a PT Consult</h2>
          Memo:
          <LongTextField name="geriPtConsultQ1" label="Geri - PT Consult Q1" />
          To be referred for doctor's consult (PT)?
          <RadioField name="geriPtConsultQ2" label="Geri - PT Consult Q2" />
          Reasons for referral to Doctor's consult (PT):
          <LongTextField name="geriPtConsultQ3" label="Geri - PT Consult Q3" />
          To be referred for social support (For HDB EASE Sign-up) (PT):
          <RadioField name="geriPtConsultQ4" label="Geri - PT Consult Q4" />
          Reasons for referral to social support (PT):
          <LongTextField name="geriPtConsultQ5" label="Geri - PT Consult Q5" />
          <h2><span style={{color: "red"}}>IF THE PATIENT NEEDS TO GO TO DOCTOR'S CONSULT/ SOCIAL SUPPORT MODALITY THAT YOU RECOMMENDED, PLEASE EDIT ON FORM A</span></h2>

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
                    {title("PAR-Q Results")}
                    {underlined("Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?")}
                    {geriParq && geriParq.geriParQQ1 ? blueText(geriParq.geriParQQ1) : blueText("nil")}
                    {underlined("Do you feel pain in your chest when you do physical activity?")}
                    {geriParq && geriParq.geriParQQ2 ? blueText(geriParq.geriParQQ2) : blueText("nil")}
                    {underlined("In the past month, have you had chest pain when you were not doing physical activity?")}
                    {geriParq && geriParq.geriParQQ3 ? blueText(geriParq.geriParQQ3) : blueText("nil")}
                    {underlined("Do you lose your balance because of dizziness or do you ever lose consciousness?")}
                    {geriParq && geriParq.geriParQQ4 ? blueText(geriParq.geriParQQ4) : blueText("nil")}
                    {underlined("Do you have a bone or joint problem (for example, back, knee or hip) that could be made worse by a change in your physical activity?")}
                    {geriParq && geriParq.geriParQQ5 ? blueText(geriParq.geriParQQ5) : blueText("nil")}
                    {underlined("Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?    ")}
                    {geriParq && geriParq.geriParQQ6 ? blueText(geriParq.geriParQQ6) : blueText("nil")}
                    {underlined("Do you know of any other reason why you should not do physical activity?")}
                    {geriParq && geriParq.geriParQQ7 ? blueText(geriParq.geriParQQ7) : blueText("nil")}
                    {title("Physical Activity Level Results ")}
                    {underlined("How often do you exercise in a week?")}
                    {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ1 ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ1) : blueText("nil")}
                    {underlined("How long do you exercise each time?")}
                    {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ2 ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ2) : blueText("nil")}
                    {underlined("What do you do for exercise?")}
                    {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ3 ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ3) : blueText("nil")}
                    {underlined("Using the following scale, can you rate the level of exertion when you exercise? (Borg Scale - Rate Perceived Exertion [RPE])")}
                    {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ4 ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ4) : blueText("nil")}
                    {underlined("Do you have significant difficulties going about your regular exercise regime? Or do you not know how to start exercising?")}
                    {geriPhysicalActivity && geriPhysicalActivity.geriPhysicalActivityLevelQ5 ? blueText(geriPhysicalActivity.geriPhysicalActivityLevelQ5) : blueText("nil")}
                    {title("Frail Scale Results ")}
                    {underlined("1. Fatigue: How much of the time during the past 4 weeks did you feel tired?\n" +
                        "1 = All of the time\n" +
                        "2 = Most of the time\n" +
                        "3 = Some of the time\n" +
                        "4 = A little of the time\n" +
                        "5 = None of the time\n" +
                        "\n" +
                        "Responses of “1” or “2” are scored as 1 and all others as 0.")}
                    {geriFrailScale && geriFrailScale.geriFrailScaleQ1 ? blueText(geriFrailScale.geriFrailScaleQ1) : blueText("nil")}
                    {underlined("2. Resistance: By yourself and not using aids, do you have any difficulty walking up 10 steps without resting?\n" +
                        "1 = Yes\n" +
                        "0 = No ")}
                    {geriFrailScale && geriFrailScale.geriFrailScaleQ2 ? blueText(geriFrailScale.geriFrailScaleQ2) : blueText("nil")}
                    {underlined("3. Ambulation: By yourself and not using aids, do you have any difficulty walking several hundred yards? (approx. > 300m)\n" +
                        "1 = Yes\n" +
                        "0 = No")}
                    {geriFrailScale && geriFrailScale.geriFrailScaleQ3 ? blueText(geriFrailScale.geriFrailScaleQ3) : blueText("nil")}
                    {underlined("4. Illnesses: For 11 illnesses, participants are asked, “Did a doctor ever tell you that you have [illness]?” \n" +
                        "The illnesses include hypertension, diabetes, cancer (other than a minor skin cancer), chronic lung disease, heart attack, congestive heart failure, angina, asthma, arthritis, stroke, and kidney disease.\n" +
                        "\n" +
                        "The total illnesses (0–11) are recorded as \n" +
                        "0–4 = 0 and 5–11 = 1.")}
                    {geriFrailScale && geriFrailScale.geriFrailScaleQ4 ? blueText(geriFrailScale.geriFrailScaleQ4) : blueText("nil")}
                    {underlined("5. What is the percentage (%) weight change? ")}
                    {geriFrailScale && geriFrailScale.geriFrailScaleQ5 ? blueText(geriFrailScale.geriFrailScaleQ5) : blueText("nil")}
                    Total Score:
                    {geriFrailScale ? getTotalFrailScaleScore(geriFrailScale) : null}
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

GeriPtConsultForm.contextType = FormContext;

export default function GeriPtConsultform(props) {
  return <GeriPtConsultForm {...props} />;
}