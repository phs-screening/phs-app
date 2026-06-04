import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { useNavigate } from 'react-router-dom'
import { isAdmin } from '../../services/authSession'
import { ScrollTopContext } from '../../api/utils.js'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Box, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { getPatientStationSummary } from 'src/api/stationsApi'

const toTimelineItem = (station) => ({
  key: station.key,
  label: station.displayName,
  path: station.route,
  eligibilityName: station.eligibilityName,
  eligible: station.eligible,
})

function navigateTo(event, navigate, page, scrollTop) {
  event.preventDefault()
  scrollTop()
  const path = '/app/' + page
  navigate(path, { replace: true })
}

const TimelineItemComponent = ({ item, formDone, admin, navigate, scrollTop }) => {
  // Check if this station is eligible
  const eligibilityName = item.eligibilityName
  const isEligible =
    typeof item.eligible === 'boolean'
      ? item.eligible
      : formDone.eligibleStations?.includes(eligibilityName)

  // Determine dot color based on completion status and eligibility
  let dotColor
  if (formDone?.[item.key]) {
    dotColor = 'primary' // Completed stations are primary color
  } else if (eligibilityName && !isEligible) {
    dotColor = 'error' // Not eligible stations are red
  } else {
    dotColor = 'grey' // Default color for incomplete but eligible stations
  }

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={dotColor} />
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
}

const BasicTimeline = (props) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formDone, setFormDone] = useState({})
  const [timelineItems, setTimelineItems] = useState([])
  const [loadError, setLoadError] = useState('')
  const [admin, isAdmins] = useState(false)
  const { scrollTop } = useContext(ScrollTopContext)

  useEffect(() => {
    let mounted = true

    const createFormsStatus = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const summaryRes = await getPatientStationSummary(props.patientId)
        const summary = summaryRes.data || {}
        const activeStations = summary.stations || []
        const status = {
          ...(summary.status || {}),
          eligibleStations: summary.eligibleStations || summary.status?.eligibleStations || [],
        }

        if (mounted) {
          setTimelineItems(activeStations.map(toTimelineItem))
          setFormDone(status)
          isAdmins(await isAdmin())
        }
      } catch (err) {
        console.error('Failed to load backend station summary:', err)
        if (mounted) {
          setLoadError('Unable to load station progress from the backend.')
          setTimelineItems([])
          setFormDone({})
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    createFormsStatus()

    return () => {
      mounted = false
    }
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
    if (loadError) {
      return <Alert severity='error'>{loadError}</Alert>
    }

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

        {/* Screening review and End items */}
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              color={timelineItems.every((item) => formDone?.[item.key]) ? 'primary' : 'grey'}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <a
              href='/app/summary'
              onClick={(event) => navigateTo(event, navigate, 'summary', scrollTop)}
            >
              Screening Review [View Only]
            </a>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              color={timelineItems.every((item) => formDone?.[item.key]) ? 'primary' : 'grey'}
            />
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
