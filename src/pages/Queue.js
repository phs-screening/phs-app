import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@material-ui/core'
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
        <Grid container spacing={3}>
          <Grid item lg={2} md={2} xs={0}></Grid>
          <Grid item lg={8} md={8} xs={12}>
            <StationQueue />
          </Grid>
          <Grid item lg={2} md={2} xs={0}></Grid>
        </Grid>
      </Container>
    </Box>
  </>
)

export default Queue
