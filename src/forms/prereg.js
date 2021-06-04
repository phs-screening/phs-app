import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import AutoForm from 'uniforms-material/AutoForm';
import AutoField from 'uniforms-material/AutoField';
import TextField from 'uniforms-material/TextField';
import SubmitField from 'uniforms-material/SubmitField';
import SelectField from 'uniforms-material/SelectField';
import HiddenField from 'uniforms-material/HiddenField';
import NumField from 'uniforms-material/NumField';
import ListField from 'uniforms-material/ListField';
import DateField from 'uniforms-material/DateField';
import RadioField from 'uniforms-material/RadioField';
import BoolField from 'uniforms-material/BoolField';
import LongTextField from 'uniforms-material/LongTextField';

import BaseField from 'uniforms/BaseField';
import nothing from 'uniforms/nothing';
import {Children} from 'react';
import { Radio } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


export const schema = new SimpleSchema({
        preRegistrationQ1: {
          type: String, allowedValues: ["Male", "Female"], optional: false
        }, preRegistrationQ2: {
          type: String, optional: false
        }, preRegistrationQ3: {
          type: String, optional: false, regEx: /^[0-9]{3}[a-zA-Z]$/
        }, preRegistrationQ4: {
          type: String, allowedValues: ["Y", "N"], optional: false
        }
    }
)

export const layout = (
    <Fragment>
    <h2>Pre-Registration</h2>
    Gender
    <RadioField name="preRegistrationQ1" />
    Initials (Surname must be spelt out. E.g. John Tan Soo Keng = Tan S.K.J. ; Alan Simon Lee = A.S. Lee)
    <LongTextField name="preRegistrationQ2" />
    Last 4 characters of NRIC (e.g. 987A)
    <LongTextField name="preRegistrationQ3" />
    Going for Phlebotomy?<br /><br /><i>Conditions:<br />1) Fasted for minimum 8 hours <br />          Note: Water is allowed, coffee/tea is not. Medications are fine. <br />2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.<br />3) Have not done a blood test within 1 year.</i>
    <RadioField name="preRegistrationQ4" />
    
  </Fragment>
  )