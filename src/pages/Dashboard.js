import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import PatientTimeline from 'src/components/dashboard/PatientTimeline';
import {Helmet} from "react-helmet";

const Dashboard = () =>{

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
            <PatientTimeline />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

export default Dashboard;
