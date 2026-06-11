import React from 'react'
import { Alert, Box } from '@mui/material'
import { useFormikContext } from 'formik'

function flattenErrors(errors, path = []) {
  if (!errors) return []

  if (typeof errors === 'string') {
    return [{ field: path.join('.'), message: errors }]
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((error, index) => flattenErrors(error, [...path, index]))
  }

  if (typeof errors === 'object') {
    return Object.entries(errors).flatMap(([field, error]) =>
      flattenErrors(error, [...path, field]),
    )
  }

  return [{ field: path.join('.'), message: String(errors) }]
}

function isGenericErrorMessage(message) {
  return (
    message === 'Required' ||
    message === 'This field is required' ||
    /\bis a required field$/.test(message)
  )
}

function formatErrorMessage(field, message) {
  if (!field || !isGenericErrorMessage(message)) {
    return message
  }

  return `${field}: ${message}`
}

const ErrorNotification = ({ 
  show = false, 
  message = "Please fill in all required fields correctly.",
  errors,
  severity = "error",
  sx = {} 
}) => {
  const formik = useFormikContext()
  const validationErrors = flattenErrors(errors || formik?.errors)

  if (!show) return null

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Alert severity={severity}>
        <div>{message}</div>
        {validationErrors.length > 0 && (
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
            {validationErrors.map(({ field, message: errorMessage }, index) => {
              const formattedMessage = formatErrorMessage(field, errorMessage)
              return <li key={`${field}-${index}`}>{formattedMessage}</li>
            })}
          </ul>
        )}
      </Alert>
    </Box>
  )
}

export default ErrorNotification
