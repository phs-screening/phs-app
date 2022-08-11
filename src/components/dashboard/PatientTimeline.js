import React, { useState, useEffect, useContext } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { useNavigate } from 'react-router-dom';
import mongoDB from "../../services/mongoDB"
import {FormContext, ScrollTopContext} from '../../api/utils.js';
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
  const entries = 12;
  if (record) {
    return [
      true, // pre-registration, always true 
      record.registrationForm !== undefined, // registration
      record.phlebotomyForm !== undefined, // phlebotomy
      // historyTaking form consists of 4 forms
      record.hxHcsrForm !== undefined
          && record.hxNssForm !==  undefined
          && record.hxSocialForm !== undefined
          && record.hxCancerForm !== undefined,
      record.fitForm !== undefined, // fit
      record.wceForm !== undefined, // wce
      // geriatrics form consists of 12 forms
      record.geriAmtForm !== undefined
          && record.geriEbasDepForm !== undefined
          && record.geriVisionForm !== undefined
          && record.geriVisionForm !== undefined
          && record.geriParQForm !== undefined
          && record.geriPhysicalActivityLevelForm !== undefined
          && record.geriFrailScaleForm !== undefined
          && record.geriOtQuestionnaireForm !== undefined
          && record.geriSppbForm !== undefined
          && record.geriTugForm !== undefined
          && record.geriPtConsultForm !== undefined
          && record.geriOtConsultForm !== undefined
          && record.geriGeriApptForm !== undefined
        && record.geriMMSEForm !== undefined
        && record.geriAudiometryForm !== undefined,
      record.doctorConsultForm !== undefined, // doctor's consult
      record.dietitiansConsultForm !== undefined, // dietitian's consult
      record.socialServiceForm !== undefined, // social service,
      record.oralHealthForm !== undefined, // Oral Health
    ]
  } else {
    return new Array(entries).fill(false);;
  }
}

function navigateTo(event, navigate, page, scrollTop) {
  event.preventDefault();
  scrollTop();
  const path = "/app/" + page;
  navigate(path, { replace: true });
}

