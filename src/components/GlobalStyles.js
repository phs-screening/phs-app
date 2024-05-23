import { GlobalStyles } from '@mui/material'
import React from 'react'

//already included in theme/index.js, not imported anywhere, left here temporarily as reference
const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontsmoothing: 'grayscale',
        height: '100%',
        width: '100%',
      },
      body: {
        backgroundColor: '#f4f6f8',
        height: '100%',
        width: '100%',
      },
      a: {
        textDecoration: 'none',
      },
      form: {
        padding: '50px',
      },
      '#root': {
        height: '100%',
        width: '100%',
      },
    })}
  />
)

export default globalStyles
