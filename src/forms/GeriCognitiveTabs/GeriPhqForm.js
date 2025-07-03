
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { submitForm } from '../../api/api.js'
import { FormContext } from '../../api/utils.js'
import PopupText from 'src/utils/popupText'
import { getSavedData } from '../../services/mongoDB'
import '../fieldPadding.css'

const dayRange = [
  '0 - Not at all',
  '1 - Several days',
  '2 - More than half the days',
  '3 - Nearly everyday',
]


const dayRangeFormOptions = [
  { label: '0 - Not at all', value: '0 - Not at all' },
  { label: '1 - Several days', value: '1 - Several days' },
  { label: '2 - More than half the days', value: '2 - More than half the days' },
  { label: '3 - Nearly everyday', value: '3 - Nearly everyday' },
]


const validationSchema = Yup.object({
  PHQ1: Yup.string().oneOf(dayRange).required('Required'),
  PHQ2: Yup.string().oneOf(dayRange).required('Required'),
  PHQ3: Yup.string().oneOf(dayRange).required('Required'),
  PHQ4: Yup.string().oneOf(dayRange).required('Required'),
  PHQ5: Yup.string().oneOf(dayRange).required('Required'),
  PHQ6: Yup.string().oneOf(dayRange).required('Required'),
  PHQ7: Yup.string().oneOf(dayRange).required('Required'),
  PHQ8: Yup.string().oneOf(dayRange).required('Required'),
  PHQ9: Yup.string().oneOf(dayRange).required('Required'),
  PHQextra9: Yup.string().oneOf(['Yes', 'No']).notRequired(),
  PHQ10: Yup.number().notRequired(),
  PHQ11: Yup.string().oneOf(['Yes', 'No']).required('Required'),
  PHQShortAns11: Yup.string().notRequired(),
})

const formName = 'geriPhqForm'


function getScore(values) {
  const points = {
    '0 - Not at all': 0,
    '1 - Several days': 1,
    '2 - More than half the days': 2,
    '3 - Nearly everyday': 3,
  }
  let score = 0
  for (let i = 1; i <= 9; i++) {
    score += points[values[`PHQ${i}`]] || 0
  }
  return score
}

