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
import { submitForm, calculateBMI } from '../api/api.js';
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
    const [saveData, setSaveData] = useState(null)
    // forms to retrieve for side panel
    const [hcsr, setHcsr] = useState({})
    const [nss, setNss] = useState({})
    const [social, setSocial] = useState({})
    const [cancer, setCancer] = useState({})
    const [geriOtQ, setGeriOtQ] = useState({})
    const [geriOt, setGeriOt] = useState({})
    const [geriPt, setGeriPt] = useState({})
    useEffect(async () => {
        const loadPastForms = async () => {
          const hcsrData = getSavedData(patientId, allForms.hxHcsrForm);
          const nssData = getSavedData(patientId, allForms.hxNssForm);
          const socialData = getSavedData(patientId, allForms.hxSocialForm);
          const cancerData = getSavedData(patientId, allForms.hxCancerForm);
          const geriOtQData = getSavedData(patientId, allForms.geriOtQuestionnaireForm)
            const geriOtData = getSavedData(patientId, allForms.geriOtConsultForm)
            const geriPtData = getSavedData(patientId, allForms.geriPtConsultForm)
            const savedData = getSavedData(patientId, formName);
          Promise.all([hcsrData, nssData, socialData, cancerData, geriOtQData, geriOtData, geriPtData, savedData])
              .then((result) => {
                  setHcsr(result[0])
                  setNss(result[1])
                  setSocial(result[2])
                  setCancer(result[3])
                  setGeriOtQ(result[4])
                  setGeriOt(result[5])
                  setGeriPt(result[6])
                  isLoadingSidePanel(false);
                  setSaveData(result[7])
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
      Doctor's Memo
      <LongTextField name="doctorSConsultQ3" label="Doctor's Consult Q3" />
        <br/><br/>
      Refer to dietitian?
      <BoolField name="doctorSConsultQ4" />
      Reason for referral
      <LongTextField name="doctorSConsultQ5" label="Doctor's Consult Q5"/>
        <br/><br/>
      Refer to Social Support?
      <BoolField name="doctorSConsultQ6" />
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
                    {hcsr ? blueText(hcsr.hxHcsrQ11) : null}
                  {underlined("Summarised reasons for referral to Doctor Consultation")}
                  {hcsr ? blueText(hcsr.hxHcsrQ2) : null}
                    {title("Systems Review")}
                    {underlined("Requires scrutiny by doctor?")}
                    {hcsr ? blueText(hcsr.hxHcsrQ12) : null}
                  {underlined("Summarised systems review")}
                  {hcsr ? blueText(hcsr.hxHcsrQ3) : null}
                  {title("Urinary/Faecal incontinence")}
                  {underlined("Urinary/Faecal incontinence")}
                  {hcsr ? blueText(hcsr.hxHcsrQ4) : null}
                  {hcsr && hcsr.hxHcsrQ5 ? blueText(hcsr.hxHcsrQ5) : null}
                    {underlined("Urinary Incontinence or nocturia (at least 3 or more times at night)?")}
                    {geriOtQ ? blueText(geriOtQ.geriOtQuestionnaireQ6) : null}
                  {title("Vision problems")}
                  {underlined("Vision Problems")}
                  {hcsr ? blueText(hcsr.hxHcsrQ6) : null}
                  {hcsr && hcsr.hxHcsrQ7 ? blueText(hcsr.hxHcsrQ7) : null}
                  {title("Hearing problems")}
                  {underlined("Hearing Problems")}
                  {hcsr ? blueText(hcsr.hxHcsrQ8) : null}
                  {hcsr && hcsr.hxHcsrQ9 ? blueText(hcsr.hxHcsrQ9) : null}
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
                  {nss ? blueText(nss.hxNssQ14) : null}
                    {underlined("Pack years:")}
                    {nss ? blueText(nss.hxNssQ3) : null}
                  {title("Alcohol history")}
                  {underlined("Alcohol consumption")}
                  {nss ? blueText(nss.hxNssQ15) : null}
                  {title("Family History")}
                  {underlined("Summary of Relevant Family History")}
                  {cancer && cancer.hxCancerQ10 ? blueText(cancer.hxCancerQ10) : null}
                  {title("Blood Pressure")}
                    {underlined("Requires scrutiny by doctor?")}
                    {cancer && cancer.hxCancerQ27 ? blueText(cancer.hxCancerQ27) : null}
                    {underlined("Dizziness on standing up from a seated or laid down position?")}
                    {geriOtQ ? blueText(geriOtQ.geriOtQuestionnaireQ5) : null}
                  {underlined("Average Blood Pressure")}
                  {cancer ? blueText("Average Reading Systolic: " + cancer.hxCancerQ17) : null}
                  {cancer ? blueText("Average Reading Diastolic: " + cancer.hxCancerQ18) : null}
                    {title("BMI")}
                    {underlined("Requires scrutiny by doctor?")}
                    {cancer && cancer.hxCancerQ23 ? blueText(cancer.hxCancerQ23.toString()) : null}
                  {underlined("BMI")}
                  {cancer ? blueText("Height: " + cancer.hxCancerQ19 + "cm") : null}
                  {cancer ? blueText("Weight: " + cancer.hxCancerQ20 + "kg") : null}
                  {cancer && cancer.hxCancerQ19 && cancer.hxCancerQ20
                    ? blueText("BMI: " + calculateBMI(cancer.hxCancerQ19, cancer.hxCancerQ20))
                    : null}
                    {underlined("Waist circumference (cm)")}
                    {cancer ? blueText(cancer.hxCancerQ24) : null}
                    {title("OT consult")}
                    {underlined("Reasons for referral")}
                    {geriOt ? blueText(geriOt.geriOtConsultQ3 ) : null}
                    {title("PT consult")}
                    {underlined("Reasons for referral")}
                    {geriPt ? blueText(geriPt.geriPtConsultQ3 ) : null}
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