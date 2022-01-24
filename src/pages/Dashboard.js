import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import PatientTimeline from 'src/components/dashboard/PatientTimeline';
import mongoDB from "../services/mongoDB";
import * as Realm from "realm-web";

const Dashboard = () =>{

    const testLogin = async () => {
        try {
            const credentials = Realm.Credentials.anonymous()
            // Authenticate the user
            const user = await mongoDB.logIn(credentials);
            console.log(user)
            const mongoClient = mongoDB.currentUser.mongoClient("mongodb-atlas");
            mongoClient.db("phs").collection("data").insertOne({name: "test"});
            // `App.currentUser` updates to match the logged in user
            return user
        } catch(err) {
            console.error("Failed to log in", err);
        }
    }

    // useEffect(() => {
    //     testLogin()
    // }, [])

    return (

  <>
    {/*<Helmet>*/}
    {/*  <title>Patient Dashboard</title>*/}
    {/*</Helmet>*/}
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
