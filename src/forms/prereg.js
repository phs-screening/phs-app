import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { RadioField, LongTextField } from 'uniforms-material';


export const schema = new SimpleSchema({
        gender: {
          type: String, allowedValues: ["Male", "Female"], optional: false
        }, fullName: {
          type: String, optional: false
        }, fullNric: {
          type: String, optional: false, regEx: /^[a-zA-Z][0-9]{7}[a-zA-Z]$/
        }, fullAddress: {
            type: String, optional: false
        }, fullPostal: {
        type: String, optional: false, regEx: /^[0-9]{6}$/
        }, dateOfBirth: {
        type: String, optional: false, regEx: /^[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/
        }, contactNumber: {
        type: String, optional: false, regEx: /^[0-9]{8}$/
        }, preferredLanguage: {
        type: String, optional: false, regEx: /^[a-zA-Z]+$/
        },goingForPhlebotomy: {
            type: String, allowedValues: ["Y", "N"], optional: false
        }
    }
)

export const layout = (
    <Fragment>
    <h2>Pre-Registration</h2>
    Gender
    <RadioField name="gender" />
    Full Name (E.g. John Tan Soo Keng, Alan Simon Lee)
    <LongTextField name="fullName" />
    Full NRIC (e.g. S1234567E)
    <LongTextField name="fullNric" />
    Full Address (e.g. 12 ABC Road #01-01)
    <LongTextField name="fullAddress" />
    Postal Code (e.g. 123456)
    <LongTextField name="fullPostal" />
    Date of Birth (e.g. 01/01/1950)
    <LongTextField name="dateOfBirth" />
    Contact Number (e.g. 12345678)
    <LongTextField name="contactNumber" />
    Preferred Language (e.g. English)
    <LongTextField name="preferredLanguage" />
    Going for Phlebotomy?<br /><br /><i>Conditions:<br />1) Fasted for minimum 8 hours <br />          Note: Water is allowed, coffee/tea is not. Medications are fine. <br />2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.<br />3) Have not done a blood test within 1 year.</i>
    <RadioField name="goingForPhlebotomy" />
    
  </Fragment>
  )