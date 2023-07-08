import React, { Component, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { LongTextField, BoolField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'

const schema = new SimpleSchema({
  doctorSConsultQ1: {
    type: String,
    optional: false,
  },
  doctorSConsultQ2: {
    type: String,
    optional: false,
  },
  doctorSConsultQ3: {
    type: String,
    optional: false,
  },
  doctorSConsultQ4: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ5: {
    type: String,
    optional: true,
  },
  doctorSConsultQ6: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ7: {
    type: String,
    optional: true,
  },
  doctorSConsultQ8: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ9: {
    type: String,
    optional: true,
  },
  doctorSConsultQ10: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  doctorSConsultQ11: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
})

class DoctorSConsultForm extends Component {
  static contextType = FormContext

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const { patientId, updatePatientId } = this.context
    const { navigate } = this.props
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, 'doctorConsultForm')
          navigate('/app/dashboard', { replace: true })
        }}
      >
        <Fragment>
          Doctor's Name:
          <LongTextField name='doctorSConsultQ1' label="Doctor's Consult Q1" />
          MCR No.:
          <LongTextField name='doctorSConsultQ2' label="Doctor's Consult Q2" />
          Doctor's Memo
          <LongTextField name='doctorSConsultQ3' label="Doctor's Consult Q3" />
          Refer to dietitian?
          <BoolField name='doctorSConsultQ4' />
          Reason for referral
          <LongTextField name='doctorSConsultQ5' label="Doctor's Consult Q5" />
          Refer to Social Support?
          <BoolField name='doctorSConsultQ6' />
          Reason for referral
          <LongTextField name='doctorSConsultQ7' label="Doctor's Consult Q7" />
          Refer to Dental?
          <BoolField name='doctorSConsultQ8' />
          Reason for referral
          <LongTextField name='doctorSConsultQ9' label="Doctor's Consult Q9" />
          Does patient require urgent follow up
          <BoolField name='doctorSConsultQ10' />
          Completed Doctor’s Consult station. Please check that Form A is filled.
          <BoolField name='doctorSConsultQ11' />
        </Fragment>

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

DoctorSConsultForm.contextType = FormContext

export default function DoctorSConsultform(props) {
  const navigate = useNavigate()

  return <DoctorSConsultForm {...props} navigate={navigate} />
}
