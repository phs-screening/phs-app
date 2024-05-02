import React from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@mui/material'
import AccountProfile from 'src/components/account/AccountProfile'
import AccountProfileDetails from 'src/components/account/AccountProfileDetails'

const Account = () => (
  <>
    <Helmet>
      <title>Account | Material Kit</title>
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
            <AccountProfile />
          </Grid>
          <Grid item lg={2} md={2} xs={0}></Grid>
        </Grid>
      </Container>
    </Box>
  </>
)

export default Account
