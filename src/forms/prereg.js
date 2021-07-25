import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';


export const schema = new SimpleSchema({
        gender: {
          type: String, allowedValues: ["Male", "Female"], optional: false
        }, initials: {
          type: String, optional: false
        }, abbreviatedNric: {
          type: String, optional: false, regEx: /^[0-9]{3}[a-zA-Z]$/
        }, goingForPhlebotomy: {
          type: String, allowedValues: ["Y", "N"], optional: false
        }
    }
)

export const layout = (
    <Fragment>
    <h2>Pre-Registration</h2>
    Gender
    <RadioField name="gender" />
    Initials (Surname must be spelt out. E.g. John Tan Soo Keng = Tan S.K.J. ; Alan Simon Lee = A.S. Lee)
    <LongTextField name="initials" />
    Last 4 characters of NRIC (e.g. 987A)
    <LongTextField name="abbreviatedNric" />
    Going for Phlebotomy?<br /><br /><i>Conditions:<br />1) Fasted for minimum 8 hours <br />          Note: Water is allowed, coffee/tea is not. Medications are fine. <br />2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.<br />3) Have not done a blood test within 1 year.</i>
    <RadioField name="goingForPhlebotomy" />
    
  </Fragment>
  )