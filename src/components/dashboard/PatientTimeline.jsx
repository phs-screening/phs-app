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
  const [loading, setLoading] = useState(true)
  const [formDone, setFormDone] = useState({})
  const [timelineItems, setTimelineItems] = useState([])
  const [loadError, setLoadError] = useState('')
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
  }, [props.patientId])
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
