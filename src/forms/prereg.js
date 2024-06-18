import React, { Fragment } from 'react'
import SimpleSchema from 'simpl-schema'
import { RadioField, LongTextField } from 'uniforms-material'
import './forms.css'

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
  <div className='form--div'>
    <h2>Pre-Registration</h2>
    <h3>Gender</h3>
    <RadioField
      name='gender'
      options={[
        { label: 'Female', value: 'Female' },
        { label: 'Male', value: 'Male' } /* ... */,
      ]}
      showInlineError
    />
    <h3>Initials (E.g. Alan Simon Lee as S.L Alan)</h3>
    <LongTextField name='initials' showInlineError />
    <h3>Age</h3>
    <LongTextField name='age' showInlineError />
    <h3>Preferred Language (e.g. English)</h3>
    <LongTextField name='preferredLanguage' showInlineError />
    <br />
    <h3>Going for Phlebotomy?</h3>
    <i>
      Conditions:
      <br />
      1) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.
      <br />
      2) Have not done a blood test within the past 3 years.
    </i>
    <RadioField
      name='goingForPhlebotomy'
      options={[
        { label: 'Yes', value: 'Y' },
        { label: 'No', value: 'N' },
      ]}
      showInlineError
    />
  </div>
)
