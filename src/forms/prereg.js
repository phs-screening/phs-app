import React, { Component, Fragment } from 'react'
import SimpleSchema from 'simpl-schema'

import { AutoForm } from 'uniforms'
import { RadioField, LongTextField } from 'uniforms-material'

export const schema = new SimpleSchema({
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: false,
  },
  initials: {
    type: String,
    optional: false,
  },
  age: {
    type: Number,
    optional: false,
  },
  preferredLanguage: {
    type: String,
    optional: false,
    regEx: /^[a-zA-Z]+$/,
  },
  goingForPhlebotomy: {
    type: String,
    allowedValues: ['Y', 'N'],
    optional: false,
  },
})

export const layout = (
  <Fragment>
    <h2>Pre-Registration</h2>
    Gender
    <RadioField name='gender' />
    Initials (E.g. Alan Simon Lee as S.L Alan)
    <LongTextField name='initials' />
    Age
    <LongTextField name='age' />
    Preferred Language (e.g. English)
    <LongTextField name='preferredLanguage' /> <br />
    Going for Phlebotomy?
    <br />
    <br />
    <i>
      Conditions:
      <br />
      1) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.
      <br />
      2) Have not done a blood test within the past 3 years.
    </i>
    <RadioField name='goingForPhlebotomy' />
  </Fragment>
)
