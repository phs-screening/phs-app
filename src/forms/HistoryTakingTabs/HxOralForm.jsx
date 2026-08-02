import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, FastField } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { FormContext } from '../../api/utils.js'
import { getSavedData } from '../../services/patientData'
import { submitForm } from '../../api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from 'src/components/form-components/FormSubmitStatusHost'
import CustomRadioGroup from '../../components/form-components/CustomRadioGroup'
import CustomTextField from '../../components/form-components/CustomTextField'
import ErrorNotification from '../../components/form-components/ErrorNotification'
import PopupText from '../../utils/popupText'
import { hxOralFormQuestionText } from '../questions/HxOralFormQuestions'

const formName = 'hxOralForm'

const initialValues = {
  ORAL1: '',
  ORAL2: '',
  ORAL3: '',
  ORAL4: '',
  ORAL5: '',
  ORALShortAns5: '',
}

const validationSchema = Yup.object({
  ORAL1: Yup.string().oneOf(['Healthy', 'Poor']).required('Required'),
  ORAL2: Yup.string().required('Required'),
  ORAL3: Yup.string().required('Required'),
  ORAL4: Yup.string().required('Required'),
  ORAL5: Yup.string().required('Required'),
})

const formOptions = {
  ORAL1: [
    { label: 'Healthy', value: 'Healthy' },
    { label: 'Poor', value: 'Poor' },
  ],
  ORAL2: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL3: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL4: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  ORAL5: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
}

const oralInspectionGuide = [
  {
    heading: 'OD (Operative Dentistry)',
    indications: [
      'Black spots (cavities) on tooth surface. Spots are cavities which may be sticky.',
      'Depression/concavities (NCCLs) at the buccal surface (brushing surface) from aggressive toothbrushing.',
      'Attrition/erosion of tooth surfaces. Worn-down appearance of biting surface with inner ring of yellow dentin surrounded by outer ring of white enamel.',
    ],
  },
  {
    heading: 'Perio (Periodontics)',
    indications: [
      'Red, swollen oedematous gums.',
      'Significant gum recession and black triangles between teeth.',
      'Gum bleeds spontaneously, bleeds easily on brushing/flossing.',
      'Calculus/plaque build-up at gingival margins and interproximal areas.',
      'Chronic bad breath.',
    ],
  },
  {
    heading: 'Endo (Endodontics)',
    indications: [
      'Hypersensitive teeth.',
      'Tooth is painful on biting or when drinking cold/hot drinks/food.',
      'Suspected cracked/chipped tooth.',
    ],
  },
  {
    heading: 'Prosthodontics',
    indications: ['Badly decayed tooth; entire tooth is black.', 'Denture broken/chipped/cracked.'],
  },
  {
    heading: 'OMS (Oral and Maxillofacial Surgery)',
    indications: [
      'Wisdom tooth impacted/painful.',
      'Badly decayed tooth/root stump requiring extraction.',
    ],
  },
]

export default function HxOralForm({ changeTab, nextTab }) {
  const { patientId } = useContext(FormContext)
  const [savedData, setSavedData] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSavedData(patientId, formName)
      setSavedData({ ...initialValues, ...res })
    }

    fetchData()
  }, [patientId])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true)
    const response = await submitForm(values, patientId, formName)
    setLoading(false)
    setSubmitting(false)
    if (response.result) {
      await showFormSubmitSuccess()
      changeTab(null, nextTab)
    } else {
      showFormSubmitError(`Unsuccessful. ${response.error}`)
    }
  }

  const renderForm = () => (
    <Formik
      initialValues={savedData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, submitCount }) => (
        <Form className='fieldPadding'>
          <Typography variant='h4' gutterBottom>
            <strong>ORAL ISSUES</strong>
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ bgcolor: 'error.main', color: 'common.black', p: 1 }}>
              <Typography fontWeight='bold'>Emergency Indications</Typography>
              <Typography variant='body2'>Facial swelling/asymmetry</Typography>
              <Typography variant='body2'>
                Unilateral/radiating pain from tooth/unable to locate source
              </Typography>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size='small' aria-label='Oral health quick inspection guide'>
                <TableHead>
                  <TableRow>
                    {oralInspectionGuide.map(({ heading }) => (
                      <TableCell key={heading} sx={{ minWidth: 220, fontWeight: 'bold' }}>
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {oralInspectionGuide.map(({ heading, indications }) => (
                      <TableCell key={heading} sx={{ verticalAlign: 'top' }}>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {indications.map((indication) => (
                            <li key={indication}>{indication}</li>
                          ))}
                        </ul>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL1}
          </Typography>
          <FastField
            name='ORAL1'
            label='ORAL1'
            component={CustomRadioGroup}
            options={formOptions.ORAL1}
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL2}
          </Typography>
          <FastField
            name='ORAL2'
            label='ORAL2'
            component={CustomRadioGroup}
            options={formOptions.ORAL2}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL3}
          </Typography>
          <img
            src='/images/dentistry_check.png'
            alt='Reference list of dental concerns'
            style={{ maxWidth: '100%' }}
          />
          <FastField
            name='ORAL3'
            label='ORAL3'
            component={CustomRadioGroup}
            options={formOptions.ORAL3}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            {hxOralFormQuestionText.ORAL4}
          </Typography>
          <FastField
            name='ORAL4'
            label='ORAL4'
            component={CustomRadioGroup}
            options={formOptions.ORAL4}
            row
          />

          <Typography variant='subtitle1' fontWeight='bold'>
            Would you like to go through free Oral Health Education by NUS Dentistry dentists and
            students?
          </Typography>
          <Typography gutterBottom>{hxOralFormQuestionText.ORAL5}</Typography>
          <FastField
            name='ORAL5'
            label='ORAL5'
            component={CustomRadioGroup}
            options={formOptions.ORAL5}
            row
          />
          <PopupText qnNo='ORAL5' triggerValue='Yes'>
            <Typography variant='subtitle1' fontWeight='bold'>
              {hxOralFormQuestionText.ORALShortAns5}
            </Typography>
            <FastField
              name='ORALShortAns5'
              label='ORALShortAns5'
              component={CustomTextField}
              fullWidth
              multiline
              sx={{ mb: 3, mt: 1 }}
            />
          </PopupText>

          <Typography variant='subtitle1' fontWeight='bold'>
            The dental examination booth will only provide <u>simple dental screening</u>, there
            will be no treatment provided on site (e.g. scaling and polishing)
          </Typography>
          <Typography variant='subtitle1' fontWeight='bold'>
            <span style={{ color: 'red' }}>Please help to emphasise that: </span>
            screening DOES NOT take the place of a thorough oral health examination with a dentist.
          </Typography>

          <ErrorNotification
            show={submitCount > 0 && Object.keys(errors || {}).length > 0}
            message='Please fill in all required fields correctly.'
          />

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            {loading || isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            )}
          </div>

          <br />
          <Divider />
        </Form>
      )}
    </Formik>
  )

  return <Paper elevation={2}>{renderForm()}</Paper>
}
