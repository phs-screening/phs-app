import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { useNavigate } from 'react-router-dom'
import mongoDB, { isAdmin } from '../../services/mongoDB'
import { ScrollTopContext } from '../../api/utils.js'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material'

// Refactor the generateStatusArray to generate an object instead
function generateStatusObject(record) {
  const recordStatus = {
    reg: false,
    triage: false,
    hxtaking: false,
    vax: false,
    hsg: false,
    phlebo: false,
    fit: false,
    lungfn: false,
    gynae: false,
    wce: false,
    osteo: false,
    nkf: false,
    mentalhealth: false,
    hpv: false,
    gerimobility: false,
    geriaudio: false,
    gerivision: false,
    doctorsconsult: false,
    dietitiansconsult: false,
    socialservice: false,
    oralhealth: false,
  }

  if (record) {
    return {
      reg: record.registrationForm !== undefined, // registration
      hxtaking:
        record.hxHcsrForm !== undefined &&
        record.hxNssForm !== undefined &&
        record.hxSocialForm !== undefined &&
        record.hxOralForm !== undefined &&
        record.geriPhqForm !== undefined &&
        record.hxFamilyForm !== undefined &&
        record.hxWellbeingForm !== undefined,
      triage: record.triageForm !== undefined, // triage
      hsg: record.hsgForm !== undefined,
      phlebo: record.phlebotomyForm !== undefined, // phlebotomy
      fit: record.fitForm !== undefined, // fit
      lungfn: record.lungFnForm !== undefined,
      gynae: record.gynaeForm !== undefined,
      wce: record.wceForm !== undefined, // wce
      osteo: record.osteoForm !== undefined,
      nkf: record.nkfForm !== undefined,
      mentalhealth: record.mentalHealthForm !== undefined,
      vax: record.vaccineForm !== undefined,
      gericog:
        record.geriAmtForm !== undefined &&
        record.geriGraceForm !== undefined &&
        record.geriWhForm !== undefined &&
        record.geriInterForm !== undefined,
      gerimobility:
        record.geriPhysicalActivityLevelForm !== undefined &&
        record.geriOtQuestionnaireForm !== undefined &&
        record.geriSppbForm !== undefined &&
        record.geriPtConsultForm !== undefined &&
        record.geriOtConsultForm !== undefined,
      gerivision: record.geriVisionForm !== undefined,
      geriaudio: record.geriAudiometryForm !== undefined,
      hpv: record.hpvForm !== undefined,
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
  const [goingForPhlebotomy, setGoingForPhlebotomy] = useState(false)
  const [formDone, setFormDone] = useState({})
  const [admin, isAdmins] = useState(false)
  const { scrollTop } = useContext(ScrollTopContext)

  useEffect(() => {
    const createFormsStatus = async () => {
      try {
        const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
        const patientsRecord = mongoConnection.db('phs').collection('patients')
        // patientId must be valid for this component to even render
        // checks done in parent component Dashboard.js
        // hence, if there is no record, likely there is implementation bug
        const record = await patientsRecord.findOne({ queueNo: props.patientId })

        if (record.goingForPhlebotomy == 'Yes') {
          setGoingForPhlebotomy(true)
        }
        setFormDone(generateStatusObject(record))
        setLoading(false)
        isAdmins(await isAdmin())
      } catch (err) {
        alert(err)
        console.log("error is here")
        navigate('/app/registration', { replace: true })
      }
    }
    createFormsStatus()
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
            {formDone?.hsg ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/hsg' onClick={(event) => navigateTo(event, navigate, 'hsg', scrollTop)}>
              HealthierSG
              {!formDone?.hsg ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.phlebo ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/phlebo'
              onClick={(event) => navigateTo(event, navigate, 'phlebo', scrollTop)}
            >
              Phlebotomy
              {!formDone?.phlebo ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
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
            {formDone?.lungfn ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/lungfn'
              onClick={(event) => navigateTo(event, navigate, 'lungfn', scrollTop)}
            >
              Lung Function
              {!formDone?.lungfn ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
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
            {formDone?.osteo ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/osteoporosis' onClick={(event) => navigateTo(event, navigate, 'osteoporosis', scrollTop)}>
              Osteoporosis
              {!formDone?.osteo ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.nkf ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/nkf' onClick={(event) => navigateTo(event, navigate, 'nkf', scrollTop)}>
              NKF
              {!formDone?.nkf ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.mentalhealth ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/mentalhealth'
              onClick={(event) => navigateTo(event, navigate, 'mentalhealth', scrollTop)}
            >
              Mental Health
              {!formDone?.mentalhealth ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.vax ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/vax' onClick={(event) => navigateTo(event, navigate, 'vax', scrollTop)}>
              Vaccination
              {!formDone?.vax ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.gericog ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/gericog'
              onClick={(event) => navigateTo(event, navigate, 'gericog', scrollTop)}
            >
              Geriatrics - Cognitive
              {!formDone?.gericog ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.gerimobility ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/gerimobility'
              onClick={(event) => navigateTo(event, navigate, 'gerimobility', scrollTop)}
            >
              Geriatrics - Mobility
              {!formDone?.gerimobility ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.gerivision ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/gerivision'
              onClick={(event) => navigateTo(event, navigate, 'gerivision', scrollTop)}
            >
              Geriatrics - Vision
              {!formDone?.gerivision ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.geriaudio ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/geriaudio'
              onClick={(event) => navigateTo(event, navigate, 'geriaudio', scrollTop)}
            >
              Geriatrics - Audiometry
              {!formDone?.geriaudio ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            {formDone?.oralhealth ? <TimelineDot color='primary' /> : <TimelineDot color='grey' />}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a href='/app/hpv' onClick={(event) => navigateTo(event, navigate, 'hpv', scrollTop)}>
              HPV
              {!formDone?.hpv ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
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
              Doctor&apos;s Station
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
              Social Services
              {!formDone?.socialservice ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
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
            {Object.values(formDone).every((e) => e) ? (
              <TimelineDot color='primary' />
            ) : (
              <TimelineDot color='grey' />
            )}
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
