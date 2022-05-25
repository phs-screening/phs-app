import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';

var formDone = [
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  false
];

const BasicTimeline = (props) => (
  <Timeline>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[0] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/prereg">Pre-Registration</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[1] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/reg">Registration</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[2] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/phlebo">Phlebotomy</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[3] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/hxtaking">History Taking</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[4] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/fit">FIT</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[5] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/wce">WCE</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[6] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/geri">Geriatrics</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[7] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/doctorsconsult">Doctor's Consult</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[8] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/socialservice">Social Service</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {props.formDone[9] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><a href="/app/feedback">Feedback</a></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot />
      </TimelineSeparator>
      <TimelineContent>END</TimelineContent>
    </TimelineItem>
  </Timeline>
);

const PatientTimeline = (props) => (
  <Card {...props}>
    <CardHeader
      action={(
        <Button
          href="/app/summary"
          size="small"
          variant="text"
        >
          Summary
        </Button>
      )}
      title="Patient Dashboard"
    />
    <Divider />
    <CardContent>
      <Box
        sx={{
          height: "auto",
          position: "relative"
        }}
      >
        <BasicTimeline formDone={props.formDone}/>
      </Box>
    </CardContent>
    <Divider />
  </Card>
);

export default PatientTimeline;
