import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm } from 'uniforms'
import { SubmitField, ErrorsField, RadioField } from 'uniforms-material'
import { submitForm, submitPhlebLocation } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { BoolField } from 'uniforms-material'
import { getPhlebCountersCollection, getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const postalCodeToLocations = {
  600415: 'Pandan Clinic\nBIk 415, Pandan Gardens #01- 115, S600415',
  600130: 'Trinity Medical Clinic\nBIk 130, Jurong Gateway Road #02-205, S600130',
  129581: 'Frontier FMC\n3151 Commonwealth Ave West, #04-01 Grantral Mall, S129581',
  650207: 'Bukit Batok Medical\nBIk 207, Bukit Batok Street 21 #01- 114, S650207',
  650644: 'Kang An Clinic\nBIk 644 Bukit Batok Central #01-70 S650644',
  610064: 'Drs Tangs and Partner\nBIk 64, Yung Kuang Road, #01- 115, S610064',
  641518: 'Lakeside FMC\nBIk 518A, Jurong West Street 52 #01-02, S641518',
  640638:
    'Healthmark Pioneer MallClinic\nBIk 638, Jurong West Street 61 Pioneer Mall #02-08, S640638',
  640762:
    'Lee Family Clinic\nBIk 762 Jurong West Street 75, #02-262 Gek Poh Shopping Centre S640762',
  None: 'None',
}

const defaultSlots = {
  600415: 30,
  600130: 30,
  129581: 30,
  650207: 30,
  650644: 30,
  610064: 30,
  641518: 30,
  640638: 30,
  640762: 30,
  None: 10000,
}

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
  phlebotomyQ3: {
    type: String,
    allowedValues: Object.values(postalCodeToLocations),
    optional: true,
  },
})

const formName = 'phlebotomyForm'

const PhleboForm = () => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const [saveData, setSaveData] = useState({})
  const navigate = useNavigate()

  const [slots, setSlots] = useState(defaultSlots)

  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)

    const phlebCountersCollection = getPhlebCountersCollection()
    const phlebCounters = await phlebCountersCollection.find()
    const temp = { ...defaultSlots }
    for (const { postalCode, counterItems } of phlebCounters) {
      if (postalCode && counterItems) {
        console.log(postalCode, counterItems.length)
        temp[postalCode] -= counterItems.length
      }
    }
    console.log(temp)
    setSlots(temp)

    setSaveData(savedData)
  }, [])

  // Note: Slice does not modify old array. It creates new array.
  const displayVacancy = Object.entries(slots).map(([postalCode, n], i) => {
    return (
      <div key={i}>
        {postalCodeToLocations[postalCode]}
        <b> Slots: {n}</b>
      </div>
    )
  })

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        const postalCode =
          model.phlebotomyQ3 === 'None' ? 'None' : model?.phlebotomyQ3?.trim().slice(-6)
        if (slots[postalCode] <= 0) {
          alert('No more slots available for this location')
          isLoading(false)
          return
        }

        const counterResponse = await submitPhlebLocation(postalCode, patientId)
        // Update counters by checking previous selection
        if (!counterResponse.result) {
          isLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${counterResponse.error}`)
          }, 80)
          isLoading(false)
          return
        }

        // If counters updated successfully, submit the new form information
        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          setTimeout(() => {
            alert('Successfully submitted form')
            navigate('/app/dashboard', { replace: true })
          }, 80)
        } else {
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }

        isLoading(false)
      }}
      model={saveData}
    >
      <Fragment>
        Blood sample collected?
        <BoolField name='phlebotomyQ1' />
        Circled &apos;Completed&apos; under Phlebotomy on Form A?
        <BoolField name='phlebotomyQ2' />
        <br />
        <h2>Follow up at GP Clinics</h2>
        <p>
          Your Health Report & Blood Test Results (if applicable) will be mailed out to the GP you
          have selected <b>4-6 weeks</b> after the screening.
        </p>
        All results, included those that are normal, have to be collected from the GP clinic via an
        appointment
        <br />
        <br />
        {displayVacancy}
        <RadioField name='phlebotomyQ3' />
      </Fragment>
      <ErrorsField />
      <div>{loading ? <CircularProgress /> : <SubmitField inputRef={(ref) => {}} />}</div>

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

PhleboForm.contextType = FormContext

export default function Phleboform(props) {
  const navigate = useNavigate()

  return <PhleboForm {...props} navigate={navigate} />
}
