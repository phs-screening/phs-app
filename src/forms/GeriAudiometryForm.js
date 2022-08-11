import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import {SubmitField, ErrorsField, LongTextField} from 'uniforms-material';
import { RadioField, NumField } from 'uniforms-material';
import {calculateBMI, submitForm} from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { useField } from 'uniforms';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'
import Grid from "@material-ui/core/Grid";
import {blueText, title, underlined} from "../theme/commonComponents";
import allForms from "./forms.json";

const schema = new SimpleSchema({
    geriAudiometryQ1: {
        type: String, allowedValues: ["Yes", "No"], optional: false
    }, geriAudiometryQ2: {
        type: String, allowedValues: ["Yes", "No"], optional: false
    }, geriAudiometryQ3: {
        type: String, allowedValues: ["Yes", "No"], optional: false
    }
    }
)


const formName = "geriAudiometryForm"
const GeriAudiometryForm = (props) => {
    const {patientId, isAdmin} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const { changeTab, nextTab } = props;
    const [loadingSidePanel, isLoadingSidePanel] = useState(true);
    const [saveData, setSaveData] = useState({})
    const [hcsr, setHcsr] = useState({})
    useEffect( () => {
        const loadForms = async () => {
            const savedData = getSavedData(patientId, formName);
            const hcsrData = getSavedData(patientId, allForms.hxHcsrForm);

            Promise.all([savedData, hcsrData]).then(result => {
                setSaveData(result[0])
                setHcsr(result[1])
                isLoadingSidePanel(false);
            })
        }
        loadForms()
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
                <h2>AUDIOMETRY</h2>
                <br />
                Did participant visit Audiometry Booth by NUS audiology team?
                <RadioField name="geriAudiometryQ1" label="geriAudiometry - Q1" />
                <br />
                Did participant fail the Audiometry Station?
                <RadioField name="geriAudiometryQ2" label="geriAudiometry - Q2" />
                <br/>
                Is participant referred for L2 Screening by NUH Mobile Hearing Clinic?
                <RadioField name="geriAudiometryQ3" label="geriAudiometry - Q3" />
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
                            {title("Hearing Issues ")}
                            {underlined("Hearing problems")}
                            {hcsr && hcsr.hxHcsrQ8 ? blueText(hcsr.hxHcsrQ8) : blueText("nil")}
                            {hcsr && hcsr.hxHcsrQ9 ? blueText(hcsr.hxHcsrQ9) : blueText("nil")}
                            {underlined("Has participant seen an ENT Specialist before?")}
                            {hcsr && hcsr.hxHcsrQ13 ? blueText(hcsr.hxHcsrQ13) : blueText("nil")}
                            {hcsr && hcsr.hxHcsrQ14 ? blueText(hcsr.hxHcsrQ14) : blueText("nil")}
                            {underlined("Does participant use any hearing aids?")}
                            {hcsr && hcsr.hxHcsrQ15 ? blueText(hcsr.hxHcsrQ15) : blueText("nil")}
                            {hcsr && hcsr.hxHcsrQ16 ? blueText(hcsr.hxHcsrQ16) : blueText("nil")}
                        </div>
                    }
                </Grid>
            </Grid>
        </Paper>
    );
}

GeriAudiometryForm.contextType = FormContext;

export default function GeriAudiometryform(props) {
    return <GeriAudiometryForm {...props} />;
}