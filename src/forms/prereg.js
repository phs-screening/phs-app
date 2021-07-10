import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';


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