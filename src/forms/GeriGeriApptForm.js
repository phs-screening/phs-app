import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { SelectField, RadioField, BoolField } from 'uniforms-material';
import PopupText from 'src/utils/popupText';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

const schema = new SimpleSchema({
  // geriGeriApptQ1: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ2: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  // }, geriGeriApptQ3: {
  //   type: String, allowedValues: ["Yes", "No"], optional: false
  //},
  // Q1 - 3 missing
  geriGeriApptQ4: {
    type: String, allowedValues: ["Yes", "No"], optional: false
  }, geriGeriApptQ5: {
    type: Boolean, label: "Done", optional: true
  }, geriGeriApptQ6: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, geriGeriApptQ7: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, geriGeriApptQ8: {
    type: String, allowedValues: ["Yes", "No"], optional: true
  }, geriGeriApptQ9: {
    type: String, allowedValues: ["Yes", "No"], optional: true
    }, geriGeriApptQ10: {
        type: String, allowedValues: ["Yes", "No"], optional: true
    },geriGeriApptQ11: {
        type: String, allowedValues: ["Yes", "No"], optional: true
    }, geriGeriApptQ12: {
      type: String, allowedValues: ["Yes", "No"], optional: true
  }, geriGeriApptQ13: {
            type: String, allowedValues: ["Yes", "No"], optional: true
        }
}
)

const formName = "geriGeriApptForm"
const GeriGeriApptForm = (props) => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const navigate = useNavigate();
    const [saveData, setSaveData] = useState({})
    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName);
        setSaveData(savedData)
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
          <h2>Geriatrics Appointment</h2>
            <br/>
            <h3>Functional screening </h3>
            Did participant attend geriatric functional screening organised by HPB-AIC?
            <RadioField name="geriGeriApptQ12" label="Geri - Geri Appt Q12" />
            <br/>
            <h3>Vision</h3>
            State eligibility criteria for SWCDC Eye vouchers (100 pax)
            <br/>
            <br/>

            <Fragment>
                SWCDC Eye Voucher given?
                <RadioField name="geriGeriApptQ4" label="Geri - Geri Appt Q4" />
            </Fragment>
            <br/>
            <h3>SWCDC's Safe & Sustainable Homes </h3>
            State eligibility criteria.
            <br/>
            <br/>



            Is participant eligible for SWCDC's Safe & Sustaniable homes?
          <RadioField name="geriGeriApptQ6" label="Geri - Geri Appt Q6" />
            <br/>
            Does participant wish to sign up for SWCDC's Safe & Sustaniable homes?
            <RadioField name="geriGeriApptQ7" label="Geri - Geri Appt Q7" />
            <br/>
            Sign up form for SWCDC's Safe & Sustainable homes filled up?
            <RadioField name="geriGeriApptQ8" label="Geri - Geri Appt Q8" />
            <br/>

            <h3>HDB EASE</h3>
            SC flat owners qualify for EASE (Direct Application) if a family member in the household:
            <br/>• is 65 years old and above; or
            <br/>• aged between 60 and 64 years and requires assistance for one or more of the Activities of Daily Living (ADL)*

           <br/><br/> * ADL refers to daily self-care activities within an individual's place of residence. These activities include washing/ bathing, dressing, feeding, toileting, mobility, and transferring.

            <br/><br/>Note: Age criterion is not applicable for EASE under HIP.
            <br/><br/>
            Is participant eligible for HDB EASE?
            <RadioField name="geriGeriApptQ9" label="Geri - Geri Appt Q9" />
            <br/>
            Does participant wish to sign up for HDB EASE?
            <RadioField name="geriGeriApptQ10" label="Geri - Geri Appt Q10" />
            <br/>
            Participant (aged 60-64 years old, inclusive) referred to Doctor's Consult for Functional Assessment Report completion?
            <RadioField name="geriGeriApptQ11" label="Geri - Geri Appt Q11" />
            <br/>
            To be referred to Social Service for HDB EASE application?
            <RadioField name="geriGeriApptQ13" label="Geri - Geri Appt Q13" />
            <br/>
            <Fragment>
                <h3>If participant is recommended for social support:</h3>
                Persuade participant to go to social support booth and explain that AIC can help
                <BoolField name="geriGeriApptQ5" />
            </Fragment>
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
        {newForm()}
      </Paper>
    );
}

GeriGeriApptForm.contextType = FormContext;

export default function HxCancerform(props) {
  const navigate = useNavigate();

  return <GeriGeriApptForm {...props} navigate={navigate} />;
}