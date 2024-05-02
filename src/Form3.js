import React, { Component, Fragment } from 'react'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

import AutoForm from 'uniforms-material/AutoForm'
import SubmitField from 'uniforms-material/SubmitField'
import ErrorsField from 'uniforms-material/ErrorsField'
import RadioField from 'uniforms-material/RadioField'
import LongTextField from 'uniforms-material/LongTextField'

class Form3 extends Component {
  render() {
    const TestSchema = new SimpleSchema({
      preRegistrationQ1: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: false,
      },
      preRegistrationQ2: {
        type: String,
        optional: false,
      },
      preRegistrationQ3: {
        type: String,
        optional: false,
        regEx: /^[0-9]{3}[a-zA-Z]$/,
      },
      preRegistrationQ4: {
        type: String,
        allowedValues: ['Y', 'N'],
        optional: false,
      },
    })

    const TestLayout = (
      <Fragment>
        <h2>Pre-Registration</h2>
        Gender
        <RadioField name='preRegistrationQ1' />
        Initials (Surname must be spelt out. E.g. John Tan Soo Keng = Tan S.K.J. ; Alan Simon Lee =
        A.S. Lee)
        <LongTextField name='preRegistrationQ2' />
        Last 4 characters of NRIC (e.g. 987A)
        <LongTextField name='preRegistrationQ3' />
        Going for Phlebotomy?
        <br />
        <br />
        <i>
          Conditions:
          <br />
          1) Fasted for minimum 8 hours <br /> Note: Water is allowed, coffee/tea is not.
          Medications are fine. <br />
          2) NOT previously diagnosed with Diabetes/ High Cholesterol/ High Blood Pressure.
          <br />
          3) Have not done a blood test within 1 year.
        </i>
        <RadioField name='preRegistrationQ4' />
      </Fragment>
    )

    const newForm = () => (
      <AutoForm
        schema={TestSchema}
        onSubmit={this.handleSubmit}
        onSubmitSuccess={() => {
          alert('Successful')
        }}
        onSubmitFailure={() => {
          alert('Unsuccessful')
        }}
      >
        {TestLayout}
        <ErrorsField />
        <div>
          <SubmitField inputRef={(ref) => (this.formRef = ref)} />
        </div>

        <br />
        <Divider />
      </AutoForm>
    )

    return (
      <Paper elevation={2} p={0} m={0}>
        {newForm()}
      </Paper>
    )
  }
}

export default Form3
