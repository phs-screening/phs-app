import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'

const CustomSelect = ({ field, form, options, label, ...props }) => {
  const selectId = `${field.name}-select`
  const showError = form.errors[field.name] && (form.touched[field.name] || form.submitCount > 0)

  return (
    <FormControl fullWidth margin='normal' error={showError} variant='outlined'>
      {label ? (
        <InputLabel shrink htmlFor={selectId}>
          {label}
        </InputLabel>
      ) : null}
      <Select
        {...field}
        {...props}
        label={label}
        id={selectId}
        displayEmpty
        value={field.value || ''}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {showError && (
        <Typography variant='caption' color='error'>
          {form.errors[field.name]}
        </Typography>
      )}
    </FormControl>
  )
}

export default CustomSelect
