import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import { useNavigate } from 'react-router-dom'
import mongoDB, { isAdmin } from '../../services/mongoDB'
import { ScrollTopContext } from '../../api/utils.js'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box, Card, CardContent, CardHeader, Divider } from '@material-ui/core'

// Refactor the generateStatusArray to generate an object instead
function generateStatusObject(record) {
  const recordStatus = {
    prereg: true,
    reg: false,
    triage: false,
    phlebo: false,
    hxtaking: false,
    fit: false,
    wce: false,
    sacs: false,
    geri: false,
    doctorsconsult: false,
    dietitiansconsult: false,
    socialservice: false,
    oralhealth: false,
  }

  if (record) {
    return {
      prereg: true, // pre-registration, always true
      reg: record.registrationForm !== undefined, // registration
      triage: record.triageForm !== undefined, // triage
      phlebo: record.phlebotomyForm !== undefined, // phlebotomy
      // historyTaking form consists of 4 forms
      hxtaking:
        record.hxHcsrForm !== undefined &&
        record.hxNssForm !== undefined &&
        record.hxSocialForm !== undefined &&
        record.hxCancerForm !== undefined,
      fit: record.fitForm !== undefined, // fit
      wce: record.wceForm !== undefined, // wce
      sacs: record.sacsForm !== undefined, // sacs
      // geriatrics form consists of 12 forms
      geri:
        record.geriAmtForm !== undefined &&
        record.geriEbasDepForm !== undefined &&
        record.geriVisionForm !== undefined &&
        record.geriVisionForm !== undefined &&
        record.geriParQForm !== undefined &&
        record.geriPhysicalActivityLevelForm !== undefined &&
        record.geriFrailScaleForm !== undefined &&
        record.geriOtQuestionnaireForm !== undefined &&
        record.geriSppbForm !== undefined &&
        record.geriTugForm !== undefined &&
        record.geriPtConsultForm !== undefined &&
        record.geriOtConsultForm !== undefined &&
        record.geriMMSEForm !== undefined &&
        record.geriAudiometryForm !== undefined &&
        record.geriAudiometryPreScreeningForm !== undefined,
      doctorsconsult: record.doctorConsultForm !== undefined, // doctor's consult
      dietitiansconsult: record.dietitiansConsultForm !== undefined, // dietitian's consult
      socialservice: record.socialServiceForm !== undefined, // social service,
      oralhealth: record.oralHealthForm !== undefined, // Oral Health
    }
  }

  return recordStatus
}

function navigateTo(event, navigate, page, scrollTop) {
  event.preventDefault()
  scrollTop()
  const path = '/app/' + page
  navigate(path, { replace: true })
}

const BasicTimeline = (props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [goingForPhlebotomy, setGoingForPhlebotomy] = useState()
  const [formDone, setFormDone] = useState({})
  const [admin, isAdmins] = useState(false)
  const { scrollTop } = useContext(ScrollTopContext)

  useEffect(async () => {
    const createFormsStatus = async () => {
      try {
        const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
        const patientsRecord = mongoConnection.db('phs').collection('patients')
        // patientId must be valid for this component to even render
        // checks done in parent component Dashboard.js
        // hence, if there is no record, likely there is implementation bug
        const record = await patientsRecord.findOne({ queueNo: props.patientId })
        setGoingForPhlebotomy(record.goingForPhlebotomy === 'Y')
        setFormDone(generateStatusObject(record))
        setLoading(false)
      } catch (err) {
        alert(err)
        navigate('/app/registration', { replace: true })
      }
    }
    createFormsStatus()
    isAdmins(await isAdmin())
  }, [navigate, props.patientId])
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </div>
    )
  } else {
    return (
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color='primary' />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            {admin ? (
              <a
                href='/app/prereg'
                onClick={(event) => navigateTo(event, navigate, 'prereg', scrollTop)}
              >
                Pre-Registration [Edit]
              </a>
            ) : (
              'Pre-Registration [Completed]'
            )}
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.reg ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/reg' onClick={(event) => navigateTo(event, navigate, 'reg', scrollTop)}>
              Registration
              {!formDone?.reg ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.triage ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/triage'
              onClick={(event) => navigateTo(event, navigate, 'triage', scrollTop)}
            >
              Triage
              {!formDone?.triage ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.phlebo ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            {goingForPhlebotomy ? (
              <a
                href='/app/phlebo'
                onClick={(event) => navigateTo(event, navigate, 'phlebo', scrollTop)}
              >
                Phlebotomy
                {!formDone?.phlebo ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
              </a>
            ) : (
              <p>Phlebotomy [Not going]</p>
            )}
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.hxtaking ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/hxtaking'
              onClick={(event) => navigateTo(event, navigate, 'hxtaking', scrollTop)}
            >
              History Taking
              {!formDone?.hxtaking ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.fit ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/fit' onClick={(event) => navigateTo(event, navigate, 'fit', scrollTop)}>
              FIT
              {!formDone?.fit ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.wce ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/wce' onClick={(event) => navigateTo(event, navigate, 'wce', scrollTop)}>
              WCE
              {!formDone?.wce ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.geri ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/geri' onClick={(event) => navigateTo(event, navigate, 'geri', scrollTop)}>
              Geriatrics
              {!formDone?.geri ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.sacs ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/sacs' onClick={(event) => navigateTo(event, navigate, 'sacs', scrollTop)}>
              SACS
              {!formDone?.sacs ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.doctorsconsult ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/doctorsconsult'
              onClick={(event) => navigateTo(event, navigate, 'doctorsconsult', scrollTop)}
            >
              Doctor&apos;s Consult
              {!formDone?.doctorsconsult ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.dietitiansconsult ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/dietitiansconsultation'
              onClick={(event) => navigateTo(event, navigate, 'dietitiansconsultation', scrollTop)}
            >
              Dietitian’s Consultation
              {!formDone?.dietitiansconsult ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.socialservice ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/socialservice'
              onClick={(event) => navigateTo(event, navigate, 'socialservice', scrollTop)}
            >
              Social Service
              {!formDone?.socialservice ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.oralhealth ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/oralhealth'
              onClick={(event) => navigateTo(event, navigate, 'oralhealth', scrollTop)}
            >
              Oral Health
              {!formDone?.oralhealth ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {Object.values(formDone).every((e) => e) ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/summary'
              onClick={(event) => navigateTo(event, navigate, 'summary', scrollTop)}
            >
              Summary [View Only]
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>END</TimelineContent>
        </TimelineItem>
      </Timeline>
    )
  }
}

const PatientTimeline = (props) => (
  <Card {...props}>
    <CardHeader title='Patient Dashboard' />
    <Divider />
    <CardContent>
      <Box
        sx={{
          height: 'auto',
          position: 'relative',
        }}
      >
        <BasicTimeline patientId={props.patientId} />
      </Box>
    </CardContent>
    <Divider />
  </Card>
)

export default PatientTimeline
