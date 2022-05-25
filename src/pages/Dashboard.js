import React, { useState, useEffect, useContext } from "react";
import mongoDB from "../services/mongoDB";
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import PatientTimeline from 'src/components/dashboard/PatientTimeline';
import {Helmet} from "react-helmet";
import { FormContext } from 'src/api/utils';
import { useNavigate } from 'react-router-dom';

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


const Dashboard = () =>{
  const {patientId, updatePatientId} = useContext(FormContext);
  const [formsStatus, setFormsStatus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId === -1) {
        alert("You need to enter the queue number for the patient you are attending to!")
        navigate('/app/registration', { replace: true });
    } else {
      // TODO: query patients collection and pass it as props to child component
      const createFormsStatus = async () => {
        try {
          const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas");
          const patientsRecord = mongoConnection.db("phs").collection("patients");
          // patientId must be valid for this component to even render without error
          // hence, if there is no record, likely there is implementation bug
          const record = await patientsRecord.findOne({queueNo: patientId});
          setFormsStatus(generateStatusArray(record));
        } catch(err) {
          alert(err);
          navigate('/app/registration', { replace: true });
        }
        
      };
      createFormsStatus();
    }
}, [patientId, navigate])

    return (

  <>
    <Helmet>
      <title>Patient Dashboard</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <PatientTimeline formDone={formsStatus}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

export default Dashboard;
