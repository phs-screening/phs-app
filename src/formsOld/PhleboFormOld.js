import React, { Component, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { BoolField } from 'uniforms-material'

const schema = new SimpleSchema({
  phlebotomyQ1: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
  phlebotomyQ2: {
    type: Boolean,
    label: 'Yes',
    optional: true,
  },
})

class PhleboForm extends Component {
  static contextType = FormContext

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const { patientId, updatePatientId } = this.context
    const { navigate } = this.props
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, 'phlebotomyForm')
          navigate('/app/dashboard', { replace: true })
        }}
      >
        <Fragment>
          Blood sample collected?
          <BoolField name='phlebotomyQ1' />
          Circled &apos;Completed&apos; under Phlebotomy on Form A?
          <BoolField name='phlebotomyQ2' />
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

PhleboForm.contextType = FormContext

export default function Phleboform(props) {
  const navigate = useNavigate()

  return <PhleboForm {...props} navigate={navigate} />
}
