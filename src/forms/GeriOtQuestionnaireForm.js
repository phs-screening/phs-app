import React, { Component, Fragment, useContext, useEffect, useState } from 'react'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { AutoForm, useField } from 'uniforms'
import { SubmitField, ErrorsField, NumField } from 'uniforms-material'
import { LongTextField, RadioField } from 'uniforms-material'
import PopupText from 'src/utils/popupText'
import { submitForm } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getSavedData } from '../services/mongoDB'
import './fieldPadding.css'

const schema = new SimpleSchema({
  geriOtQuestionnaireQ1: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ33: {
    type: String,
    optional: true,
  },
  geriOtQuestionnaireQ3: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ4: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ5: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ6: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (client uses wheelchair constantly)'],
    optional: false,
  },
  geriOtQuestionnaireQ7: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ8: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ9: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil kerbs and steps - new BTO building)'],
    optional: false,
  },
  geriOtQuestionnaireQ10: {
    type: String,
    optional: true,
  },
  geriOtQuestionnaireQ11: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (client uses commode constantly)'],
    optional: false,
  },
  geriOtQuestionnaireQ12: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (does not use bathtub, uses shower)'],
    optional: false,
  },
  geriOtQuestionnaireQ13: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil shower at home, uses bathtub)'],
    optional: false,
  },
  geriOtQuestionnaireQ14: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ15: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ16: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ17: {
    type: String,
    optional: true,
  },
  geriOtQuestionnaireQ18: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ19: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ20: {
    type: String,
    allowedValues: [
      'Yes',
      'No',
      'NA (no steps / stairs at home - including toilet - new BTO building)',
    ],
    optional: false,
  },
  geriOtQuestionnaireQ21: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil steps / kerbs at entrance)'],
    optional: false,
  },
  geriOtQuestionnaireQ22: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil steps at home, lift landing, does not climb stairs)'],
    optional: false,
  },
  geriOtQuestionnaireQ23: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil steps at home, lift landing, does not climb stairs)'],
    optional: false,
  },
  geriOtQuestionnaireQ24: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ25: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil garden, path, corridor walkway)'],
    optional: false,
  },
  geriOtQuestionnaireQ26: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
  geriOtQuestionnaireQ27: {
    type: String,
    allowedValues: ['Yes', 'No', 'NA (nil pets / animals at home)'],
    optional: false,
  },
  geriOtQuestionnaireQ28: {
    type: String,
    optional: true,
  },
  geriOtQuestionnaireQ29: {
    type: String,
    optional: false,
  },
  geriOtQuestionnaireQ30: {
    type: String,
    optional: false,
  },
  geriOtQuestionnaireQ31: {
    type: String,
    optional: false,
  },
  geriOtQuestionnaireQ32: {
    type: String,
    optional: false,
  },
})

const GetScores = () => {
  const score = [0, 0, 0] //yes , no , NA
  const arrayValues = []
  arrayValues[0] = useField('geriOtQuestionnaireQ1', {})
  arrayValues[1] = useField('geriOtQuestionnaireQ2', {})
  arrayValues[2] = useField('geriOtQuestionnaireQ3', {})
  arrayValues[3] = useField('geriOtQuestionnaireQ4', {})
  arrayValues[4] = useField('geriOtQuestionnaireQ5', {})
  arrayValues[5] = useField('geriOtQuestionnaireQ6', {})
  arrayValues[6] = useField('geriOtQuestionnaireQ7', {})
  arrayValues[7] = useField('geriOtQuestionnaireQ8', {})
  arrayValues[8] = useField('geriOtQuestionnaireQ9', {})
  arrayValues[9] = useField('geriOtQuestionnaireQ11', {})
  arrayValues[10] = useField('geriOtQuestionnaireQ12', {})
  arrayValues[11] = useField('geriOtQuestionnaireQ13', {})
  arrayValues[12] = useField('geriOtQuestionnaireQ14', {})
  arrayValues[13] = useField('geriOtQuestionnaireQ15', {})
  arrayValues[14] = useField('geriOtQuestionnaireQ16', {})
  arrayValues[15] = useField('geriOtQuestionnaireQ18', {})
  arrayValues[16] = useField('geriOtQuestionnaireQ19', {})
  arrayValues[17] = useField('geriOtQuestionnaireQ20', {})
  arrayValues[18] = useField('geriOtQuestionnaireQ21', {})
  arrayValues[19] = useField('geriOtQuestionnaireQ22', {})
  arrayValues[20] = useField('geriOtQuestionnaireQ23', {})
  arrayValues[21] = useField('geriOtQuestionnaireQ24', {})
  arrayValues[22] = useField('geriOtQuestionnaireQ25', {})
  arrayValues[23] = useField('geriOtQuestionnaireQ26', {})
  arrayValues[24] = useField('geriOtQuestionnaireQ27', {})

  const length = arrayValues.length

  for (let i = 0; i < length; i++) {
    const current = arrayValues[i][0].value
    if (current !== undefined) {
      if (current.substring(0, 3).trim().toLowerCase() === 'yes') {
        score[0] = score[0] + 1
      } else if (current.substring(0, 3).trim().toLowerCase() === 'no') {
        score[1] = score[1] + 1
      } else {
        score[2] = score[2] + 1
      }
    }
  }

  return (
    <div>
      <b>Yes (calculated):</b> {score[0]}
      <br />
      <b>Yes :</b>
      <NumField name='geriOtQuestionnaireQ29' label='geriOtQuestionnaire-Q29' step={1} />
      <b>No (calculated):</b> {score[1]}
      <br />
      <b>No :</b>
      <NumField name='geriOtQuestionnaireQ30' label='geriOtQuestionnaire-Q30' step={1} />
      <b>NA (calculated):</b> {score[2]} <br />
      <b>NA :</b>
      <NumField name='geriOtQuestionnaireQ31' label='geriOtQuestionnaire-Q31' step={1} />
    </div>
  )
}

