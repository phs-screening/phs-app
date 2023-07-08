import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'

import { schema, layout } from './prereg.js'

import { preRegister } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import './fieldPadding.css'

class PreregForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
  }

  render() {
    const { patientId, updatePatientId } = this.context
    const { navigate } = this.props
    const form_schema = new SimpleSchema2Bridge(schema)
    const form_layout = layout
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        className='fieldPadding'
        onSubmit={async (model) => {
          this.setState({ isLoading: true })
          const response = await preRegister(model)
          if (response.result) {
            this.setState({ isLoading: false })
            setTimeout(() => {
              alert(
                `Successfully pre-registered patient with queue number ${response.data.patientId}.`,
              )
              updatePatientId(response.data.patientId)
              navigate('/app/dashboard', { replace: true })
            }, 80)
          } else {
            this.setState({ isLoading: false })
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`)
            }, 80)
          }
        }}
      >
        {form_layout}
        <ErrorsField />
        <div>
          {this.state.isLoading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}
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
PreregForm.contextType = FormContext

export default function Preregform(props) {
  const navigate = useNavigate()

  return <PreregForm {...props} navigate={navigate} />
}
