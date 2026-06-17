import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Box, Container, Grid } from '@mui/material'
import StationQueue from 'src/components/StationQueue'

const Queue = () => (
  <>
    <Helmet>
      <title>PHS Queue</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item lg={1} md={1} xs={0}></Grid>
          <Grid item lg={10} md={10} xs={12}>
            <StationQueue />
          </Grid>
          <Grid item lg={1} md={1} xs={0}></Grid>
        </Grid>
      </Container>
    </Box>
  </>
)

export default Queue