const formName = 'geriOtQuestionnaireForm'
const GeriOtQuestionnaireForm = (props) => {
  const { patientId, updatePatientId } = useContext(FormContext)
  const [loading, isLoading] = useState(false)
  const [form_schema, setForm_schema] = useState(new SimpleSchema2Bridge(schema))
  const { changeTab, nextTab } = props
  const [saveData, setSaveData] = useState({})
  useEffect(async () => {
    const savedData = await getSavedData(patientId, formName)
    setSaveData(savedData)
  }, [])

  const newForm = () => (
    <AutoForm
      schema={form_schema}
      className='fieldPadding'
      onSubmit={async (model) => {
        isLoading(true)
        // add 3 calculated fields

        const response = await submitForm(model, patientId, formName)
        if (response.result) {
          const event = null // not interested in this value
          isLoading(false)
          setTimeout(() => {
            alert('Successfully submitted form')
            changeTab(event, nextTab)
          }, 80)
        } else {
          isLoading(false)
          setTimeout(() => {
            alert(`Unsuccessful. ${response.error}`)
          }, 80)
        }
      }}
      model={saveData}
    >
      <Fragment>
        <h2>HOME FALLS AND ACCIDENTS SCREENING TOOL (HOME FAST)</h2>
        <b style={{ color: 'red' }}>
          Instructions: Please select either YES / NO / NA. Remember to fill up the total scoring
        </b>
        <br />
        The HOMEFAST assessment is a 25 question standardized assessment that aims to identify any
        potential fall risks at home, and within your home environment (lift landing, corridor). The
        Occupational Therapist will then advise you on some possible home modifications to make to
        minimize these risks, should there be a concern.
        <br />
        <br />
        <h3>HOME ENVIRONMENT (LIVING ROOM / HOME ENTRANCE)</h3>
        <br />
        1. Are your walkways free of cords and other clutter?
        <br />
        <p>
          <b>Definition:</b> No cords / clutter that obstruct door opening / closing or in the
          walkway. No items behind / in front of doors that prevent them from opening fully
        </p>
        <RadioField name='geriOtQuestionnaireQ1' label='geriOtQuestionnaire-Q1' />
        <br />
        2. Are your floor coverings in good condition?
        <br />
        <p>
          <b>Definition:</b> Carpets / mats are flat on the ground. No cracked / missing tiles
          including stair coverings
        </p>
        <RadioField name='geriOtQuestionnaireQ2' label='geriOtQuestionnaire-Q2' />
        Please specify:
        <LongTextField name='geriOtQuestionnaireQ33' label='geriOtQuestionnaire-Q33' />
        <br />
        3. Are your floor surfaces non slip?
        <p>
          <b>Definition:</b> Score ‘NO” if kitchen, toilet are non-slip, Score “YES” if kitchen,
          toilet are non-slip
        </p>
        <RadioField name='geriOtQuestionnaireQ3' label='geriOtQuestionnaire-Q3' />
        <br />
        4. Are your loose mats securely fixed to the floor?
        <p>
          <b>Definition:</b> If backings of mats are safely taped/nailed to the ground
        </p>
        <RadioField name='geriOtQuestionnaireQ4' label='geriOtQuestionnaire-Q4' />
        <br />
        5. Can you get in and out of bed easily and safely?
        <p>
          {' '}
          <b>Definition:</b> Bed is of adequate height and firmness, without the need to pull self
          up with the aid of bedside furniture.
        </p>
        <RadioField name='geriOtQuestionnaireQ5' label='geriOtQuestionnaire-Q5' />
        <br />
        6. Can you get up from your chair/sofa easily?
        <p>
          <b>Definition:</b> Chair / sofa is of adequate height, arm rests are accessible to push
          from, and seat cushion not too soft or deep
        </p>
        <RadioField name='geriOtQuestionnaireQ6' label='geriOtQuestionnaire-Q6' />
        <br />
        7. Are the lights at home bright enough for you to see clearly?
        <p>
          <b>Definition:</b> No shadows thrown across the room. No excessive glare
        </p>
        <RadioField name='geriOtQuestionnaireQ7' label='geriOtQuestionnaire-Q7' />
        <br />
        8. Can you switch a light on easily from your bed?
        <p>
          <b>Definition: </b> Client does not need to get out of bed to switch on a light. Has
          flashlight or bedside lamp{' '}
        </p>
        <RadioField name='geriOtQuestionnaireQ8' label='geriOtQuestionnaire-Q8' />
        <br />
        9. Are the paths, steps, entrances outside (at your corridor) well lit at night?
        <p>
          <b>Definition:</b> Light exists at the back and front of doors. Lift lobbies and corridors
          have sufficient lighting to ambulate
        </p>
        <RadioField name='geriOtQuestionnaireQ9' label='geriOtQuestionnaire-Q9' />
        <br />
        Notes (Q1 - 9, Living room/ Home entrance):
        <LongTextField name='geriOtQuestionnaireQ10' label='geriOtQuestionnaire-Q10' />
        <br />
        <h3>HOME ENVIRONMENT (TOILET)</h3>
        <br />
        10. Are you able to get on and out of the toilet easily and safely?
        <p>
          <b>Definition:</b> Toilet seat is of adequate height, does not need to hold onto sink /
          towel rail / toilet paper holder to stand. Grab bars are present when needed
        </p>
        <RadioField name='geriOtQuestionnaireQ11' label='geriOtQuestionnaire-Q11' />
        <br />
        11. Are you able to get in and out of the bath easily and safely?
        <p>
          <b>Definition:</b> Client is able to step over bathtub and lower themselves without
          grabbing onto furniture
        </p>
        <RadioField name='geriOtQuestionnaireQ12' label='geriOtQuestionnaire-Q12' />
        <br />
        12. Are you able to walk in and out of the shower kerb / toilet kerb easily and safely?
        <p>
          <b>Definition:</b> Client can step over kerbs / recesses without the need to hold onto
          anything{' '}
        </p>
        <RadioField name='geriOtQuestionnaireQ13' label='geriOtQuestionnaire-Q13' />
        <br />
        13. Are there stable grab bars / rails for you to hold in the shower / bath?
        <p>
          <b>Definition:</b> Grab bars EXCLUDING towel rails, sink, toilet paper holder.
        </p>
        <RadioField name='geriOtQuestionnaireQ14' label='geriOtQuestionnaire-Q14' />
        <br />
        14. Are there any non-slip mats in the shower area?
        <p>
          <b>Definition:</b> Well maintained slip resistant rubber mats / non slip strips / non slip
          floor application on the floor / bathtub.
        </p>
        <RadioField name='geriOtQuestionnaireQ15' label='geriOtQuestionnaire-Q15' />
        <br />
        15. Is the toilet close by / adjunct to the bedroom?
        <p>
          <b>Definition:</b> Less than 2 door distance away (including bathroom door)
        </p>
        <RadioField name='geriOtQuestionnaireQ16' label='geriOtQuestionnaire-Q16' />
        <br />
        Notes (Q10 - 15, Toilet):
        <LongTextField name='geriOtQuestionnaireQ17' label='geriOtQuestionnaire-Q17' />
        <br />
        <h3>HOME ENVIRONMENT (KITCHEN AND LIVING ROOM)</h3>
        <br />
        16. Can you reach items in the kitchen that are used regularly without climbing, bending or
        flexing your trunk such that you will not lose your balance?
        <p>
          <b>Definition:</b> Cupboards are accessible at shoulder and knee height - without the need
          to use chairs / stepladders to reach items
        </p>
        <RadioField name='geriOtQuestionnaireQ18' label='geriOtQuestionnaire-Q18' />
        <br />
        17. Can you carry your meals from the kitchen to the dining table easily?
        <p>
          <b>Definition:</b> Meals can be carried safely, transported using trolley to wherever the
          client usually consumes meals
        </p>
        <RadioField name='geriOtQuestionnaireQ19' label='geriOtQuestionnaire-Q19' />
        <br />
        18. Does your house have any grab bars extending along the length of the steps / kerbs?
        <p>
          <b>Definition:</b> Grab bars must be easily gribbed, secure, robust throughout the steps /
          kerbs
        </p>
        <RadioField name='geriOtQuestionnaireQ20' label='geriOtQuestionnaire-Q20' />
        <br />
        19. Does your apartment entrance have grab bars that extend the entire steps / kerbs?
        <p>
          <b>Definition:</b> Steps = more than 2 steps consecutively with a change in floor level
          Definition: Grab bars must be easily gripped, firmly fixed, robust and available for the
          full length of the steps or stairs
        </p>
        <RadioField name='geriOtQuestionnaireQ21' label='geriOtQuestionnaire-Q21' />
        <br />
        20. Can you easily and safely go up and down the steps in and outside your house?
        <p>
          <b>Definition:</b> Steps are not too high, narrow, uneven for feet to be firmly placed.
        </p>
        <p>
          <b>Definition:</b> Client will not be fatigued, breathless while using steps / kerbs or
          any other medical condition that will impair ability to ascend the stairs safely. Eg. Foot
          drop, loss of sensation in feet, impaired control of movement.
        </p>
        <RadioField name='geriOtQuestionnaireQ22' label='geriOtQuestionnaire-Q22' />
        <br />
        21. Are the edges of the steps / stairs (inside and outside your house) easily identified?
        <p>
          <b>Definition:</b> No patterned floor coverings, tiles, that could obscure the edge of
          step with sufficient lighting of the stairs / steps
        </p>
        <RadioField name='geriOtQuestionnaireQ23' label='geriOtQuestionnaire-Q23' />
        <br />
        22. Can you use the entrance of doors safely and easily?
        <p>
          <b>Definition:</b> Locks and bolts can be used without the need to bend down or over
          reach. There is a landing such that the client does not need to balance on steps to open
          the door.
        </p>
        <RadioField name='geriOtQuestionnaireQ24' label='geriOtQuestionnaire-Q24' />
        <br />
        23. Are the paths in your house and outside your house in good condition and free of
        clutter?
        <p>
          <b>Definition:</b> No cracked / loose pathway / neighbors plants or furniture on walkways
        </p>
        <RadioField name='geriOtQuestionnaireQ25' label='geriOtQuestionnaire-Q25' />
        <br />
        24. Are you using non-slip / well fitting slippers/shoes at home?
        <p>
          <b>Definition:</b> Supportive, firmly fitting shoes / slippers with low heels and non-slip
          soles.
        </p>
        No shoes = NO"
        <RadioField name='geriOtQuestionnaireQ26' label='geriOtQuestionnaire-Q26' />
        <br />
        25. If there are pets - can you care for them without bending down OR at risk of falling
        over?
        <p>
          <b>Definition: </b> “YES” when client does NOT need to bend down to feed pets, clean,
          refill bowls etc
        </p>
        <RadioField name='geriOtQuestionnaireQ27' label='geriOtQuestionnaire-Q27' />
        <br />
        Notes (Q16 - 25, Kitchen and Living Environment):
        <LongTextField name='geriOtQuestionnaireQ28' label='geriOtQuestionnaire-Q28' />
        <br />
        <h3>SCORING</h3>
        <br />
        <GetScores /> <br />
        <b>Total (Record it as "YES" / 25 - "NA"):</b>
        <LongTextField name='geriOtQuestionnaireQ32' label='geriOtQuestionnaire-Q32' />
        <br />
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

GeriOtQuestionnaireForm.contextType = FormContext

export default function GeriOtQuestionnaireform(props) {
  return <GeriOtQuestionnaireForm {...props} />
}
