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

const schema = new SimpleSchema({
        dietitiansConsultQ1: {
            type: String, optional: false
        }, dietitiansConsultQ2: {
            type: String, optional: true
        }, dietitiansConsultQ3: {
            type: String, optional: true
        }, dietitiansConsultQ4: {
            type: Boolean, label: "Yes", optional: true
        }, dietitiansConsultQ5: {
            type: String, optional: true
        }
    }
)


const formName = "dietitiansConsultForm"
const DietitiansConsultForm = (props) => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const navigate = useNavigate();
    const [loading, isLoading] = useState(false);
    const [loadingSidePanel, isLoadingSidePanel] = useState(true);
    const [saveData, setSaveData] = useState(null)
    // forms to retrieve for side panel
    const [doctorConsult, setDoctorConsult] = useState({})

    useEffect(async () => {
        const savedData = await getSavedData(patientId, formName);
        const loadPastForms = async () => {
            const doctorConsultData = await getSavedData(patientId, allForms.doctorConsultForm);
            setDoctorConsult(doctorConsultData)
            isLoadingSidePanel(false);
        }
        setSaveData(savedData)
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

                Dietitian's Name:
                <LongTextField name="dietitiansConsultQ1" label="Dietitian's Consult Q1"/>
                Dietitian's License No:
                <LongTextField name="dietitiansConsultQ2" label="Dietitian's Consult Q2"/>
                Dietitian's Notes:
                <LongTextField name="dietitiansConsultQ3" label="Dietitian's Consult Q3" />
                Does the patient require urgent follow up?
                <BoolField name="dietitiansConsultQ4" />
                Reasons for urgent follow up:
                <LongTextField name="dietitiansConsultQ5" label="Dietitian's Consult Q5"/>

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
                            {title("Reasons for referral")}
                            {underlined("Reasons for referral from Doctor's Consult ")}
                            {doctorConsult ? blueText(doctorConsult.doctorSConsultQ5) : null}
                        </div>
                    }
                </Grid>
            </Grid>
        </Paper>
    );
}

DietitiansConsultForm.contextType = FormContext;

export default function DietitiansConsultform(props) {
    const navigate = useNavigate();

    return <DietitiansConsultForm {...props} navigate={navigate} />;
}
