import React, { useState, useEffect } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { useNavigate } from 'react-router-dom';
import mongoDB from "../../services/mongoDB"
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';


function generateStatusArray(record) {
  const entries = 10;
  if (record) {
    return [
      true, // pre-registration, always true 
      record.registrationForm !== undefined, // registration
      record.phlebotomyForm !== undefined, // phlebotomy
      record.historyTakingForm !== undefined, // history taking
      record.fitForm !== undefined, // fit
      record.wceForm !== undefined, // wce
      record.geriatricsForm !== undefined, // geriatrics
      record.doctorConsultForm !== undefined, // doctor's consult
      record.socialServiceForm !== undefined, // social service
      record.feedbackForm !== undefined // feedback
    ]
  } else {
    return new Array(entries).fill(false);;
  }
}

function navigateTo(event, navigate, page) {
  event.preventDefault();
  const path = "/app/" + page;
  navigate(path, { replace: true });
}

const BasicTimeline = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goingForPhlebotomy, setGoingForPhlebotomy] = useState();
  const [formDone, setFormDone] = useState([]);

  useEffect(() => {
    const createFormsStatus = async () => {
      try {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas");
        const patientsRecord = mongoConnection.db("phs").collection("patients");
        // patientId must be valid for this component to even render without error
        // hence, if there is no record, likely there is implementation bug
        const record = await patientsRecord.findOne({queueNo: props.patientId});
        setGoingForPhlebotomy(record.goingForPhlebotomy === "Y");
        setFormDone(generateStatusArray(record));
        setLoading(false);
      } catch(err) {
        alert(err);
        navigate('/app/registration', { replace: true });
      }
    };
    createFormsStatus();
  }, [navigate, props.patientId]);
if (loading) {
  return (<div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}}><CircularProgress /></div>);
} else {
  return (
  <Timeline>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[0] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent><p>Pre-Registration</p></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[1] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/reg"
          onClick={(event) => navigateTo(event, navigate, "reg")}>Registration
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[2]
          ? <TimelineDot color="primary"/>
          : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
      {goingForPhlebotomy
          ? <a
              href="/app/phlebo"
              onClick={(event) => navigateTo(event, navigate, "phlebo")}>Phlebotomy
            </a>
          : <p>[Not required] Phlebotomy</p>
      }
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[3] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/hxtaking"
          onClick={(event) => navigateTo(event, navigate, "hxtaking")}>History Taking
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[4] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/fit"
          onClick={(event) => navigateTo(event, navigate, "fit")}>FIT
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[5] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/wce"
          onClick={(event) => navigateTo(event, navigate, "wce")}>WCE
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[6] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/geri"
          onClick={(event) => navigateTo(event, navigate, "geri")}>Geriatrics
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[7] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/doctorsconsult"
          onClick={(event) => navigateTo(event, navigate, "doctorsconsult")}>Doctor's Consult
          </a>
        </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[8] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/socialservice"
          onClick={(event) => navigateTo(event, navigate, "socialservice")}>Social Service
        </a>
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        {formDone[9] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <a
          href="/app/feedback"
          onClick={(event) => navigateTo(event, navigate, "feedback")}>Feedback
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
)}};

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
        <BasicTimeline patientId={props.patientId}/>
      </Box>
    </CardContent>
    <Divider />
  </Card>
);

export default PatientTimeline;
