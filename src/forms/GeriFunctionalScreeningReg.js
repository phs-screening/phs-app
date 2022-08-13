import React, {Component, Fragment, useContext, useEffect, useState} from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AutoForm } from 'uniforms';
import { SubmitField, ErrorsField } from 'uniforms-material';
import { LongTextField, SelectField, RadioField, NumField } from 'uniforms-material';
import PopupText from 'src/utils/popupText';
import { submitForm } from '../api/api.js';
import { FormContext } from '../api/utils.js';
import {getSavedData} from "../services/mongoDB";
import './fieldPadding.css'

const schema = new SimpleSchema({
    geriFunctionalScreeningRegFormQ1: {
            type: String, allowedValues: ["Yes", "No"], optional: false
        }, geriFunctionalScreeningRegFormQ2: {
        type: String, allowedValues: ["HPB", "PHS", "None"], optional: false
    }, geriFunctionalScreeningRegFormQ3: {
        type: String, optional: true
    }, geriFunctionalScreeningRegFormQ4: {
        type: String, allowedValues: ["Yes", "No"], optional: true
    }, geriFunctionalScreeningRegFormQ5: {
        type: String, optional: true
    }
    }
)


const formName = "geriFunctionalScreeningRegForm"
const GeriFunctionalScreeningRegForm = (props) => {
    const {patientId, updatePatientId} = useContext(FormContext);
    const [loading, isLoading] = useState(false);
    const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
    const { changeTab, nextTab } = props;
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
                <h2>Functional Screening Registration</h2>
                <br/>
                Explained HPB FS and PHS FS?
                <RadioField name="geriFunctionalScreeningRegFormQ1" label = "geriFunctionalScreeningRegForm - Q1"/>
                <br/>
                Which functional screening does the participant prefer?
                <RadioField name="geriFunctionalScreeningRegFormQ2" label = "geriFunctionalScreeningRegForm - Q2"/>
                <br/>
                If participant prefers HPB screening, which event will they be going to? (event; date):
                <LongTextField name="geriFunctionalScreeningRegFormQ3" label = "geriFunctionalScreeningRegForm - Q3"/>
                <br/>
                Helped participant sign up on HPB FormSG?
                <RadioField name="geriFunctionalScreeningRegFormQ4" label = "geriFunctionalScreeningRegForm - Q4"/>
                <br/>
                Additional notes:
                <LongTextField name="geriFunctionalScreeningRegFormQ5" label = "geriFunctionalScreeningRegForm - Q5"/>


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

GeriFunctionalScreeningRegForm.contextType = FormContext;

export default function GeriFunctionalScreeningRegform(props) {
    return <GeriFunctionalScreeningRegForm {...props} />;
}