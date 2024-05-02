import { Helmet } from 'react-helmet'
import { Box, Container } from '@mui/material'
import SettingsNotifications from 'src/components/settings/SettingsNotifications'
import SettingsPassword from 'src/components/settings/SettingsPassword'
import React from 'react'

const SettingsView = () => (
  <>
    <Helmet>
      <title>Settings | PHS</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth='lg'>
        <SettingsNotifications />
        <Box sx={{ pt: 3 }}>
          <SettingsPassword />
        </Box>
      </Container>
    </Box>
  </>
)

export default SettingsView
