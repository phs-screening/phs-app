import React, { Component, Fragment } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField } from 'uniforms-material'
import { RadioField, NumField } from 'uniforms-material'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { useField } from 'uniforms'

const schema = new SimpleSchema({
  geriSppbQ1: {
    type: Number,
    optional: true,
  },
  geriSppbQ2: {
    type: String,
    allowedValues: [
      '0       (If not able to complete 5 chair stands)',
      '1       (> 16.7s )',
      '2       (16.6 – 13.7s )',
      '3       (13.6 – 11.2s )',
      '4       (< 11.1s )',
    ],
    optional: false,
  },
  geriSppbQ3: {
    type: Number,
    optional: true,
  },
  geriSppbQ4: {
    type: Number,
    optional: true,
  },
  geriSppbQ5: {
    type: Number,
    optional: true,
  },
  geriSppbQ6: {
    type: String,
    allowedValues: [
      '0        (Side by side < 10s or unable)',
      '1       (Side by side 10s AND < 10s semi tandem)',
      '2       (Semi tandem 10s AND tandem < 3s)',
      '3       (Semi tandem 10s AND tandem < 10s but > 3s)',
      '4       (Tandem >= 10s)',
      'Refused to do',
    ],
    optional: false,
  },
  geriSppbQ7: {
    type: Number,
    optional: true,
  },
  geriSppbQ8: {
    type: String,
    allowedValues: [
      '0       (Could not do)',
      '1       (> 5.7s )',
      '2       (4.1 – 5.7s )',
      '3       (3.2 – 4.0s )',
      '4       (< 3.1s )',
    ],
    optional: false,
    // There is no Q9???
    // }, geriSppbQ9: {
    //   type: String, optional: false
  },
  geriSppbQ10: {
    type: String,
    allowedValues: ['High Falls Risk (score ≤ 6)', 'Low Falls Risk (score > 6)'],
    optional: false,
  },
  geriSppbQ11: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})

function GetSppbScore() {
  let score = 0
  const [{ value: q2 }] = useField('geriSppbQ2', {})
  const [{ value: q6 }] = useField('geriSppbQ6', {})
  const [{ value: q8 }] = useField('geriSppbQ8', {})

  if (q2 !== undefined) {
    score += parseInt(q2.slice(0))
  }
  if (q6 !== undefined) {
    const num = parseInt(q6.slice(0))
    if (!Number.isNaN(num)) {
      score += num
    }
  }
  if (q8 !== undefined) {
    score += parseInt(q8.slice(0))
  }
  return score
}

class GeriSppbForm extends Component {
  static contextType = FormContext

  render() {
    const form_schema = new SimpleSchema2Bridge(schema)
    const { patientId, updatePatientId } = this.context
    const { changeTab, nextTab } = this.props
    const newForm = () => (
      <AutoForm
        schema={form_schema}
        onSubmit={async (model) => {
          const response = await submitForm(model, patientId, 'geriSppbForm')
          if (!response.result) {
            alert(response.error)
          }
          const event = null // not interested in this value
          changeTab(event, nextTab)
        }}
      >
        <Fragment>
          <h2>3.3a SHORT PHYSICAL PERFORMANCE BATTERY (SPPB)</h2>
          1) REPEATED CHAIR STANDS
          <br />
          Time taken in seconds (only if 5 chair stands were completed):
          <NumField name='geriSppbQ1' label='Geri - SPPB Q1' />
          <font color='blue'>
            <b>
              Score for REPEATED CHAIR STANDS (out of 4):
              <RadioField name='geriSppbQ2' label='Geri - SPPB Q2' />
            </b>
          </font>
          2a) BALANCE Side-by-side Stand <br />
          Time held for in seconds:
          <NumField name='geriSppbQ3' label='Geri - SPPB Q3' />
          2b) BALANCE Semi-tandem Stand <br />
          Time held for in seconds:
          <NumField name='geriSppbQ4' label='Geri - SPPB Q4' />
          2c) BALANCE Tandem Stand <br />
          Time held for in seconds:
          <NumField name='geriSppbQ5' label='Geri - SPPB Q5' />
          <font color='blue'>
            <b>
              Score for BALANCE (out of 4):
              <RadioField name='geriSppbQ6' label='Geri - SPPB Q6' />
            </b>
          </font>
          3) 8’ WALK <br />
          Time taken in seconds:
          <NumField name='geriSppbQ7' label='Geri - SPPB Q7' />
          <font color='blue'>
            <b>
              Score for 8&apos; WALK (out of 4):
              <RadioField name='geriSppbQ8' label='Geri - SPPB Q8' />
            </b>
          </font>
          <h3>
            <font color='blue'>
              Total score (Max Score: 12):
              <GetSppbScore />
            </font>
          </h3>
          <h3>If total score ≤ 6, participant has a high falls risk.</h3>
          Falls Risk Level:
          <RadioField name='geriSppbQ10' label='Geri - SPPB Q10' />
          <font color='red'>*Referral to Physiotherapist and Occupational Therapist Consult</font>
          <RadioField name='geriSppbQ11' label='Geri - SPPB Q11' />
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

GeriSppbForm.contextType = FormContext

export default function GeriSppbform(props) {
  return <GeriSppbForm {...props} />
}
