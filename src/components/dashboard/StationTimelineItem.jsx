import React from 'react'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { Card, CardActionArea, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './StationTimelineItem.css'

const StationTimelineItem = ({ item, formDone, scrollTop }) => {
  const navigate = useNavigate()

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

  const handleClick = () => {
    scrollTop()
    navigate(`/app/${item.path}`)
  }

  return (
    <TimelineItem className='station-timeline-item'>
      <TimelineSeparator>
        <TimelineDot color={dotColor} />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card
          variant='outlined'
          className={`station-timeline-card station-timeline-card--${dotColor}`}
        >
          <CardActionArea onClick={handleClick} className='station-timeline-card__action'>
            <Typography
              variant='body2'
              className={`station-timeline-card__label station-timeline-card__label--${dotColor}`}
            >
              {item.label}
            </Typography>
          </CardActionArea>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}

export default StationTimelineItem
