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

// Timeline item configuration - add/delete stations here
const timelineItems = [
  { key: 'reg', label: 'Registration', path: 'reg' },
  { key: 'hxtaking', label: 'History Taking', path: 'hxtaking' },
  { key: 'triage', label: 'Triage', path: 'triage' },
  { key: 'hsg', label: 'HealthierSG', path: 'hsg' },
  { key: 'phlebo', label: 'Phlebotomy', path: 'phlebo' },
  { key: 'fit', label: 'FIT', path: 'fit' },
  { key: 'lungfn', label: 'Lung Function', path: 'lungfn' },
  { key: 'wce', label: 'WCE', path: 'wce' },
  { key: 'osteo', label: 'Osteoporosis', path: 'osteoporosis' },
  { key: 'nkf', label: 'NKF', path: 'nkf' },
  { key: 'mentalhealth', label: 'Mental Health', path: 'mentalhealth' },
  { key: 'vax', label: 'Vaccination', path: 'vax' },
  { key: 'gericog', label: 'Geriatrics - Cognitive', path: 'gericog' },
  { key: 'gerimobility', label: 'Geriatrics - Mobility', path: 'gerimobility' },
  { key: 'gerivision', label: 'Geriatrics - Vision', path: 'gerivision' },
  { key: 'geriaudio', label: 'Geriatrics - Audiometry', path: 'geriaudio' },
  { key: 'hpv', label: 'HPV', path: 'hpv' },
  { key: 'doctorsconsult', label: "Doctor's Station", path: 'doctorsconsult' },
  { key: 'dietitiansconsult', label: "Dietitian's Consultation", path: 'dietitiansconsultation' },
  { key: 'oralhealth', label: 'Oral Health', path: 'oralhealth' },
  { key: 'socialservice', label: 'Social Services', path: 'socialservice' },
]

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

const TimelineItemComponent = ({ item, formDone, admin, navigate, scrollTop }) => (
  <TimelineItem>
    <TimelineSeparator>
      <TimelineDot color={formDone?.[item.key] ? 'primary' : 'grey'} />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>
      <a
        href={`/app/${item.path}`}
        onClick={(event) => navigateTo(event, navigate, item.path, scrollTop)}
      >
        {item.label}
        {!formDone?.[item.key] ? ' [Incomplete]' : admin ? ' [Edit]' : ' [Completed]'}
      </a>
    </TimelineContent>
  </TimelineItem>
)

const BasicTimeline = (props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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

        setFormDone(generateStatusObject(record))
        setLoading(false)
        isAdmins(await isAdmin())
      } catch (err) {
        alert(err)
        console.log('error is here')
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
        {timelineItems.map((item) => (
          <TimelineItemComponent
            key={item.key}
            item={item}
            formDone={formDone}
            admin={admin}
            navigate={navigate}
            scrollTop={scrollTop}
          />
        ))}

        {/* Summary and End items */}
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={Object.values(formDone).every(Boolean) ? 'primary' : 'grey'} />
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
            <TimelineDot color={Object.values(formDone).every(Boolean) ? 'primary' : 'grey'} />
          </TimelineSeparator>
          <TimelineContent>END</TimelineContent>
        </TimelineItem>
      </Timeline>
    )
  }
}

const PatientTimeline = (props) => {
  const { patientId, ...cardProps } = props
  return (
    <Card {...cardProps}>
      <CardHeader title='Patient Dashboard' />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 'auto',
            position: 'relative',
          }}
        >
          <BasicTimeline patientId={patientId} />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  )
}

export default PatientTimeline
