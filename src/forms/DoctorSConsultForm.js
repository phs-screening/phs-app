import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import {
	LongTextField,
  BoolField } from 'uniforms-material';
import { submitForm, calculateBMI, calculateSppbScore } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { title, underlined, blueText } from '../theme/commonComponents';
import {getSavedData} from "../services/mongoDB";
import allForms from "./forms.json";
import './fieldPadding.css'
import {blue} from "@material-ui/core/colors";

const schema = new SimpleSchema({
	doctorSConsultQ1: {
    type: String, optional: false
  }, doctorSConsultQ2: {
    type: String, optional: false
  }, doctorSConsultQ3: {
    type: String, optional: false
  }, doctorSConsultQ4: {
    type: Boolean, label: "Yes", optional: true
  }, doctorSConsultQ5: {
    type: String, optional: true
  }, doctorSConsultQ6: {
    type: Boolean, label: "Yes", optional: true
  }, doctorSConsultQ7: {
    type: String, optional: true
  }, doctorSConsultQ8: {
    type: Boolean, label: "Yes", optional: true
  }, doctorSConsultQ9: {
    type: String, optional: true
  }, doctorSConsultQ10: {
    type: Boolean, label: "Yes", optional: true
  }, doctorSConsultQ11: {
    type: Boolean, label: "Yes", optional: true
  }, doctorSConsultQ12: {
        type: Boolean, label: "Yes", optional: true
    }
	}
)


