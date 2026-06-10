import React from 'react'
import { Alert, Box, Button } from '@mui/material'

const DataLoadError = ({
  message = 'Unable to load data. Refresh or try again.',
  onRetry,
  retryLabel = 'Try Again',
  sx = {},
}) => (
  <Box sx={{ my: 2, ...sx }}>
    <Alert
      severity='error'
      action={
        onRetry ? (
          <Button color='inherit' size='small' onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  </Box>
)

export default DataLoadError
