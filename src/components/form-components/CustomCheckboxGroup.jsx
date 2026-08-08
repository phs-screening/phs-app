import React from 'react'
import { Checkbox, FormControlLabel, FormHelperText, Box, Typography } from '@mui/material'

const CustomCheckboxGroup = ({ field, form, options, label, row = false, ...props }) => {
  const showError = form.errors[field.name] && (form.touched[field.name] || form.submitCount > 0)
  const fieldValue = form.values[field.name] || []

  const handleChange = (optionValue) => {
    const set = new Set(fieldValue)
    if (set.has(optionValue)) {
      set.delete(optionValue)
    } else {
      set.add(optionValue)
    }
    form.setFieldValue(field.name, Array.from(set))
  }

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      {label && (
        <Typography variant='subtitle1' sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: row ? 'flex' : 'block', flexWrap: 'wrap' }}>
        {options.map((option) => (
          <Box key={option.value} sx={{ mt: 1, mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldValue.includes(option.value)}
                  onChange={() => handleChange(option.value)}
                  color={showError ? 'error' : 'primary'}
                  {...props}
                />
              }
              label={option.label}
            />
          </Box>
        ))}
      </Box>
      {showError && <FormHelperText error>{form.errors[field.name]}</FormHelperText>}
    </Box>
  )
}

export default CustomCheckboxGroup