const BasicTimeline = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goingForPhlebotomy, setGoingForPhlebotomy] = useState();
  const [formDone, setFormDone] = useState([]);
  const [admin, isAdmins] = useState(false)
  const {isAdmin} = useContext(FormContext);
  const { scrollTop } = useContext(ScrollTopContext);

  useEffect(async () => {
    const createFormsStatus = async () => {
      try {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas");
        const patientsRecord = mongoConnection.db("phs").collection("patients");
        // patientId must be valid for this component to even render
        // checks done in parent component Dashboard.js
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
    isAdmins(isAdmin)
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
      <TimelineContent>{admin ? <a
          href="/app/prereg"
          onClick={(event) => navigateTo(event, navigate, "prereg", scrollTop)}>Pre-Registration [Edit]
      </a> : "Pre-Registration [Completed]"}</TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[1] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[1] ? <a
            href="/app/reg"
            onClick={(event) => navigateTo(event, navigate, "reg", scrollTop)}>Registration [Incomplete]
        </a> : admin ? <a
            href="/app/reg"
            onClick={(event) => navigateTo(event, navigate, "reg", scrollTop)}>Registration [Edit]
        </a> : <a
            href="/app/reg"
            onClick={(event) => navigateTo(event, navigate, "reg", scrollTop)}>Registration [Completed]
        </a>}
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
          ? (!formDone[2] ? <a
              href="/app/phlebo"
              onClick={(event) => navigateTo(event, navigate, "phlebo", scrollTop)}>Phlebotomy [Incomplete]
              </a> : admin ? <a
              href="/app/phlebo"
              onClick={(event) => navigateTo(event, navigate, "phlebo", scrollTop)}>Phlebotomy [Edit]
          </a>: <a
              href="/app/phlebo"
              onClick={(event) => navigateTo(event, navigate, "phlebo", scrollTop)}>Phlebotomy [Completed]
          </a>)
          : <p>Phlebotomy [Not going]</p>
      }
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[3] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
      {!formDone[3] ? <a
          href="/app/hxtaking"
          onClick={(event) => navigateTo(event, navigate, "hxtaking", scrollTop)}>History Taking [Incomplete]
        </a> : admin ? <a
          href="/app/hxtaking"
          onClick={(event) => navigateTo(event, navigate, "hxtaking", scrollTop)}>History Taking [Edit]
      </a> : <a
          href="/app/hxtaking"
          onClick={(event) => navigateTo(event, navigate, "hxtaking", scrollTop)}>History Taking [Completed]
      </a>
      }
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[4] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
      {!formDone[4] ? <a
          href="/app/fit"
          onClick={(event) => navigateTo(event, navigate, "fit", scrollTop)}>FIT [Incomplete]
        </a> : admin ? <a
          href="/app/fit"
          onClick={(event) => navigateTo(event, navigate, "fit", scrollTop)}>FIT [Edit]
      </a>: <a
          href="/app/fit"
          onClick={(event) => navigateTo(event, navigate, "fit", scrollTop)}>FIT [Completed]
      </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[5] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
      {!formDone[5] ? <a
          href="/app/wce"
          onClick={(event) => navigateTo(event, navigate, "wce", scrollTop)}>WCE [Incomplete]
        </a> : admin ? <a
          href="/app/wce"
          onClick={(event) => navigateTo(event, navigate, "wce", scrollTop)}>WCE [Edit]
      </a>: <a
          href="/app/wce"
          onClick={(event) => navigateTo(event, navigate, "wce", scrollTop)}>WCE [Completed]
      </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[6] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
      {!formDone[6] ? <a
          href="/app/geri"
          onClick={(event) => navigateTo(event, navigate, "geri", scrollTop)}>Geriatrics [Incomplete]
        </a> : admin ? <a
          href="/app/geri"
          onClick={(event) => navigateTo(event, navigate, "geri", scrollTop)}>Geriatrics [Edit]
      </a>: <a
          href="/app/geri"
          onClick={(event) => navigateTo(event, navigate, "geri", scrollTop)}>Geriatrics [Completed]
      </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[7] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[7] ? <a
          href="/app/doctorsconsult"
          onClick={(event) => navigateTo(event, navigate, "doctorsconsult", scrollTop)}>Doctor's Consult [Incomplete]
          </a> : admin ? <a
            href="/app/doctorsconsult"
            onClick={(event) => navigateTo(event, navigate, "doctorsconsult", scrollTop)}>Doctor's Consult [Edit]
        </a>: <a
            href="/app/doctorsconsult"
            onClick={(event) => navigateTo(event, navigate, "doctorsconsult", scrollTop)}>Doctor's Consult [Completed]
        </a>}
        </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[8] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[8] ? <a
            href="/app/dietitiansconsultation"
            onClick={(event) => navigateTo(event, navigate, "dietitiansconsultation", scrollTop)}>Dietitian’s Consultation [Incomplete]
        </a> : admin ? <a
            href="/app/dietitiansconsultation"
            onClick={(event) => navigateTo(event, navigate, "dietitiansconsultation", scrollTop)}>Dietitian’s Consultation [Edit]
        </a> : <a
            href="/app/dietitiansconsultation"
            onClick={(event) => navigateTo(event, navigate, "dietitiansconsultation", scrollTop)}>Dietitian’s Consultation [Completed]
        </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[9] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[9] ? <a
          href="/app/socialservice"
          onClick={(event) => navigateTo(event, navigate, "socialservice", scrollTop)}>Social Service [Incomplete]
        </a> : admin ? <a
            href="/app/socialservice"
            onClick={(event) => navigateTo(event, navigate, "socialservice", scrollTop)}>Social Service [Edit]
        </a> : <a
            href="/app/socialservice"
            onClick={(event) => navigateTo(event, navigate, "socialservice", scrollTop)}>Social Service [Completed]
        </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[10] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[10] ? <a
            href="/app/oralhealth"
            onClick={(event) => navigateTo(event, navigate, "oralhealth", scrollTop)}>Oral Health [Incomplete]
        </a> : admin ? <a
            href="/app/oralhealth"
            onClick={(event) => navigateTo(event, navigate, "oralhealth", scrollTop)}>Oral Health [Edit]
        </a> : <a
            href="/app/oralhealth"
            onClick={(event) => navigateTo(event, navigate, "oralhealth", scrollTop)}>Oral Health [Completed]
        </a>}
      </TimelineContent>
    </TimelineItem>

    <TimelineItem>
      <TimelineSeparator>
        {formDone[10] ? <TimelineDot color="primary"/> : <TimelineDot color="grey"/>}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        {!formDone[11] ? <a
          href="/app/summary"
          onClick={(event) => navigateTo(event, navigate, "summary", scrollTop)}>Summary [View Only]
        </a> : admin ? <a
            href="/app/summary"
            onClick={(event) => navigateTo(event, navigate, "summary", scrollTop)}>Summary [View Only]
        </a> : <a
            href="/app/summary"
            onClick={(event) => navigateTo(event, navigate, "summary", scrollTop)}>Summary [View Only]
        </a>}
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
