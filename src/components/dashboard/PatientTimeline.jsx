import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { ScrollTopContext } from '../../api/utils.js'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert, Box, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { getPatientStationSummary } from 'src/api/stationsApi'
import StationTimelineItem from './StationTimelineItem'

const toTimelineItem = (station) => ({
  key: station.key,
  label: station.displayName,
  path: station.route,
  eligibilityName: station.eligibilityName,
  eligible: station.eligible,
})

const BasicTimeline = (props) => {
  const initialSummaryMatchesPatient =
    props.initialSummary?.patient?.queueNo === props.patientId
  const [loading, setLoading] = useState(!initialSummaryMatchesPatient)
  const [formDone, setFormDone] = useState({})
  const [timelineItems, setTimelineItems] = useState([])
  const [loadError, setLoadError] = useState('')
  const { scrollTop } = useContext(ScrollTopContext)

  useEffect(() => {
    let mounted = true

    const applySummary = (summary) => {
      const activeStations = summary.stations || []
      const status = {
        ...(summary.status || {}),
        eligibleStations: summary.eligibleStations || summary.status?.eligibleStations || [],
      }

      setTimelineItems(activeStations.map(toTimelineItem))
      setFormDone(status)
      setLoadError('')
      setLoading(false)
    }

    if (props.initialSummary?.patient?.queueNo === props.patientId) {
      applySummary(props.initialSummary)
      return () => {
        mounted = false
      }
    }

    const createFormsStatus = async () => {
      setLoading(true)
      setLoadError('')

      try {
        const summaryRes = await getPatientStationSummary(props.patientId)
        const summary = summaryRes.data || {}
        if (mounted) {
          applySummary(summary)
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
  }, [props.initialSummary, props.patientId])
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
          <StationTimelineItem
            key={item.key}
            item={item}
            formDone={formDone}
            scrollTop={scrollTop}
          />
        ))}

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
  const { patientId, initialSummary, ...cardProps } = props
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
          <BasicTimeline patientId={patientId} initialSummary={initialSummary} />
        </Box>
      </CardContent>
      <Divider />
    </Card>
  )
}

export default PatientTimeline