const formName = "doctorConsultForm"
const DoctorSConsultForm = (props) => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const navigate = useNavigate();
    const [loading, isLoading] = useState(false);
    const [loadingSidePanel, isLoadingSidePanel] = useState(true);
    const [saveData, setSaveData] = useState({})
    // forms to retrieve for side panel
    const [hcsr, setHcsr] = useState({})
    const [nss, setNss] = useState({})
    const [cancer, setCancer] = useState({})
    const [geriOt, setGeriOt] = useState({})
    const [geriPt, setGeriPt] = useState({})
    const [geriVision, setGeriVision] = useState({})
    const [geriSppb, setGeriSppb] = useState({})
    const [geriPhysical, setGeriPhysical] = useState({})
    const [geriAppt, setGeriAppt] = useState({})
    useEffect(async () => {
        const loadPastForms = async () => {
          const hcsrData = getSavedData(patientId, allForms.hxHcsrForm);
          const nssData = getSavedData(patientId, allForms.hxNssForm);
          const cancerData = getSavedData(patientId, allForms.hxCancerForm);
            const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
            const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)
            const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
            const geriSppbData = getSavedData(patientId, allForms.geriSppbForm)
            const geriPhysicalData = getSavedData(patientId,allForms.geriPhysicalActivityLevelForm)
            const geriApptData = getSavedData(patientId, allForms.geriGeriApptForm)
            const savedData = getSavedData(patientId, formName);
          Promise.all([hcsrData, nssData, cancerData, geriOtData, geriPtData, savedData, geriVisionData, geriSppbData
          , geriPhysicalData, geriApptData])
              .then((result) => {
                  setHcsr(result[0])
                  setNss(result[1])
                  setCancer(result[2])
                  setGeriOt(result[3])
                  setGeriPt(result[4])
                  isLoadingSidePanel(false);
                  setSaveData(result[5])
                  setGeriVision(result[6])
                  setGeriSppb(result[7])
                  setGeriPhysical(result[8])
                  setGeriAppt(result[9])
              })
        }

        loadPastForms();

    }, [])
        const newForm = () => (
          <AutoForm
            schema={form_schema}
            className='fieldPadding'
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

      Doctor's Name:
      <LongTextField name="doctorSConsultQ1" label="Doctor's Consult Q1"/>
      MCR No.:
      <LongTextField name="doctorSConsultQ2" label="Doctor's Consult Q2"/>
        <br/><br/>
      {/*Doctor's Memo*/}
      {/*<LongTextField name="doctorSConsultQ3" label="Doctor's Consult Q3" />*/}
      {/*  <br/><br/>*/}
      Refer to dietitian?
      <BoolField name="doctorSConsultQ4" />
      Reason for referral
      <LongTextField name="doctorSConsultQ5" label="Doctor's Consult Q5"/>
        <br/><br/>
      Refer to Social Support?
      <BoolField name="doctorSConsultQ6" />
        Functional Assessment Report (Pg 2-3) completed for HDB EASE application?
        <BoolField name="doctorSConsultQ12" />

      Reason for referral
      <LongTextField name="doctorSConsultQ7" label="Doctor's Consult Q7"/>
        <br/><br/>
      Refer to Dental?
      <BoolField name="doctorSConsultQ8" />
      Reason for referral
      <LongTextField name="doctorSConsultQ9" label="Doctor's Consult Q9"/>
        <br/><br/>
      Does patient require urgent follow up 
      <BoolField name="doctorSConsultQ10" />
        <br/>
      Completed Doctor’s Consult station. Please check that Form A is filled.
      <BoolField name="doctorSConsultQ11" />
      
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
                    {title("Health Concerns")}
                    {underlined("Requires scrutiny by doctor?")}
                    {hcsr ? blueText(hcsr.hxHcsrQ11) : blueText("nil")}
                  {underlined("Summarised reasons for referral to Doctor Consultation")}
                  {hcsr ? blueText(hcsr.hxHcsrQ2) : blueText("nil")}
                    {title("Systems Review")}
                    {underlined("Requires scrutiny by doctor?")}
                    {hcsr ? blueText(hcsr.hxHcsrQ12) : blueText("nil")}
                  {underlined("Summarised systems review")}
                  {hcsr ? blueText(hcsr.hxHcsrQ3) : blueText("nil")}
                  {title("Urinary/Faecal incontinence")}
                  {underlined("Urinary/Faecal incontinence")}
                  {hcsr ? blueText(hcsr.hxHcsrQ4) : blueText("nil")}
                  {hcsr && hcsr.hxHcsrQ5 ? blueText(hcsr.hxHcsrQ5) : blueText("nil")}
                  {title("Vision problems")}
                  {underlined("Vision Problems (From history taking)")}
                  {hcsr ? blueText(hcsr.hxHcsrQ6) : blueText("nil")}
                  {hcsr && hcsr.hxHcsrQ7 ? blueText(hcsr.hxHcsrQ7) : blueText("nil")}
                    {underlined("Referred from Geriatric Vision Screening (if VA with pinhole ≥ 6/12)")}
                    {geriVision && geriVision.geriVisionQ9 ? (geriVision.geriVisionQ9.length === 0 ? blueText("nil") : blueText(geriVision.geriVisionQ9)) : blueText("nil")}
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


                  {title("Hearing problems")}
                  {underlined("Hearing Problems")}
                  {hcsr ? blueText(hcsr.hxHcsrQ8) : blueText("nil")}
                  {hcsr && hcsr.hxHcsrQ9 ? blueText(hcsr.hxHcsrQ9) : blueText("nil")}
                  {title("Past Medical History")}
                  {underlined("Summary of Relevant Past Medical History")}
                  {nss && nss.hxNssQ12 ? blueText(nss.hxNssQ12.toString()) : blueText("nil")}
                    {underlined("Drug allergies?")}
                    {nss && nss.hxNssQ1 ? blueText(nss.hxNssQ1.toString()) : blueText("nil")}
                    {nss && nss.hxNssQ2 ? blueText(nss.hxNssQ2.toString()) : blueText("nil")}
                    {underlined("Currently on any alternative medicine?")}
                    {nss && nss.hxNssQ9 ? blueText(nss.hxNssQ9.toString()) : blueText("nil")}
                    {nss && nss.hxNssQ10 ? blueText(nss.hxNssQ10.toString()) : blueText("nil")}
                  {title("Smoking History")}
                  {underlined("Smoking frequency")}
                  {nss ? blueText(nss.hxNssQ14) : blueText("nil")}
                    {underlined("Pack years:")}
                    {nss ? blueText(nss.hxNssQ3) : blueText("nil")}
                  {title("Alcohol history")}
                  {underlined("Alcohol consumption")}
                  {nss ? blueText(nss.hxNssQ15) : blueText("nil")}
                  {title("Family History")}
                  {underlined("Summary of Relevant Family History")}
                  {cancer && cancer.hxCancerQ10 ? blueText(cancer.hxCancerQ10) : blueText("nil")}
                  {title("Blood Pressure")}
                    {underlined("Requires scrutiny by doctor?")}
                    {cancer && cancer.hxCancerQ27 ? blueText(cancer.hxCancerQ27) : blueText("nil")}
                  {underlined("Average Blood Pressure")}
                  {cancer ? blueText("Average Reading Systolic: " + cancer.hxCancerQ17) : blueText("nil")}
                  {cancer ? blueText("Average Reading Diastolic: " + cancer.hxCancerQ18) : blueText("nil")}
                    {title("BMI")}
                    {underlined("Requires scrutiny by doctor?")}
                    {cancer && cancer.hxCancerQ23 ? blueText(cancer.hxCancerQ23.toString()) : blueText("nil")}
                  {underlined("BMI")}
                  {cancer ? blueText("Height: " + cancer.hxCancerQ19 + "cm") : blueText("nil")}
                  {cancer ? blueText("Weight: " + cancer.hxCancerQ20 + "kg") : blueText("nil")}
                  {cancer && cancer.hxCancerQ19 && cancer.hxCancerQ20
                    ? calculateBMI(cancer.hxCancerQ19, cancer.hxCancerQ20)
                    : blueText("nil")}
                    {underlined("Waist circumference (cm)")}
                    {cancer ? blueText(cancer.hxCancerQ24) : blueText("nil")}
                    {title("OT consult")}
                    {underlined("Reasons for referral")}
                    {geriOt ? blueText(geriOt.geriOtConsultQ3 ) : blueText("nil")}
                    {title("PT consult")}
                    {underlined("Reasons for referral")}
                    {geriPt ? blueText(geriPt.geriPtConsultQ3 ) : blueText("nil")}
                    {geriPt ? blueText(geriPt.geriPtConsultQ3 ) : blueText("nil")}
                    {underlined("Short Physical Performance Battery Score (out of 12):")}
                    {geriSppb ? blueText(calculateSppbScore(geriSppb.geriSppbQ2, geriSppb.geriSppbQ6, geriSppb.geriSppbQ8)) : blueText("nil")}
                    {underlined("Gait speed Score (out of 4):")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ8) : blueText("nil")}
                    {underlined("5 Chair rise Score (out of 4):")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ2) : blueText("nil")}
                    {underlined("Balance score (out of 4):")}
                    {geriSppb ? blueText(geriSppb.geriSppbQ6) : blueText("nil")}
                    {underlined("Number of falls in past 1 year:")}
                    {geriPhysical ? blueText(geriPhysical.geriPhysicalActivityLevelQ8) : blueText("nil")}
                    {underlined("Were any of the falls injurious?")}
                    {geriPhysical ? blueText(geriPhysical.geriPhysicalActivityLevelQ9) : blueText("nil")}
                    {geriPhysical ? blueText(geriPhysical.geriPhysicalActivityLevelQ10) : blueText("nil")}
                    {underlined("Eligible for HDB EASE?")}
                    {geriAppt ? blueText(geriAppt.geriGeriApptQ9) : blueText("nil")}
                    {underlined("Interested in signing up?")}
                    {geriAppt ? blueText(geriAppt.geriGeriApptQ10) : blueText("nil")}
                    {underlined("Requires Functional Assessment Report Completion?")}
                    {geriAppt ? blueText(geriAppt.geriGeriApptQ11) : blueText("nil")}
                </div>
              }
              </Grid>
            </Grid>
          </Paper>
        );
}

DoctorSConsultForm.contextType = FormContext;

export default function DoctorSConsultform(props) {
  const navigate = useNavigate();

  return <DoctorSConsultForm {...props} navigate={navigate} />;
}