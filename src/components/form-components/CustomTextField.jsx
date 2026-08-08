import React from 'react'
import { TextField } from '@mui/material'

const CustomTextField = ({ field, form, label, ...props }) => {
  const showError = form.errors[field.name] && (form.touched[field.name] || form.submitCount > 0)

  return (
    <TextField
      {...field}
      {...props}
      label={label || undefined}
      fullWidth
      margin='normal'
      error={showError}
      helperText={showError ? form.errors[field.name] : ''}
    />
  )
}

export default CustomTextField