const GeriPhqForm = (props) => {
  const { patientId } = useContext(FormContext)
  const { changeTab, nextTab } = props
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    PHQ1: '',
    PHQ2: '',
    PHQ3: '',
    PHQ4: '',
    PHQ5: '',
    PHQ6: '',
    PHQ7: '',
    PHQ8: '',
    PHQ9: '',
    PHQextra9: '',
    PHQ10: 0,
    PHQ11: '',
    PHQShortAns11: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getSavedData(patientId, formName)
      setInitialValues({
        PHQ1: savedData.PHQ1 || '',
        PHQ2: savedData.PHQ2 || '',
        PHQ3: savedData.PHQ3 || '',
        PHQ4: savedData.PHQ4 || '',
        PHQ5: savedData.PHQ5 || '',
        PHQ6: savedData.PHQ6 || '',
        PHQ7: savedData.PHQ7 || '',
        PHQ8: savedData.PHQ8 || '',
        PHQ9: savedData.PHQ9 || '',
        PHQextra9: savedData.PHQextra9 || '',
        PHQ10: savedData.PHQ10 || 0,
        PHQ11: savedData.PHQ11 || '',
        PHQShortAns11: savedData.PHQShortAns11 || '',
      })
    }
    fetchData()
  }, [patientId])

  return (
    <Paper elevation={2} p={0} m={0}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setFieldValue }) => {
          setLoading(true)
          const score = getScore(values)
          values.PHQ10 = score
          const response = await submitForm(values, patientId, formName)
          setLoading(false)
          setSubmitting(false)
          if (response.result) {
            const event = null
            setTimeout(() => {
              alert('Successfully submitted form')
              changeTab(event, nextTab)
            }, 80)
          } else {
            setTimeout(() => {
              alert(`Unsuccessful. ${response.error}`)
            }, 80)
          }
        }}
      >
        {({ values }) => {
          const score = getScore(values)
          return (
            <Form className='fieldPadding'>
              <div className='form--div'>
                <h2>
                  Over the last 2 weeks, how often have you been bothered by any of the following problems?
                </h2>
                <h3>1. Little interest or pleasure in doing things</h3>
                <div role='group' aria-labelledby='PHQ1'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ1' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ1' component='div' className='error' />
                </div>
                <h3>2. Feeling down, depressed or hopeless</h3>
                <div role='group' aria-labelledby='PHQ2'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ2' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ2' component='div' className='error' />
                </div>
                <h3>3. Trouble falling asleep or staying asleep, or sleeping too much</h3>
                <div role='group' aria-labelledby='PHQ3'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ3' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ3' component='div' className='error' />
                </div>
                <h3>4. Feeling tired or having little energy</h3>
                <div role='group' aria-labelledby='PHQ4'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ4' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ4' component='div' className='error' />
                </div>
                <h3>5. Poor appetite or overeating</h3>
                <div role='group' aria-labelledby='PHQ5'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ5' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ5' component='div' className='error' />
                </div>
                <h3>6. Feeling bad about yourself, or that you are a failure or have let yourself or your family down</h3>
                <div role='group' aria-labelledby='PHQ6'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ6' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ6' component='div' className='error' />
                </div>
                <h3>7. Trouble concentrating on things, such as reading the newspaper or television</h3>
                <div role='group' aria-labelledby='PHQ7'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ7' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ7' component='div' className='error' />
                </div>
                <h3>8. Moving or speaking so slowly that other people have noticed? Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual</h3>
                <div role='group' aria-labelledby='PHQ8'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ8' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ8' component='div' className='error' />
                </div>
                <h3>9. Thoughts that you would be better off dead or hurting yourself in some way</h3>
                <div role='group' aria-labelledby='PHQ9'>
                  {dayRangeFormOptions.map((opt) => (
                    <label key={opt.value} style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQ9' value={opt.value} /> {opt.label}
                    </label>
                  ))}
                  <ErrorMessage name='PHQ9' component='div' className='error' />
                </div>
                <PopupText qnNo='PHQ9' triggerValue={['1 - Several days', '2 - More than half the days', '3 - Nearly everyday']}>
                  <h3>*Do you want to take your life now?*</h3>
                  <div role='group' aria-labelledby='PHQextra9'>
                    <label style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQextra9' value='Yes' /> Yes
                    </label>
                    <label style={{ marginRight: 16 }}>
                      <Field type='radio' name='PHQextra9' value='No' /> No
                    </label>
                    <ErrorMessage name='PHQextra9' component='div' className='error' />
                  </div>
                </PopupText>
                <PopupText qnNo='PHQextra9' triggerValue='Yes'>
                  <font color='red'>
                    <b>*Patient requires urgent attention, please escalate*</b>
                  </font>{' '}
                </PopupText>
                <h3>Score:</h3>
                {score >= 10 ? (
                  <Fragment>
                    <p className='blue'>{score} / 27</p>
                    <font color='red'>
                      <b>Patient fails PHQ, score is 10 and above </b>
                    </font>
                    <br />
                  </Fragment>
                ) : (
                  <p className='blue'>{score} / 27</p>
                )}
                <h3>Do you feel like the patient will benefit from counselling? Specify why.</h3>
                <div role='group' aria-labelledby='PHQ11'>
                  <label style={{ marginRight: 16 }}>
                    <Field type='radio' name='PHQ11' value='Yes' /> Yes
                  </label>
                  <label style={{ marginRight: 16 }}>
                    <Field type='radio' name='PHQ11' value='No' /> No
                  </label>
                  <ErrorMessage name='PHQ11' component='div' className='error' />
                </div>
                <h4>Please specify.</h4>
                <Field as='textarea' name='PHQShortAns11' className='form-control' />
                <ErrorMessage name='PHQShortAns11' component='div' className='error' />
                <br />
              </div>
              <div>{loading ? <CircularProgress /> : <button type='submit'>Submit</button>}</div>
              <Divider />
            </Form>
          )
        }}
      </Formik>
    </Paper>
  )
}

export default GeriPhqForm
